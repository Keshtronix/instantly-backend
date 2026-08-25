import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  generateAIAdminController,
  getAdminAnalyticsController,
  getAdminOrdersController,
  getProductByIdForAdminController,
  getProductsForAdminController,
  updateOrderStatusController,
  updateProductController,
  uploadProductImagesController,
} from "../controllers/admin.controller";
import {
  uploadProductImages,
  validateFilesPresence,
} from "../middlewares/multer.middleware";
import { passportAuthenticateJwt } from "../config/passport.config";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";

import {
  createCouponController,
  getAllCouponsController,
  toggleCouponActiveController,
  deleteCouponController,
} from "../controllers/coupon.controller";

import {
  getCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  updateCustomerStatusController,
} from "../controllers/customer.controller";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/category.controller";

import {
  getSubCategoriesController,
  createSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
} from "../controllers/subcategory.controller";

const adminRoutes = Router();

adminRoutes.use(passportAuthenticateJwt);
adminRoutes.use(requireAdmin);

adminRoutes.get("/analytics", getAdminAnalyticsController);
adminRoutes.post("/ai/generate", generateAIAdminController);
adminRoutes.get("/orders", getAdminOrdersController);
adminRoutes.put("/orders/:id/status", updateOrderStatusController);
adminRoutes.get("/products", getProductsForAdminController);
adminRoutes.post(
  "/products/upload",
  uploadProductImages,
  validateFilesPresence,
  uploadProductImagesController,
);

// Product routes
adminRoutes.post("/products", createProductController);
// Update and delete product routes
adminRoutes.patch("/products/:id", updateProductController);
adminRoutes.delete("/products/:id", deleteProductController);
// Get product by ID for admin
adminRoutes.get("/products/:id", getProductByIdForAdminController);


// Coupon routes
adminRoutes.post("/coupons", createCouponController);
adminRoutes.get("/coupons", getAllCouponsController);
adminRoutes.patch("/coupons/:id/toggle", toggleCouponActiveController);
adminRoutes.delete("/coupons/:id", deleteCouponController);

adminRoutes.get("/customers", getCustomersController);
adminRoutes.get("/customers/:id", getCustomerByIdController);
adminRoutes.patch("/customers/:id", updateCustomerController);
adminRoutes.patch("/customers/:id/status", updateCustomerStatusController);

adminRoutes.get("/categories", getCategoriesController);
adminRoutes.post("/categories", createCategoryController);
adminRoutes.patch("/categories/:id", updateCategoryController);
adminRoutes.delete("/categories/:id", deleteCategoryController);

adminRoutes.get("/sub-categories", getSubCategoriesController); // ?categoryId=xxx to filter
adminRoutes.post("/sub-categories", createSubCategoryController);
adminRoutes.patch("/sub-categories/:id", updateSubCategoryController);
adminRoutes.delete("/sub-categories/:id", deleteSubCategoryController);

export default adminRoutes;
