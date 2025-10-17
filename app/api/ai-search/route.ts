import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const STOP_WORDS = [
  "the",
  "a",
  "an",
  "and",
  "or",
  "in",
  "on",
  "at",
  "by",
  "for",
  "of",
  "to",
  "learning",
  "practicing",
  "study",
  "course",
  "program",
  "self",
  "through",
  "using",
];

export async function POST(req: Request) {
  try {
    await connectDB();
    const { query, milestone } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }

    console.log("query---------", query);
    console.log("milestone---------", milestone);
 
    // ---------- DB Search ----------
    const searchTerms = [query.title, query.category]
      .join(" ")
      .split(/\s+/)
      .map((term) => term.toLowerCase())
      .filter((term) => term && !STOP_WORDS.includes(term));

    const regexTerms = searchTerms.map((term) => new RegExp(term, "i"));

    const opportunities = await Opportunity.find({
      $or: [{ title: { $in: regexTerms } }, { category: { $in: regexTerms } }],
    }).limit(20);

    if (opportunities.length > 0) {
      return NextResponse.json({ opportunities });
    }

    // ---------- AI Fallback ----------
    const aiPrompt = `
You are an AI that recommends extracurricular or academic opportunities aligned with a student's milestone.

Milestone Details:
Title: ${milestone.title}
Category: ${milestone.category}
Organization: ${milestone.organization || "N/A"}
Description: ${milestone.description}

Search Query Context: ${query.title || "N/A"}

Generate 2–4 realistic, milestone-aligned opportunities in this exact JSON format (array only, no extra text):

[
  {
    "_id": "string (fake ObjectId)",
    "title": "string",
    "category": "Internships | Summer Program | Clubs | Community Service | Competitions",
    "type": "In-Person | Online | Hybrid",
    "difficulty": "Easy | Medium | Advanced",
    "description": "string",
    "link": "valid URL",
    "majors": ["string"],
    "addedToMilestone": false,
    "appliedBy": [],
    "saved": false,
    "savedBy": [],
    "ignored": false,
    "ignoredBy": [],
    "milestoneAddedBy": [],
    "notificationCreated": false,
    "perHour": false,
    "createdAt": "${new Date().toISOString()}",
    "updatedAt": "${new Date().toISOString()}",
    "__v": 0,
    "image": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
  }
]
`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: aiPrompt,
    });

    const text = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const clean = text?.replace(/^```json\s*/, "").replace(/```$/, "");
    let generated = [];

    try {
      generated = JSON.parse(clean || "[]");
    } catch (err) {
      console.error("AI JSON parse error:", err);
    }

    return NextResponse.json({ opportunities: generated });
  } catch (err: any) {
    console.error("AI Search Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
