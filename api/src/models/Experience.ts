import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  type: "guide" | "music" | "workshop";
  name: string;
  image: string;
  video?: string;
  sites: mongoose.Types.ObjectId[];
  rating: number;
  reviewCount: number;
  price: number;
  description: string;

  // Guide-specific fields
  guideId?: mongoose.Types.ObjectId;

  // Music-specific fields
  duration?: string;
  venue?: string;
  performers?: string[];
  genre?: string;
  schedule?: string[];
  instruments?: mongoose.Types.ObjectId[]; // References to Instrument
  city?: mongoose.Types.ObjectId; // Reference to City

  // Workshop-specific fields
  instructor?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  materialsIncluded?: boolean;
  maxParticipants?: number;
  topics?: string[];
  artForms?: mongoose.Types.ObjectId[]; // References to ArtForm
  workshopCity?: mongoose.Types.ObjectId; // Reference to City

  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    type: {
      type: String,
      enum: ["guide", "music", "workshop"],
      required: true,
    },
    name: { type: String, required: true, index: true },
    image: { type: String, required: true },
    video: { type: String },
    sites: [{ type: Schema.Types.ObjectId, ref: "HeritageSite" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },

    // Guide-specific
    guideId: { type: Schema.Types.ObjectId, ref: "Guide" },

    // Music-specific
    duration: { type: String },
    venue: { type: String },
    performers: [{ type: String }],
    genre: { type: String },
    schedule: [{ type: String }],
    instruments: [{ type: Schema.Types.ObjectId, ref: "Instrument" }],
    city: { type: Schema.Types.ObjectId, ref: "City" },

    // Workshop-specific
    instructor: { type: String },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    materialsIncluded: { type: Boolean },
    maxParticipants: { type: Number },
    topics: [{ type: String }],
    artForms: [{ type: Schema.Types.ObjectId, ref: "ArtForm" }],
    workshopCity: { type: Schema.Types.ObjectId, ref: "City" },

    email: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ExperienceSchema.index({ type: 1, sites: 1 });
ExperienceSchema.index({ name: "text", description: "text" });
ExperienceSchema.index({ isActive: 1 });
ExperienceSchema.index({ instruments: 1 });
ExperienceSchema.index({ artForms: 1 });
ExperienceSchema.index({ city: 1 });
ExperienceSchema.index({ workshopCity: 1 });

export default mongoose.model<IExperience>("Experience", ExperienceSchema);
