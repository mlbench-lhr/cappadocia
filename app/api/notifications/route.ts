import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Notification from "@/lib/mongodb/models/Notification";
import Milestone from "@/lib/mongodb/models/Milestone";
import moment from "moment";
import connectDB from "@/lib/mongodb/connection";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import { verifyToken } from "@/lib/auth/jwt";
import User, { IUser } from "@/lib/mongodb/models/User";
import { getSeason } from "@/lib/helper/timeFunctions";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    console.log("Cron running at:", moment().format("hh:mm:ss"));
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const user: IUser | null | any = await User.findById(payload?.userId);
    console.log("user---------", user);

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // add 7 days
    const currentSeason = getSeason();

    // STEP 1 — Create Notifications from Milestones
    const milestones = await Milestone.find({
      deadLine: { $gte: now, $lte: sevenDaysLater },
      status: { $ne: "done" },
      createdBy: payload?.userId,
      tier: user?.milestoneTier,
      gradeLevel: user?.academicInfo?.gradeLevel,
      season: currentSeason,
      notificationCreated: false,
    });
    const mIds = milestones.map((op) => op._id);
    await Milestone.updateMany(
      { _id: { $in: mIds } },
      { $set: { notificationCreated: true } }
    );

    for (const milestone of milestones) {
      const exists = await Notification.findOne({
        relatedId: milestone._id,
        type: "Milestone",
      });
      if (!exists) {
        await Notification.create({
          name: milestone.title,
          type: "Milestone",
          endDate: milestone.deadLine,
          image: milestone.image,
          relatedId: milestone._id,
          userId: payload?.userId,
        });
      }
    }

    // STEP 2 — Create Notifications from Opportunities
    const opportunities = await Opportunity.find({
      dueDate: { $gte: now, $lte: sevenDaysLater },
      notificationCreated: false,
      // appliedBy: { $in: [payload?.userId] },
    });

    const ids = opportunities.map((op) => op._id);
    await Opportunity.updateMany(
      { _id: { $in: ids } },
      { $set: { notificationCreated: true } }
    );

    for (const opportunity of opportunities) {
      const exists = await Notification.findOne({
        relatedId: opportunity._id,
        type: "Opportunity",
      });
      if (!exists) {
        await Notification.create({
          name: opportunity.title,
          type: "Opportunity",
          endDate: opportunity.dueDate,
          image: opportunity.image,
          relatedId: opportunity._id,
          isUnread: true,
          userId: payload?.userId,
        });
      }
    }

    // STEP 3 — Return latest notifications
    const notifications = await Notification.find({
      endDate: { $gte: new Date() },
      userId: payload?.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const responseData = notifications.map((n) => ({
      _id: n._id,
      name: n.name,
      type: n.type,
      endDate: n.endDate,
      image: n.image,
      createdAt: n.createdAt,
      isUnread: n.isUnread,
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error creating notifications:", error);
    return NextResponse.json(
      { error: "Failed to generate notifications" },
      { status: 500 }
    );
  }
}
