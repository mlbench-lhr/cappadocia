import mongoose, { type Document, Schema } from "mongoose";

// ----------- Interfaces -----------
export interface OpportunitiesCardType extends Document {
  _id: string;
  image?: string;
  location: string;
  category:
    | "Internships"
    | "Summer Program"
    | "Clubs"
    | "Community Service"
    | "Awards"
    | "Competitions";
  title: string;
  institute: string;
  description: string;
  majors: string[];
  type: "Online" | "In-Person";
  difficulty: string | "Easy" | "Medium" | "Advanced";
  dueDate: Date;
  saved: boolean;
  ignored: boolean;
  addedToMilestone: boolean;
  appliedBy: string[];
  milestoneAddedBy: string[];
  savedBy: string[];
  ignoredBy: string[];
  price: number;
  perHour: boolean;
  link: string;
  notificationCreated: boolean;
}

// ----------- Schema -----------
const OpportunityCardSchema = new Schema<OpportunitiesCardType>(
  {
    link: { type: String, required: false },
    image: { type: String, required: false },
    location: { type: String, required: false },
    category: { type: String, required: true },
    title: { type: String, required: false },
    institute: { type: String, required: false },
    description: { type: String, required: false },
    majors: [{ type: String, required: true }],
    type: {
      type: String,
      default: "Online",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Advanced"],
      default: "Easy",
    },
    dueDate: { type: Date, required: false },
    saved: { type: Boolean, default: false },
    ignored: { type: Boolean, default: false },
    addedToMilestone: { type: Boolean, default: false },
    appliedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    milestoneAddedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    ignoredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    price: { type: Number, required: false },
    perHour: { type: Boolean, default: false },
    notificationCreated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.OpportunityCard ||
  mongoose.model<OpportunitiesCardType>(
    "OpportunityCard",
    OpportunityCardSchema
  );
