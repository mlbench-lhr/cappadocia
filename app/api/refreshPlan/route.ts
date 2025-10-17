// /api/milestones/refresh.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { verifyToken } from "@/lib/auth/jwt";
import { getSeason } from "@/lib/helper/timeFunctions";
import User from "@/lib/mongodb/models/User";
import Milestone from "@/lib/mongodb/models/Milestone";

const ai = new GoogleGenAI({});

// Transform user data to AI input format (reuse from generate)
function transformUserToInput(userInfo: any) {
  const personal = userInfo.personalInfo || {};
  const academic = userInfo.academicInfo || {};
  const dreams = userInfo.dreamsAndGoals || {};
  const extAwards = userInfo.extracurricularsAndAwards || {};

  const parseIncomeToNumber = (income: string) => {
    const ranges: { [key: string]: number } = {
      "$20,000 – $39,999": 30000,
      "$40,000 – $59,999": 50000,
      "$60,000 – $89,999": 75000,
      "$90,000 – $119,999": 105000,
      "$120,000 – $199,999": 160000,
      "$200,000+": 250000,
    };
    return ranges[income] || 50000;
  };

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
        academic.manualCourse
          ?.map((c: any) => c.courseName || c)
          .filter(Boolean) || [],
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
        title: a.awardName || "Award",
        level: a.recognitionLevel.toLowerCase() || "school",
        gradeEarned: parseInt(a.gradeLevel?.[0]) || 10,
      })) || [],
    extracurriculars:
      extAwards.extracurricularActivity?.map((e: any) => ({
        name: e.activityTitle || e,
        role: e.activityType || "Member",
        years: e.grade?.length || 1,
        level: e.activityType || "school",
        ongoing: true,
      })) || [],
    targetTier: userInfo.milestoneTier || "Tier 2",
  };
}

// Build AI prompt for Refresh Plan
function buildRefreshPrompt(input: any) {
  return `You are an expert college-counseling roadmap generator.

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
    .map((e: any) => `${e.name} (${e.role})`)
    .join(", ")}
- Awards: ${input.achievements.map((a: any) => a.title).join(", ")}

TASK:
Refresh the student's 4-year high school roadmap based on:
1) Failed or skipped milestones
2) New achievements or extracurriculars added

RULES:
- Keep existing milestones intact unless affected
- Adjust or add only impacted milestones
- Maintain chronological order and Tier focus
- Include 12-20 milestones total (3-5 per year)
- 80% should be extracurricular-focused
- Assign milestones by Grade (9-12) and Semester (Fall/Spring/Summer)
- Default due dates: Fall → December, Spring → May, Summer → August

OUTPUT:
Return ONLY a valid JSON array of milestone objects in this exact format:
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
]`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    const userId = payload.userId;

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existingMilestones = await Milestone.find({ createdBy: userId });

    // Transform user data to AI input
    const aiInput = transformUserToInput(user);
    const prompt = buildRefreshPrompt(aiInput);

    // Call Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error("No response from AI");

    const cleanJson = text
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```\s*$/, "")
      .trim();
    const refreshedMilestones = JSON.parse(cleanJson);

    const currentSeason = getSeason();

    // Format AI response to DB schema
    const milestonesFinal = refreshedMilestones.map((m: any) => ({
      image:
        "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg", // placeholder
      title: m.MilestoneTitle,
      organization: `Grade ${m.Grade} - ${m.Semester}`,
      type: m.RequiresOpportunitySelection ? "Opportunity" : "Awards",
      category: m.OpportunityType,
      deadLine: new Date(m.DueDate),
      description: m.MilestoneGoal,
      dependencies: m.Dependencies,
      linkedOpportunities: [],
      gradeLevel: m.Grade,
      semester: m.Semester,
      requiresSelection: m.RequiresOpportunitySelection,
      tier: user.milestoneTier,
      createdBy: userId,
      season: currentSeason,
      price: 0,
      status: "not_started",
      saved: false,
      skipped: false,
      markedAsDone: false,
      applied: false,
      perHour: false,
      completed: false,
      started: false,
      opportunityId: "",
      notificationCreated: false,
    }));

    // Insert or update milestones
    // For simplicity, remove affected milestones first
    await Milestone.deleteMany({
      createdBy: userId,
      status: { $in: ["skipped", "not_started"] },
    });

    const addedMilestones = await Milestone.insertMany(milestonesFinal);

    return NextResponse.json({
      success: true,
      updatedCount: existingMilestones.length,
      addedCount: addedMilestones.length,
      data: addedMilestones,
      message: "Roadmap successfully refreshed",
    });
  } catch (err: any) {
    console.error("Refresh Plan Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to refresh milestones" },
      { status: 500 }
    );
  }
}
