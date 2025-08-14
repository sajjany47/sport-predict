import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import Order from "../OrderModel";
import { FormatErrorMessage } from "@/lib/utils";
import mongoose from "mongoose";
import moment from "moment";
import Subscription from "../../subscription/SubscriptionModel";
import User from "../../users/UserModel";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const data = await req.json();
    const xUser = req.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    if (loggedInUser.role !== "admin" && loggedInUser === null) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const findOrder = await Order.findOne({
      _id: new mongoose.Types.ObjectId(data.orderId),
    });
    if (!findOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    let updateData: any = {
      status: data.status,
      paymentStatus: data.paymentStatus,
    };
    let credits = 0;
    if (data.paymentStatus && data.status === "completed") {
      if (findOrder.ordertype === "subscription") {
        updateData.subscriptionId = new mongoose.Types.ObjectId(
          findOrder.subscriptionId
        );
        updateData.subscriptionExpired = moment().add(1, "months");
        const findSubscription = await Subscription.findOne({
          _id: new mongoose.Types.ObjectId(findOrder.subscriptionId),
        });
        if (!findSubscription) {
          return NextResponse.json(
            { success: false, message: "Subscription not found" },
            { status: 404 }
          );
        }
        credits = Number(findSubscription.credits);
      }
      if (findOrder.ordertype === "credit") {
        credits = Number(data.credits);
      }
    } else if (data.status === "refunded") {
      updateData.paymentStatus = true;
      updateData.remarks = data.remarks;
    } else if (data.status === "failed") {
      updateData.remarks = data.remarks;
      updateData.paymentStatus = false;
    } else {
    }

    const updateOrder = await Order.updateOne(
      {
        _id: new mongoose.Types.ObjectId(data.orderId),
      },
      { $set: updateData }
    );

    if (updateOrder) {
      if (credits > 0) {
        const findUser = await User.findOne({
          _id: new mongoose.Types.ObjectId(findOrder.userId),
        });
        if (!findUser) {
          return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
          );
        }
        await User.updateOne(
          { _id: new mongoose.Types.ObjectId(findOrder.userId) },
          { $set: { credits: Number(findUser.credits) + Number(credits) } }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "Order updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
