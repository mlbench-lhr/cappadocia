import { pusherServer } from "./server";
import Notification from "@/lib/mongodb/models/Notification";
import User from "@/lib/mongodb/models/User";
import { Types } from "mongoose";

export type SendNotificationPayload = {
  recipientId: string;
  name: string;
  type: string;
  message?: string;
  image?: string;
  link?: string;
  relatedId?: string;
  endDate?: Date | null;
};

export async function sendNotification(payload: SendNotificationPayload) {
  try {
    const user = await User.findById(payload.recipientId).select(
      "notificationPreferences"
    );
    const prefVal = user?.notificationPreferences?.get?.(payload.type);
    if (prefVal === false) return null;
  } catch {}

  const doc = await Notification.create({
    userId: new Types.ObjectId(payload.recipientId),
    name: payload.name,
    type: payload.type,
    message: payload.message,
    image: payload.image,
    link: payload.link,
    relatedId: payload.relatedId,
    endDate: payload.endDate ?? null,
  });

  const event = {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    type: doc.type,
    message: doc.message,
    image: doc.image,
    link: doc.link,
    relatedId: doc.relatedId,
    endDate: doc.endDate,
    createdAt: doc.createdAt,
  };

  await pusherServer.trigger(
    `notification-user-${event.userId}`,
    "notification-new",
    event
  );

  return event;
}
