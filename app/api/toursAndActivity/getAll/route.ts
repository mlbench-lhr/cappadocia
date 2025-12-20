import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  let token = req.cookies.get("auth_token")?.value;
  const payload = token ? verifyToken(token) : null;
  const userId = payload?.userId;
  console.log("userId------", payload);
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 7;
  const searchTerm = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const category = url.searchParams.get("category");
  const filters = url.searchParams.get("filters") || "";
  const alternativeOf = url.searchParams.get("alternativeOf") || "";
  const sortBy = url.searchParams.get("sortBy") || "latest"; // latest | popular | rating
  const recommendedParam = url.searchParams.get("recommended");

  const query: any = {};

  if (payload && payload.role === "vendor") {
    query.vendor = userId;
  } else {
    query.isVerified = true;
  }
  if (!payload || payload.role === "user") {
    query.active = true;
  }
  if (status) {
    query.status = status;
  }
  if (alternativeOf) {
    query._id = { $ne: alternativeOf };
  }
  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (recommendedParam !== null) {
    const val = recommendedParam?.toLowerCase();
    if (val === "true" || val === "false") {
      query.recommended = val === "true";
    }
  }
  if (filters) {
    const filterArray = filters
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const validStatuses = [
      "pending admin approval",
      "active",
      "rejected",
      "upcoming",
    ];

    const validFilters = filterArray.filter((f) => validStatuses.includes(f));

    if (validFilters.length > 0) {
      query.status = { $in: validFilters };
    }

    // 2️⃣ Try JSON parsing (if filters is a JSON array)
    let parsed = [];
    try {
      const json = JSON.parse(filters);
      if (Array.isArray(json)) parsed = json;
    } catch {
      // Not JSON → ignore
    }

    // 3️⃣ Apply advanced filters (only if JSON was valid)
    // after parsing `parsed` as in your previous code:
    if (parsed.length > 0) {
      const slotConditions: any[] = [];

      parsed.forEach((f: any) => {
        const singleSlotCondition: any = {};
        if (f.duration) {
          // require slot start >= from AND slot end <= to
          const from = new Date(f.duration.from);
          const to = new Date(f.duration.to);
          singleSlotCondition.startDate = { $lte: to };
          singleSlotCondition.endDate = { $gte: from };
        }

        if (f.priceRange) {
          singleSlotCondition.adultPrice = {
            $gte: f.priceRange.min,
            $lte: f.priceRange.max,
          };
        }
        if (Object.keys(singleSlotCondition).length > 0) {
          slotConditions.push(singleSlotCondition);
        }

        if (typeof f.rating === "number") {
          // rating is a root-level field, keep it outside slots
          query["rating.average"] = { $gte: f.rating };
        }
      });

      // If we have multiple slot conditions, we need slots that match ALL of them
      if (slotConditions.length > 0) {
        if (slotConditions.length === 1) {
          // Single condition - simple $elemMatch
          query.slots = { $elemMatch: slotConditions[0] };
        } else {
          // Multiple conditions - need slots matching all conditions
          // This means we need a slot that satisfies all constraints simultaneously
          const combinedSlotCondition: any = {};
          slotConditions.forEach((condition) => {
            Object.keys(condition).forEach((key) => {
              if (!combinedSlotCondition[key]) {
                combinedSlotCondition[key] = condition[key];
              } else {
                // Merge conditions (handle $gte, $lte, etc.)
                if (typeof condition[key] === "object") {
                  combinedSlotCondition[key] = {
                    ...combinedSlotCondition[key],
                    ...condition[key],
                  };
                }
              }
            });
          });

          query.slots = { $elemMatch: combinedSlotCondition };
        }
      }
    }
  }
  const skip = (page - 1) * limit;

  let items: any[] = [];
  const total = await ToursAndActivity.countDocuments(query);

  if (sortBy === "popular") {
    items = await ToursAndActivity.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "activity",
          as: "bookings",
        },
      },
      { $addFields: { bookingsCount: { $size: "$bookings" } } },
      { $sort: { bookingsCount: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookings: 0,
        },
      },
    ]);
  } else if (sortBy === "rating") {
    items = await ToursAndActivity.find(query)
      .populate("vendor")
      .skip(skip)
      .limit(limit)
      .sort({ "rating.average": -1, "rating.total": -1, createdAt: -1 });
  } else {
    items = await ToursAndActivity.find(query)
      .populate("vendor")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  return NextResponse.json({
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
