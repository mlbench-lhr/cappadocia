import mongoose, { type Document, Schema } from "mongoose";

// ----------- Interfaces -----------
export interface MilestonesType extends Document {
  _id: string;
  image: string;
  category: string;
  title: string;
  organization: string;
  description: string;
  majors: string[];
  type: "Opportunity" | "Awards";
  deadLine: Date;
  dependencies?: string[];
  linkedOpportunities?: string[];
  status: "not_started" | "skipped" | "done" | "in_progress";
  saved: boolean;
  skipped: boolean;
  markedAsDone: boolean;
  applied: boolean;
  price: number;
  perHour: boolean;
  gradeLevel: string;
  tier: string;
  createdBy?: string; // optional user id for custom milestones
  aiGenerated?: boolean;
  completed?: boolean;
  started?: boolean;
  season?: "Fall" | "Spring" | "Summer";
  opportunityId: string;
  completedAt: Date;
  createdAt?: string;
  notificationCreated: boolean;
}

// ----------- Schema -----------
const MilestoneSchema = new Schema<MilestonesType>(
  {
    image: { type: String },
    category: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String, required: false },
    description: { type: String },
    majors: [{ type: String, required: true }],
    type: {
      type: String,
      default: "Opportunity",
    },
    deadLine: { type: Date, required: true },
    dependencies: [{ type: String, default: [] }],
    linkedOpportunities: [{ type: String, default: [] }],
    status: {
      type: String,
      enum: ["not_started", "skipped", "done", "in_progress"],
      default: "not_started",
    },
    saved: { type: Boolean, default: false },
    skipped: { type: Boolean, default: false },
    markedAsDone: { type: Boolean, default: false },
    applied: { type: Boolean, default: false },
    price: { type: Number, required: true },
    perHour: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false },
    gradeLevel: { type: String, required: true },
    tier: { type: String, required: true },
    createdBy: { type: String }, // optional for custom milestone
    opportunityId: { type: String }, // optional for custom milestone
    completed: { type: Boolean, default: false },
    started: { type: Boolean, default: false },
    season: {
      type: String,
      enum: ["Fall", "Spring", "Summer"],
    },
    completedAt: { type: Date },
    notificationCreated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Milestone ||
  mongoose.model<MilestonesType>("Milestone", MilestoneSchema);
