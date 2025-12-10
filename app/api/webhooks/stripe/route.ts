import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import Invoice from "@/lib/mongodb/models/Invoice";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Notification from "@/lib/mongodb/models/Notification";
import { sendNotification } from "@/lib/pusher/notify";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Helper function to generate unique invoice ID
function generateInvoiceId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${timestamp}-${random}`;
}

export async function POST(req: NextRequest) {
  console.log("[Stripe Webhook] Incoming request");

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    console.error("Missing Stripe keys");
    return NextResponse.json(
      { error: "Missing Stripe environment variables" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecret);
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature header" },
      { status: 400 }
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    console.log("[Stripe Webhook] Event type:", event.type);
  } catch (err: any) {
    console.error("Invalid signature:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Connect to database
    await connectDB();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("=== Checkout Session Completed ===");
        console.log("Session ID:", session.id);
        console.log("Payment Status:", session.payment_status);
        console.log("Customer:", session.customer_details);
        console.log("Metadata:", session.metadata);

        // Only proceed if payment was successful
        if (session.payment_status === "paid") {
          // Get the booking ID from metadata
          const bookingId = session.metadata?.bookingId;

          if (!bookingId) {
            console.error("No bookingId found in session metadata");
            break;
          }

          // Retrieve the PaymentIntent to get full payment details
          const paymentIntentId = session.payment_intent as string;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          // Find the booking first
          const booking = await Booking.findOne({ bookingId });

          if (!booking) {
            console.error("❌ Booking not found:", bookingId);
            break;
          }

          // Update the booking with payment details
          const updatedBooking = await Booking.findOneAndUpdate(
            { bookingId },
            {
              $set: {
                "paymentDetails.paymentIntentId": paymentIntent.id,
                "paymentDetails.customerId": (session.customer as string) || "",
                "paymentDetails.amount": paymentIntent.amount / 100, // Convert from cents
                "paymentDetails.currency": paymentIntent.currency,
                "paymentDetails.status": paymentIntent.status,
                paymentStatus: "paid",
                status: "upcoming",
              },
            },
            { new: true }
          );

          if (updatedBooking) {
            console.log("✅ Booking updated successfully:", bookingId);
            console.log("Payment Details:", updatedBooking.paymentDetails);
            console.log("Payment Status:", updatedBooking.paymentStatus);
            console.log("Booking Status:", updatedBooking.status);

            // Check if invoice already exists for this booking
            const existingInvoice = await Invoice.findOne({
              booking: updatedBooking._id,
            });

            if (!existingInvoice) {
              // Create new invoice
              const newInvoice = await Invoice.create({
                booking: updatedBooking._id,
                activity: updatedBooking.activity,
                vendor: updatedBooking.vendor,
                user: updatedBooking.user,
                invoicesId: generateInvoiceId(),
              });

              console.log(
                "✅ Invoice created successfully:",
                newInvoice.invoicesId
              );
              console.log("Invoice ID:", newInvoice._id);
              console.log("Booking Reference:", newInvoice.booking);
            } else {
              console.log(
                "ℹ️ Invoice already exists for this booking:",
                existingInvoice.invoicesId
              );
            }

            const hasUserConfirm = await Notification.findOne({
              userId: updatedBooking.user,
              type: "booking-confirmation",
              relatedId: updatedBooking._id.toString(),
            }).lean();
            if (!hasUserConfirm) {
              await sendNotification({
                recipientId: updatedBooking.user.toString(),
                name: "Booking Confirmed",
                type: "booking-confirmation",
                message: `Your booking #${updatedBooking.bookingId} is confirmed`,
                link: `/bookings/detail/${updatedBooking._id.toString()}`,
                relatedId: updatedBooking._id.toString(),
                endDate: new Date(updatedBooking.selectDate),
              });
            }

            const hasVendorPayment = await Notification.findOne({
              userId: updatedBooking.vendor,
              type: "vendor-booking-payment",
              relatedId: updatedBooking._id.toString(),
            }).lean();
            if (!hasVendorPayment) {
              await sendNotification({
                recipientId: updatedBooking.vendor.toString(),
                name: "Booking Payment Confirmed",
                type: "vendor-booking-payment",
                message: `Payment confirmed for booking #${updatedBooking.bookingId}`,
                link: "/vendor/reservations",
                relatedId: updatedBooking._id.toString(),
                endDate: new Date(updatedBooking.selectDate),
              });
            }
          } else {
            console.error("❌ Failed to update booking:", bookingId);
          }
        }

        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;

        console.log("=== Payment Intent Succeeded ===");
        console.log("PI ID:", pi.id);
        console.log("Amount received:", pi.amount_received);
        console.log("Status:", pi.status);

        // Optional: Update booking by PaymentIntent ID if needed
        // This is a backup in case checkout.session.completed didn't fire
        const booking = await Booking.findOne({
          "paymentDetails.paymentIntentId": pi.id,
        });

        if (booking && booking.paymentStatus !== "paid") {
          booking.paymentDetails.status = pi.status;
          booking.paymentDetails.amount = pi.amount_received / 100;
          booking.paymentStatus = "paid";
          booking.status = "upcoming";
          await booking.save();

          console.log("✅ Booking updated via payment_intent.succeeded");

          // Check if invoice exists, create if not
          const existingInvoice = await Invoice.findOne({
            booking: booking._id,
          });

          if (!existingInvoice) {
            const newInvoice = await Invoice.create({
              booking: booking._id,
              activity: booking.activity,
              vendor: booking.vendor,
              user: booking.user,
              invoicesId: generateInvoiceId(),
            });

            console.log(
              "✅ Invoice created via payment_intent.succeeded:",
              newInvoice.invoicesId
            );
          }
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;

        console.log("=== Payment Intent Failed ===");
        console.log("PI ID:", pi.id);

        // Update booking to reflect failed payment
        const booking = await Booking.findOne({
          "paymentDetails.paymentIntentId": pi.id,
        });

        if (booking) {
          booking.paymentDetails.status = "failed";
          // Keep paymentStatus as "pending" for failed payments
          // Don't create invoice for failed payments
          await booking.save();
          console.log("❌ Booking payment marked as failed");
        }

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Processing error:", err.message);
    console.error("Stack trace:", err.stack);
    return NextResponse.json(
      { error: err.message || "Processing error" },
      { status: 500 }
    );
  }
}
