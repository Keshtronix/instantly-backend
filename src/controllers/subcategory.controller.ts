import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  subCategoryIdParamSchema,
  subCategoryQuerySchema,
  createSubCategoryBodySchema,
  updateSubCategoryBodySchema,
} from "../validators/subcategory.validator";
import {
  createSubCategoryService,
  deleteSubCategoryService,
  getSubCategoriesService,
  updateSubCategoryService,
} from "../services/subcategory.service";

export const getSubCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = subCategoryQuerySchema.parse(req.query);
    const result = await getSubCategoriesService(categoryId);

    res.status(HTTPSTATUS.OK).json({
      message: "Sub-categories retrieved successfully",
      ...result,
    });
  },
);

export const createSubCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createSubCategoryBodySchema.parse(req.body);
    const subCategory = await createSubCategoryService(data);
    res.status(HTTPSTATUS.CREATED).json({
      message: "Sub-category created successfully",
      subCategory,
    });
  },
);

export const updateSubCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = subCategoryIdParamSchema.parse(req.params);
    const data = updateSubCategoryBodySchema.parse(req.body);
    const subCategory = await updateSubCategoryService(id, data);
    res.status(HTTPSTATUS.OK).json({
      message: "Sub-category updated successfully",
      subCategory,
    });
  },
);

export const deleteSubCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = subCategoryIdParamSchema.parse(req.params);
    await deleteSubCategoryService(id);
    res.status(HTTPSTATUS.OK).json({
      message: "Sub-category deleted successfully",
    });
  },
);
