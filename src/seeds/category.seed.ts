import "dotenv/config";
import mongoose from "mongoose";
import CategoryModel from "../models/category.model";
import { envConfig } from "../config/env.config";

const categories = [
   {
    name: "Beverages",
    imageUrl:
      "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941340/beverages_tdtdnz.jpg",
    description: "Drinks, juices, and everyday refreshments.",
    isActive: true,
  },
  {
    name: "Snacks",
    imageUrl:
      "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941341/snacks_rbq6mw.jpg",
    description: "Chips, biscuits, and quick bites.",
    isActive: true,
  },
   {
    name: "Bakery",
    imageUrl:
      "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941262/bakery_cjurxr.jpg",
    description: "Fresh bread, pastries, and baked goods.",
    isActive: true,
  },
    
    {
      name: "Baby Care",
      imageUrl:
        "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941339/babycare_vzbkgv.jpg",
      description: "Essentials for infants and toddlers.",
    isActive: true,
  },
 
 {
      name: "Frozen Foods",
      imageUrl:
        "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941340/frozen_ywx16j.jpg",
      description: "Frozen meals and freezer staples.",
      isActive: true,
    },
  {
    name: "Fruits & Vegetables",
    imageUrl:
      "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941524/fruits_ny98r0.jpg",
    description: "Fresh produce for everyday cooking.",
    isActive: true,
  },
  {
    name: "Meat & Seafood",
    imageUrl:
      "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941340/meat_ckm6s5.jpg",
    description: "Fresh meat, fish, and seafood options.",
    isActive: true,
  },
  {
    name: "Pantry Staples",
    imageUrl:
      "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941341/pantry-staples-1_vjkckf.jpg",
    description: "Rice, flour, oil, and pantry basics.",
    isActive: true,
  },
  {
    name: "Personal Care",
    imageUrl:
      "https://res.cloudinary.com/g3ga85sp/image/upload/v1783941340/personal_care_bo4s28.jpg",
    description: "Daily hygiene and personal grooming items.",
    isActive: true,
  },
  
];

const seedCategories = async () => {
  try {
    await mongoose.connect(envConfig.MONGO_URI);
    console.log("Database connected");

    await CategoryModel.deleteMany({});
    console.log("Existing categories cleared");

    const created = await CategoryModel.insertMany(categories);
    console.log(`${created.length} categories seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedCategories();