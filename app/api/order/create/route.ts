import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { orderValidationSchema } from "../OrderSchema";
import { PrepareOrderData } from "../OrderData";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../OrderModel";
import mongoose from "mongoose";
import User from "../../users/UserModel";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const data = await req.json();
    await orderValidationSchema.validate(data, { abortEarly: false });

    const findUser = await User.findOne({
      _id: new mongoose.Types.ObjectId(data.userId),
    });

    if (!findUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (data.ordertype === "prediction") {
      const hasSufficientCredit =
        (findUser?.credits ?? 0) >= (data?.credits ?? 0);
      if (!hasSufficientCredit) {
        return NextResponse.json(
          { success: false, message: "Not sufficient credits for purchase" },
          { status: 402 } // Payment Required
        );
      }
    }

    const prepareData = PrepareOrderData(data);
    const orderData = await Order.create({
      ...prepareData,
      _id: new mongoose.Types.ObjectId(),
    });
    if (orderData && data.ordertype === "prediction") {
      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(data.userId) },
        { $set: { credits: (findUser?.credits ?? 0) - (data?.credits ?? 0) } }
      );
    }
    return NextResponse.json(
      { success: true, message: "Order created successfully", data: orderData },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
