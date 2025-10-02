import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import User from "../UserModel";
import { GenerateOTP } from "../UtilAuth";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  ResetPasswordSuccessTem,
  ResetPasswordTem,
} from "@/components/template/reset-password-tem";
import { MailSend } from "@/lib/MailSend";

export const POST = async (request: NextRequest) => {
  dbConnect();

  try {
    const reqData = await request.json();

    const user = await User.findOne({
      $or: [
        { email: reqData.userId },
        { username: reqData.userId },
        { mobileNumber: Number(reqData.userId) },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 }
      );
    }
    if (reqData.type === "generate-otp") {
      const date = new Date();
      const otp = GenerateOTP(date);
      await MailSend({
        to: [user.email],
        subject: "OTP generated for password reset",
        html: ResetPasswordTem({
          username: user.username,
          otp: otp,
        }),
      });
      return NextResponse.json(
        {
          success: true,
          message: "OTP generated successfully!",
          createdAt: date,
        },
        { status: 200 }
      );
    }
    if (reqData.type === "verify-otp") {
      const databaseOtp = GenerateOTP(new Date(reqData.createdAt));
      const now = new Date();
      const diffMs = now.getTime() - new Date(reqData.createdAt).getTime(); // difference in ms
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes > 10) {
        return NextResponse.json(
          {
            success: false,
            message: "OTP has expired!",
          },
          { status: 400 }
        );
      }
      if (databaseOtp !== reqData.otp) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid OTP!",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: "OTP verified successfully!",
        },
        { status: 200 }
      );
    } else if (reqData.type === "reset-password") {
      const password = await bcrypt.hash(reqData.password, 10);
      const updateUser = await User.updateOne(
        { _id: new mongoose.Types.ObjectId(user._id) },
        { $set: { password } }
      );
      if (updateUser) {
        await MailSend({
          to: [user.email],
          subject: "Password reset successfully!",
          html: ResetPasswordSuccessTem({
            email: user.email,
            username: user.username,
          }),
        });
        return NextResponse.json(
          {
            success: true,
            message: "Password reset successfully!",
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request!",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: FormatErrorMessage(error),
      },
      { status: 500 }
    );
  }
};
