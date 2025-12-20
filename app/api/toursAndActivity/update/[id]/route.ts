import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const token =
    req.headers.get("authorization")?.startsWith("Bearer ")
      ? req.headers.get("authorization")!.substring(7)
      : req.cookies.get("auth_token")?.value || "";
  if (!token)
    return NextResponse.json({ error: "Authorization required" }, { status: 401 });

  const payload = verifyToken(token);
  const body = await req.json();

  const item = await ToursAndActivity.findById(params.id);
  if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });

  if (payload.role === "vendor") {
    const vendorId = (item.vendor as any)?.toString();
    if (payload.userId !== vendorId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const allowed = ["title", "category", "description", "uploads", "active"] as const;
    const filtered: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) filtered[key] = body[key];
    }
    if (filtered.category && !["Tour", "Activity"].includes(filtered.category))
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    if (filtered.title && typeof filtered.title !== "string")
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    if (filtered.description && typeof filtered.description !== "string")
      return NextResponse.json({ error: "Invalid description" }, { status: 400 });
    if (filtered.uploads) {
      if (!Array.isArray(filtered.uploads))
        return NextResponse.json({ error: "Invalid uploads" }, { status: 400 });
      if (filtered.uploads.length < 4 || filtered.uploads.length > 10)
        return NextResponse.json({ error: "Uploads must be 4-10 images" }, { status: 400 });
    }
    if ("active" in filtered && typeof filtered.active !== "boolean")
      return NextResponse.json({ error: "Invalid active value" }, { status: 400 });

    const updated = await ToursAndActivity.findByIdAndUpdate(
      params.id,
      { $set: filtered },
      { new: true }
    );
    return NextResponse.json({ data: updated });
  }

  if (payload.role === "admin") {
    const updated = await ToursAndActivity.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );
    return NextResponse.json({ data: updated });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
