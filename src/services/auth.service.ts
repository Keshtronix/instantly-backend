import UserModel from "../models/user.model";
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from "../utils/app-error";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { mergeGuestCartService } from "./cart.service";
import VerificationCodeModel from "../models/verification.model";
import { VerificationEnum } from "../constants/verification-code.enum";
import { envConfig } from "../config/env.config";
import { sendEmail } from "../mailers/mailer";
import { verifyEmailTemplate ,resetPasswordTemplate} from "../mailers/templates/template";

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

  if (user.status === "banned") {
    throw new ForbiddenException(
      "Your account has been banned. Contact support if you believe this is a mistake.",
    );
  }

  if (user.status === "suspended") {
    throw new ForbiddenException("Your account is temporarily suspended.");
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

export const updateUserProfile = async (
  userId: string,
  data: { name: string; email: string; phone?: string },
) => {
  const existing = await UserModel.findOne({
    email: data.email,
    _id: { $ne: userId },
  });
  if (existing) {
    throw new BadRequestException("Email is already in use");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { name: data.name, email: data.email, phone: data.phone },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new NotFoundException("User not found");
  }

  return updatedUser;
};




//import { thirtyMinutesFromNow } from "../utils/date-time";
//import { resetPasswordTemplate } from "../mailers/templates/template";

export const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });

  // Don't reveal whether the email exists — just no-op if not found.
  if (!user) return;

  // Invalidate any previous reset codes for this user
  await VerificationCodeModel.deleteMany({
    userId: user._id,
    type: VerificationEnum.PASSWORD_RESET,
  });

  const verification = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationEnum.PASSWORD_RESET,
    expiresAt: fortyFiveMinutesFromNow(),
  });

  const resetUrl = `${envConfig.FRONTEND_ORIGIN}/reset-password?code=${verification.code}`;

  await sendEmail({
    //to: user.email,
    to: "prakhyat333@gmail.com",
    ...resetPasswordTemplate(resetUrl),
  });
};

export const resetPasswordService = async (code: string, password: string) => {
  const verification = await VerificationCodeModel.findOne({
    code,
    type: VerificationEnum.PASSWORD_RESET,
    expiresAt: { $gt: new Date() },
  });

  if (!verification) {
    throw new BadRequestException("Reset link is invalid or has expired");
  }

  const user = await UserModel.findById(verification.userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  user.password = password; // relies on the same pre-save hashing hook comparePassword pairs with
  await user.save();

  await verification.deleteOne();

  return user;
};