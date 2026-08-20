import WishlistModel from "../models/wishlist.model";
import ProductModel from "../models/product.model";
import { NotFoundException } from "../utils/app-error";

// Only pull the fields a wishlist card actually needs to render
const WISHLIST_PRODUCT_SELECT =
  "name slug images originalPrice salePrice discountPercent discountLabel unit stockCount ratingAverage reviewCount isActive";

export const getUserWishlistService = async (userId: string) => {
  const wishlist = await WishlistModel.findOne({ userId }).populate(
    "products",
    WISHLIST_PRODUCT_SELECT
  );
  return { products: wishlist?.products ?? [] };
};

export const addToWishlistService = async (userId: string, productId: string) => {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new NotFoundException("Product not found");
  }

  const wishlist = await WishlistModel.findOneAndUpdate(
    { userId },
    { $addToSet: { products: productId } },
    { new: true, upsert: true }
  ).populate("products", WISHLIST_PRODUCT_SELECT);

  return { products: wishlist.products };
};

export const removeFromWishlistService = async (userId: string, productId: string) => {
  const wishlist = await WishlistModel.findOneAndUpdate(
    { userId },
    { $pull: { products: productId } },
    { new: true }
  ).populate("products", WISHLIST_PRODUCT_SELECT);

  if (!wishlist) {
    throw new NotFoundException("Wishlist not found");
  }

  return { products: wishlist.products };
};