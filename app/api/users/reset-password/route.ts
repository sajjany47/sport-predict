import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import User from "../UserModel";

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
    if (reqData.type === "validate") {
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
