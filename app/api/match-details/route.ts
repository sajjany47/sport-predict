import { NextRequest } from "next/server";
import { FormatErrorMessage } from "@/lib/utils";

import dbConnect from "../db";

import { CrexV2Details } from "./CrexV2Details";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();

    const crexOverallStats = body.url ? await CrexV2Details(body.url) : null;

    return Response.json(
      {
        data: {
          ...crexOverallStats,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
}
