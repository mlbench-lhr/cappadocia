import mongoose, { Schema, Document } from "mongoose";

export interface FieldEntryType extends Document {
  fieldName: string; // e.g. "race", "annualIncome"
  value: string; // entry name
  createdAt?: Date;
  updatedAt?: Date;
}

const FieldEntrySchema = new Schema<FieldEntryType>(
  {
    fieldName: { type: String, required: true, index: true },
    value: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.FieldEntry ||
  mongoose.model<FieldEntryType>("FieldEntry", FieldEntrySchema);
