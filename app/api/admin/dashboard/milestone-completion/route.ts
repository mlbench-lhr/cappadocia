import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30"; // default last 30 days
  const days = parseInt(range);
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  console.log("days-----", days);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const data = await Milestone.aggregate([
    {
      $match: {
        completed: true,
        completedAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
        value: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  

  const formatted = data.map((d) => ({
    date: d._id,
    value: d.value,
  }));

  return NextResponse.json(formatted);
}
