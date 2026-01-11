import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import { extractAndTransformSchedule } from "../../schedule/CricBuzzScarbList";
import { CrexList } from "../../schedule/CrexList";
import { CrexNext3DaysFixturesArray } from "../CrexNext3DayList";
import moment from "moment";
import MatchList from "./DailyMatchListModel";

export const GET = async (req: NextRequest) => {
  await dbConnect();
  const today = moment().startOf("day").toDate();
  try {
    //delete old matches
    const cutoffDate = moment()
      .subtract(0, "days")
      .startOf("day")
      .format("DD MMM YYYY, HH:mm");
    console.log(cutoffDate);
    await MatchList.deleteMany({ startTime: { $lte: cutoffDate } });

    return NextResponse.json(
      { success: true, message: "Deleted successfully" },
      { status: 200 }
    );

    //fetch existing matches from DB
    const databaseMatches = await MatchList.aggregate([
      {
        $addFields: {
          startTimeDate: {
            $dateFromString: {
              dateString: "$startTime",
              format: "%d %b %Y, %H:%M",
            },
          },
        },
      },
      {
        $match: {
          startTimeDate: { $gte: today },
        },
      },
    ]);

    const cricbuzzList = await extractAndTransformSchedule(
      null,
      "Asia/Kolkata"
    );
    const filteredCricbuzzList = cricbuzzList.filter((item: any) => {
      return (
        moment(item.startTime, "DD MMM YYYY, HH:mm").isSameOrAfter(moment()) &&
        moment(item.startTime, "DD MMM YYYY, HH:mm").isBefore(
          moment().add(3, "days")
        )
      );
    });

    const day3List: any = await CrexNext3DaysFixturesArray();
    const normalizeCrexUrl = (url: string) => url.replace(/\/live$/, "/info");

    const getCricbuzzDate = (startTime: string) =>
      moment(startTime, "DD MMM YYYY, HH:mm").format("YYYY-MM-DD");

    const getCrexDate = (matchDate: string) =>
      moment(matchDate, "ddd, DD MMM YYYY").format("YYYY-MM-DD");

    const prepareData = filteredCricbuzzList.map((item: any) => {
      let cricbuzzTeam1 = item?.teams[0];
      let cricbuzzTeam2 = item.teams[1];
      let data = item;
      let matchedCrex = day3List.find((crxItem: any) => {
        let crexTeam1 = crxItem?.teams[0];
        let crexTeam2 = crxItem?.teams[1];
        if (
          (cricbuzzTeam1?.teamName?.toLowerCase() ===
            crexTeam1?.teamName?.toLowerCase() ||
            cricbuzzTeam1?.teamShortName.toLowerCase() ===
              crexTeam1?.teamShortName.toLowerCase() ||
            cricbuzzTeam2?.teamName?.toLowerCase() ===
              crexTeam2?.teamName?.toLowerCase() ||
            cricbuzzTeam2?.teamShortName.toLowerCase() ===
              crexTeam2?.teamShortName.toLowerCase()) &&
          getCricbuzzDate(item.startTime) === getCrexDate(crxItem.matchDate)
        ) {
          return { url: crxItem.url };
        }
      });

      return {
        ...data,
        matchId: data.matchId,
        crexUrl: matchedCrex ? normalizeCrexUrl(matchedCrex.url) : null,
      };
    });

    let updateData = [];
    let insertData = [];

    const dbMatchMap = new Map(
      databaseMatches.map((match: any) => [match.matchId, match])
    );

    for (const prepMatch of prepareData) {
      const dbMatch = dbMatchMap.get(prepMatch.matchId);
      if (dbMatch) {
        updateData.push({
          ...dbMatch,
          crexUrl: prepMatch.crexUrl,
        });
      } else {
        insertData.push(prepMatch);
      }
    }

    const operations = [];
    //Insert new matches

    for (const doc of insertData) {
      operations.push({ insertOne: { document: doc } });
    }

    //Update existing matches
    for (const doc of updateData) {
      operations.push({
        updateOne: {
          filter: { matchId: doc.matchId },
          update: {
            $set: { crexUrl: doc.crexUrl },
          },
          upsert: false,
        },
      });
    }

    if (operations.length > 0) {
      await MatchList.bulkWrite(operations, { ordered: false });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Daily match list updated successfully",
        data: { inserted: insertData.length, updated: updateData.length },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
