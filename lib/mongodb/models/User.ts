import { LocationData } from "@/components/map";
import mongoose, { type Document, Schema } from "mongoose";

export interface VendorDetails {
  confirmPassword?: string;
  password?: string;
  companyName: string;
  contactPersonName: string;
  businessEmail: string;
  contactPhoneNumber: string;
  tursabNumber: string;
  address: LocationData;
  documents: string[];
  aboutUs: string;
  languages: string[];
  paymentInfo: {
    ibanNumber: string;
    bankName: string;
    accountHolderName: string;
    currency: string;
  };
}

export interface IUser extends Document {
  role: "admin" | "user" | "vendor";
  _id: string;
  email: string;
  password: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  avatar?: string;
  isEmailVerified: boolean;
  isRoleVerified: boolean;
  roleRejected: {
    isRoleRejected: boolean;
    reason?: string;
  };
  dataUpdated: boolean;
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: Date;
  resetPasswordOTP?: string;
  resetPasswordOTPExpires?: Date;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  profileUpdated: Boolean;
  vendorDetails: VendorDetails;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    fullName: { type: String, required: false, trim: true },
    firstName: { type: String, required: false, trim: true },
    phoneNumber: { type: String, trim: true },
    lastName: { type: String, required: false, trim: true },
    role: { type: String, default: "user", enum: ["user", "admin", "vendor"] },
    avatar: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isRoleVerified: { type: Boolean, default: false },
    roleRejected: {
      isRoleRejected: { type: Boolean, default: false },
      reason: { type: String },
    },
    emailVerificationOTP: { type: String, default: null },
    emailVerificationOTPExpires: { type: Date, default: null },
    resetPasswordOTP: { type: String, default: null },
    resetPasswordOTPExpires: { type: Date, default: null },
    googleId: { type: String, default: null },
    dataUpdated: { type: Boolean, default: false },
    profileUpdated: { type: Boolean },
    vendorDetails: {
      type: {
        companyName: { type: String, required: true },
        contactPersonName: { type: String, required: true },
        businessEmail: { type: String, required: true },
        contactPhoneNumber: { type: String, required: true },
        tursabNumber: { type: String, required: true },
        address: {
          address: { type: String, required: true },
          coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
          },
        },
        documents: [{ type: String, required: true }],
        aboutUs: { type: String, required: true },
        languages: [{ type: String, required: true }],
        paymentInfo: {
          ibanNumber: { type: String, required: true },
          bankName: { type: String, required: true },
          accountHolderName: { type: String, required: true },
          currency: { type: String, required: true },
        },
      },
      required: function () {
        return this.role === "vendor";
      },
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", { virtuals: true });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
