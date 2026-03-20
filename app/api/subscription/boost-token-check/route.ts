import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import User from "../../users/UserModel";
import mongoose from "mongoose";
import moment from "moment";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const data = await req.json();

    const findUser = await User.findOne({
      _id: new mongoose.Types.ObjectId(data._id),
    });

    if (!findUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // 👉 Today date (YYYY-MM-DD)
    const today = moment().format("YYYY-MM-DD");

    // 👉 Last purchase date
    const lastPurchaseDate = findUser.dailyBoostTokenPurchaseDate
      ? moment(findUser.dailyBoostTokenPurchaseDate).format("YYYY-MM-DD")
      : null;

    //  Already purchased today
    if (lastPurchaseDate === today) {
      return NextResponse.json(
        {
          success: true,
          data: { isBuyAble: false },
          message: "Token purchased successfully",
        },
        { status: 200 },
      );
    }

    // ✅ Allow purchase → update date
    findUser.dailyBoostTokenPurchaseDate = new Date();
    await findUser.save();

    return NextResponse.json(
      {
        success: true,
        data: { isBuyAble: true },
        message: "Token purchased successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
}
