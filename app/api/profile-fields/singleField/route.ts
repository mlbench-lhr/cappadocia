import connectDB from "@/lib/mongodb/connection";
import { NextResponse } from "next/server";
import FieldEntry from "@/lib/mongodb/models/ProfileFields";

export async function PUT(req: Request) {
  await connectDB();
  const { field, value } = await req.json();
  if (!field || !value)
    return NextResponse.json(
      { message: "Field and value required" },
      { status: 400 }
    );

  const newEntry = await FieldEntry.create({ fieldName: field, value });
  return NextResponse.json({ success: true, entry: newEntry });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

  await FieldEntry.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  await connectDB();
  const { id, value } = await req.json();
  console.log("id, value-----", id, value);

  if (!id || !value)
    return NextResponse.json(
      { message: "Missing id or value" },
      { status: 400 }
    );

  const updated = await FieldEntry.findByIdAndUpdate(
    id,
    { value },
    { new: true }
  );
  return NextResponse.json({ success: true, entry: updated });
}
