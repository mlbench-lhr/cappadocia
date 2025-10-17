import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import User from "@/lib/mongodb/models/User";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic"; // ensure Next.js doesn't cache this route

const ai = new GoogleGenAI({});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = req.cookies.get("auth_token")?.value;

    if (!token)
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );

    const payload = verifyToken(token);
    const userId = payload.userId;
    const category = searchParams.get("category"); // "All Opportunities", "Internships", "Summer Program", "Clubs", "Community Service", "Competitions"
    const format = searchParams.get("format"); // "Online", "In-Person"
    const location = searchParams.get("location"); // "Local", "Anywhere"
    const priceType = searchParams.get("priceType"); // "Free", "Paid"
    const searchQuery = searchParams.get("search");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Fetch user data
    const userData: any = await User.findById(userId).lean();
    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Build database query
    let dbQuery: any = { ignoredBy: { $ne: userId } };

    if (category && category !== "All Opportunities") {
      dbQuery.category = category;
    }
    if (format) {
      dbQuery.type = format;
    }
    if (location === "Local" && userData.personalInfo?.city) {
      dbQuery.location = {
        $regex: new RegExp(userData.personalInfo.city, "i"),
      };
    }
    if (priceType === "Free") {
      dbQuery.price = { $lte: 0 };
    } else if (priceType === "Paid") {
      dbQuery.price = { $gt: 0 };
    }
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), "i");
      dbQuery.$or = [
        { title: searchRegex },
        { institute: searchRegex },
        { description: searchRegex },
        { majors: searchRegex },
      ];
    }

    // Search database first -- sample results to avoid identical prompt context every request
    let dbOpportunities: any[] = [];
    try {
      // sample up to 5 matching documents to vary context
      const sampleSize = 5;
      const pipeline: any[] = [
        { $match: dbQuery },
        { $sample: { size: sampleSize } },
      ];
      dbOpportunities = await Opportunity.aggregate(pipeline).limit(5).exec();
      // If aggregate returns nothing (e.g., due to $sample on small results), fallback to find
      if (!dbOpportunities || dbOpportunities.length === 0) {
        dbOpportunities = await Opportunity.find(dbQuery).limit(5).lean();
      }
    } catch (e) {
      // Fallback to .find in case aggregate fails
      dbOpportunities = await Opportunity.find(dbQuery).limit(5).lean();
    }

    console.log("Database query:", dbQuery);
    console.log("Found opportunities in DB (sampled):", dbOpportunities.length);

    // Prepare user profile for AI
    const userProfile = buildUserProfile(userData);
    const filters = buildFilters(category, format, location, priceType);

    // Generate AI recommendations
    const aiOpportunities = await generateAIOpportunities(
      userProfile,
      filters,
      dbOpportunities,
      userData.personalInfo?.city || "",
      searchQuery
    );

    // Save new opportunities to database
    const savedOpportunities = await saveOpportunitiesToDB(
      aiOpportunities,
      userId
    );

    return NextResponse.json(
      {
        savedOpportunities,
        pagination: {
          currentPage: 0,
          totalPages: 1,
          totalCount: savedOpportunities?.length || 7,
          limit: 8,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch opportunities", error: error.message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

function buildUserProfile(userData: any): string {
  const profile: any = {
    name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
    demographics: {},
    academic: {},
    aspirations: {},
    achievements: [],
    extracurriculars: [],
  };

  // Demographics
  if (userData.personalInfo) {
    profile.demographics = {
      gender: userData.personalInfo.gender,
      city: userData.personalInfo.city,
      state: userData.personalInfo.state,
      annualIncome: userData.personalInfo.annualIncome,
      race: userData.personalInfo.race,
      firstGeneration: userData.personalInfo.firstGenerationCollegeStudent,
      hispanicOrLatino: userData.personalInfo.hispanicOrLatino,
    };
  }

  // Academic Data
  if (userData.academicInfo) {
    profile.academic = {
      gradeLevel: userData.academicInfo.gradeLevel,
      gpa: userData.academicInfo.gpa,
      gpaType: userData.academicInfo.gpaType,
      testScores: userData.academicInfo.testScores,
      scores: {
        reading: userData.academicInfo.reading,
        english: userData.academicInfo.english,
        science: userData.academicInfo.science,
        maths: userData.academicInfo.maths,
      },
      coursework: userData.academicInfo.manualCourse,
    };
  }

  // Aspirations
  if (userData.dreamsAndGoals) {
    profile.aspirations = {
      dreamColleges: userData.dreamsAndGoals.dreamSchool,
      intendedMajors: userData.dreamsAndGoals.intendedMajors,
      careerGoals: userData.dreamsAndGoals.careerAspiration,
    };
  }

  // Achievements
  if (userData.extracurricularsAndAwards?.awards) {
    profile.achievements = userData.extracurricularsAndAwards.awards;
  }

  // Extracurriculars
  if (userData.extracurricularsAndAwards?.extracurricularActivity) {
    profile.extracurriculars =
      userData.extracurricularsAndAwards.extracurricularActivity;
  }

  return JSON.stringify(profile, null, 2);
}

function buildFilters(
  category: string | null,
  format: string | null,
  location: string | null,
  priceType: string | null
): string {
  const filters: any = {};

  if (category && category !== "All Opportunities") {
    filters.category = category;
  }
  if (format) {
    filters.type = format;
  }
  if (location) {
    filters.location = location;
  }
  if (priceType) {
    filters.priceType = priceType;
  }

  return JSON.stringify(filters, null, 2);
}

/**
 * Generate AI opportunities
 * - adds randomness (temperature/topP)
 * - injects a uniqueness seed & small prompt-variation
 * - uses systemInstruction for better behavior
 * - robustly parses and normalizes AI output to expected schema (keeps Price as number and DueDate as YYYY-MM-DD)
 */
async function generateAIOpportunities(
  userProfile: string,
  filters: string,
  dbOpportunities: any[],
  userCity: string,
  searchQuery: string | null
): Promise<any[]> {
  try {
    // Small set of variations to encourage different reasoning paths
    const phrasingVariations = [
      "Focus on lesser-known but high-quality programs with strong mentorship.",
      "Prioritize programs with free scholarships or need-based aid where possible.",
      "Emphasize research and sustained projects suitable for essays.",
      "Prioritize leadership and community impact opportunities.",
      "Highlight programs that map well to selective STEM majors.",
    ];
    const styleHint =
      phrasingVariations[Math.floor(Math.random() * phrasingVariations.length)];

    const randomSeed = Math.random().toString(36).substring(2, 10);

    const prompt = `
You are an expert AI assistant that recommends extracurricular opportunities for high school students.

STUDENT PROFILE:
${userProfile}

SELECTED FILTERS:
${filters}
${styleHint}

${
  searchQuery
    ? `\n🔍 CRITICAL SEARCH QUERY: "${searchQuery}"\n- This is the user's PRIMARY INTEREST\n- ALL opportunities MUST be directly related to: ${searchQuery}\n- Titles and descriptions MUST reflect this topic\n- Ignore unrelated activities even if they match the profile\n`
    : ""
}

DATABASE OPPORTUNITIES FOUND:
${
  dbOpportunities.length > 0
    ? JSON.stringify(
        dbOpportunities
          .map((d: any) => ({
            title: d.title,
            institute: d.institute,
            category: d.category,
            type: d.type,
            location: d.location,
            description: d.description,
            majors: d.majors,
            price: d.price,
            dueDate: d.dueDate,
          }))
          .slice(0, 5),
        null,
        2
      )
    : "No matching opportunities found in database."
}
UNIQUENESS_SEED: ${randomSeed}

YOUR TASK:
Generate 2-4 extracurricular opportunities that best fit this student's profile and selected filters${
      searchQuery ? ` with PRIMARY FOCUS on: "${searchQuery}"` : ""
    }.

RULES:
1. Database First: If any DB opportunities match well, include up to 1-2 of them. Transform them to match the output schema.
2. If not enough DB matches, recommend well-known programs from trusted sources.
3. Match opportunities to dream colleges and intended majors.
4. Apply the 4-tier selectivity strategy described in the client spec.
5. Provide DueDate as YYYY-MM-DD.
6. Price must be a number (0 for free).
7. If an opportunity is Hybrid, use "Hybrid" exactly. Type must be one of "Online" | "In-Person" | "Hybrid".
8. Output only a JSON array of 2-4 objects using the schema:
[
  {
    "Title": "string",
    "Organization": "string",
    "Category": "Internships | Summer Programs | Clubs | Community Service | Competitions",
    "Difficulty": "Easy | Medium | Advanced",
    "Type": "Online | In-Person | Hybrid",
    "Location": "string",
    "Description": "string (100-200 words)",
    "Majors": ["string"],
    "Price": number,
    "DueDate": "YYYY-MM-DD",
    "URL": "string"
  }
]
Respond with only raw JSON (no text).
`;
    // Use systemInstruction and generationConfig to encourage creative varied outputs
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are a creative, careful educational assistant that curates fresh, diverse extracurricular opportunities for high school students.",
      contents: [{ role: "user", text: prompt }],
      // sampling params to increase variation between calls
      generationConfig: {
        temperature: 0.85,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1200,
      },
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error("No response from AI");
    }

    // Try to extract JSON block from response
    let cleanedText = text
      .replace(/^\s*```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    // If there's extra commentary, find the first JSON array in the text
    if (!cleanedText.startsWith("[")) {
      const match = cleanedText.match(/(\[.*\])/s);
      if (match) cleanedText = match[1];
    }

    let opportunities: any[] = [];
    try {
      opportunities = JSON.parse(cleanedText);
    } catch (err) {
      // If JSON.parse fails, attempt to be more permissive: replace trailing commas, etc.
      const permissive = cleanedText
        .replace(/,\s*([}\]])/g, "$1") // remove trailing commas
        .replace(/(\w+):/g, (m, p1) => `"${p1}":`) // unquoted keys to quoted
        .replace(/'/g, '"');
      try {
        opportunities = JSON.parse(permissive);
      } catch (err2) {
        console.error(
          "AI response parse error:",
          err2,
          "original:",
          cleanedText
        );
        throw new Error("AI response is not valid JSON");
      }
    }

    if (!Array.isArray(opportunities)) {
      throw new Error("AI response is not an array");
    }

    // Normalize & validate each opportunity to expected schema and types
    const normalized = opportunities
      .slice(0, 4)
      .map((opp: any, idx: number) => {
        // Ensure required fields exist
        const Title = opp.Title || opp.title || `Opportunity ${idx + 1}`;
        const Organization =
          opp.Organization || opp.organization || opp.institute || "";
        const Category = opp.Category || opp.category || "Summer Programs";
        const Difficulty = opp.Difficulty || opp.difficulty || "Medium";
        let Type = opp.Type || opp.type || "Online";
        if (!["Online", "In-Person", "Hybrid"].includes(Type)) {
          // normalize common variants
          const t = String(Type).toLowerCase();
          if (t.includes("hybrid")) Type = "Hybrid";
          else if (t.includes("in")) Type = "In-Person";
          else Type = "Online";
        }
        const Location = opp.Location || opp.location || userCity || "Remote";
        const Description =
          opp.Description ||
          opp.description ||
          (opp.summary || "").toString().slice(0, 1000);
        const Majors = Array.isArray(opp.Majors)
          ? opp.Majors
          : opp.majors
          ? [String(opp.majors)]
          : [];
        // Price: ensure number (0 for free)
        let Price: number = 0;
        if (opp.Price !== undefined && opp.Price !== null) {
          if (typeof opp.Price === "number") Price = opp.Price;
          else if (typeof opp.Price === "string") {
            const p = opp.Price.replace(/[^0-9.]/g, "");
            Price = p ? parseFloat(p) : 0;
          } else {
            Price = Number(opp.Price) || 0;
          }
        } else if (opp.price !== undefined && opp.price !== null) {
          Price = Number(opp.price) || 0;
        } else {
          Price = 0;
        }

        // DueDate: accept flexible formats from AI, but store YYYY-MM-DD
        let DueDate = opp.DueDate || opp.dueDate || opp.deadline || null;
        let parsedISO = null;
        if (DueDate) {
          // Try to parse common formats
          const tryDate = (d: any) => {
            if (!d) return null;
            // If it's already YYYY-MM-DD or ISO
            const isoMatch = String(d).match(/\d{4}-\d{2}-\d{2}/);
            if (isoMatch) return isoMatch[0];
            // Try Date constructor
            const dt = new Date(String(d));
            if (!isNaN(dt.getTime())) {
              const yyyy = dt.getFullYear();
              const mm = String(dt.getMonth() + 1).padStart(2, "0");
              const dd = String(dt.getDate()).padStart(2, "0");
              return `${yyyy}-${mm}-${dd}`;
            }
            // Try parsing Month DD, YYYY
            const parsed = Date.parse(String(d));
            if (!isNaN(parsed)) {
              const dt2 = new Date(parsed);
              const yyyy = dt2.getFullYear();
              const mm2 = String(dt2.getMonth() + 1).padStart(2, "0");
              const dd2 = String(dt2.getDate()).padStart(2, "0");
              return `${yyyy}-${mm2}-${dd2}`;
            }
            return null;
          };
          parsedISO = tryDate(DueDate);
        }

        if (!parsedISO) {
          // If no due date provided, estimate a reasonable date: 90 days from now
          const dt = new Date();
          dt.setDate(dt.getDate() + 90);
          const yyyy = dt.getFullYear();
          const mm = String(dt.getMonth() + 1).padStart(2, "0");
          const dd = String(dt.getDate()).padStart(2, "0");
          parsedISO = `${yyyy}-${mm}-${dd}`;
        }

        const URL = opp.URL || opp.url || opp.link || "";

        return {
          Title: String(Title),
          Organization: String(Organization),
          Category: String(Category),
          Difficulty: String(Difficulty),
          Type: String(Type),
          Location: String(Location),
          Description: String(Description).slice(0, 2000),
          Majors: Majors.map((m: any) => String(m)),
          Price: Number(Price),
          DueDate: parsedISO, // YYYY-MM-DD
          URL: String(URL),
        };
      });

    return normalized;
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw new Error(`Failed to generate AI opportunities: ${error.message}`);
  }
}

async function saveOpportunitiesToDB(
  aiOpportunities: any[],
  userId: string
): Promise<any[]> {
  const savedOpportunities = [];

  for (const opp of aiOpportunities) {
    try {
      // Check if opportunity already exists (by title and organization)
      let existingOpp = await Opportunity.findOne({
        title: opp.Title,
        institute: opp.Organization,
      });

      if (existingOpp) {
        // Update user-specific fields
        const userIdObj = userId;

        // Add to savedBy if not already there
        const savedByIds = (existingOpp.savedBy || []).map(
          (id: any) => id?.toString?.() ?? String(id)
        );
        if (!savedByIds.includes(String(userIdObj))) {
          existingOpp.savedBy.push(userIdObj);
          await existingOpp.save();
        }

        savedOpportunities.push({
          ...existingOpp.toObject(),
          saved: (existingOpp.savedBy || [])
            .map((id: any) => id?.toString?.() ?? String(id))
            .includes(String(userIdObj)),
          ignored: (existingOpp.ignoredBy || [])
            .map((id: any) => id?.toString?.() ?? String(id))
            .includes(String(userIdObj)),
          addedToMilestone: (existingOpp.milestoneAddedBy || [])
            .map((id: any) => id?.toString?.() ?? String(id))
            .includes(String(userIdObj)),
        });
      } else {
        // Create new opportunity
        const newOpp = new Opportunity({
          title: opp.Title,
          institute: opp.Organization,
          category: opp.Category,
          difficulty: opp.Difficulty,
          type: opp.Type,
          location: opp.Location,
          description: opp.Description,
          majors: opp.Majors || [],
          price: opp.Price || 0,
          dueDate: new Date(opp.DueDate),
          link: opp.URL,
          saved: false,
          ignored: false,
          addedToMilestone: false,
          appliedBy: [],
          milestoneAddedBy: [],
          savedBy: [],
          ignoredBy: [],
          perHour: false,
          notificationCreated: false,
        });

        const saved = await newOpp.save();
        savedOpportunities.push({
          ...saved.toObject(),
          saved: false,
          ignored: false,
          addedToMilestone: false,
        });
      }
    } catch (error: any) {
      console.error(`Error saving opportunity ${opp.Title}:`, error);
      // Continue with next opportunity
    }
  }

  return savedOpportunities;
}
