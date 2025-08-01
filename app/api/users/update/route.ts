import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { UserData } from "../../auth/UserData";
import User from "../../auth/UserModel";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const body = await request.json();
    const userData = UserData(body);
    const update = await User.updateOne(
      {
        _id: new mongoose.Types.ObjectId(body.userId),
      },
      { $set: userData }
    );

    return NextResponse.json(
      { success: true, message: "User updated successfully", data: update },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Error updating user" },
      { status: 500 }
    );
  }
};
