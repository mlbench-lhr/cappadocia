import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/lib/mongodb/models/Invoice";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";

// GET /api/vendor/invoices?userId=xxxxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get userId from query params or auth session
    const { searchParams } = new URL(req.url);
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    // Fetch all invoices for this vendor with populated references
    const invoices = await Invoice.find({ vendor: userId })
      .populate({
        path: "booking",
        select:
          "bookingId selectDate paymentDetails adultsCount childrenCount slotId completedAt status",
      })
      .populate({
        path: "activity",
        select: "title slots",
      })
      .lean();

    // Map invoices to required format with payout status
    const formattedInvoices = invoices.map((invoice: any) => {
      const booking = invoice.booking;
      const activity = invoice.activity;

      // Find the slot details from activity
      const slot = activity?.slots?.find(
        (s: any) => s._id.toString() === booking.slotId.toString()
      );

      const bookingDate = slot?.startDate ? new Date(slot.startDate) : null;
      const completedAt = booking?.completedAt
        ? new Date(booking.completedAt)
        : null;
      const bookingStatus = booking?.status;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Determine payout status based on completedAt date
      let payoutStatus = "Not Eligible (Activity not completed yet)";

      if (bookingStatus === "completed" && completedAt) {
        // Create a date object for completedAt with time set to start of day
        const completedAtDate = new Date(completedAt);
        completedAtDate.setHours(0, 0, 0, 0);

        // Calculate the difference in days
        const daysDifference = Math.floor(
          (today.getTime() - completedAtDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDifference >= 1) {
          // One or more days have passed since completion
          payoutStatus = "Eligible";
        } else {
          // Booking completed today or in the future (edge case)
          payoutStatus = "Not Eligible (Completed less than 1 day ago)";
        }
      } else if (bookingStatus === "cancelled") {
        payoutStatus = "Not Eligible (Booking cancelled)";
      } else if (bookingStatus === "missed") {
        payoutStatus = "Not Eligible (Booking missed)";
      } else if (bookingDate) {
        // Fallback: Check booking date if status is not completed
        const bookingDateOnly = new Date(bookingDate);
        bookingDateOnly.setHours(0, 0, 0, 0);

        // if (bookingDateOnly < today) {
        //   payoutStatus =
        //     "Not Eligible (Activity passed but not marked completed)";
        // } else if (bookingDateOnly.getTime() === today.getTime()) {
        //   payoutStatus = "Not Eligible (Activity is today)";
        // } else {
        //   payoutStatus = "Not Eligible (Activity not started yet)";
        // }
      }

      return {
        _id: invoice._id,
        invoiceId: invoice.invoicesId,
        tourTitle: activity?.title || "N/A",
        bookingId: booking?.bookingId || "N/A",
        amount: booking?.paymentDetails?.amount || 0,
        currency: booking?.paymentDetails?.currency || "usd",
        date: bookingDate ? bookingDate.toISOString() : null,
        completedAt: completedAt ? completedAt.toISOString() : null,
        bookingStatus: bookingStatus || "N/A",
        payoutStatus,
        booking: invoice.booking,
        activity: invoice.activity,
        user: invoice.user,
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: formattedInvoices.length,
        data: formattedInvoices,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error fetching vendor invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices", details: error.message },
      { status: 500 }
    );
  }
}
