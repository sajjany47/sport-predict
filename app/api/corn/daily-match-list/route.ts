import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import { CrexNext3DaysFixturesArray } from "../CrexNext3DayList";
import moment from "moment";
import MatchList from "./DailyMatchListModel";

export const GET = async (req: NextRequest) => {
  await dbConnect();
  const today = moment().format("YYYY-MM-DD");
  try {
    //delete old matches
    const cutoffDate = moment().subtract(5, "days").format("YYYY-MM-DD");

    await MatchList.deleteMany({
      formatDate: { $lte: cutoffDate },
    });

    //fetch existing matches from DB
    const databaseMatches = await MatchList.find(
      { formatDate: { $gte: today } },
      { url: 1, _id: 0 },
    );

    const dbUrlSet = new Set(databaseMatches.map((m: any) => m.url));

    const day3List: any[] = await CrexNext3DaysFixturesArray();

    const bulkOps = day3List.map((item: any) => ({
      updateOne: {
        filter: { url: item.url },
        update: {
          $setOnInsert: {
            ...item,
            formatDate: moment(item.matchDate, "ddd, DD MMM YYYY").format(
              "YYYY-MM-DD",
            ),
            createdAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await MatchList.bulkWrite(bulkOps);

    return NextResponse.json(
      {
        success: true,
        message: "Daily match list updated successfully",
        data: {
          data: bulkOps,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
