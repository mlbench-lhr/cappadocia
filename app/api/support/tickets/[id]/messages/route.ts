import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import SupportTicket from "@/lib/mongodb/models/SupportTicket";
import { verifyToken } from "@/lib/auth/jwt";
import axios from "axios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    verifyToken(token);
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    const ticket = await SupportTicket.findById(params.id).lean();
    if (!ticket || !ticket.conversation)
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    // Proxy to conversations messages
    const base = new URL(req.url).origin;
    const r = await fetch(
      `${base}/api/messages/conversations/${ticket.conversation}/messages?limit=${limit}&page=${page}`,
      {
        headers: { cookie: req.headers.get("cookie") || "" },
      }
    );
    const data = await r.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    const userId = payload.userId;
    const { text } = await req.json();
    if (!text || !text.trim())
      return NextResponse.json({ error: "Text is required" }, { status: 400 });

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket || !ticket.conversation)
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    // Proxy to conversations message POST
    const base = new URL(req.url).origin;
    const r = await fetch(
      `${base}/api/messages/conversations/${ticket.conversation}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({ text }),
      }
    );
    const data = await r.json();
    // update ticket latest
    ticket.latestMessageAt = new Date();
    await ticket.save();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
