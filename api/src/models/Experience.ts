import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  type: "guide" | "music" | "workshop";
  name: string;
  image: string;
  sites: mongoose.Types.ObjectId[]; // References to HeritageSite
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  
  // Guide-specific fields
  guideId?: mongoose.Types.ObjectId; // Reference to Guide if type is "guide"
  
  // Music-specific fields
  duration?: string;
  venue?: string;
  performers?: string[];
  genre?: string;
  schedule?: string[];
  
  // Workshop-specific fields
  instructor?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  materialsIncluded?: boolean;
  maxParticipants?: number;
  topics?: string[];
  
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
    
    // Workshop-specific
    instructor: { type: String },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    materialsIncluded: { type: Boolean },
    maxParticipants: { type: Number },
    topics: [{ type: String }],
    
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.index({ type: 1, sites: 1 });
ExperienceSchema.index({ name: "text", description: "text" });
ExperienceSchema.index({ isActive: 1 });

export default mongoose.model<IExperience>("Experience", ExperienceSchema);

