import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import dbConnect from "../../db";
import Order from "../../order/OrderModel";
import User from "../../users/UserModel";
import { getPlanById } from "@/lib/subscription-plans";
import { encodeSignedPayload } from "@/lib/payment-signature";
import { FormatErrorMessage } from "@/lib/utils";

const toObjectId = (id: any) =>
  id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id);

/**
 * Start a purchase that is collected by the shared Sajjan Mart /pay page.
 *
 * A pending CricVista order is written first, then the browser is handed a
 * signed URL. Price and credits come from the server-side plan catalog — the
 * client only supplies a plan id.
 */
export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const xUser = req.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    if (!loggedInUser?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { planId } = await req.json();
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Invalid plan selected" },
        { status: 400 },
      );
    }

    const userId = toObjectId(loggedInUser._id);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const gatewayUrl = process.env.NEXT_PUBLIC_SAJJAN_MART_URL || process.env.SAJJAN_MART_URL;
    if (!gatewayUrl) {
      return NextResponse.json(
        { success: false, message: "Payment gateway URL is not configured" },
        { status: 500 },
      );
    }

    // Reuse a recent pending order for the same plan so page reloads / double
    // clicks do not leave a trail of abandoned orders.
    const recentPending = await Order.findOne({
      userId,
      planId: plan.id,
      status: "pending",
      createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
    }).sort({ createdAt: -1 });

    let order = recentPending;
    if (!order) {
      const ref = `CV-${Date.now().toString(36).toUpperCase()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

      order = await Order.create({
        orderNumber: ref,
        ordertype: "purchase",
        price: plan.price,
        credits: plan.tokens,
        userId,
        subscriptionId: null,
        planId: plan.id,
        paymentStatus: false,
        status: "pending",
        paymentMode: "RAZORPAY",
        remarks: `${plan.name} (${plan.tokens} credits)`,
        paymentDetails: [
          {
            planId: plan.id,
            planName: plan.name,
            credits: plan.tokens,
            gateway: "sajjan-mart",
          },
        ],
        paymentDate: null,
      });
    }

    const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL || req.nextUrl.origin).replace(/\/$/, "");
    const returnUrl = `${baseUrl}/payment/razorpay-callback`;

    const signed = encodeSignedPayload({
      source: "cricvista",
      ref: order.orderNumber,
      amount: plan.price,
      currency: "INR",
      description: `CricVista - ${plan.name} (${plan.tokens} credits)`,
      customer: {
        name: String(user.name || user.username || "CricVista User"),
        email: String(user.email || ""),
        phone: String(user.mobileNumber || ""),
      },
      returnUrl,
      issuedAt: Date.now(),
    });

    const paymentUrl = new URL("/pay", gatewayUrl);
    paymentUrl.searchParams.set("p", signed.p);
    paymentUrl.searchParams.set("sign", signed.sign);

    return NextResponse.json({
      success: true,
      url: paymentUrl.toString(),
      ref: order.orderNumber,
      amount: plan.price,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
