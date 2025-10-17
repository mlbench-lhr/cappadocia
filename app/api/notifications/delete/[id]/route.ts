import Notification from "@/lib/mongodb/models/Notification";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const reqParams = await params;
    const id = reqParams.id;
    console.log("id--------", id);

    await Notification.deleteOne({ _id: id });

    return NextResponse.json(
      { message: "Notification deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete notifications" },
      { status: 500 }
    );
  }
}
