import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import { CrexNext3DaysFixturesArray } from "../CrexNext3DayList";
import moment from "moment";
import MatchList from "./DailyMatchListModel";
import { CrexV2Details } from "../../match-details/CrexV2Details";

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    //delete old matches
    const cutoffDate = moment().subtract(5, "days").format("YYYY-MM-DD");

    await MatchList.deleteMany({
      formatDate: { $lte: cutoffDate },
    });

    const day3List: any[] = await CrexNext3DaysFixturesArray();

    let prepareArray = [];

    const today = moment().startOf("day");
    const tomorrow = moment().add(1, "day").startOf("day");

    for (let index = 0; index < day3List.length; index++) {
      console.log("check api running or not", index);
      const element = day3List[index];
      const matchDate = moment(element.matchDate, "ddd, DD MMM YYYY");
      console.log(matchDate);
      let details = null;
      if (matchDate.isSame(today, "day") || matchDate.isSame(tomorrow, "day")) {
        console.log("first");
        details = await CrexV2Details(element.url);
      }
      prepareArray.push({
        ...element,
        formatDate: moment(element.matchDate, "ddd, DD MMM YYYY").format(
          "YYYY-MM-DD",
        ),
        details,
        detailsUpdatedAt: new Date(),
      });
    }

    // const bulkOps = day3List.map((item: any) => ({
    //   updateOne: {
    //     filter: { url: item.url },
    //     update: {
    //       $set: {
    //         details: item.details,
    //         detailsUpdatedAt: item.detailsUpdatedAt,
    //       },
    //       $setOnInsert: {
    //         ...item,
    //         formatDate: moment(item.matchDate, "ddd, DD MMM YYYY").format(
    //           "YYYY-MM-DD",
    //         ),
    //         createdAt: new Date(),
    //       },
    //     },
    //     upsert: true,
    //   },
    // }));

    // await MatchList.bulkWrite(bulkOps);

    return NextResponse.json(
      {
        success: true,
        message: "Daily match list updated successfully",
        data: {
          data: prepareArray,
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
