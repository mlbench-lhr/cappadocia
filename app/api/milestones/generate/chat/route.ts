// /api/milestones/generate.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an assistant that behaves in two modes:

1. **Milestone Mode**:  
If the message describes a clear goal (e.g., "I want to improve my mathematics in 3 months"),  
respond **ONLY with a valid JSON array** containing 2 or 3 objects. 
Each object must match exactly this TypeScript shape:

{
  "image": string,
  "title": string,
  "organization": string,
  "type": "Opportunity" | "Awards" | string,
  "category": "Internships" | "Summer Program" | "Clubs" | "Community Service" | "Competitions",
  "gradeLevel": string,
  "deadLine": Date,
  "description": string,
  "dependencies": string[],
  "linkedOpportunities": string[]
}

⚠️ Rules for Milestone Mode:
- The "image" field must always be a direct Pexels link (images.pexels.com), like this https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg.
- Respond with **ONLY raw JSON**.  
- Do not include explanations, markdown, or extra text.  

2. **Chat Mode**:  
If the message is casual (like "hi", "how are you"), respond normally in plain text.  

User message: "${userMessage}"
      `,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    let parsed = null;
    try {
      if (text) {
        parsed = JSON.parse(
          text.replace(/^```json\s*/, "").replace(/```$/, "")
        );
      }
    } catch (e) {
      parsed = null;
    }

    return NextResponse.json({
      isMilestone: !!parsed,
      data: parsed || text,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
