import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCategoriesService } from "../services/category.service";
import {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.service";

import {
  categoryIdParamSchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from "../validators/category.validator"; // adjust path


export const getCategoriesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getCategoriesService();

    res.status(HTTPSTATUS.OK).json({
      message: "Categories retrieved successfully",
      ...result,
    });
  }
);

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createCategoryBodySchema.parse(req.body);
    const category = await createCategoryService(data);
    res.status(HTTPSTATUS.CREATED).json({
      message: "Category created successfully",
      category,
    });
  }
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const data = updateCategoryBodySchema.parse(req.body);
    const category = await updateCategoryService(id, data);
    res.status(HTTPSTATUS.OK).json({
      message: "Category updated successfully",
      category,
    });
  }
);

export const deleteCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    await deleteCategoryService(id);
    res.status(HTTPSTATUS.OK).json({
      message: "Category deleted successfully",
    });
  }
);




// export const createCategoryController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const category = await createCategoryService(req.body);
//     res.status(HTTPSTATUS.CREATED).json({
//       message: "Category created successfully",
//       category,
//     });
//   }
// );

// export const updateCategoryController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const category = await updateCategoryService(req.params.id, req.body);
//     res.status(HTTPSTATUS.OK).json({
//       message: "Category updated successfully",
//       category,
//     });
//   }
// );

// export const deleteCategoryController = asyncHandler(
//   async (req: Request, res: Response) => {
//     await deleteCategoryService(req.params.id);
//     res.status(HTTPSTATUS.OK).json({
//       message: "Category deleted successfully",
//     });
//   }
// );