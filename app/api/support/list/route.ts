import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import SupportTicket from "../SupportModel";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();

    // 🔹 Build match conditions
    let matchConditions: any = {};

    if (reqData.search) {
      matchConditions.$or = [
        { "user.name": { $regex: reqData.search, $options: "i" } },
        { "user.email": { $regex: reqData.search, $options: "i" } },
        { ticketNumber: { $regex: reqData.search, $options: "i" } },
      ];
    }

    if (reqData.userId) {
      matchConditions.userId = new mongoose.Types.ObjectId(reqData.userId);
    }

    if (reqData.status) {
      matchConditions.status = { $regex: reqData.status, $options: "i" };
    }

    // 🔹 Base pipeline
    let pipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "user.password": 0,
        },
      },
    ];

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // 🔹 Count total
    const count = await SupportTicket.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
    const total = count.length > 0 ? count[0].total : 0;

    // 🔹 Pagination
    if (reqData.page && reqData.limit) {
      const page = Number(reqData.page) || 1;
      const limit = Number(reqData.limit) || 10;
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    // 🔹 Sort latest first
    pipeline.push({ $sort: { createdAt: -1 } });

    const data = await SupportTicket.aggregate(pipeline);

    return NextResponse.json(
      { success: true, data, count: total },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
