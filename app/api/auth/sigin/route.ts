import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, ApiResponse } from "@/types/api";
import { comparePassword, generateToken } from "../UtilAuth";
import dbConnect from "../../db";
import User from "../UserModel";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ name });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password!);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      data: {
        user: userWithoutPassword,
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
