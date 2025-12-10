import mongoose, { type Document, Schema } from "mongoose";

// ----------- Interfaces -----------
export interface AdminSettingsType extends Document {
  _id: string;
  promotionalImages: string[];
  section1Slides: string[];
  section3MainImages: string[];
  section3TabIcons: string[];
  section4Background: string;
  section4Thumbs: string[];
  section6Image: string;
  section7Image: string;
  section8Background: string;
}

// ----------- Schema -----------
const AdminSettingSchema = new Schema<AdminSettingsType>(
  {
    promotionalImages: [{ type: String }],
    section1Slides: [{ type: String }],
    section3MainImages: [{ type: String }],
    section3TabIcons: [{ type: String }],
    section4Background: { type: String },
    section4Thumbs: [{ type: String }],
    section6Image: { type: String },
    section7Image: { type: String },
    section8Background: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.AdminSetting ||
  mongoose.model<AdminSettingsType>("AdminSetting", AdminSettingSchema);
