import mongoose, { Schema, Document } from "mongoose";

export interface NotificationType extends Document {
  name: string;
  type: "Milestone" | "Opportunity";
  endDate: Date;
  image?: string;
  relatedId: string;
  createdAt: Date;
  isUnread: boolean;
  userId?: string;
}

const NotificationSchema = new Schema<NotificationType>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Milestone", "Opportunity"], required: true },
    endDate: { type: Date, required: true },
    image: { type: String },
    relatedId: { type: String, required: true },
    isUnread: { type: Boolean, default: true },
    userId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<NotificationType>("Notification", NotificationSchema);
