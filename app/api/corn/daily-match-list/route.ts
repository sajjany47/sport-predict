import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import { CrexNext3DaysFixturesArray } from "../CrexNext3DayList";
import moment from "moment";
import MatchList from "./DailyMatchListModel";
import { CrexV2Details } from "../../match-details/CrexV2Details";

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    //delete old matches
    const cutoffDate = moment().subtract(2, "days").format("YYYY-MM-DD");

    await MatchList.deleteMany({
      formatDate: { $lte: cutoffDate },
    });

    const day3List = (await CrexNext3DaysFixturesArray()).map((item: any) => ({
      ...item,
      url: NormalizeCrexUrl(item.url),
    }));

    // const fixtures = await CrexNext3DaysFixturesArray();
    // const day3List = [];

    // for (const item of fixtures) {
    //   let data = { ...item, url: NormalizeCrexUrl(item.url) };

    //   const crexOverallStats = item.url
    //     ? await CrexV2Details(NormalizeCrexUrl(item.url))
    //     : null;

    //   if (crexOverallStats) {
    //     const cleanedSquads = (crexOverallStats.squads ?? []).map(
    //       (team: any) => ({
    //         ...team,

    //         playingPlayers: (team.playingPlayers ?? []).map((player: any) => ({
    //           ...player,
    //           careerStats: {
    //             ...player.careerStats,
    //             bowling: (player.careerStats?.bowling ?? []).filter(
    //               (b: any) => !b.format?.toLowerCase().includes("debut"),
    //             ),
    //           },
    //         })),

    //         benchPlayers: (team.benchPlayers ?? []).map((player: any) => ({
    //           ...player,
    //           careerStats: {
    //             ...player.careerStats,
    //             bowling: (player.careerStats?.bowling ?? []).filter(
    //               (b: any) => !b.format?.toLowerCase().includes("debut"),
    //             ),
    //           },
    //         })),
    //       }),
    //     );

    //     data.details = {
    //       ...crexOverallStats,
    //       squads: cleanedSquads,
    //     };

    //     data.detailsUpdatedAt = new Date();
    //   }

    //   day3List.push(data);
    // }

    const bulkOps = day3List.map((item: any) => ({
      updateOne: {
        filter: { url: item.url },
        update: {
          $set: {
            details: item.details,
            detailsUpdatedAt: item.detailsUpdatedAt,
          },
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
        data: day3List,
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
