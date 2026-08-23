import { Router } from "express";
import {
  createProductController,
  generateAIAdminController,
  getAdminAnalyticsController,
  getAdminOrdersController,
  getProductsForAdminController,
  updateOrderStatusController,
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
  uploadProductImagesController
);
adminRoutes.post("/products", createProductController);

adminRoutes.post("/coupons", createCouponController);
adminRoutes.get("/coupons", getAllCouponsController);
adminRoutes.patch("/coupons/:id/toggle", toggleCouponActiveController);
adminRoutes.delete("/coupons/:id", deleteCouponController);

adminRoutes.get("/customers", getCustomersController);
adminRoutes.get("/customers/:id", getCustomerByIdController);
adminRoutes.patch("/customers/:id", updateCustomerController);
adminRoutes.patch("/customers/:id/status", updateCustomerStatusController);

export default adminRoutes;
