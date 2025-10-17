import mongoose, { type Document, Schema } from "mongoose";

// ----------- Interfaces -----------
export interface MilestoneFieldsType extends Document {
  _id: string;
  tier: string[];
  type: string[];
  category: string[];
  createdAt?: string;
}

// ----------- Schema -----------
const MilestoneSchema = new Schema<MilestoneFieldsType>(
  {
    tier: [{ type: String, required: true }],
    type: [{ type: String, required: true }],
    category: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.models.MilestoneFields ||
  mongoose.model<MilestoneFieldsType>("MilestoneFields", MilestoneSchema);
