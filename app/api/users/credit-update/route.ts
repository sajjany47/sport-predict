import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";
import dbConnect from "../../db";
import User from "../UserModel";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const body = await request.json();
    const userData = { credits: body.credits }; // Assuming credits is the only field to update
    const update = await User.updateOne(
      {
        _id: new mongoose.Types.ObjectId(body.userId),
      },
      { $set: userData }
    );

    return NextResponse.json(
      { success: true, message: "Credits updated successfully", data: update },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Error updating credits" },
      { status: 500 }
    );
  }
};
