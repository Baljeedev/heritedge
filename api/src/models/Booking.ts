import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: string; // Clerk user ID
  bookingType: "guide" | "music" | "workshop";
  
  // Reference to what's being booked
  guideId?: mongoose.Types.ObjectId; // Reference to Guide if bookingType is "guide"
  experienceId?: mongoose.Types.ObjectId; // Reference to Experience if bookingType is "music" or "workshop"
  
  // Booking details
  bookingDate: Date; // Date/time of the booking
  numberOfPeople: number;
  
  // Contact information
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Additional information
  notes?: string; // Special requirements or notes
  
  // Status
  status: "pending" | "confirmed" | "cancelled";
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true, index: true },
    bookingType: {
      type: String,
      enum: ["guide", "music", "workshop"],
      required: true,
    },
    guideId: { type: Schema.Types.ObjectId, ref: "Guide" },
    experienceId: { type: Schema.Types.ObjectId, ref: "Experience" },
    bookingDate: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true, min: 1 },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ bookingType: 1, status: 1 });
BookingSchema.index({ guideId: 1 });
BookingSchema.index({ experienceId: 1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);
