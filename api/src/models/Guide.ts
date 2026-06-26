import mongoose, { Schema, Document } from "mongoose";

export interface IGuide extends Document {
  clerkUserId: string; // Links to Clerk user
  name: string;
  image?: string;
  video?: string; // Video URL or path
  specialization: string;
  sites: mongoose.Types.ObjectId[]; // References to HeritageSite
  rating: number;
  reviewCount: number;
  pricePerDay: number;
  languages: string[];
  experience: number; // years of experience
  bio: string;
  certifications: {
    name: string;
    issuingAuthority: string;
    certificateNumber: string;
    issueDate: Date;
    expiryDate?: Date;
    verified: boolean; // Admin verified
    verificationDate?: Date;
  }[];
  isIntern: boolean; // For students aged 13-17
  age?: number;
  internshipStatus?: "pending" | "approved" | "rejected" | "completed";
  internshipTestScore?: number;
  email?: string;
  whatsappNumber?: string;
  leadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GuideSchema = new Schema<IGuide>(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    specialization: { type: String, required: true },
    sites: [{ type: Schema.Types.ObjectId, ref: "HeritageSite" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    pricePerDay: { type: Number, required: true, min: 0 },
    languages: [{ type: String }],
    experience: { type: Number, default: 0, min: 0 },
    bio: { type: String, required: true },
    certifications: [
      {
        name: { type: String, required: true },
        issuingAuthority: { type: String, required: true },
        certificateNumber: { type: String, required: true },
        issueDate: { type: Date, required: true },
        expiryDate: { type: Date },
        verified: { type: Boolean, default: false },
        verificationDate: { type: Date },
      },
    ],
    isIntern: { type: Boolean, default: false },
    age: { type: Number, min: 13, max: 17 },
    internshipStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
    },
    internshipTestScore: { type: Number, min: 0, max: 100 },
    email: { type: String },
    whatsappNumber: { type: String },
    leadCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

GuideSchema.index({ specialization: "text", bio: "text" });
GuideSchema.index({ sites: 1 });
GuideSchema.index({ isActive: 1, isIntern: 1 });

export default mongoose.model<IGuide>("Guide", GuideSchema);

