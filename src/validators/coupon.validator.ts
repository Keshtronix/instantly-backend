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

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

export const couponIdParamSchema = z.object({
  id: z.string().min(1, "Coupon ID is required"),
});
