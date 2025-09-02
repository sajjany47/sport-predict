import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
