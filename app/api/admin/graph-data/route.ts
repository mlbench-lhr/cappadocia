// app/api/admin/graph-data/route.ts
import connectDB from "@/lib/mongodb/connection";
import Visits from "@/lib/mongodb/models/Visits";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const range = parseInt(searchParams.get("range") || "7", 10); // default 7 days

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - range);

  // convert to YYYY-MM-DD format
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const visits = await Visits.aggregate([
    {
      $match: {
        date: { $gte: formatDate(startDate), $lte: formatDate(endDate) },
      },
    },
    {
      $group: {
        _id: "$date",
        value: { $sum: "$count" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const graphData = visits.map((v) => ({
    date: v._id,
    value: v.value,
  }));

  return NextResponse.json({ graphData });
}
