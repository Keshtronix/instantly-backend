import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  authStatusController,
  updateProfileController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/status", passportAuthenticateJwt, authStatusController);
authRoutes.put("/profile", passportAuthenticateJwt, updateProfileController);

authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.post("/reset-password", resetPasswordController);

export default authRoutes;