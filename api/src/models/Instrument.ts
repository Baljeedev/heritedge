import mongoose, { Schema, Document } from "mongoose";

export interface IInstrument extends Document {
  name: string;
  category: string; // e.g. "string", "wind", "percussion", "vocal"
  origin?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstrumentSchema = new Schema<IInstrument>(
  {
    name: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    origin: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

InstrumentSchema.index({ name: "text", description: "text" });
InstrumentSchema.index({ category: 1 });

export default mongoose.model<IInstrument>("Instrument", InstrumentSchema);
