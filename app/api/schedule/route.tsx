import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import moment from "moment-timezone";
import MatchList from "../corn/daily-match-list/DailyMatchListModel";
import { CrexList } from "./CrexList";
import dbConnect from "../db";
import { CrexMatchScorecard } from "./CrexScore";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const fromDate = body.fromDate ? new Date(body.fromDate) : new Date();

    // 1️⃣ Fetch DB matches
    const dbMatches = await MatchList.aggregate([
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

    // 2️⃣ Fetch Crex matches (LIVE / UPCOMING)
    const crexData = (await CrexList()).map((item: any) => ({
      ...item,
      url: NormalizeCrexUrl(item.url),
    }));

    // 3️⃣ Merge DB + Crex (live matches)
    const prepareData = crexData
      .map((item: any) => {
        const match = dbMatches.find((m: any) => m.url === item.url);
        if (!match) return null;

        return {
          ...match,
          teams: [
            {
              ...match.teams[0],
              teamShortName: item.teams[0].teamShortName,
            },
            {
              ...match.teams[1],
              teamShortName: item.teams[1].teamShortName,
            },
          ],
          status: item.status,
          score: item.score,
        };
      })
      .filter(Boolean);

    // 4️⃣ DB matches NOT in Crex → COMPLETED
    const completedMatches = dbMatches
      .filter(
        (dbMatch: any) =>
          !prepareData.some((liveMatch: any) => liveMatch.url === dbMatch.url),
      )
      .map((item: any) => ({
        ...item,
        status: "COMPLETED",
      }));

    // const addScore = Promise.all(
    //   completedMatches.map(async (item: any) => {
    //     const changeUrl = item.url.replace(/\/info(\/)?$/i, "/scorecard");
    //     const score = await CrexMatchScorecard(changeUrl);
    //     const te;
    //   }),
    // );

    // ✅ Final response
    return Response.json(
      {
        data: [...prepareData, ...completedMatches],
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
