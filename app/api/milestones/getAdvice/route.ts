// /api/milestones/advice.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export interface MilestoneAdviceRequest {
  milestone: {
    title?: string;
    description?: string;
    category?: string;
    organization?: string;
    type?: string;
    gradeLevel?: string;
    tier?: string;
    dependencies?: string[];
    deadLine?: Date;
    status?: string;
  };
  userProfile?: {
    gpa?: string;
    dreamColleges?: string[];
    intendedMajor?: string;
    currentActivities?: string[];
    city?: string;
    state?: string;
  };
}

interface AdviceResponse {
  title: string;
  description: string;
}

export async function POST(req: Request) {
  try {
    const payload: MilestoneAdviceRequest = await req.json();
    console.log("payload", payload);
    
    const milestone = payload.milestone;
    const userProfile = payload.userProfile;
    console.log("milestone", milestone);
    
    if (!milestone || !milestone.title) {
      return NextResponse.json(
        { error: "Milestone details are required" },
        { status: 400 }
      );
    }

    // Format deadline for better AI understanding
    const deadlineDate = milestone?.deadLine;
    const formattedDeadline = deadlineDate;
    const prompt = `
You are an expert college counselor helping a high school student achieve their milestone. 

MILESTONE DETAILS:
- Title: "${milestone.title}"
- Description: "${milestone.description}"
- Category: "${milestone.category}"
- Organization: "${milestone.organization}"
- Type: "${milestone.type}"
- Grade Level: "${milestone.gradeLevel || "Not specified"}"
- Tier: "${milestone.tier || "Not specified"}"
- Deadline: "${formattedDeadline}"
- Current Status: "${milestone.status || "not_started"}"
- Dependencies: ${
      milestone.dependencies?.length
        ? milestone.dependencies.join(", ")
        : "None"
    }

STUDENT PROFILE:
- GPA: "${userProfile?.gpa || "Not provided"}"
- Dream Colleges: "${userProfile?.dreamColleges?.join(", ") || "Not provided"}"
- Intended Major: "${userProfile?.intendedMajor || "Not provided"}"
- Current Activities: "${
      userProfile?.currentActivities?.join(", ") || "Not provided"
    }"
- Location: "${userProfile?.city || ""}, ${userProfile?.state || ""}"

Provide exactly 3 practical, actionable advice points to help the student successfully complete this milestone. Each advice point should be specific, actionable, and tailored to their profile and timeline.

Respond with ONLY a valid JSON array of exactly 3 objects, each with this structure:
{
  "title": "Brief, catchy title (similar to: 'Personalised Coding Guidance', 'Expert Insights', 'Step-by-Step Support')",
  "description": "Concise explanation of what this advice offers (similar to: 'Get tailored tips on tasks like building features, fixing bugs, or optimizing code.')"
}

Make sure each advice point is:
1. Specific to this milestone and student profile
2. Considers the timeline
3. Includes concrete benefits
4. Is realistic and achievable

Do NOT include markdown, explanations, or any text outside the JSON array.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error("No response from AI");
    }

    // Clean and parse JSON response
    let adviceData: AdviceResponse[];
    try {
      const cleanedText = text.replace(/^```json\s*/, "").replace(/```$/, "");
      adviceData = JSON.parse(cleanedText);

      // Validate response structure
      if (!Array.isArray(adviceData) || adviceData.length !== 3) {
        throw new Error("Invalid advice format");
      }

      // Validate each advice object
      for (const advice of adviceData) {
        if (!advice.title || !advice.description) {
          throw new Error("Invalid advice object structure");
        }
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);

      // Fallback generic advice in the new format
      adviceData = [
        {
          title: "Personalised Guidance",
          description: "Get tailored tips and strategies specific to your milestone, timeline, and academic profile.",
        },
        {
          title: "Expert Insights", 
          description: "Learn best practices and proven strategies from experienced counselors and successful students.",
        },
        {
          title: "Step-by-Step Support",
          description: "Break down complex milestones into manageable steps with clear timelines and actionable tasks.",
        },
      ];
    }

    return NextResponse.json({
      success: true,
      milestone: {
        title: milestone.title,
        deadline: formattedDeadline,
      },
      advice: adviceData,
    });
  } catch (error: any) {
    console.error("Error generating milestone advice:", error);

    return NextResponse.json(
      {
        error: "Failed to generate advice",
        details: error.message,
      },
      { status: 500 }
    );
  }
}