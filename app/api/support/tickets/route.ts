import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import SupportTicket from "@/lib/mongodb/models/SupportTicket";
import Conversation from "@/lib/mongodb/models/Conversation";
import User from "@/lib/mongodb/models/User";
import Message from "@/lib/mongodb/models/Message";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";

    const query: any = {};
    if (payload.role === "user") {
      query.user = payload.userId;
    }
    if (status) query.status = status;
    if (search) query.subject = { $regex: search, $options: "i" };

    const q = SupportTicket.find(query).sort({
      latestMessageAt: -1,
      createdAt: -1,
    });
    if (payload.role === "admin") {
      q.populate({ path: "user", select: "fullName email avatar" });
    }
    const items = await q.lean();
    const withLast = await Promise.all(
      items.map(async (t: any) => {
        let lastMessage = null;
        if (t.conversation) {
          lastMessage = await Message.findOne({ conversation: t.conversation })
            .sort({ createdAt: -1 })
            .lean();
        }
        return { ...t, lastMessage };
      })
    );
    return NextResponse.json({ tickets: withLast });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    const { bookingId, subject, description } = await req.json();
    if (!subject || !description) {
      return NextResponse.json(
        { error: "Subject and description required" },
        { status: 400 }
      );
    }
    const existing = await SupportTicket.findOne({
      user: payload.userId,
      status: "open",
    }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "You already have an open ticket", ticket: existing },
        { status: 400 }
      );
    }

    const admin = await User.findOne({ role: "admin" }).lean();
    if (!admin)
      return NextResponse.json({ error: "Admin not found" }, { status: 500 });
    const adminId = admin._id.toString();
    const chatKey = [payload.userId, adminId].sort().join("_");
    let convo = await Conversation.findOne({ chatKey });
    if (!convo) {
      convo = await Conversation.create({
        participants: [payload.userId, adminId],
        chatKey,
        latestMessageAt: new Date(),
      });
    }

    const ticket = await SupportTicket.create({
      user: payload.userId,
      bookingId,
      subject,
      description,
      conversation: convo._id,
      latestMessageAt: new Date(),
    });
    const participants = await User.find({ _id: { $in: convo.participants } })
      .select("_id fullName avatar role")
      .lean();
    return NextResponse.json({
      ticket,
      conversation: { ...convo.toObject(), participants },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
