import mongoose, { type Document, Schema } from "mongoose";

// ----------- Interfaces -----------
export interface AdminSettingsType extends Document {
  _id: string;
  promotionalImages: string[];
}

// ----------- Schema -----------
const AdminSettingSchema = new Schema<AdminSettingsType>(
  {
    promotionalImages: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.AdminSetting ||
  mongoose.model<AdminSettingsType>("AdminSetting", AdminSettingSchema);
