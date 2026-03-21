import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  state: string;
  country: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, unique: true, index: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CitySchema.index({ name: "text" });
CitySchema.index({ state: 1 });

export default mongoose.model<ICity>("City", CitySchema);
