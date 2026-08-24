import { z } from "zod";
import mongoose from "mongoose";

export const categoryIdParamSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid category ID",
  }),
});

export const createCategoryBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageUrl: z.string().url().nullable().optional(),
  description: z.string().optional(),
});

export const updateCategoryBodySchema = createCategoryBodySchema.partial().extend({
  isActive: z.boolean().optional(),
});