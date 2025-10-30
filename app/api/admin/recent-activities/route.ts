// app/api/recent-activities/route.ts
import mongoose from "mongoose";
import Visits from "@/lib/mongodb/models/Visits";
import Blog from "@/lib/mongodb/models/Blog";
import UserSubscription from "@/lib/mongodb/models/UserSubscription";

export async function GET(req: Request) {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI!);
    }

    // --- Visits (App + Blog Views) ---
    const visits = await Visits.find().sort({ date: -1 }).limit(10);
    const visitActivities = visits.map((v) => ({
      date: v.date,
      type: v.path.startsWith("blog") ? "Blog Viewed" : "Website Viewed",
      title: v.path,
    }));

    // --- Blogs Added ---
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(10);
    const blogActivities = blogs.map((b) => ({
      date: b.createdAt.toISOString().split("T")[0],
      type: "New Blog Added",
      title: b.title,
    }));

    // --- Subscriptions Added ---
    const subs = await UserSubscription.find()
      .sort({ createdAt: -1 })
      .limit(10);
    const subActivities = subs.map((s) => ({
      date: s.createdAt.toISOString().split("T")[0],
      type: "New Subscription",
      title: s.email,
    }));

    // --- Combine + Sort (Latest 6 only) ---
    const activities = [...subActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);

    return Response.json({ success: true, activities });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error", error });
  }
}
