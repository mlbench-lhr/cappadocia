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

  const query: any = {};

  if (payload && payload.role === "vendor") {
    query.vendor = userId;
  } else {
    query.isVerified = true;
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
      // Build a single slot constraint that combines all price & duration constraints
      const slotCondition: any = {};

      parsed.forEach((f: any) => {
        if (f.duration) {
          // require slot start >= from AND slot end <= to
          const from = new Date(f.duration.from);
          const to = new Date(f.duration.to);
          // if startDate constraint already exists, merge with $gte/$lte appropriately
          slotCondition.startDate = Object.assign(
            {},
            slotCondition.startDate || {},
            { $gte: from }
          );
          slotCondition.endDate = Object.assign(
            {},
            slotCondition.endDate || {},
            { $lte: to }
          );
        }

        if (f.priceRange) {
          slotCondition.adultPrice = Object.assign(
            {},
            slotCondition.adultPrice || {},
            { $gte: f.priceRange.min, $lte: f.priceRange.max }
          );
        }

        if (typeof f.rating === "number") {
          // rating is a root-level field, keep it outside slots
          query["rating.average"] = { $gte: f.rating };
        }
      });

      // If we collected any slot constraints, require at least one slot matching them
      if (Object.keys(slotCondition).length > 0) {
        query.slots = { $elemMatch: slotCondition };
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
