import { NextRequest, NextResponse } from "next/server";
import { RegisterRequest, ApiResponse } from "@/types/api";
import User from "../UserModel";
import { generateToken } from "../UtilAuth";
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
        } as ApiResponse,
        { status: 409 }
      );
    } else {
      // ✅ Create new user
      const modifySubscription = [
        {
          _id: new mongoose.Types.ObjectId(),
          subscriptionId: new mongoose.Types.ObjectId(
            "6873c7502d01bea623cac559"
          ),
          isActive: true,
          expiryDate: new Date(),
          purchaseDate: new Date(),
        },
      ];
      let userData: any = {
        _id: new mongoose.Types.ObjectId(),
        ...UserData({
          ...body,
          subscription: modifySubscription,
          credits: 1,
          role: "user",
          isActive: true,
        }),
        password: await bcrypt.hash(body.password, 10),
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
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error || "Internal server error.",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
