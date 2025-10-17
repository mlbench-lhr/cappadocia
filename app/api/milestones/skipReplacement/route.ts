// /api/milestones/generate.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { verifyToken } from "@/lib/auth/jwt";
import { getSeason } from "@/lib/helper/timeFunctions";

const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    const userInfoPayload = await req.json();
    console.log("userInfoPayload-------", userInfoPayload);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Generate **3 to 4 milestones** in valid JSON format for a student based on this info:
${JSON.stringify(userInfoPayload, null, 2)}

Each milestone must strictly follow this TypeScript interface:
{
  "image": string,
  "title": string,
  "organization": string,
  "type": "Opportunity" | "Awards" | string,
  "category": "Internships" | "Summer Program" | "Clubs" | "Community Service" | "Competitions",
  "deadLine": string,
  "description": string,
  "dependencies": string[],
  "linkedOpportunities": string[]
}

Rules:
- Respond ONLY with raw JSON array (no markdown or text).
- Each "image" must be a real Pexels image URL (https://images.pexels.com/...).
- All milestones should be **closely related or similar** to the provided opportunity (e.g., same category, focus, or theme).
- Keep milestone descriptions detailed but concise.
  `,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error("No response from AI");

    const milestones = JSON.parse(
      text.replace(/^```json\s*/, "").replace(/```$/, "")
    );

    const currentSeason = getSeason();
    const milestonesFinal = milestones.map((item: any) => ({
      ...item,
      tier: userInfoPayload.tier,
      price: 0,
      createdBy: userId,
      gradeLevel: userInfoPayload.gradeLevel,
      season: currentSeason,
    }));

    return NextResponse.json({
      success: true,
      count: milestonesFinal.length,
      data: milestonesFinal,
      gradeLevel: userInfoPayload.gradeLevel,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
