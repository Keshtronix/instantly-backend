import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createCouponSchema,
  couponIdParamSchema,
} from "../validators/coupon.validator";
import {
  createCouponService,
  getAllCouponsService,
  toggleCouponActiveService,
  deleteCouponService,
} from "../services/coupon.service";

import { applyCouponSchema } from "../validators/coupon.validator";
import { validateCouponForUserService } from "../services/coupon.service";

export const createCouponController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createCouponSchema.parse(req.body);
    const coupon = await createCouponService(data);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Coupon created successfully",
      coupon,
    });
  }
);

export const getAllCouponsController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllCouponsService({ page, limit });

    return res.status(HTTPSTATUS.OK).json({
      message: "Coupons fetched successfully",
      ...result,
    });
  }
);

export const toggleCouponActiveController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = couponIdParamSchema.parse(req.params);
    const coupon = await toggleCouponActiveService(id);

    return res.status(HTTPSTATUS.OK).json({
      message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}`,
      coupon,
    });
  }
);

export const deleteCouponController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = couponIdParamSchema.parse(req.params);
    await deleteCouponService(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Coupon deleted successfully",
    });
  }
);


export const validateCouponController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, subtotal } = applyCouponSchema.parse(req.body);
    const userId = (req.user as any)._id.toString();

    const result = await validateCouponForUserService(userId, code, subtotal);

    return res.status(HTTPSTATUS.OK).json({
      message: "Coupon applied successfully",
      ...result,
    });
  }
);