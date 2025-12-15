import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Payments from "@/lib/mongodb/models/Payments";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { payment_id, iban, bankName, accountHolderName, amount, currency, reference } = body;

    if (!payment_id || !iban || !amount || !currency) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const updated = await Payments.findByIdAndUpdate(
      payment_id,
      {
        $set: {
          paymentStatus: "paid",
          payout: {
            method: "manual",
            iban,
            bankName: bankName || "",
            accountHolderName: accountHolderName || "",
            amount,
            currency,
            reference: reference || `MANUAL-${Date.now()}`,
            processedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to record payout" }, { status: 500 });
  }
}
