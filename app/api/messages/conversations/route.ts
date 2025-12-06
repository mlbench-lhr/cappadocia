import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Conversation from "@/lib/mongodb/models/Conversation";
import Message from "@/lib/mongodb/models/Message";
import User from "@/lib/mongodb/models/User";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .sort({ latestMessageAt: -1 })
      .lean();

    const result = await Promise.all(
      conversations.map(async (c: any) => {
        const lastMsg = await Message.findOne({ conversation: c._id })
          .sort({ createdAt: -1 })
          .lean();
        const participants = await User.find({
          _id: { $in: c.participants },
        })
          .select("_id fullName avatar role vendorDetails")
          .lean();
        return { ...c, lastMessage: lastMsg || null, participants };
      })
    );

    return NextResponse.json({ conversations: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(token);
    const userId = payload.userId;
    const body = await req.json();
    const otherUserId = body.otherUserId as string;
    if (!otherUserId) {
      return NextResponse.json(
        { error: "otherUserId is required" },
        { status: 400 }
      );
    }

    const otherUser = await User.findById(otherUserId).lean();
    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chatKey = [userId, otherUserId].sort().join("_");
    let convo = await Conversation.findOne({ chatKey });
    if (!convo) {
      convo = await Conversation.create({
        participants: [userId, otherUserId],
        chatKey,
        latestMessageAt: new Date(),
      });
    }

    const participants = await User.find({ _id: { $in: convo.participants } })
      .select("_id fullName avatar role vendorDetails")
      .lean();

    return NextResponse.json({
      conversation: { ...convo.toObject(), participants },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
