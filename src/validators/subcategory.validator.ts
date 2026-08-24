import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ID",
});

export const subCategoryIdParamSchema = z.object({
  id: objectIdSchema,
});

export const subCategoryQuerySchema = z.object({
  categoryId: objectIdSchema.optional(),
});

export const createSubCategoryBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: objectIdSchema,
  imageUrl: z.string().url().nullable().optional(),
  description: z.string().optional(),
});

export const updateSubCategoryBodySchema = createSubCategoryBodySchema.partial().extend({
  isActive: z.boolean().optional(),
});