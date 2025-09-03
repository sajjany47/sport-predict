import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import SupportTicket from "../SupportModel";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();
    let query: any = [
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
    if (reqData.hasOwnProperty("search") && reqData.search) {
      query.push({
        $or: [
          { "user.name": { $regex: reqData.search, $options: "i" } },
          { "user.email": { $regex: reqData.search, $options: "i" } },
          {
            ticketNumber: { $regex: reqData.search, $options: "i" },
          },
        ],
      });
    }

    if (reqData.hasOwnProperty("status") && reqData.status) {
      query.push({
        status: { $regex: reqData.status, $options: "i" },
      });
    }
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
      {
        $match: {
          $and: query.length > 0 ? query : [{}],
        },
      },
    ];

    const count = await SupportTicket.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
    const total = count.length > 0 ? count[0].total : 0;

    if (reqData.hasOwnProperty("page") && reqData.hasOwnProperty("limit")) {
      const page = reqData.page;
      const limit = reqData.limit;
      const skip: any = page * limit - limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const data = await SupportTicket.aggregate([
      ...pipeline,
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return NextResponse.json(
      { success: true, data: data, count: total },
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
