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
    const databaseMatches = await MatchList.aggregate([
      {
        $match: {
          formatDate: { $gte: today },
        },
      },
    ]);

    const day3List: any = await CrexNext3DaysFixturesArray();

    let updateData = [];
    let insertData = [];

    const filterNewMatches = day3List.filter((prepMatch: any) => {
      return !databaseMatches.some(
        (dbMatch: any) => dbMatch.matchId === prepMatch.matchId,
      );
    });

    // const dbMatchMap = new Map(
    //   databaseMatches.map((match: any) => [match.matchId, match]),
    // );

    // for (const prepMatch of day3List) {
    //   const dbMatch = dbMatchMap.get(prepMatch.matchId);
    //   if (dbMatch) {
    //     updateData.push({
    //       ...dbMatch,
    //       formatDate: moment(prepMatch.matchDate).format("YYYY-MM-DD"),
    //     });
    //   } else {
    //     insertData.push({
    //       ...prepMatch,
    //       formatDate: moment(prepMatch.matchDate).format("YYYY-MM-DD"),
    //     });
    //   }
    // }

    // const operations = [];
    // //Insert new matches

    // for (const doc of insertData) {
    //   operations.push({ insertOne: { document: doc } });
    // }

    // //Update existing matches
    // for (const doc of updateData) {
    //   operations.push({
    //     updateOne: {
    //       filter: { matchId: doc.matchId },
    //       update: {
    //         $set: { crexUrl: doc.crexUrl },
    //       },
    //       upsert: false,
    //     },
    //   });
    // }

    // if (operations.length > 0) {
    //   await MatchList.bulkWrite(operations, { ordered: false });
    // }

    return NextResponse.json(
      {
        success: true,
        message: "Daily match list updated successfully",
        data: {
          // inserted: insertData,
          // updated: updateData,
          data: day3List,
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
