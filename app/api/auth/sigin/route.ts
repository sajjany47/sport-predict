import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, ApiResponse } from "@/types/api";
import { comparePassword, generateToken } from "../UtilAuth";
import dbConnect from "../../db";
import User from "../UserModel";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body: LoginRequest = await request.json();
    const { userId, password } = body;

    // Validation
    if (!userId || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Find user
    // Match by username, email or mobileNumber
    const user = await User.findOne({
      $or: [
        { email: userId },
        { username: userId },
        { mobileNumber: Number(userId) },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found!",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password.",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Generate token
    const prepareResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      subscriptionId: user.subscriptionId,
      username: user.username,
      role: user.role,
    };

    const token = generateToken({ ...prepareResponse });

    // Remove password from response

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      data: {
        user: prepareResponse,
        token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
