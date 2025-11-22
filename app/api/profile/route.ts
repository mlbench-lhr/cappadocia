import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import User from "@/lib/mongodb/models/User";
import { z } from "zod";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";

const PersonalInfoSchema = z.object({
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  annualIncome: z.string().optional(),
  firstGenerationCollegeStudent: z.boolean().optional(),
  hispanicOrLatino: z.boolean().optional(),
  race: z.string().optional(),
});

const ManualCourseSchema = z.object({
  courseName: z.string(),
  grade: z.string(),
  gradeLevel: z.string(),
});

const AcademicInfoSchema = z.object({
  gradeLevel: z.string().optional(),
  school: z.string().optional(),
  gpaType: z.enum(["Unweighted GPA", "Weighted GPA"]).optional(),
  gpa: z.string().optional(),
  testScores: z.enum(["SAT", "ACT", "PSAT", "PACT", "N/A"]).optional(),
  reading: z.string().optional(),
  english: z.string().optional(),
  science: z.string().optional(),
  maths: z.string().optional(),
  transcript: z.array(z.string()).optional(),
  manualCourse: z.array(ManualCourseSchema).optional(),
});

const DreamsAndGoalsSchema = z.object({
  dreamSchool: z.array(z.string()).optional(),
  majors: z.array(z.string()).optional(),
  intendedMajors: z.array(z.string()).optional(),
  careerAspiration: z.array(z.string()).optional(),
  intendedMajorsNotInterested: z.array(z.string()).optional(),
  careerAspirationNotInterested: z.array(z.string()).optional(),
});

const AwardSchema = z.object({
  awardName: z.string(),
  gradeLevel: z.array(z.string()),
  recognitionLevel: z.string(),
  description: z.string().optional(),
});

const ExtracurricularActivitySchema = z.object({
  activityType: z.string(),
  activityTitle: z.string(),
  organization: z.string(),
  description: z.string().optional(),
  grade: z.array(z.string()),
  timing: z.string(),
  hourPerWeek: z.number(),
  weekPerYear: z.number(),
});

const ExtracurricularsAndAwardsSchema = z.object({
  awards: z.array(AwardSchema).optional(),
  extracurricularActivity: z.array(ExtracurricularActivitySchema).optional(),
});
export const ObjectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

const UpdateProfileSchema = z.object({
  personalInfo: PersonalInfoSchema.optional(),
  academicInfo: AcademicInfoSchema.optional(),
  dreamsAndGoals: DreamsAndGoalsSchema.optional(),
  extracurricularsAndAwards: ExtracurricularsAndAwardsSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
  blogTier: z.string().optional(),
  profileUpdated: z.boolean().optional(),
  favorites: z.array(ObjectIdSchema).optional(),
});

export const GET = withAuth(async (req) => {
  try {
    await connectDB();
    console.log(req.user?.userId);
    const user = await User.findOne({
      _id: req.user?.userId,
    }).lean();
    return NextResponse.json({
      user: user,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profile" },
      { status: 500 }
    );
  }
});

export const PUT = async (req: any) => {
  try {
    await connectDB();
    const body = await req.json();
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    // Validate the request body
    const validatedData = UpdateProfileSchema.parse(body);

    // Build update object dynamically based on provided data
    const updateData: any = {};

    // Handle nested object updates
    if (validatedData.personalInfo) {
      Object.keys(validatedData.personalInfo).forEach((key) => {
        updateData[`personalInfo.${key}`] =
          validatedData.personalInfo![
            key as keyof typeof validatedData.personalInfo
          ];
      });
    }

    if (validatedData.academicInfo) {
      Object.keys(validatedData.academicInfo).forEach((key) => {
        updateData[`academicInfo.${key}`] =
          validatedData.academicInfo![
            key as keyof typeof validatedData.academicInfo
          ];
      });
    }

    if (validatedData.dreamsAndGoals) {
      Object.keys(validatedData.dreamsAndGoals).forEach((key) => {
        updateData[`dreamsAndGoals.${key}`] =
          validatedData.dreamsAndGoals![
            key as keyof typeof validatedData.dreamsAndGoals
          ];
      });
    }

    if (validatedData.extracurricularsAndAwards) {
      Object.keys(validatedData.extracurricularsAndAwards).forEach((key) => {
        updateData[`extracurricularsAndAwards.${key}`] =
          validatedData.extracurricularsAndAwards![
            key as keyof typeof validatedData.extracurricularsAndAwards
          ];
      });
    }

    if (validatedData.favorites) {
      updateData.favorites = validatedData.favorites;
    }
    console.log("updateData======-------------", updateData);

    // Handle direct field updates
    if (validatedData.firstName) updateData.firstName = validatedData.firstName;
    if (validatedData.lastName) updateData.lastName = validatedData.lastName;
    if (validatedData.avatar) updateData.avatar = validatedData.avatar;
    if (validatedData.blogTier) updateData.blogTier = validatedData.blogTier;
    try {
      if (validatedData.profileUpdated === true) {
        updateData.profileUpdated = validatedData.profileUpdated;
        let profileUpdating = await User.findOne({ _id: userId });
        profileUpdating.profileUpdated = true;
        profileUpdating.save();
      }
    } catch (error) {
      console.log("error-----", error);
    }
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -emailVerificationOTP -resetPasswordOTP");
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
};
