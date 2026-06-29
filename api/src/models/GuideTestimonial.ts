import mongoose, { Schema, Document } from "mongoose";

export interface IGuideTestimonial extends Document {
  guideId: mongoose.Types.ObjectId;
  quote: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GuideTestimonialSchema = new Schema<IGuideTestimonial>(
  {
    guideId: { type: Schema.Types.ObjectId, ref: "Guide", required: true, index: true },
    quote: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GuideTestimonialSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model<IGuideTestimonial>("GuideTestimonial", GuideTestimonialSchema);
