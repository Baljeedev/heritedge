import mongoose, { Schema, Document } from "mongoose";

export interface IArtForm extends Document {
  name: string;
  category: string; // e.g. "visual", "performing", "textile", "craft", "culinary"
  origin?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArtFormSchema = new Schema<IArtForm>(
  {
    name: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    origin: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ArtFormSchema.index({ name: "text", description: "text" });
ArtFormSchema.index({ category: 1 });

export default mongoose.model<IArtForm>("ArtForm", ArtFormSchema);
