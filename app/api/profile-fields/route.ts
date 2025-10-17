import connectDB from "@/lib/mongodb/connection";
import { NextResponse } from "next/server";
import FieldEntry from "@/lib/mongodb/models/ProfileFields";

export async function GET() {
  await connectDB();

  const aggregation = await FieldEntry.aggregate([
    {
      $group: {
        _id: "$fieldName",
        count: { $sum: 1 },
        createdAt: { $min: "$createdAt" },
        updatedAt: { $max: "$updatedAt" },
      },
    },
  ]);

  const total = aggregation.reduce((sum: any, f: any) => sum + f.count, 0);

  return NextResponse.json({
    total,
    fields: aggregation.map((f: any, index: number) => ({
      _id: f._id,
      name: f._id,
      count: f.count,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      srNo: `0${index + 1}`,
    })),
  });
}
