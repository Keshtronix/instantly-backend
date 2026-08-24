import SubCategoryModel from "../models/subcategory.model";
import { NotFoundException } from "../utils/app-error";

export const getSubCategoriesService = async (categoryId?: string) => {
  const filter = categoryId ? { categoryId } : {};
  const subCategories = await SubCategoryModel.find(filter)
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 });
  return { subCategories };
};

export const createSubCategoryService = async (data: {
  name: string;
  categoryId: string;
  imageUrl?: string | null;
  description?: string;
}) => {
  const subCategory = await SubCategoryModel.create(data);
  return subCategory;
};

export const updateSubCategoryService = async (
  id: string,
  data: Partial<{
    name: string;
    categoryId: string;
    imageUrl: string | null;
    description: string;
    isActive: boolean;
  }>
) => {
  const subCategory = await SubCategoryModel.findById(id);
  if (!subCategory) throw new NotFoundException("Sub-category not found");

  Object.assign(subCategory, data);
  await subCategory.save();

  return subCategory;
};

export const deleteSubCategoryService = async (id: string) => {
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!subCategory) throw new NotFoundException("Sub-category not found");
  return subCategory;
};