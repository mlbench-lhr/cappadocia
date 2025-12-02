import { NextResponse } from "next/server";
import "@/lib/mongodb/models/booking";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb/connection";
import Payments from "@/lib/mongodb/models/Payments";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newPayment = await Payments.create(body);

    return NextResponse.json({ success: true, data: newPayment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
