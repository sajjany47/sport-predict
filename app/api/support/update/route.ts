import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import SupportTicket from "../SupportModel";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();
    const xUser = request.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    await SupportTicket.updateOne(
      { _id: new mongoose.Types.ObjectId(reqData.ticketId) },
      {
        $push: {
          message: {
            _id: new mongoose.Types.ObjectId(),
            text: reqData.description,
            replyAt: new Date(),
            replyBy: new mongoose.Types.ObjectId(loggedInUser._id),
            ticketStatus: reqData.status || "in-progress",
          },
        },
        $set: { status: reqData.status },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Support ticket updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
