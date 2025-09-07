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

    if (!reqData.ticketId) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const checkTicket = await SupportTicket.findById(
      new mongoose.Types.ObjectId(reqData.ticketId)
    );

    if (!checkTicket) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket id" },
        { status: 400 }
      );
    }

    // --- Prepare message ---
    const isUser = checkTicket.userId.toString() === loggedInUser._id;
    let messageText = reqData.text || "";

    if (reqData.status === "resolved" && reqData.ticketStatus === "resolved") {
      messageText =
        "Ticket resolved successfully. This chat will now be closed.";
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      text: messageText,
      replyAt: new Date(),
      replyBy: new mongoose.Types.ObjectId(loggedInUser._id),
      ticketStatus: reqData.status || "in-progress",
      isRead: !isUser, // if user sends → support unread, if support sends → user unread
    };

    // --- Step 1: Push new message + update status/priority ---
    await SupportTicket.updateOne(
      { _id: new mongoose.Types.ObjectId(reqData.ticketId) },
      {
        $push: { message: newMessage },
        $set: {
          ...(reqData.status ? { status: reqData.status } : {}),
          ...(reqData.priority ? { priority: reqData.priority } : {}),
          ...(reqData.description ? { description: reqData.description } : {}),
          ...(reqData.category ? { category: reqData.category } : {}),
          ...(reqData.subject ? { subject: reqData.subject } : {}),
        },
      }
    );

    // --- Step 2: Mark opposite party messages as read ---
    await SupportTicket.updateOne(
      { _id: new mongoose.Types.ObjectId(reqData.ticketId) },
      {
        $set: { "message.$[elem].isRead": true },
      },
      {
        arrayFilters: [
          {
            "elem.isRead": false,
            "elem.replyBy": {
              $ne: new mongoose.Types.ObjectId(loggedInUser._id),
            },
          },
        ],
      }
    );

    // --- Fetch updated ticket with all messages ---
    const updatedTicket = await SupportTicket.findById(
      new mongoose.Types.ObjectId(reqData.ticketId)
    ).populate("userId", "name email");

    return NextResponse.json(
      {
        success: true,
        data: updatedTicket,
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
