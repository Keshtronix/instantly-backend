import { z } from "zod";

export const createCouponSchema = z
  .object({
    code: z.string().trim().min(3, "Code must be at least 3 characters"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().positive("Discount value must be positive"),
    maxDiscountAmount: z.number().positive().optional(),
    expiresAt: z.string().datetime().optional(),
  })
  .refine(
    (data) => !(data.discountType === "percentage" && data.discountValue > 100),
    {
      message: "Percentage discount cannot exceed 100",
      path: ["discountValue"],
    },
  );

export const applyCouponSchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required"),
  subtotal: z.number().positive("Subtotal must be positive"),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

//export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;

export const couponIdParamSchema = z.object({
  id: z.string().min(1, "Coupon ID is required"),
});
