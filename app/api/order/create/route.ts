import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { orderValidationSchema } from "../OrderSchema";
import { PrepareOrderData } from "../OrderData";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../OrderModel";
import mongoose from "mongoose";
import User from "../../users/UserModel";
import moment from "moment";
import axios from "axios";
import { use } from "react";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const data = await req.json();
    const xUser = req.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    await orderValidationSchema.validate(data, { abortEarly: false });

    const findUser = await User.findOne({
      _id: new mongoose.Types.ObjectId(loggedInUser._id),
    });

    if (!findUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (data.ordertype === "prediction") {
      const findMatchId = await Order.findOne({
        userId: new mongoose.Types.ObjectId(loggedInUser._id),
        paymentMode: "DEDUCTION",
        matchId: Number(data.matchId),
      });
      if (findMatchId) {
        return NextResponse.json(
          { message: "Already sibscribe this match", credits: 0 },
          { status: 200 }
        );
      } else {
        const hasSufficientCredit =
          (findUser?.credits ?? 0) >= (data?.credits ?? 0);
        if (!hasSufficientCredit) {
          return NextResponse.json(
            { success: false, message: "Not sufficient credits for purchase" },
            { status: 402 } // Payment Required
          );
        }
      }
    }
    if (data.ordertype === "credit") {
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();
      const checkDailyCredit = await Order.findOne({
        userId: new mongoose.Types.ObjectId(loggedInUser._id),
        ordertype: "credit",
        status: "completed",
        paymentMode: "PROMOTION",
        paymentDate: { $gte: startOfDay, $lte: endOfDay },
      });
      if (checkDailyCredit) {
        return NextResponse.json(
          { success: false, message: "Already claimed today's free credit." },
          { status: 400 }
        );
      }
    }

    let prepareData = PrepareOrderData({ ...data, userId: loggedInUser._id });
    if (data.ordertype === "purchase") {
      const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": process.env.NEXT_PUBLIC_CASH_ID,
        "x-client-secret": process.env.NEXT_PUBLIC_CASH_KEY,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CASH_URL}/orders/${data.paymentIntentId}`,
        {
          headers,
        }
      );

      if (response.data.order_status === "PAID") {
        const paymentDetails = await axios.get(
          `${process.env.NEXT_PUBLIC_CASH_URL}/orders/${response.data.order_id}/payments`,
          {
            headers,
          }
        );

        prepareData.paymentStatus = true;
        prepareData.status = "completed";
        prepareData.paymentDate = paymentDetails.data[0]?.payment_time;
        prepareData.paymentDetails = paymentDetails.data;
      }

      // const verifyPayment=
    }
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
    if (orderData && data.ordertype === "credit") {
      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(data.userId) },
        { $set: { credits: (findUser?.credits ?? 0) + (data?.credits ?? 0) } }
      );
    }
    if (orderData && orderData.ordertype === "purchase") {
      const userCreditUpdate = await User.updateOne(
        {
          _id: new mongoose.Types.ObjectId(findUser._id),
        },
        {
          $set: {
            credits:
              Number(findUser.credits || 0) + (prepareData?.credits || 0),
          },
        }
      );
      if (userCreditUpdate) {
      }
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
