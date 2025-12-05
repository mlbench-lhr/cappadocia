import connectDB from "@/lib/mongodb/connection";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    let message = "";
    const { tourId, selectedDate, selectedLanguage, participants } =
      await req.json();

    if (!tourId) {
      return NextResponse.json(
        { message: "tourId is required" },
        { status: 400 }
      );
    }

    const tour = await ToursAndActivity.findById(tourId);
    if (!tour) {
      return NextResponse.json({ message: "Tour not found" }, { status: 404 });
    }

    // language filter
    if (selectedLanguage) {
      if (!tour.languages.includes(selectedLanguage)) {
        return NextResponse.json({ matchingSlots: [] });
      }
    }

    const dateObj = selectedDate ? new Date(selectedDate) : null;

    const matchingSlots = tour.slots.filter((slot: any) => {
      let isValid = true;

      // date filter
      if (dateObj) {
        const start = new Date(slot.startDate);
        const end = new Date(slot.endDate);

        if (!(dateObj >= start && dateObj <= end)) {
          message =
            "Sorry, this date is not available. Please select another date.";
          isValid = false;
        }
      }

      // participants filter
      if (participants) {
        if (slot.seatsAvailable < participants) {
          message = "This Booking does not have enough available seats";
          isValid = false;
        }
      }

      return isValid;
    });

    return NextResponse.json({
      tourId,
      matchingSlots,
      message: message,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
