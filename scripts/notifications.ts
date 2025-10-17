import mongoose from "mongoose";
import { Server } from "socket.io";
import cron from "node-cron";
import Milestone from "@/lib/mongodb/models/Milestone";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import Notification from "@/lib/mongodb/models/Notification";

const MONGO_URI = process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI);

const io = new Server(3001, { cors: { origin: "*" } }); // Socket server

cron.schedule("0 * * * *", async () => {
  // Runs every hour
  console.log("Running notification cron job ------------------------------------------------------------------------------------------");

  const now = new Date();
  const milestones = await Milestone.find({ deadLine: { $lte: now } });
  const opportunities = await Opportunity.find({ dueDate: { $lte: now } });

  const notifications = [];

  for (const m of milestones) {
    const exists = await Notification.findOne({ relatedId: m._id });
    if (!exists) {
      const notification = await Notification.create({
        name: m.title,
        type: "Milestone",
        endDate: m.deadLine,
        image: m.image,
        relatedId: m._id,
      });
      notifications.push(notification);
    }
  }

  for (const o of opportunities) {
    const exists = await Notification.findOne({ relatedId: o._id });
    if (!exists) {
      const notification = await Notification.create({
        name: o.title,
        type: "Opportunity",
        endDate: o.dueDate,
        image: o.image,
        relatedId: o._id,
      });
      notifications.push(notification);
    }
  }

  if (notifications.length > 0) {
    io.emit("new-notifications", notifications);
    console.log("Notifications emitted:", notifications);
  }
});
