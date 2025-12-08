import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import SupportTicket from "@/lib/mongodb/models/SupportTicket";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    ticket.status = "resolved";
    await ticket.save();
    return NextResponse.json({ ticket });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
