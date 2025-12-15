import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookingId = body.bookingId as string;
    const amount = Number(body.amount);
    const currency = (body.currency as string) || "TRY";

    if (!bookingId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid booking or amount" }, { status: 400 });
    }

    const merchantId = process.env.ZIRAAT_VPOS_MERCHANT_ID as string;
    const terminalId = process.env.ZIRAAT_VPOS_TERMINAL_ID as string;
    const username = process.env.ZIRAAT_VPOS_USERNAME as string;
    const password = process.env.ZIRAAT_VPOS_PASSWORD as string;
    const storeKey = process.env.ZIRAAT_VPOS_STORE_KEY as string;
    const gatewayUrl = process.env.ZIRAAT_VPOS_GATEWAY_URL as string;
    const okUrl = process.env.ZIRAAT_VPOS_OK_URL as string;
    const failUrl = process.env.ZIRAAT_VPOS_FAIL_URL as string;

    if (!merchantId || !storeKey || !gatewayUrl || !okUrl || !failUrl) {
      return NextResponse.json({ error: "Missing Ziraat POS configuration" }, { status: 500 });
    }

    const orderId = bookingId;
    const rnd = Date.now().toString();

    const hashInput = `${merchantId}|${orderId}|${amount.toFixed(2)}|${okUrl}|${failUrl}|${rnd}|${storeKey}`;
    const hash = crypto.createHash("sha256").update(hashInput).digest("base64");

    const fields: Record<string, string> = {
      merchantId,
      terminalId: terminalId || "",
      username: username || "",
      password: password || "",
      orderId,
      amount: amount.toFixed(2),
      currency,
      okUrl,
      failUrl,
      rnd,
      hash,
      storetype: "3D_PAY",
      lang: "tr",
    };

    return NextResponse.json({ formAction: gatewayUrl, fields, orderId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to init payment" }, { status: 500 });
  }
}
