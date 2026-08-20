import { Router } from "express";
import {
  getWishlistController,
  addToWishlistController,
  removeFromWishlistController,
} from "../controllers/wishlist.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const wishlistRoutes = Router();

wishlistRoutes.get("/", passportAuthenticateJwt, getWishlistController);
wishlistRoutes.post("/:productId", passportAuthenticateJwt, addToWishlistController);
wishlistRoutes.delete("/:productId", passportAuthenticateJwt, removeFromWishlistController);

export default wishlistRoutes;