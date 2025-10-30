// app/api/log-visit/route.ts

import connectDB from "@/lib/mongodb/connection";
import Visits from "@/lib/mongodb/models/Visits";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { path, userId } = body;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const filter = { path, userId: userId || null, date: today };
    const update = { $inc: { count: 1 } };
    const options = { upsert: true, new: true };

    await Visits.findOneAndUpdate(filter, update, options);

    return new Response(JSON.stringify({ message: "Visit logged" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error logging visit" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
