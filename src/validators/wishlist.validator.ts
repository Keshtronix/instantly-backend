import { z } from "zod";
import mongoose from "mongoose";

export const wishlistProductParamSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  }),
});