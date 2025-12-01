import mongoose, { Schema, Document } from "mongoose";
import "@/lib/mongodb/models/booking";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/User";
import { Payments } from "@/lib/types/payments";

export interface BookingDocument extends Payments, Document {
  _id: string;
}

const PaymentsSchema = new Schema<Payments>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    activity: {
      type: Schema.Types.ObjectId,
      ref: "ToursAndActivity",
      required: true,
    },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedAt: { type: Date, default: Date.now },
    total: { type: Number },
    vendorPayment: { type: Number },
    commission: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Payments ||
  mongoose.model<Payments>("Payments", PaymentsSchema);
