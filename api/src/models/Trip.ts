import mongoose, { Schema, Document } from "mongoose";

export interface IDayPlan {
  day: number;
  title: string;
  activities: {
    time: string;
    activity: string;
    location: string;
    description?: string;
  }[];
}

export interface ITrip extends Document {
  clerkUserId: string; // User who created/owns the trip (use "system" for featured/premade trips)
  name: string;
  location: string;
  duration: string; // e.g., "3 Days"
  image?: string;
  description: string;
  highlights: string[];
  itinerary: IDayPlan[];
  budget: "Budget" | "Moderate" | "Luxury";
  bestTimeToVisit: string;
  isFeatured: boolean; // Mark featured/premade trips
  
  // Selected items
  selectedSites: mongoose.Types.ObjectId[]; // HeritageSite references
  selectedHotels: {
    hotelId: mongoose.Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    roomType?: string;
  }[];
  selectedGuides: {
    guideId: mongoose.Types.ObjectId;
    date: Date;
    siteId: mongoose.Types.ObjectId;
  }[];
  selectedExperiences: {
    experienceId: mongoose.Types.ObjectId;
    date: Date;
    time?: string;
  }[];
  
  // AI-generated flag
  isAIGenerated: boolean;
  aiPrompt?: string; // Original prompt used for AI generation
  isFeatured: boolean; // Mark featured/premade trips
  
  // Status
  status: "draft" | "planned" | "booked" | "completed" | "cancelled";
  
  // Dates
  startDate?: Date;
  endDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const DayPlanSchema = new Schema<IDayPlan>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [
      {
        time: { type: String, required: true },
        activity: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String },
      },
    ],
  },
  { _id: false }
);

const TripSchema = new Schema<ITrip>(
  {
    clerkUserId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    itinerary: [DayPlanSchema],
    budget: {
      type: String,
      enum: ["Budget", "Moderate", "Luxury"],
      required: true,
    },
    bestTimeToVisit: { type: String },
    
    selectedSites: [{ type: Schema.Types.ObjectId, ref: "HeritageSite" }],
    selectedHotels: [
      {
        hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        roomType: { type: String },
      },
    ],
    selectedGuides: [
      {
        guideId: { type: Schema.Types.ObjectId, ref: "Guide" },
        date: { type: Date, required: true },
        siteId: { type: Schema.Types.ObjectId, ref: "HeritageSite" },
      },
    ],
    selectedExperiences: [
      {
        experienceId: { type: Schema.Types.ObjectId, ref: "Experience" },
        date: { type: Date, required: true },
        time: { type: String },
      },
    ],
    
    isAIGenerated: { type: Boolean, default: false },
    aiPrompt: { type: String },
    isFeatured: { type: Boolean, default: false, index: true }, // Featured/premade trips
    
    status: {
      type: String,
      enum: ["draft", "planned", "booked", "completed", "cancelled"],
      default: "draft",
    },
    
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

TripSchema.index({ clerkUserId: 1, status: 1 });
TripSchema.index({ location: "text", name: "text" });
TripSchema.index({ startDate: 1, endDate: 1 });
TripSchema.index({ isFeatured: 1 }); // Index for featured trips query

export default mongoose.model<ITrip>("Trip", TripSchema);

