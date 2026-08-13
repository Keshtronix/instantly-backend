import UserModel from "../models/user.model";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { mergeGuestCartService } from "./cart.service";
import VerificationCodeModel from "../models/verification.model";
import { VerificationEnum } from "../constants/verification-code.enum";
import { envConfig } from "../config/env.config";
import { sendEmail } from "../mailers/mailer";
import { verifyEmailTemplate } from "../mailers/templates/template";

import { fortyFiveMinutesFromNow } from "../utils/date-time";

export const registerService = async (data: RegisterInput) => {
  const existingUser = await UserModel.findOne({
    email: data.email,
  });
  if (existingUser) {
    throw new BadRequestException("Email already in use");
  }
  const user = await UserModel.create(data);

  const userId = user._id;

  const verification = await VerificationCodeModel.create({
    userId,
    type: VerificationEnum.EMAIL_VERIFICATION,
    expiresAt: fortyFiveMinutesFromNow(),
  });

  // Sending verification email link
  const verificationUrl = `${envConfig.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`;
  console.log("Verification URL:", verificationUrl);
  // await sendEmail({
  //   to: user.email,
  //   ...verifyEmailTemplate(verificationUrl),
  // });

    await sendEmail({
    to: "prakhyat333@gmail.com",
    ...verifyEmailTemplate(verificationUrl),
  });

  return user;
};

export const loginService = async ({ email, password }: LoginInput) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return user;
};

export const registerAndMergeGuestCart = async (
  data: RegisterInput,
  guestCartId: string | null,
) => {
  const user = await registerService(data);
  await mergeGuestCartService(user._id.toString(), guestCartId);
  return user;
};

export const loginAndMergeGuestCart = async (
  email: string,
  password: string,
  guestCartId: string | null,
) => {
  const user = await loginService({ email, password });
  await mergeGuestCartService(user._id.toString(), guestCartId);
  return user;
};
