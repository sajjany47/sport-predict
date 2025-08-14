import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../OrderModel";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const reqData = await request.json();

    let query = [];
    if (reqData.hasOwnProperty("search") && reqData.search) {
      query.push({
        $match: {
          $or: [
            { "user.name": { $regex: reqData.search, $options: "i" } },
            { "user.email": { $regex: reqData.search, $options: "i" } },
          ],
        },
      });
    }
    if (reqData.hasOwnProperty("status") && reqData.status) {
      query.push({
        status: reqData.status,
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
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: {
          path: "$plan",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    const count = await Order.aggregate([...pipeline, { $count: "total" }]);
    const total = count.length > 0 ? count[0].total : 0;

    if (reqData.hasOwnProperty("page") && reqData.hasOwnProperty("limit")) {
      const page = reqData.page;
      const limit = reqData.limit;
      const skip: any = page * limit - limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const data = await Order.aggregate([
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
