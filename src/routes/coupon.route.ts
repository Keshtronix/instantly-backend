import { Router } from "express";
import { validateCouponController } from "../controllers/coupon.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const couponRoutes = Router();

couponRoutes.post("/validate", passportAuthenticateJwt, validateCouponController);

export default couponRoutes;