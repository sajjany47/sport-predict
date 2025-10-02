import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../db";
import User from "../UserModel";
import { FormatErrorMessage } from "@/lib/utils";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const reqData = await request.json();

    let query: any = [
      {
        $unwind: {
          path: "$subscription",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "subscription.isActive": true,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscription.subscriptionId",
          foreignField: "_id",
          as: "subscriptionDetails",
        },
      },
      {
        $unwind: {
          path: "$subscriptionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orderDetails",
        },
      },
    ];

    const data = await User.aggregate([
      {
        $match: reqData.hasOwnProperty("userId")
          ? {
              _id: new mongoose.Types.ObjectId(reqData.userId),
            }
          : {},
      },

      ...query,
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return NextResponse.json(
      { success: true, message: "Data fetched successfully", data: data },
      { status: 200 }
    );
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
