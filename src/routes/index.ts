import { Router } from "express";
import authRoute from "./auth.route";
import productRoute from "./product.route";
import adminRoute from "./admin.route";
import categoryRoute from "./category.route";
import cartRoute from "./cart.route";
import addressRoute from "./address.route";
import orderRoute from "./order.route";
import reviewRoute from "./review.route";
import wishlistRoute from "./wishlist.route";
import couponRoutes from "./coupon.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/admin", adminRoute);
router.use("/categories", categoryRoute);
router.use("/cart", cartRoute);
router.use("/addresses", addressRoute);
router.use("/wishlist", wishlistRoute);
router.use("/orders", orderRoute);
router.use("/reviews", reviewRoute);
router.use("/coupons", couponRoutes);

export default router;
