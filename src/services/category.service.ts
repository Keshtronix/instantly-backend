// import CategoryModel from "../models/category.model";

// export const getCategoriesService = async () => {
//   const categories = await CategoryModel.find({ isActive: true })
//     .sort({ _id: 1, })
//     .lean();

//   return { categories };
// };




import CategoryModel from "../models/category.model";
import { NotFoundException } from "../utils/app-error"; // adjust path

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
  data: Partial<{ name: string; imageUrl: string | null; description: string; isActive: boolean }>
) => {
  const category = await CategoryModel.findById(id);
  if (!category) throw new NotFoundException("Category not found");

  Object.assign(category, data);
  await category.save(); // triggers pre("save") slug regeneration if name changed

  return category;
};

export const deleteCategoryService = async (id: string) => {
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) throw new NotFoundException("Category not found");
  return category;
};