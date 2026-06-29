import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  type: "guide" | "hotel" | "experience";
  status: "pending" | "approved" | "rejected";
  clerkUserId: string; // Links to Clerk user
  email: string; // User's email from Clerk
  
  // Common fields
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Admin user ID
  rejectionReason?: string;
  
  // Application data - stores the full data structure
  // This will be validated and used to create the actual record when approved
  applicationData: {
    // Guide fields
    name?: string;
    image?: string;
    video?: string;
    specialization?: string;
    sites?: mongoose.Types.ObjectId[];
    cities?: mongoose.Types.ObjectId[];
    bio?: string;
    experience?: number;
    pricePerDay?: number;
    languages?: string[];
    certifications?: {
      name: string;
      issuingAuthority: string;
      certificateNumber: string;
      issueDate: Date;
      expiryDate?: Date;
    }[];
    isIntern?: boolean;
    age?: number;
    
    // Hotel fields
    chain?: string;
    location?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    images?: string[];
    pricePerNight?: {
      min: number;
      max: number;
      currency: string;
    };
    description?: string;
    amenities?: string[];
    roomTypes?: {
      name: string;
      description: string;
      pricePerNight: number;
      maxOccupancy: number;
      isLivingHistory: boolean;
      theme?: string;
    }[];
    heritageFeatures?: {
      hasLivingHistoryRooms: boolean;
      hasHistoryLectures: boolean;
      hasCulturalMeals: boolean;
      hasStorytellingEvenings: boolean;
      historicalTimelinePosters?: boolean;
    };
    nearbySites?: mongoose.Types.ObjectId[];
    partnershipType?: "listing" | "referral" | "premium";
    listingFee?: number;
    referralFee?: number;
    discountPercentage?: number;
    
    // Experience fields
    type?: "guide" | "music" | "workshop"; // For experience applications
    duration?: string;
    venue?: string;
    performers?: string[];
    genre?: string;
    schedule?: string[];
    instructor?: string;
    skillLevel?: "beginner" | "intermediate" | "advanced";
    materialsIncluded?: boolean;
    maxParticipants?: number;
    topics?: string[];
    guideId?: mongoose.Types.ObjectId;
    price?: number; // For experiences
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    type: {
      type: String,
      enum: ["guide", "hotel", "experience"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    clerkUserId: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
    rejectionReason: { type: String },
    applicationData: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ clerkUserId: 1, status: 1 });
ApplicationSchema.index({ type: 1, status: 1 });

export default mongoose.model<IApplication>("Application", ApplicationSchema);
