import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Conversation from "@/lib/mongodb/models/Conversation";
import Message from "@/lib/mongodb/models/Message";
import { verifyToken } from "@/lib/auth/jwt";
import { pusherServer } from "@/lib/pusher/server";
import { sendNotification } from "@/lib/pusher/notify";
import SupportTicket from "@/lib/mongodb/models/SupportTicket";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    verifyToken(token);
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    const convo = await Conversation.findById(params.id).lean();
    if (!convo) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const [items, total] = await Promise.all([
      Message.find({ conversation: params.id })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments({ conversation: params.id }),
    ]);

    return NextResponse.json({
      messages: items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
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
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload1 = verifyToken(token);
    const userId = payload1.userId;

    const body = await req.json();
    const text = (body.text || "").trim();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const convo = await Conversation.findById(params.id);
    if (!convo) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const msg = await Message.create({
      conversation: convo._id,
      sender: userId,
      text,
    });

    convo.latestMessageAt = new Date();
    await convo.save();

    const payload = {
      _id: msg._id.toString(),
      conversation: convo._id.toString(),
      sender: userId,
      text,
      createdAt: msg.createdAt,
    };
    await pusherServer.trigger(
      `conversation-${convo._id.toString()}`,
      "message-new",
      payload
    );

    const convPayload = {
      conversationId: convo._id.toString(),
      latestMessageAt: convo.latestMessageAt,
      lastMessage: { text, sender: userId, createdAt: msg.createdAt },
    };
    await pusherServer.trigger(
      `user-${convo.participants[0].toString()}`,
      "conversation-updated",
      convPayload
    );
    await pusherServer.trigger(
      `user-${convo.participants[1].toString()}`,
      "conversation-updated",
      convPayload
    );

    const recipients = convo.participants
      .map((p) => p.toString())
      .filter((p) => p !== userId);

    for (const rid of recipients) {
      await sendNotification({
        recipientId: rid,
        name: "New message",
        type: "chat",
        message: text,
        link: `/messages?sender=${userId}`,
        relatedId: convo._id.toString(),
        endDate: msg.createdAt,
      });
    }

    await SupportTicket.updateMany(
      { conversation: convo._id },
      { $set: { latestMessageAt: msg.createdAt } }
    );

    return NextResponse.json({ message: msg });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
