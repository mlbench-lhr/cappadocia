import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import { Resend } from "resend";
import { sendNotification } from "@/lib/pusher/notify";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    const body = await req.json();
    if (body?.isRoleVerified === true) {
      const commissionDot = body?.["vendorDetails.commission"];
      const commissionNested = body?.vendorDetails?.commission;
      const commissionVal =
        typeof commissionDot !== "undefined" ? commissionDot : commissionNested;
      const num = Number(commissionVal);
      if (
        commissionVal === undefined ||
        Number.isNaN(num) ||
        num < 0 ||
        num > 100
      ) {
        return NextResponse.json(
          {
            error: "Commission percentage (0-100) is required to accept vendor",
          },
          { status: 400 }
        );
      }
    }

    // If rejected, force isRoleVerified to false
    if (body?.roleRejected?.isRoleRejected === true) {
      body.isRoleVerified = false;
    }

    // Update only provided fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (body?.isRoleVerified === true) {
      try {
        await ToursAndActivity.updateMany(
          { vendor: id },
          { $set: { isVerified: true, status: "active" } }
        );
      } catch (e) {
        console.error("Bulk verify tours failed:", (e as any)?.message || e);
      }
    }

    // Send email + notification based on action
    try {
      const RESEND_API_KEY = (process.env.RESEND_API_KEY ||
        "re_UnbMd7D2_NrJ4Kq9gbN3B8U2ceKHpu1HV") as string;
      const EMAIL_FROM =
        process.env.EMAIL_FROM || "noreply@cappadociaplatform.com";
      const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

      const to = updatedUser.email;
      const displayName =
        updatedUser.vendorDetails?.companyName ||
        updatedUser.fullName ||
        "Vendor";

      console.log("body?.isRoleVerified------", body?.isRoleVerified);
      if (body?.isRoleVerified === true) {
        console.log("this------");
        // Accepted
        const subject = "Your vendor account has been approved";
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px;">
            <h2 style="color: #000;">Hello ${displayName},</h2>
            <p style="color: #000;">Your vendor account on <strong>Cappadocia</strong> has been approved.</p>
            <p style="color: #000;">You can now access your dashboard to add tours and manage reservations.</p>
            <p style="color: #000;">Welcome aboard!</p>
            <hr />
            <p style="font-size: 12px; color:#000;">
              <a href="https://cappadocia-alpha.vercel.app/vendor/dashboard" style="color: #555;">Go to dashboard</a>
            </p>
          </div>`;
        if (resend) {
          try {
            let resp = await resend.emails.send({
              from: EMAIL_FROM,
              to,
              subject,
              html,
            });
            console.log("resp----", resp);
          } catch (e) {
            console.error(
              "Vendor approval email failed:",
              (e as any)?.message || e
            );
          }
        }
        await sendNotification({
          recipientId: updatedUser._id.toString(),
          name: "Vendor Account Approved",
          type: "vendor-approval",
          message: "Your vendor account has been approved.",
          link: "/vendor/dashboard",
          relatedId: updatedUser._id.toString(),
          endDate: new Date(),
        });
      }

      if (body?.roleRejected?.isRoleRejected === true) {
        // Rejected
        const reason = String(
          body?.roleRejected?.reason || "No reason provided"
        );
        const subject = "Your vendor account has been rejected";
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px;">
            <h2 style="color: #000;">Hello ${displayName},</h2>
            <p style="color: #000;">We regret to inform you that your vendor account request on <strong>Cappadocia</strong> has been rejected.</p>
            <p style="color: #000;">Reason: ${reason}</p>
            <p style="color: #000;">You can update your application and re-apply.
            </p>
            <hr />
            <p style="font-size: 12px; color:#000;">
              <a href="https://cappadocia-alpha.vercel.app/vendor/settings" style="color: #555;">Update application</a>
            </p>
          </div>`;
        if (resend) {
          try {
            await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
          } catch (e) {
            console.error(
              "Vendor rejection email failed:",
              (e as any)?.message || e
            );
          }
        }
        await sendNotification({
          recipientId: updatedUser._id.toString(),
          name: "Vendor Account Rejected",
          type: "vendor-rejection",
          message: `Your vendor account was rejected. Reason: ${reason}`,
          link: "/vendor/settings",
          relatedId: updatedUser._id.toString(),
          endDate: new Date(),
        });
      }
    } catch (err) {
      console.error(
        "Post-update notify/email error:",
        (err as any)?.message || err
      );
    }

    return NextResponse.json({
      msg: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
