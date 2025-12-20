// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import moment from "moment";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import AdminSettings from "@/lib/mongodb/models/AdminSettings";
import Booking from "@/lib/mongodb/models/booking";
import { Slot } from "@/lib/store/slices/tourAndActivitySlice";
import { sendNotification } from "@/lib/pusher/notify";

// Helper function to generate unique booking ID
function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `CP-${timestamp}-${random}`.toUpperCase();
}

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();

    const {
      activityId,
      userId,
      selectDate,
      adultsCount,
      childrenCount,
      email,
      fullName,
      phoneNumber,
      travelers,
      pickupLocation,
    } = body;

    // Validation

    if (
      !activityId ||
      !userId ||
      !selectDate ||
      !email ||
      !fullName ||
      !phoneNumber
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!adultsCount && !childrenCount) {
      return NextResponse.json(
        { error: "At least one adult or child participant is required" },
        { status: 400 }
      );
    }

    const adults = parseInt(adultsCount) || 0;
    const children = parseInt(childrenCount) || 0;
    const totalParticipants = adults + children;

    if (!travelers || travelers.length !== totalParticipants) {
      return NextResponse.json(
        {
          error: `Travelers data must match total participants (${totalParticipants})`,
        },
        { status: 400 }
      );
    }

    // Validate date format
    const selectedMoment = moment(selectDate, "YYYY-MM-DD", true);
    if (!selectedMoment.isValid()) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Fetch activity with slots
    const activity = await ToursAndActivity.findById(activityId).session(
      session
    );

    if (!activity) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    if (!activity.active || activity.status !== "active") {
      await session.abortTransaction();
      return NextResponse.json(
        { error: "Activity is not active" },
        { status: 400 }
      );
    }

    // Find matching slot for selected date
    const selectedDate = selectedMoment.toDate();
    const matchingSlot = activity.slots.find((slot: Slot) => {
      const slotStart = moment(slot.startDate).startOf("day");
      const slotEnd = moment(slot.endDate).endOf("day");
      const selected = moment(selectedDate).startOf("day");

      return (
        selected.isSameOrAfter(slotStart) && selected.isSameOrBefore(slotEnd)
      );
    });

    if (!matchingSlot) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: "No available slot found for the selected date" },
        { status: 400 }
      );
    }

    // Check seat availability
    if (matchingSlot.seatsAvailable < totalParticipants) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          error: "Not enough seats available",
          available: matchingSlot.seatsAvailable,
          requested: totalParticipants,
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    const adultTotal = adults * matchingSlot.adultPrice;
    const childTotal = children * matchingSlot.childPrice;
    let totalAmount = adultTotal + childTotal;

    // Apply active global discount if available
    const settings = await AdminSettings.findOne().session(session);
    const discount = settings?.discount;
    if (discount) {
      const now = new Date();
      const start = new Date(discount.startDate);
      const end = new Date(discount.endDate);
      const within =
        Number.isFinite(start.getTime()) &&
        Number.isFinite(end.getTime()) &&
        start <= now &&
        now <= end;
      if (within && typeof discount.percentage === "number") {
        const pct = Math.min(Math.max(discount.percentage, 0), 100);
        totalAmount = Number((totalAmount * (1 - pct / 100)).toFixed(2));
      }
    }

    // Generate unique booking ID
    const bookingId = generateBookingId();

    // Create booking
    const newBooking = new Booking({
      bookingId,
      activity: activityId,
      slotId: matchingSlot._id,
      vendor: activity.vendor,
      user: userId,
      selectDate: selectDate,
      adultsCount: adults,
      childrenCount: children,
      email,
      fullName,
      phoneNumber,
      travelers,
      pickupLocation: pickupLocation || null,
      paymentDetails: {
        paymentIntentId: "",
        customerId: "",
        amount: totalAmount,
        currency: "usd",
        status: "pending",
      },
      paymentStatus: "pending",
      status: "pending",
    });

    await newBooking.save({ session });

    // Update available seats in the activity slot
    await ToursAndActivity.updateOne(
      {
        _id: activityId,
        "slots._id": matchingSlot._id,
      },
      {
        $inc: { "slots.$.seatsAvailable": -totalParticipants },
      },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    try {
      await sendNotification({
        recipientId: activity.vendor.toString(),
        name: "New Booking",
        type: "vendor-booking-new",
        message: `New booking #${newBooking.bookingId}`,
        link: "/vendor/reservations",
        relatedId: newBooking._id.toString(),
        endDate: new Date(newBooking.selectDate),
      });
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: {
          bookingId: newBooking.bookingId,
          _id: newBooking._id,
          amount: totalAmount,
          currency: "usd",
          status: "pending",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Booking creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
