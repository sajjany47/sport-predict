import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { orderValidationSchema } from "../OrderSchema";
import { PrepareOrderData } from "../OrderData";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../OrderModel";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const data = await req.json();
    await orderValidationSchema.validate(data, { abortEarly: false });

    const prepareData = PrepareOrderData(data);
    const orderData = await Order.create({
      ...prepareData,
      _id: new mongoose.Types.ObjectId(),
    });
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
