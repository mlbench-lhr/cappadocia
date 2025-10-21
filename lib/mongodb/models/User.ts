import mongoose, { type Document, Schema } from "mongoose";

// ----------- Interfaces -----------
type ManualCourse = {
  courseName: string;
  grade: string;
  gradeLevel: string;
};

type Award = {
  awardName: string;
  gradeLevel: string[];
  recognitionLevel: string;
  description: string;
};

type ExtracurricularActivity = {
  activityType: string;
  activityTitle: string;
  organization: string;
  description: string;
  grade: string[];
  timing: string;
  hourPerWeek: number;
  weekPerYear: number;
};

export interface IUser extends Document {
  role: "admin" | "user";
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  isEmailVerified: boolean;
  dataUpdated: boolean;
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: Date;
  resetPasswordOTP?: string;
  resetPasswordOTPExpires?: Date;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  profileUpdated: Boolean;
  roadMapAdded: Boolean;
  applicationsStarted: number;
  blogTier: string;
  // new fields
  personalInfo?: {
    gender: "Male" | "Female" | "Other" | "Prefer not to say";
    state: string;
    city: string;
    annualIncome: string;
    firstGenerationCollegeStudent: boolean;
    hispanicOrLatino: boolean;
    race: string;
  };
  academicInfo?: {
    gradeLevel: string;
    school: string;
    gpaType: "Unweighted GPA" | "Weighted GPA";
    gpa: string;
    testScores: "SAT" | "ACT" | "PSAT" | "PACT" | "N/A";
    reading: string;
    english: string;
    science: string;
    maths: string;
    transcript: string[];
    manualCourse: ManualCourse[];
  };
  dreamsAndGoals?: {
    dreamSchool: string[];
    majors: string[];
    intendedMajors: string[];
    careerAspiration: string[];
    intendedMajorsNotInterested: string[];
    careerAspirationNotInterested: string[];
  };
  extracurricularsAndAwards?: {
    awards: Award[];
    extracurricularActivity: ExtracurricularActivity[];
  };
}

// ----------- Schema -----------
const ManualCourseSchema = new Schema<ManualCourse>(
  {
    courseName: { type: String, required: true },
    grade: { type: String, required: true },
    gradeLevel: { type: String, required: true },
  },
  { _id: false }
);

const AwardSchema = new Schema<Award>(
  {
    awardName: { type: String, required: true },
    gradeLevel: [{ type: String, required: true }],
    recognitionLevel: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const ExtracurricularActivitySchema = new Schema<ExtracurricularActivity>(
  {
    activityType: { type: String, required: true },
    activityTitle: { type: String, required: true },
    organization: { type: String, required: true },
    description: { type: String },
    grade: [{ type: String, required: true }],
    timing: { type: String, required: true },
    hourPerWeek: { type: Number, required: true },
    weekPerYear: { type: Number, required: true },
  },
  { _id: false }
);

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
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    avatar: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationOTP: { type: String, default: null },
    emailVerificationOTPExpires: { type: Date, default: null },
    resetPasswordOTP: { type: String, default: null },
    resetPasswordOTPExpires: { type: Date, default: null },
    googleId: { type: String, default: null },
    dataUpdated: { type: Boolean, default: false },

    // ----------- New Fields -----------
    personalInfo: {
      gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
      },
      state: String,
      city: String,
      annualIncome: String,
      firstGenerationCollegeStudent: { type: Boolean, default: false },
      hispanicOrLatino: { type: Boolean, default: false },
      race: String,
    },
    academicInfo: {
      gradeLevel: String,
      school: String,
      gpaType: { type: String, enum: ["Unweighted GPA", "Weighted GPA"] },
      gpa: String,
      testScores: { type: String, enum: ["SAT", "ACT", "PSAT", "PACT", "N/A"] },
      reading: String,
      english: String,
      science: { type: String },
      maths: String,
      transcript: [String],
      manualCourse: [ManualCourseSchema],
    },
    dreamsAndGoals: {
      dreamSchool: [String],
      majors: [String],
      intendedMajors: [String],
      careerAspiration: [String],
      intendedMajorsNotInterested: [String],
      careerAspirationNotInterested: [String],
    },
    extracurricularsAndAwards: {
      awards: [AwardSchema],
      extracurricularActivity: [ExtracurricularActivitySchema],
    },
    profileUpdated: { type: Boolean },
    roadMapAdded: { type: Boolean, default: false },
    applicationsStarted: { type: Number },
    blogTier: { type: String },
  },
  { timestamps: true }
);

// Virtual for full name
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are serialized
UserSchema.set("toJSON", { virtuals: true });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
