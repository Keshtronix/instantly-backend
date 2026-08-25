import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createProductSchema,
  getProductsForAdminSchema,
  productIdParamSchema,
  updateProductSchema,
} from "../validators/product.validator";
import {
  createProductService,
  getProductsForAdminService,
  updateProductService,
  deleteProductService,
  getProductByIdForAdminService,
} from "../services/product.service";
import {
  getAdminAnalyticsService,
  getAdminOrdersService,
  updateOrderStatusService,
} from "../services/admin.service";
import { uploadMultipleImagesToCloudinary } from "../utils/cloudinary.util";
import { generateAIAdminSchema } from "../validators/ai.validator";
import { generateAIAdminService } from "../services/ai.service";
import {
  getAdminOrdersSchema,
  updateOrderStatusBodySchema,
  updateOrderStatusParamsSchema,
} from "../validators/admin.validator";

export const createProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const data = createProductSchema.parse(req.body);
    const product = await createProductService(userId, data);

    res.status(HTTPSTATUS.CREATED).json({
      message: "Product created successfully",
      product,
    });
  }
);

export const getProductsForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getProductsForAdminSchema.parse(req.query);
    const result = await getProductsForAdminService(query);

    res.status(HTTPSTATUS.OK).json({
      message: "Products retrieved successfully",
      ...result,
    });
  }
);

// brocky update
export const getProductByIdForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    const product = await getProductByIdForAdminService(id);

    res.status(HTTPSTATUS.OK).json({
      message: "Product retrieved successfully",
      product,
    });
  }
);

export const getAdminAnalyticsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getAdminAnalyticsService();

    res.status(HTTPSTATUS.OK).json({
      message: "Analytics retrieved successfully",
      ...result,
    });
  }
);

export const getAdminOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getAdminOrdersSchema.parse(req.query);
    const result = await getAdminOrdersService(query);

    res.status(HTTPSTATUS.OK).json({
      message: "Orders retrieved successfully",
      ...result,
    });
  }
);

export const updateOrderStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const params = updateOrderStatusParamsSchema.parse(req.params);
    const body = updateOrderStatusBodySchema.parse(req.body);
    const result = await updateOrderStatusService(params, body);

    res.status(HTTPSTATUS.OK).json({
      message: "Order status updated successfully",
      ...result,
    });
  }
);

export const uploadProductImagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    try {
      const uploaded = await uploadMultipleImagesToCloudinary(files);
      res.status(HTTPSTATUS.OK).json({
        message: "Images uploaded successfully",
        images: uploaded.map((image) => image.url),
      });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error); // Check your server logs here
      throw error; // Or handle appropriately
    }
  }
);

export const generateAIAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = generateAIAdminSchema.parse(req.body);
    const result = await generateAIAdminService(data);

    res.status(HTTPSTATUS.OK).json({
      message: "AI content generated successfully",
      ...result,
    });
  }
);

// brocky update
// The above code is a controller for admin-related operations in an e-commerce application. It includes functions for creating products, retrieving products for admin, getting analytics, managing orders, uploading product images, and generating AI content. Each function uses asyncHandler to handle asynchronous operations and validate input using Zod schemas. The responses are sent with appropriate HTTP status codes and messages.

// The following code is for updating and deleting products, which was added recently.
export const updateProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    const data = updateProductSchema.parse(req.body);
    const product = await updateProductService(id, data);

    res.status(HTTPSTATUS.OK).json({
      message: "Product updated successfully",
      product,
    });
  }
);

export const deleteProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    await deleteProductService(id);

    res.status(HTTPSTATUS.OK).json({
      message: "Product deleted successfully",
    });
  }
);