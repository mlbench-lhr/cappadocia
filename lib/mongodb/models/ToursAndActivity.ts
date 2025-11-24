import { VendorDetails } from "@/lib/store/slices/vendorSlice";
import mongoose, { type Document, Schema, Types } from "mongoose";
import "@/lib/mongodb/models/User";

// ----------- Interfaces -----------

export interface ToursAndActivity {
  _id: string;
  vendor: Types.ObjectId;
  title: string;
  category?: "Tour" | "Activity";
  description?: string;
  uploads: string[];
  languages: string[];
  pickupAvailable: boolean;
  included: string[];
  notIncluded: string[];
  itinerary: string[];
  cancellationPolicy: string;
  duration: number;
  status: "pending Admin Approval" | "active" | "rejected" | "upcoming";
  slots: [
    {
      _id: string;
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }
  ];
  isVerified: boolean;
  rejected: {
    isRejected: boolean;
    reason?: string;
  };
}
export interface ToursAndActivityWithVendor {
  _id: string;
  title: string;
  category?: "Tour" | "Activity";
  description?: string;
  uploads: string[];
  languages: string[];
  pickupAvailable: boolean;
  included: string[];
  notIncluded: string[];
  itinerary: string[];
  cancellationPolicy: string;
  duration: number;
  status: "pending Admin Approval" | "active" | "rejected" | "upcoming";
  slots: [
    {
      _id: string;
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }
  ];
  isVerified: boolean;
  rejected: {
    isRejected: boolean;
    reason?: string;
  };
  vendor: {
    avatar: string;
    vendorDetails: VendorDetails;
  };
}
export interface ToursAndActivityDocument extends ToursAndActivity, Document {
  _id: string;
}

// ----------- Schema -----------

const ToursAndActivitySchema = new Schema<ToursAndActivity>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String },
    status: {
      type: String,
      enum: ["pending Admin Approval", "active", "rejected", "upcoming"],
      default: "pending Admin Approval",
    },
    description: { type: String },
    uploads: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    pickupAvailable: { type: Boolean, default: false },
    included: { type: [String], default: [] },
    notIncluded: { type: [String], default: [] },
    itinerary: { type: [String], default: [] },
    cancellationPolicy: { type: String, required: true },
    duration: { type: Number, required: true },
    slots: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        adultPrice: { type: Number, required: true },
        childPrice: { type: Number, required: true },
        seatsAvailable: { type: Number, required: true },
      },
    ],
    isVerified: { type: Boolean, default: false },
    rejected: {
      isRejected: { type: Boolean, default: false },
      reason: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.ToursAndActivity ||
  mongoose.model<ToursAndActivity>("ToursAndActivity", ToursAndActivitySchema);
