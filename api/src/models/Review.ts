import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  clerkUserId: string; // User who wrote the review
  rating: number; // 1-5
  comment: string;
  images?: string[]; // Photos from traveler's adventures
  
  // What is being reviewed
  reviewType: "site" | "guide" | "hotel" | "experience";
  targetId: mongoose.Types.ObjectId; // ID of the reviewed item
  
  // Optional metadata
  visitDate?: Date;
  helpfulCount: number; // How many users found this helpful
  
  isVerified: boolean; // Verified purchase/visit
  isVisible: boolean; // Admin can hide inappropriate reviews
  
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    clerkUserId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }],
    
    reviewType: {
      type: String,
      enum: ["site", "guide", "hotel", "experience"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    
    visitDate: { type: Date },
    helpfulCount: { type: Number, default: 0 },
    
    isVerified: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
ReviewSchema.index({ reviewType: 1, targetId: 1 });
ReviewSchema.index({ clerkUserId: 1, reviewType: 1, targetId: 1 }, { unique: true }); // One review per user per item

export default mongoose.model<IReview>("Review", ReviewSchema);

