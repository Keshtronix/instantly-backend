import mongoose, { Document, Schema } from "mongoose";

export type DiscountType = "percentage" | "fixed";

export interface ICoupon extends Document {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  expiresAt?: Date;
  usedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
      default: undefined,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: undefined,
    },
    usedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CouponModel = mongoose.model<ICoupon>("Coupon", couponSchema);

export default CouponModel;