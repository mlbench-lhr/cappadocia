import mongoose, { Schema, Types, Document } from "mongoose";
import { LocationData, Traveler } from "@/lib/store/slices/addbooking";

// ----------- Sub-Schemas -----------

const LatLngSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const LocationDataSchema = new Schema<LocationData>(
  {
    address: { type: String, required: true },
    coordinates: { type: LatLngSchema, default: null },
  },
  { _id: false }
);

const TravelerSchema = new Schema<Traveler>(
  {
    fullName: { type: String, required: true },
    dob: { type: String, required: true },
    nationality: { type: String, required: true },
    passport: { type: String, required: true },
  },
  { _id: false }
);

// ----------- Main Schema -----------

export interface Booking {
  bookingId: string;
  activity: Types.ObjectId;
  vendor: Types.ObjectId;
  user: Types.ObjectId;
  selectDate: string;
  participants: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  travelers: Traveler[];
  pickupLocation: LocationData | null;
  paymentDetails: {
    paymentIntentId: string;
    customerId: string;
    amount: number;
    currency: string;
    status: string;
  };
  paymentStatus: "completed" | "pending" | "refunded";
  status: "pending" | "upcoming" | "completed" | "cancelled" | "missed";
}

export interface BookingDocument extends Booking, Document {
  _id: string;
}

const BookingSchema = new Schema<Booking>(
  {
    bookingId: { type: String, required: true, unique: true },

    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    selectDate: { type: String, required: true },
    participants: { type: String, required: true },

    email: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    travelers: { type: [TravelerSchema], required: true },

    pickupLocation: {
      type: LocationDataSchema,
      required: true,
      default: null,
    },

    paymentDetails: {
      paymentIntentId: { type: String, required: true },
      customerId: { type: String, required: true },
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
      status: { type: String, required: true },
    },

    paymentStatus: {
      type: String,
      enum: ["completed", "pending", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "upcoming", "completed", "cancelled", "missed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<Booking>("Booking", BookingSchema);
