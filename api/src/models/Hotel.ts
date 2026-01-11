import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  name: string;
  chain?: string; // e.g., "Neemrana", "WelcomHeritage", "HeritEdge"
  location: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  amenities: string[];
  roomTypes: {
    name: string;
    description: string;
    pricePerNight: number;
    maxOccupancy: number;
    isLivingHistory: boolean; // "Living History" themed rooms
    theme?: string; // e.g., "Mughal Era", "Rajputana", "Colonial"
  }[];
  heritageFeatures: {
    hasLivingHistoryRooms: boolean;
    hasHistoryLectures: boolean;
    hasCulturalMeals: boolean;
    hasStorytellingEvenings: boolean;
    historicalTimelinePosters?: boolean;
  };
  nearbySites: mongoose.Types.ObjectId[]; // References to HeritageSite
  partnershipType: "listing" | "referral" | "premium";
  listingFee?: number;
  referralFee?: number; // Percentage
  discountPercentage: number; // Discount when booked through HeritEdge
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true, index: true },
    chain: { type: String },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    pricePerNight: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: "INR" },
    },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    roomTypes: [
      {
        name: { type: String, required: true },
        description: { type: String },
        pricePerNight: { type: Number, required: true },
        maxOccupancy: { type: Number, required: true },
        isLivingHistory: { type: Boolean, default: false },
        theme: { type: String },
      },
    ],
    heritageFeatures: {
      hasLivingHistoryRooms: { type: Boolean, default: false },
      hasHistoryLectures: { type: Boolean, default: false },
      hasCulturalMeals: { type: Boolean, default: false },
      hasStorytellingEvenings: { type: Boolean, default: false },
      historicalTimelinePosters: { type: Boolean, default: false },
    },
    nearbySites: [{ type: Schema.Types.ObjectId, ref: "HeritageSite" }],
    partnershipType: {
      type: String,
      enum: ["listing", "referral", "premium"],
      default: "listing",
    },
    listingFee: { type: Number },
    referralFee: { type: Number }, // Percentage
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

HotelSchema.index({ coordinates: "2dsphere" });
HotelSchema.index({ name: "text", description: "text", location: "text" });
HotelSchema.index({ city: 1, state: 1 });
HotelSchema.index({ isActive: 1, partnershipType: 1 });

export default mongoose.model<IHotel>("Hotel", HotelSchema);

