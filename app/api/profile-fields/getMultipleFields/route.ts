import connectDB from "@/lib/mongodb/connection";
import { NextResponse } from "next/server";
import FieldEntry from "@/lib/mongodb/models/ProfileFields";

export async function POST(req: Request) {
  await connectDB();
  const { fields } = await req.json();
  if (!Array.isArray(fields) || fields.length === 0)
    return NextResponse.json({ message: "Fields required" }, { status: 400 });

  const data = await FieldEntry.find({ fieldName: { $in: fields } }).lean();

  const grouped: Record<string, string[]> = {};
  fields.forEach((f) => (grouped[f] = []));
  data.forEach((d) => grouped[d.fieldName].push(d.value));

  return NextResponse.json({ fields: grouped });
}
