import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import Stats from "../StatsModel";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const stats = await Stats.find().sort({ createdOn: 1 });
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
