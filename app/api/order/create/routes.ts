import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { orderValidationSchema } from "../OrderSchema";
import { PrepareOrderData } from "../OrderData";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const data = await req.json();
    await orderValidationSchema.validate(data, { abortEarly: false });

    const prepareData = PrepareOrderData(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
