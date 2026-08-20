import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { wishlistProductParamSchema } from "../validators/wishlist.validator";
import {
  getUserWishlistService,
  addToWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service";

export const getWishlistController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)._id.toString();
    const result = await getUserWishlistService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Wishlist fetched successfully",
      ...result,
    });
  }
);

export const addToWishlistController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)._id.toString();
    const { productId } = wishlistProductParamSchema.parse(req.params);

    const result = await addToWishlistService(userId, productId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Product added to wishlist",
      ...result,
    });
  }
);

export const removeFromWishlistController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)._id.toString();
    const { productId } = wishlistProductParamSchema.parse(req.params);

    const result = await removeFromWishlistService(userId, productId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Product removed from wishlist",
      ...result,
    });
  }
);