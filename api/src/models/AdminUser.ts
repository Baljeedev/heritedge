import mongoose, { Schema, Document } from "mongoose";

export type AdminRole = "admin" | "manager";

export interface IAdminUser extends Document {
  clerkUserId: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  addedBy?: string; // clerkUserId of the admin who added this manager
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager"],
      required: true,
      default: "manager",
    },
    isActive: { type: Boolean, default: true },
    addedBy: { type: String }, // clerkUserId of admin
  },
  { timestamps: true }
);

export default mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
