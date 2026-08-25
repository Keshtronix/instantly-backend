// import CategoryModel from "../models/category.model";

// export const getCategoriesService = async () => {
//   const categories = await CategoryModel.find({ isActive: true })
//     .sort({ _id: 1, })
//     .lean();

//   return { categories };
// };

import CategoryModel from "../models/category.model";
import SubCategoryModel from "../models/subcategory.model";
import ProductModel from "../models/product.model"; // adjust path
import { NotFoundException, BadRequestException } from "../utils/app-error";

export const getCategoriesService = async () => {
  const categories = await CategoryModel.find().sort({ createdAt: -1 });
  return { categories };
};

export const createCategoryService = async (data: {
  name: string;
  imageUrl?: string | null;
  description?: string;
}) => {
  const category = await CategoryModel.create(data);
  return category;
};

export const updateCategoryService = async (
  id: string,
  data: Partial<{
    name: string;
    imageUrl: string | null;
    description: string;
    isActive: boolean;
  }>,
) => {
  const category = await CategoryModel.findById(id);
  if (!category) throw new NotFoundException("Category not found");

  Object.assign(category, data);
  await category.save(); // triggers pre("save") slug regeneration if name changed

  return category;
};

// export const deleteCategoryService = async (id: string) => {
//   const category = await CategoryModel.findByIdAndDelete(id);
//   if (!category) throw new NotFoundException("Category not found");
//   return category;
// };

export const deleteCategoryService = async (id: string) => {
  const category = await CategoryModel.findById(id);
  if (!category) throw new NotFoundException("Category not found");

  const subCategoryCount = await SubCategoryModel.countDocuments({
    categoryId: id,
  });
  if (subCategoryCount > 0) {
    throw new BadRequestException(
      `Cannot delete category — it still has ${subCategoryCount} sub-categor${subCategoryCount === 1 ? "y" : "ies"}. Delete or reassign them first.`,
    );
  }

  const productCount = await ProductModel.countDocuments({ categoryId: id });
  if (productCount > 0) {
    throw new BadRequestException(
      `Cannot delete category — it still has ${productCount} product${productCount === 1 ? "" : "s"} assigned. Reassign them first.`,
    );
  }

  await CategoryModel.findByIdAndDelete(id);
  return category;
};
