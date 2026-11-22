import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import Order from "../../order/OrderModel";
import User from "../../users/UserModel";
import Notification from "../../notification/NotificationModel";
import {
  decodeSignedToken,
  isFresh,
  type CrossPaymentResult,
} from "@/lib/payment-signature";
import { FormatErrorMessage } from "@/lib/utils";

/**
 * Return URL target for the shared Sajjan Mart payment page.
 *
 * The only input is the signed result token. We verify the HMAC with the
 * shared secret, match it to the pending CricVista order, then atomically flip
 * that order and credit the user. Retries are idempotent — credits are never
 * added twice.
 */
export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const { result: token } = await req.json();
    if (typeof token !== "string" || !token) {
      return NextResponse.json(
        { success: false, message: "Missing payment result" },
        { status: 400 },
      );
    }

    const result = decodeSignedToken<CrossPaymentResult>(token);
    if (
      !result ||
      typeof result.ref !== "string" ||
      (result.status !== "success" && result.status !== "failed") ||
      !isFresh(result.completedAt)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired payment result" },
        { status: 401 },
      );
    }

    const order = await Order.findOne({ orderNumber: result.ref });
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    // Idempotent replay: the callback may be delivered more than once (browser
    // refresh, retry button). Never credit twice.
    if (order.status === "completed" && order.paymentStatus) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        credits: order.credits,
        orderNumber: order.orderNumber,
        amount: order.price,
        planName: order.remarks,
      });
    }

    if (result.status !== "success") {
      if (order.status === "pending") {
        await Order.updateOne(
          { _id: order._id, status: "pending" },
          {
            $set: {
              status: "failed",
              remarks: result.reason || "Payment failed",
              paymentDate: new Date(result.completedAt),
            },
          },
        );
      }
      return NextResponse.json({
        success: false,
        message: result.reason || "Payment was not completed",
        orderNumber: order.orderNumber,
        amount: order.price,
      });
    }

    if (
      typeof result.razorpayPaymentId !== "string" ||
      !result.razorpayPaymentId ||
      Number(result.amount) !== Number(order.price)
    ) {
      return NextResponse.json(
        { success: false, message: "Payment result does not match this order" },
        { status: 409 },
      );
    }

    // A single payment id can only ever settle one CricVista order.
    const duplicate = await Order.findOne({
      paymentId: result.razorpayPaymentId,
      _id: { $ne: order._id },
    });
    if (duplicate) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        credits: duplicate.credits,
        orderNumber: duplicate.orderNumber,
        amount: duplicate.price,
        planName: duplicate.remarks,
      });
    }

    const details = Array.isArray(order.paymentDetails) ? order.paymentDetails : [];
    const settled = await Order.findOneAndUpdate(
      { _id: order._id, status: "pending" },
      {
        $set: {
          status: "completed",
          paymentStatus: true,
          paymentMode: "RAZORPAY",
          paymentId: result.razorpayPaymentId,
          paymentDate: new Date(result.completedAt),
          paymentDetails: [
            ...details,
            {
              razorpayOrderId: result.razorpayOrderId,
              razorpayPaymentId: result.razorpayPaymentId,
              razorpaySignature: result.razorpaySignature,
              gateway: "sajjan-mart",
              status: "captured",
            },
          ],
        },
      },
      { new: true },
    );

    if (!settled) {
      const current = await Order.findById(order._id);
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        credits: current?.credits ?? 0,
        orderNumber: current?.orderNumber ?? order.orderNumber,
        amount: current?.price ?? order.price,
        planName: current?.remarks ?? order.remarks,
      });
    }

    await User.updateOne(
      { _id: settled.userId },
      {
        $inc: { credits: settled.credits },
        ...(settled.planId === "starter"
          ? { $set: { dailyBoostTokenPurchaseDate: new Date() } }
          : {}),
      },
    );

    await Notification.create({
      userId: settled.userId,
      type: "payment",
      title: "Payment successful",
      message: `Your payment was verified and ${settled.credits} tokens have been added to your account.`,
      link: "/matches",
    });

    return NextResponse.json({
      success: true,
      alreadyProcessed: false,
      credits: settled.credits,
      orderNumber: settled.orderNumber,
      amount: settled.price,
      paymentId: settled.paymentId,
      planName: settled.remarks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
