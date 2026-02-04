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
        { status: 404 },
      );
    }

    if (data.ordertype === "prediction") {
      const existingPrediction = await Order.findOne({
        userId: new mongoose.Types.ObjectId(loggedInUser._id),
        paymentMode: "DEDUCTION",
        matchId: new mongoose.Types.ObjectId(data.matchId),
      });
      if (existingPrediction) {
        return NextResponse.json(
          { message: "Already subscribe this match", credits: 0 },
          { status: 200 },
        );
      }

      const hasSufficientCredit =
        (findUser?.credits ?? 0) >= (data?.credits ?? 0);
      if (!hasSufficientCredit) {
        return NextResponse.json(
          { success: false, message: "Not sufficient credits for purchase" },
          { status: 402 },
        );
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
          { status: 400 },
        );
      }
    }

    let prepareData = PrepareOrderData({ ...data, userId: loggedInUser._id });

    if (data.ordertype === "purchase" && data.paymentIntentId) {
      const isValidPaymentIntent = await Order.findOne({
        paymentId: data.paymentIntentId,
      });
      if (isValidPaymentIntent) {
        return NextResponse.json(
          {
            success: false,
            message: "Duplicate payment intent ID.",
          },
          { status: 500 },
        );
      }
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
          timeout: 10000,
        },
      );
      const orderBody = response.data;
      const orderStatus = (
        orderBody?.order_status ||
        orderBody?.order?.status ||
        orderBody?.status ||
        ""
      )
        .toString()
        .toUpperCase();
      if (orderStatus === "PAID") {
        let paymentDetails = null;
        try {
          const paymentsResp = await axios.get(
            `${process.env.NEXT_PUBLIC_CASH_URL}/orders/${response.data.order_id}/payments`,
            { headers, timeout: 10000 },
          );
          paymentDetails = paymentsResp.data;
          prepareData.paymentStatus = true;
          prepareData.status = "completed";
        } catch (e: any) {
          // Do not fail processing if payments fetch fails; we still mark PAID but log.
          console.warn(
            "Could not fetch payment details:",
            e?.response?.data || e.message,
          );
        }
        // prepareData.paymentStatus = true;
        // prepareData.status = "completed";

        // Prefer payment_time from payments list if present
        if (Array.isArray(paymentDetails) && paymentDetails[0]?.payment_time) {
          prepareData.paymentDate = new Date(paymentDetails[0].payment_time);
        } else if (orderBody?.order_time) {
          prepareData.paymentDate = new Date(orderBody.order_time);
        } else {
          prepareData.paymentDate = new Date();
        }
        prepareData.paymentDetails = paymentDetails || orderBody;
      } else {
        // Not paid - keep as pending
        prepareData.paymentStatus = false;
        prepareData.status = "failed";
      }
      // const verifyPayment=
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const existingOrder = await Order.findOne({
        orderNumber: prepareData.orderNumber,
      }).session(session);
      if (existingOrder) {
        await session.commitTransaction();
        session.endSession();
        return NextResponse.json(
          {
            success: true,
            message: "Order already exists",
            data: existingOrder,
          },
          { status: 200 },
        );
      }
      const orderData = await Order.create(
        [{ ...prepareData, _id: new mongoose.Types.ObjectId() }],
        { session },
      );
      const createdOrder = orderData[0];
      if (createdOrder.ordertype === "prediction") {
        await User.updateOne(
          { _id: new mongoose.Types.ObjectId(loggedInUser._id) },
          {
            $inc: {
              credits: -(createdOrder.paymentStatus ? createdOrder.credits : 0),
            },
          },
          { session },
        );
      } else if (createdOrder.ordertype === "credit") {
        await User.updateOne(
          { _id: new mongoose.Types.ObjectId(loggedInUser._id) },
          {
            $inc: {
              credits: createdOrder.paymentStatus ? createdOrder.credits : 0,
            },
          },
          { session },
        );
      } else if (
        createdOrder.ordertype === "purchase" &&
        createdOrder.status === "completed"
      ) {
        // For successful purchase, add credits
        await User.updateOne(
          { _id: new mongoose.Types.ObjectId(loggedInUser._id) },
          {
            $inc: {
              credits: createdOrder.paymentStatus ? createdOrder.credits : 0,
            },
          },
          { session },
        );
      }
      await session.commitTransaction();
      session.endSession();
      return NextResponse.json(
        {
          success: true,
          message: "Order created successfully",
          data: createdOrder,
        },
        { status: 200 },
      );
    } catch (txnErr) {
      await session.abortTransaction();
      session.endSession();

      return NextResponse.json(
        { success: false, message: FormatErrorMessage(txnErr) },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
