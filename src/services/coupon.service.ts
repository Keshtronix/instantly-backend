import CouponModel from "../models/coupon.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import type { CreateCouponInput } from "../validators/coupon.validator";


type DiscountTypeLiteral = "percentage" | "fixed";

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

  const totalPages = Math.ceil(total / limit);

  return {
    coupons,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
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


export const calculateCouponDiscount = (
  coupon: { discountType: DiscountTypeLiteral; discountValue: number; maxDiscountAmount?: number },
  subtotal: number
) => {
  let discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  // Never let a fixed-amount coupon discount more than the order is worth
  return Math.min(discount, subtotal);
};

export const validateCouponForUserService = async (
  userId: string,
  code: string,
  subtotal: number
) => {
  const coupon = await CouponModel.findOne({ code: code.trim().toUpperCase() });

  if (!coupon) {
    throw new BadRequestException("Invalid coupon code");
  }
  if (!coupon.isActive) {
    throw new BadRequestException("This coupon is no longer active");
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new BadRequestException("This coupon has expired");
  }
  if (coupon.usedBy.some((id) => id.toString() === userId)) {
    throw new BadRequestException("You've already used this coupon");
  }

  const discountAmount = calculateCouponDiscount(coupon, subtotal);

  return {
    couponId: coupon._id.toString(),
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
  };
};