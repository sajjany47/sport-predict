import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import Order from "../OrderModel";
import { FormatErrorMessage } from "@/lib/utils";
import mongoose from "mongoose";
import moment from "moment";
import Subscription from "../../subscription/SubscriptionModel";
import User from "../../users/UserModel";
import { MailSend } from "@/lib/MailSend";
import { PaymentVerifiedTem } from "@/components/template/subscription-temp";

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

    if (findOrder.status === "completed") {
      return NextResponse.json(
        { success: false, message: "Order already updated" },
        { status: 409 }
      );
    }

    let updateData: any = {
      status: data.status,
      remarks: data.remarks,
    };
    let credits = 0;
    if (data.status === "completed") {
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
        updateData.paymentStatus = true;
        credits = Number(findSubscription.credits);
      }
      if (findOrder.ordertype === "credit") {
        credits = Number(data.credits);
        updateData.paymentStatus = true;
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
      if (credits > 0 && updateData.status === "completed") {
        const findUser = await User.findOne({
          _id: new mongoose.Types.ObjectId(findOrder.userId),
        });
        if (!findUser) {
          return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
          );
        }

        if (findOrder.ordertype === "subscription") {
          await User.updateOne(
            { _id: new mongoose.Types.ObjectId(findOrder.userId) },
            { $set: { "subscription.$[].isActive": false } }
          );
          const updateUserData = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(findOrder.userId) },
            {
              $push: {
                subscription: {
                  _id: new mongoose.Types.ObjectId(),
                  subscriptionId: new mongoose.Types.ObjectId(
                    findOrder.subscriptionId
                  ),
                  isActive: true,
                  expiryDate: new Date(updateData.subscriptionExpired),
                  purchaseDate: new Date(findOrder.paymentDate),
                  credits: Number(credits),
                },
              },
              $inc: { credits: Number(credits) },
            }
          );
          if (updateUserData && findOrder.ordertype === "subscription") {
            const findSubscription = await Subscription.findOne({
              _id: new mongoose.Types.ObjectId(findOrder.subscriptionId),
            });
            await MailSend({
              to: [findUser.email],
              subject: `Payment verified(${findUser.username}) - SportPredict`,
              html: PaymentVerifiedTem({
                subscriptionPlan: findSubscription?.name || "",
                paymentId: findOrder.paymentId || "",
                paymentMode: findOrder.paymentMode || "",
                paymentDate: moment(findOrder.paymentDate).format(
                  "MMMM DD, YYYY HH:mm"
                ),
                validUntil: moment(findOrder.subscriptionExpired).format(
                  "MMMM DD, YYYY HH:mm"
                ),
                verificationDate: moment().format("MMMM DD, YYYY HH:mm"),
                price: findOrder.price || 0,
                username: findUser.username,
              }),
            });
          }
          // Step 1: Deactivate all existing subscriptions
          // const updatedSubscriptions = (findUser.subscription || []).map(
          //   (item: any) => ({
          //     ...item, // if Mongoose doc, convert to plain object
          //     isActive: false,
          //   })
          // );

          // // Step 2: Add the new subscription
          // updatedSubscriptions.push({
          //   _id: new mongoose.Types.ObjectId(),
          //   subscriptionId: new mongoose.Types.ObjectId(
          //     findOrder.subscriptionId
          //   ),
          //   isActive: true,
          //   expiryDate: new Date(updateData.subscriptionExpired),
          //   purchaseDate: new Date(findOrder.paymentDate),
          //   credits: Number(credits),
          // });
          // updateUser.subscription = updatedSubscriptions;
        }
        if (findOrder.ordertype === "credit") {
          const updateUserData = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(findOrder.userId) },
            { $set: { credits: Number(findUser.credits) + Number(credits) } }
          );
        }
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
