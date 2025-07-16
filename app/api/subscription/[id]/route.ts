import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../db";
import Subscription from "../SubscriptionModel";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // ✅ DO NOT destructure directly
) {
  await dbConnect();

  const { id } = context.params;

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return NextResponse.json(
  //     { success: false, message: "Invalid ID" },
  //     { status: 400 }
  //   );
  // }

  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
