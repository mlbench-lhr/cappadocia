import connectDB from "@/lib/mongodb/connection";
import { NextResponse } from "next/server";
import FieldEntry from "@/lib/mongodb/models/ProfileFields";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const field = searchParams.get("field");
  const search = searchParams.get("search") || "";
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!field)
    return NextResponse.json({ message: "Missing field" }, { status: 400 });

  const query: any = { fieldName: field };
  if (search) query.value = { $regex: search, $options: "i" };

  const total = await FieldEntry.countDocuments(query);
  const entries = await FieldEntry.find(query)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const formatted = entries.map((e, i) => ({
    srNo: `0${i + 1}`,
    name: e.value,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    _id: e._id,
  }));

  return NextResponse.json({ total, offset, limit, items: formatted });
}
