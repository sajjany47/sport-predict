import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../db";
import Subscription from "../SubscriptionModel";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string | string[] } }
) {
  await dbConnect();

  // Ensure id is a string (handle case where it might be an array)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID" },
      { status: 400 }
    );
  }

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
