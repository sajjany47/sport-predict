import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import moment from "moment-timezone";
import MatchList from "../corn/daily-match-list/DailyMatchListModel";
import { CrexList } from "./CrexList";
import dbConnect from "../db";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    const fromDate = body.fromDate ? new Date(body.fromDate) : new Date();

    const data = await MatchList.aggregate([
      {
        $match: {
          formatDate: new Date(moment(fromDate).format("YYYY-MM-DD")),
        },
      },
      {
        $sort: {
          formatDate: 1,
          startTime: 1,
        },
      },
    ]);

    let crexData = (await CrexList()).map((item: any) => ({
      ...item,
      url: NormalizeCrexUrl(item.url),
    }));

    // const prepareData = data.map((item: any) => {
    //   const crexMatch = crexData.find((m: any) => m.url === item.url);
    //   let teamA = item.teams[0];
    //   let teamB = item.teams[1];
    //   return {
    //     ...item,
    //     teams: [
    //       {
    //         ...teamA,
    //         teamShortName: crexMatch
    //           ? crexMatch.teams[0].teamShortName
    //           : teamA.teamShortName,
    //       },
    //       {
    //         ...teamB,
    //         teamShortName: crexMatch
    //           ? crexMatch.teams[1].teamShortName
    //           : teamB.teamShortName,
    //       },
    //     ],
    //     status: crexMatch ? crexMatch.status : item.status,
    //     score: crexMatch ? crexMatch.score : item.score,
    //   };
    // });

    const prepareData = crexData
      .map((item: any) => {
        const match = data.find((m: any) => m.url === item.url);
        if (match) {
          let teamA = match.teams[0];
          let teamB = match.teams[1];
          return {
            ...match,
            teams: [
              {
                ...teamA,
                teamShortName: item.teams[0].teamShortName,
              },
              {
                ...teamB,
                teamShortName: item.teams[1].teamShortName,
              },
            ],
            status: item.status,
            score: item.score,
          };
        }
      })
      .filter(Boolean);
    return Response.json(
      {
        data: prepareData,
        date: moment(fromDate).format("DD-MM-YYYY"),
        success: true,
        message: "Schedule fetched successfully",
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
