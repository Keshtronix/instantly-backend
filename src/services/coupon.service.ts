import CouponModel from "../models/coupon.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import type { CreateCouponInput } from "../validators/coupon.validator";

export const createCouponService = async (data: CreateCouponInput) => {
  const existing = await CouponModel.findOne({ code: data.code.toUpperCase() });
  if (existing) {
    throw new BadRequestException("A coupon with this code already exists");
  }

  const coupon = await CouponModel.create({
    ...data,
    code: data.code.toUpperCase(),
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
  });

  return coupon;
};

export const getAllCouponsService = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  const [coupons, total] = await Promise.all([
    CouponModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    CouponModel.countDocuments(),
  ]);

  return {
    coupons,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const toggleCouponActiveService = async (couponId: string) => {
  const coupon = await CouponModel.findById(couponId);
  if (!coupon) {
    throw new NotFoundException("Coupon not found");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  return coupon;
};

export const deleteCouponService = async (couponId: string) => {
  const coupon = await CouponModel.findByIdAndDelete(couponId);
  if (!coupon) {
    throw new NotFoundException("Coupon not found");
  }
  return coupon;
};