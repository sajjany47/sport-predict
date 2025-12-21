import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import moment from "moment";
import dbConnect from "../../db";
import User from "../UserModel";
import { FormatErrorMessage } from "@/lib/utils";
import { MailSend } from "@/lib/MailSend";
import { AdminFreeCreditsEmail } from "@/components/template/UserTemp";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const body = await request.json();
    const xUser = request.headers.get("x-user");

    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    if (!loggedInUser?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (loggedInUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const targetUser = await User.findById({
      _id: new mongoose.Types.ObjectId(body.userId),
    });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updatedCredits = (targetUser.credits || 0) + (body.credits || 0);

    const updateuserCredits = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(body.userId) },
      { $set: { credits: updatedCredits } }
    );

    if (updateuserCredits) {
      const emailData = {
        user: {
          name: targetUser.name,
          email: targetUser.email,
        },
        credits: updatedCredits,
        totalCreditsAdded: body.credits,
        reason:
          "SportPredict added 5 bonus tokens to your account as a special gesture.",
        adminName: "SportPredict Team",
        appUrl: process.env.NEXT_PUBLIC_API_URL,
        supportEmail: process.env.NEXT_PUBLIC_EMAIL,
        supportPhone: process.env.NEXT_PUBLIC_MOBILE,
      };

      const emailHtml = AdminFreeCreditsEmail(emailData);
      await MailSend({
        to: [targetUser.email],
        subject: `🎁 ${body.credits} Free Credits Added to Your SportPredict Account!`,
        html: emailHtml,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Credits send successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
