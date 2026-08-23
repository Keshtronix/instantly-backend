import mongoose, { Document, Schema, Model } from "mongoose";
import { hashValue, compareValue } from "../utils/bcrypt.util";
import { USER_ROLE_VALUES, USER_ROLES, UserRole } from "../constants/enums";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: "active" | "suspended" | "banned";
  statusReason?: string;
  statusUpdatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
     // select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLES.USER,
    },
    phone: {
      type: String,
      default: undefined,
    },
    avatar: {
      type: String,
      default: undefined,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
      index: true, // speeds up admin filtering by status
    },
    statusReason: { type: String }, // e.g. "Repeated fake orders", optional admin note
    statusUpdatedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as { password?: string }).password;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return compareValue(candidatePassword, this.password);
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
