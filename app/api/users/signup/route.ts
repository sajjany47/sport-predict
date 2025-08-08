import { NextRequest, NextResponse } from "next/server";
import { RegisterRequest, ApiResponse } from "@/types/api";
import User from "../UserModel";
import { generateToken, hashPassword } from "../UtilAuth";
import dbConnect from "../../db";
import { userValidationSchema } from "../UserValidation";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserData } from "../UserData";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    await userValidationSchema.validate(body, { abortEarly: false });
    const {
      name,
      email,
      password,
      subscriptionId,
      mobileNumber,
      role,
      username,
      isActive,
      credits,
    } = body;

    // ✅ Check if email or mobile number already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }, { username }],
    });
    if (existingUser) {
      let message = "User already exists with the same ";
      if (
        existingUser.email === email &&
        existingUser.mobileNumber === mobileNumber &&
        existingUser.username === username
      ) {
        message += "email and mobile number and username";
      } else if (existingUser.email === email) {
        message += "email.";
      } else if (existingUser.username === username) {
        message += "username";
      } else {
        message += "mobile number.";
      }
      return NextResponse.json(
        {
          success: false,
          message: message,
        } as ApiResponse,
        { status: 409 }
      );
    }

    // ✅ Create new user

    let userData: any = {
      _id: new mongoose.Types.ObjectId(),
      ...UserData(body),
      password: await bcrypt.hash(password, 10),
    };
    const newUser = new User(userData);

    const saveUser = await newUser.save();
    if (saveUser) {
      delete userData.password;

      // Generate token
      const token = generateToken({ ...userData });

      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully.",
          data: {
            user: userData,
            token,
          },
        } as ApiResponse,
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
