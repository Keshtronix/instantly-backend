import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../validators/auth.validator";
import {
  loginAndMergeGuestCart,
  registerAndMergeGuestCart,
  updateUserProfile,
} from "../services/auth.service";
import {
  setJwtAuthCookie,
  clearJwtAuthCookie,
  clearGuestCartCookie,
} from "../utils/cookie.util";
import { USER_ROLES } from "../constants/enums";
import UserModel from "../models/user.model";

const toAuthUser = (user: any) => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  phone: user.phone ?? null,
  avatar: user.avatar ?? null,
  isAdmin: user.role === USER_ROLES.ADMIN,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const guestCartId = req.cookies?.instant_guest_cart_id ?? null;

    const user = await registerAndMergeGuestCart(data, guestCartId);
    const userId = user._id.toString();

    if (guestCartId) clearGuestCartCookie(res);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
      user,
    });
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);
    const guestCartId = req.cookies?.instant_guest_cart_id ?? null;

    const user = await loginAndMergeGuestCart(
      data.email,
      data.password,
      guestCartId,
    );
    const userId = user._id.toString();

    if (guestCartId) clearGuestCartCookie(res);

    return setJwtAuthCookie({ res, userId }).status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user,
    });
  },
);

export const logoutController = asyncHandler(
  async (_req: Request, res: Response) => {
    return clearJwtAuthCookie(res).status(HTTPSTATUS.OK).json({
      message: "User logged out successfully",
    });
  },
);

export const authStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    res.status(HTTPSTATUS.OK).json({
      message: "User is authenticated",
      user: user ? toAuthUser(user) : null,
    });
  },
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateProfileSchema.parse(req.body);
    const userId = (req.user as any)._id.toString();

    const user = await updateUserProfile(userId, data);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile updated successfully",
      user: toAuthUser(user),
    });
  },
);
