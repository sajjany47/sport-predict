import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { orderValidationSchema } from "../OrderSchema";
import { PrepareOrderData } from "../OrderData";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../OrderModel";
import mongoose from "mongoose";
import User from "../../users/UserModel";
import moment from "moment";
import { MailSend } from "@/lib/MailSend";
import {
  AdminPaymentConfirmationTemp,
  UserPaymentConfirmationTemp,
} from "@/components/template/subscription-temp";
import Subscription from "../../subscription/SubscriptionModel";

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
      const findMatchId = await Order.findOne({
        userId: new mongoose.Types.ObjectId(data.userId),
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
        userId: new mongoose.Types.ObjectId(data.userId),
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
    if (orderData && data.ordertype === "credit") {
      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(data.userId) },
        { $set: { credits: (findUser?.credits ?? 0) + (data?.credits ?? 0) } }
      );
    }
    if (orderData && orderData.ordertype === "subscription") {
      const findSUbscription = await Subscription.findOne({
        _id: new mongoose.Types.ObjectId(prepareData.subscriptionId),
      });
      const findAdmin = await User.findOne({ role: "admin" });
      await MailSend({
        to: [findUser.email],
        subject: "Payment Submitted - SportPredict",
        html: UserPaymentConfirmationTemp({
          subscriptionPlan: findSUbscription?.name || "",
          paymentId: orderData.paymentId || "",
          paymentMode: orderData.paymentMode || "",
          paymentDate: moment(prepareData.paymentDate).format(
            "MMMM DD, YYYY HH:mm"
          ),
          paymentModeDetails: orderData.paymentModeDetails || "",
          price: prepareData.price || 0,
          username: findUser.username,
        }),
      });
      await MailSend({
        to: [findUser.email],
        subject: `Payment Submitted(${findUser.username}) - SportPredict`,
        html: AdminPaymentConfirmationTemp({
          subscriptionPlan: findSUbscription?.name || "",
          paymentId: prepareData.paymentId || "",
          paymentMode: prepareData.paymentMode || "",
          paymentDate: moment(prepareData.paymentDate).format(
            "MMMM DD, YYYY HH:mm"
          ),
          paymentModeDetails: prepareData.paymentModeDetails || "",
          price: prepareData.price || 0,
          username: findUser.username,
          email: findUser.email,
        }),
      });
    }
    return NextResponse.json(
      { success: true, message: "Order created successfully", data: orderData },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
