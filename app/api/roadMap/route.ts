// /api/milestones/generate.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { verifyToken } from "@/lib/auth/jwt";
import { getSeason } from "@/lib/helper/timeFunctions";
import User from "@/lib/mongodb/models/User";
import Milestone from "@/lib/mongodb/models/Milestone";

const ai = new GoogleGenAI({});

interface MilestoneInput {
  demographics: {
    name: string;
    gender: string;
    city: string;
    state: string;
    annualIncome: number;
    raceEthnicity: string;
    firstGen: boolean;
  };
  academicData: {
    currentGrade: number;
    gpaType: "weighted" | "unweighted";
    GPA: number;
    coursework: string[];
    testScores: {
      PSAT?: number;
      SAT?: number;
      ACT?: number;
      PACT?: number;
    };
  };
  aspirations: {
    dreamColleges: string[];
    potentialMajors: string[];
    careerGoals: string[];
  };
  achievements: Array<{
    title: string;
    level: "school" | "regional" | "state" | "national" | "other";
    gradeEarned: number;
  }>;
  extracurriculars: Array<{
    name: string;
    role: string;
    years: number;
    level: "school" | "regional" | "state" | "national";
    ongoing: boolean;
  }>;
  targetTier: "Tier 1" | "Tier 2" | "Tier 3";
}

interface GeneratedMilestone {
  Grade: string;
  Semester: "Fall" | "Spring" | "Summer";
  MilestoneTitle: string;
  MilestoneGoal: string;
  OpportunityType: string;
  Dependencies: string[];
  DueDate: string;
  RequiresOpportunitySelection: boolean;
}

interface FormattedMilestone {
  image: string;
  title: string;
  organization: string;
  type: "Opportunity" | "Awards" | string;
  category:
    | "Internships"
    | "Summer Program"
    | "Clubs"
    | "Community Service"
    | "Awards"
    | "Competitions";
  deadLine: string;
  description: string;
  dependencies: string[];
  linkedOpportunities: string[];
  grade: string;
  semester: string;
  requiresSelection: boolean;
  tier: string;
  createdBy: string;
  gradeLevel: string;
  season: string | undefined;
}

// Helper: Parse income range to number
function parseIncomeToNumber(income: string): number {
  const ranges: { [key: string]: number } = {
    "$20,000 – $39,999": 30000,
    "$40,000 – $59,999": 50000,
    "$60,000 – $89,999": 75000,
    "$90,000 – $119,999": 105000,
    "$120,000 – $199,999": 160000,
    "$200,000+": 250000,
  };
  return ranges[income] || 50000;
}

// Helper: Map opportunity type to category
function mapToCategory(
  type: string
):
  | "Internships"
  | "Summer Program"
  | "Clubs"
  | "Community Service"
  | "Awards"
  | "Competitions" {
  const mapping: {
    [key: string]:
      | "Internships"
      | "Summer Program"
      | "Clubs"
      | "Awards"
      | "Community Service"
      | "Competitions";
  } = {
    Leadership: "Clubs",
    STEM: "Clubs",
    Arts: "Clubs",
    "Community Service": "Community Service",
    Research: "Internships",
    Competition: "Competitions",
    "Summer Program": "Summer Program",
    Award: "Awards",
  };
  return mapping[type] || "Clubs";
}

// Helper: Generate placeholder image based on type
function getPlaceholderImage(type: string): string {
  const images: { [key: string]: string } = {
    Leadership:
      "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg", // leader in meeting
    STEM: "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg", // science lab
    Arts: "https://images.pexels.com/photos/374746/pexels-photo-374746.jpeg", // painting or art
    "Community Service":
      "https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg",
    Research:
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg", // microscope / lab
    Competition:
      "https://images.pexels.com/photos/1754477/pexels-photo-1754477.jpeg",
    "Summer Program":
      "https://images.pexels.com/photos/210297/pexels-photo-210297.jpeg",
  };
  return (
    images[type] ||
    "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
  );
}

// Transform user data to milestone input
function transformUserToInput(userInfo: any): MilestoneInput {
  const personal = userInfo.personalInfo || {};
  const academic = userInfo.academicInfo || {};
  const dreams = userInfo.dreamsAndGoals || {};
  const extAwards = userInfo.extracurricularsAndAwards || {};

  return {
    demographics: {
      name: `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim(),
      gender: personal.gender || "Not specified",
      city: personal.city || "Not specified",
      state: personal.state || "Not specified",
      annualIncome: parseIncomeToNumber(personal.annualIncome || ""),
      raceEthnicity: personal.race || "Not specified",
      firstGen: personal.firstGenerationCollegeStudent || false,
    },
    academicData: {
      currentGrade: parseInt(academic.gradeLevel) || 11,
      gpaType: (academic.gpaType || "Unweighted GPA")
        .toLowerCase()
        .includes("unweighted")
        ? "unweighted"
        : "weighted",
      GPA: parseFloat(academic.gpa) || 3.5,
      coursework:
        academic.manualCourse?.map((c: any) => c.name || c).filter(Boolean) ||
        [],
      testScores: {
        PSAT: academic.maths ? parseInt(academic.maths) : undefined,
        ACT: academic.reading ? parseInt(academic.reading) : undefined,
      },
    },
    aspirations: {
      dreamColleges: dreams.dreamSchool || [],
      potentialMajors: dreams.intendedMajors || [],
      careerGoals: dreams.careerAspiration || [],
    },
    achievements:
      extAwards.awards?.map((a: any) => ({
        title: a.title || a.name || "Award",
        level: a.level || "school",
        gradeEarned: a.gradeEarned || 10,
      })) || [],
    extracurriculars:
      extAwards.extracurricularActivity?.map((e: any) => ({
        name: e.name || e,
        role: e.role || "Member",
        years: e.years || 1,
        level: e.level || "school",
        ongoing: e.ongoing !== false,
      })) || [],
    targetTier: userInfo.milestoneTier || "Tier 2",
  };
}

// Build AI prompt based on student data
function buildAIPrompt(input: MilestoneInput): string {
  return `You are an expert college-counseling roadmap generator whose job is to produce a 4-year, extracurricular-focused high school roadmap for an individual student.

STUDENT PROFILE:
- Name: ${input.demographics.name}
- Current Grade: ${input.academicData.currentGrade}
- GPA: ${input.academicData.GPA} (${input.academicData.gpaType})
- Location: ${input.demographics.city}, ${input.demographics.state}
- Target Colleges: ${input.aspirations.dreamColleges.join(", ")}
- Intended Majors: ${input.aspirations.potentialMajors.join(", ")}
- Career Goals: ${input.aspirations.careerGoals.join(", ")}
- Target Tier: ${input.targetTier}
- Current Extracurriculars: ${input.extracurriculars
    .map((e) => `${e.name} (${e.role})`)
    .join(", ")}
- Awards: ${input.achievements.map((a) => a.title).join(", ")}

TASK:
Generate a 4-year personalized high school roadmap (Grades 9-12) with 12-20 milestones (3-5 per year), focused on extracurricular growth aligned with their ${
    input.targetTier
  } profile and aspirations.

RULES:
1. At least 80% should be extracurricular-focused
2. Sequence logically: Join → Lead → Compete → Scale
3. Each milestone must integrate with or build upon existing activities
4. Include 3-5 milestones per school year
5. Assign each milestone to a specific Grade (9-12) and Semester (Fall/Spring/Summer)
6. Default due dates: Fall → December, Spring → May, Summer → August
7. For ${input.targetTier}, prioritize ${
    input.targetTier === "Tier 1"
      ? "national recognition, research, leadership with measurable impact"
      : input.targetTier === "Tier 2"
      ? "regional/state recognition, consistent leadership, selective programs"
      : "local leadership, consistent involvement, community service depth"
  }

TIER CONTEXT:
${
  input.targetTier === "Tier 1"
    ? "Ultra-Elite: National recognition, original research, selective programs, national competitions"
    : input.targetTier === "Tier 2"
    ? "Highly Competitive: Regional/state recognition, strong academics, selective programs, state competitions"
    : "Competitive: Local leadership, consistent involvement, community impact, depth in 2-3 activities"
}

CURRENT EXTRACURRICULARS TO BUILD UPON:
${input.extracurriculars
  .map(
    (e) =>
      `- ${e.name}: Currently a ${e.role}, involved for ${e.years} year(s), level: ${e.level}`
  )
  .join("\n")}

OUTPUT:
Return ONLY a valid JSON array (no markdown, no code blocks) of milestone objects in this exact format:
[
  {
    "Grade": "9",
    "Semester": "Fall",
    "MilestoneTitle": "string",
    "MilestoneGoal": "string - why this matters for ${input.targetTier}",
    "OpportunityType": "Leadership|STEM|Arts|Community Service|Research|Competition|Summer Program",
    "Dependencies": ["string"],
    "DueDate": "Month Year",
    "RequiresOpportunitySelection": true|false
  }
]

Ensure chronological order. Return ONLY valid JSON, no other text.`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    const userInfoPayload = await User.findById(userId);
    if (!userInfoPayload) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Transform user data to AI input format
    const aiInput = transformUserToInput(userInfoPayload);
    const prompt = buildAIPrompt(aiInput);

    // Call Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error("No response from AI");

    // Parse JSON response - remove markdown formatting if present
    const cleanJson = text
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```\s*$/, "")
      .trim();
    const milestones: GeneratedMilestone[] = JSON.parse(cleanJson);
    // Format milestones to required interface
    const currentSeason = getSeason();
    const milestonesFinal: FormattedMilestone[] = milestones.map(
      (milestone: GeneratedMilestone) => ({
        image: getPlaceholderImage(milestone.OpportunityType),
        title: milestone.MilestoneTitle,
        organization: `Grade ${milestone.Grade} - ${milestone.Semester}`,
        type: milestone.RequiresOpportunitySelection ? "Opportunity" : "Awards",
        category: mapToCategory(milestone.OpportunityType),
        deadLine: milestone.DueDate,
        description: milestone.MilestoneGoal,
        dependencies: milestone.Dependencies,
        linkedOpportunities: [],
        grade: milestone.Grade,
        semester: milestone.Semester,
        requiresSelection: milestone.RequiresOpportunitySelection,
        tier: userInfoPayload.milestoneTier,
        createdBy: userId,
        gradeLevel: userInfoPayload.academicInfo?.gradeLevel,
        season: currentSeason,
        price: 0,
      })
    );
    const addedRoadMap = await Milestone.insertMany(milestonesFinal);
    const updatedUser = await User.updateOne(
      { _id: userId },
      { roadMapAdded: true }
    );

    return NextResponse.json({
      success: true,
      count: milestonesFinal.length,
      data: addedRoadMap,
      gradeLevel: userInfoPayload.academicInfo?.gradeLevel,
      tier: userInfoPayload.milestoneTier,
      studentName: `${userInfoPayload.firstName} ${userInfoPayload.lastName}`,
    });
  } catch (err: any) {
    console.error("Milestone generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate milestones" },
      { status: 500 }
    );
  }
}
