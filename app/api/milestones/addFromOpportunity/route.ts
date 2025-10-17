// /app/api/milestones/addFromOpportunity/route.ts
import { NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";
import { getSeason } from "@/lib/helper/timeFunctions";
import connectDB from "@/lib/mongodb/connection";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import User from "@/lib/mongodb/models/User";
import Milestone from "@/lib/mongodb/models/Milestone";

const ai = new GoogleGenAI({});

function normalizeGrade(input: string): string {
  const clean = input?.toString().replace(/\D/g, ""); // remove non-digits
  if (["9", "10", "11", "12"].includes(clean)) return clean;
  return "9"; // default
}

function fallbackPlacement(userGrade: string, dueDate: Date) {
  const numeric = parseInt(userGrade, 10);
  const deadlineYear = new Date(dueDate).getFullYear();
  const nowYear = new Date().getFullYear();

  let next = numeric;
  if (deadlineYear > nowYear && numeric < 12) next = numeric + 1;
  return next.toString();
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { opportunityId, userId, selectedDate } = await req.json();

    if (!opportunityId || !userId) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const [user, opportunity] = await Promise.all([
      User.findById(userId),
      Opportunity.findById(opportunityId),
    ]);

    if (!user || !opportunity) {
      return NextResponse.json(
        { message: "User or Opportunity not found" },
        { status: 404 }
      );
    }

    const existing = await Milestone.findOne({
      createdBy: userId,
      opportunityId,
    });
    if (existing)
      return NextResponse.json(
        { message: "Already added to milestone" },
        { status: 200 }
      );

    // === AI placement logic ===
    let aiGradeLevel = normalizeGrade(user?.academicInfo?.gradeLevel || "9");
    let aiSemester = getSeason();

    try {
      const userMessage = `
Determine the best grade level (9, 10, 11, 12)
and semester (Fall, Spring, Summer)
for when this student should add the following opportunity as a milestone.

Student profile:
${JSON.stringify(user, null, 2)}

Opportunity details:
${JSON.stringify(opportunity, null, 2)}

Return ONLY a JSON object in this shape:
{
  "gradeLevel": "10",
  "semester": "Spring"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMessage,
      });

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiGradeLevel = normalizeGrade(parsed.gradeLevel);
        aiSemester = parsed.semester || aiSemester;
      }
    } catch (error) {
      console.error("AI placement failed, using fallback:", error);
      aiGradeLevel = fallbackPlacement(
        aiGradeLevel,
        opportunity?.dueDate || new Date()
      );
    }

    // ✅ Create milestone
    const milestone = new Milestone({
      image: opportunity.image,
      title: opportunity.title,
      organization: opportunity.institute,
      description: opportunity.description,
      majors: opportunity.majors || [],
      type: "Opportunity",
      category: opportunity.category,
      gradeLevel: aiGradeLevel, // numeric only
      deadLine: selectedDate || opportunity?.dueDate || new Date(),
      dependencies: [],
      linkedOpportunities: [],
      createdBy: userId,
      aiGenerated: true,
      skipped: false,
      saved: false,
      markedAsDone: false,
      applied: false,
      price: opportunity.price || 0,
      perHour: false,
      status: "not_started",
      tier: user?.milestoneTier || "Tier 1",
      season: aiSemester,
      opportunityId,
    });

    await milestone.save();
    await Opportunity.findByIdAndUpdate(opportunityId, {
      $addToSet: { milestoneAddedBy: userId },
    });

    return NextResponse.json(
      { message: "Milestone added with AI placement", milestone },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Add Milestone Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
