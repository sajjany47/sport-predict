import { NextRequest, NextResponse } from "next/server";
import { RegisterRequest, ApiResponse } from "@/types/api";
import User from "../UserModel";
import {
  GenerateOTP,
  GenerateOTPToken,
  generateToken,
  VerifyOTPToken,
} from "../UtilAuth";
import dbConnect from "../../db";
import { userValidationSchema } from "../UserValidation";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserData } from "../UserData";
import { FormatErrorMessage } from "@/lib/utils";
import { serialize } from "cookie";
import { MailSend } from "@/lib/MailSend";
import {
  RegistrationOTP,
  UserWelcomeTemp,
} from "@/components/template/UserTemp";
import moment from "moment";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    if (body.type === "finalize") {
      await userValidationSchema.validate(body, { abortEarly: false });
    }

    // ✅ Check if email or mobile number already exists
    const existingUser = await User.findOne({
      $or: [
        { email: body.email },
        { mobileNumber: body.mobileNumber },
        { username: body.username },
      ],
    });
    if (existingUser) {
      let message = "User already exists with the same ";
      if (
        existingUser.email === body.email &&
        existingUser.mobileNumber === body.mobileNumber &&
        existingUser.username === body.username
      ) {
        message += "email and mobile number and username";
      } else if (existingUser.email === body.email) {
        message += "email.";
      } else if (existingUser.username === body.username) {
        message += "username";
      } else {
        message += "mobile number.";
      }
      return NextResponse.json(
        {
          success: false,
          message: message,
        },
        { status: 409 }
      );
    } else {
      // ✅ Create new user
      if (body.type === "generate") {
        let date = new Date();
        const otp = GenerateOTP(date);
        const otpToken = await GenerateOTPToken({
          createdAt: date,
          email: body.email,
          otp: otp,
          isVerified: false,
        });
        if (otpToken) {
          await MailSend({
            to: [body.email],
            subject: "Unlock Predictions - SportPredict Email Verification OTP",
            html: RegistrationOTP({
              otp: otp,
            }),
          });
        }
        const cookie = `otp_token=${otpToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=300`;

        return NextResponse.json(
          {
            success: true,
            message: "OTP Send successfully.",
          },
          {
            status: 200,
            headers: {
              "Set-Cookie": cookie,
              "Content-Type": "application/json",
            },
          }
        );
      } else if (body.type === "verified") {
        const newOtpToken: any = await VerifyOTPToken({
          email: body.email,
          otp: body.otp,
        });

        const newCookie = `otp_token=${newOtpToken.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=300`;
        return NextResponse.json(
          {
            success: true,
            message: "OTP verified successfully.",
          },
          {
            status: 200,
            headers: {
              "Set-Cookie": newCookie,
              "Content-Type": "application/json",
            },
          }
        );
      } else if (body.type !== "finalize") {
        const checkOtpToken: any = await VerifyOTPToken({
          email: body.email,
          otp: body.otp,
        });
        if (!checkOtpToken.payload.isVerified) {
          return NextResponse.json(
            {
              success: false,
              message: "OTP not verified!",
            },
            { status: 400 }
          );
        }
        let userData: any = {
          _id: new mongoose.Types.ObjectId(),
          ...UserData({
            ...body,
            credits: 1,
            role: "user",
            isActive: true,
            status: "active",
            createdAt: new Date(),
          }),
          password: await bcrypt.hash(body.password, 10),
        };
        const newUser = new User(userData);

        const saveUser = await newUser.save();
        if (saveUser) {
          delete userData.password;

          // Generate token
          // const token = await generateToken({ ...userData });
          const accessToken = await generateToken({ ...userData }, "15m");

          const refreshToken = await generateToken({ ...userData }, "1d");
          const cookie = serialize("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
          });

          await MailSend({
            to: [userData.email],
            subject: `Welcome to SportPredict (${userData.username}) - SportPredict`,
            html: UserWelcomeTemp({
              email: userData.email || "",
              username: userData.username,
              joinDate: moment(userData.createdAt).format(
                "MMMM DD, YYYY HH:mm"
              ),
              mobileNumber: userData.mobileNumber || "NA",
            }),
          });

          return NextResponse.json(
            {
              success: true,
              message: "User registered successfully.",
              data: {
                user: userData,
                token: accessToken,
              },
            },
            {
              status: 200,
              headers: {
                "Set-Cookie": cookie,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: FormatErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
