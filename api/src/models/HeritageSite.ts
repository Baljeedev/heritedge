import mongoose, { Schema, Document } from "mongoose";

export interface IHeritageSite extends Document {
  name: string;
  location: string;
  city?: string;
  state?: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  era: string;
  status: "Preserved" | "Under Restoration" | "At Risk" | "Ruins";
  annualVisitors?: number; // in millions
  description: string;
  historicalWriteup: string;
  keyFacts: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  unescoWorldHeritage?: boolean;
  yearOfConstruction?: string;
  creator?: string;
  architecturalStyle?: string;
  materials?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HeritageSiteSchema = new Schema<IHeritageSite>(
  {
    name: { type: String, required: true, index: true },
    location: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String, required: true, default: "India" },
    image: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    era: { type: String, required: true },
    status: {
      type: String,
      enum: ["Preserved", "Under Restoration", "At Risk", "Ruins"],
      default: "Preserved",
    },
    annualVisitors: { type: Number },
    description: { type: String, required: true },
    historicalWriteup: { type: String, required: true },
    keyFacts: [{ type: String }],
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    unescoWorldHeritage: { type: Boolean, default: false },
    yearOfConstruction: { type: String },
    creator: { type: String },
    architecturalStyle: { type: String },
    materials: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
HeritageSiteSchema.index({ coordinates: "2dsphere" });
HeritageSiteSchema.index({ name: "text", description: "text", location: "text" });

export default mongoose.model<IHeritageSite>("HeritageSite", HeritageSiteSchema);

