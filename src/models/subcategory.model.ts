import mongoose, { Document, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface ISubCategory extends Document {
  name: string;
  slug: string;
  categoryId: Types.ObjectId;
  imageUrl: string | null;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: undefined,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.pre("validate", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

subCategorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

const SubCategoryModel = mongoose.model<ISubCategory>("SubCategory", subCategorySchema);

export default SubCategoryModel;