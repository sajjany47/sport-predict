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

    const prepareData = (
      await Promise.all(
        crexData.map(async (item: any) => {
          const match = dbMatches.find((m: any) => m.url === item.url);

          if (!match) return null;
          const scorecardUrl = item.url.replace(/\/info(\/)?$/i, "/scorecard");

          const scorecardData: any = await CrexMatchScorecard(scorecardUrl);

          const updatedTeams = match.teams.map((dbTeam: any) => {
            const liveTeam = item.teams.find(
              (t: any) => t.teamFlagUrl === dbTeam.teamFlagUrl,
            );

            const scTeam = (scorecardData?.teams ?? []).find(
              (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
            );

            return {
              ...dbTeam,
              teamShortName: liveTeam?.teamShortName ?? dbTeam.teamShortName,
              // cricketScore: liveTeam?.cricketScore ?? null,
              cricketScore:
                (scTeam
                  ? `${scTeam.score} (${scTeam.overs})`
                  : liveTeam?.cricketScore) ?? null,
            };
          });

          const { details, ...matchWithoutDetails } = match;
          return {
            ...matchWithoutDetails,
            teams: updatedTeams,
            status: item.status,
            score: item.score ?? {
              score: (scorecardData?.teams ?? []).map((a: any) => ({
                team: a.name,
                run: `${a.score} (${a.overs})`,
              })),
              result: scorecardData.result ?? "",
            },
          };
        }),
      )
    ).filter(Boolean);

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

    const completedWithScore = await Promise.all(
      completedMatches.map(async (item: any) => {
        const scorecardUrl = item?.url.replace(/\/info(\/)?$/i, "/scorecard");

        const scorecardData: any = await CrexMatchScorecard(scorecardUrl);

        // assume scorecardData.teams & scorecardData.score

        if (!scorecardData) return item;

        const updatedTeams = (item.teams ?? []).map((dbTeam: any) => {
          const scTeam = (scorecardData?.teams ?? []).find(
            (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
          );

          return {
            ...dbTeam,
            teamShortName: scTeam?.name ?? dbTeam?.teamShortName,
            // cricketScore: scTeam?.cricketScore ?? dbTeam?.cricketScore ?? null,
            cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
          };
        });

        return {
          ...item,
          teams: updatedTeams,
          score: {
            score: (scorecardData?.teams ?? []).map((a: any) => ({
              team: a.name,
              run: `${a.score} (${a.overs})`,
            })),
            result: scorecardData.result ?? "",
          },
          status: "COMPLETED",
        };
      }),
    );

    // ✅ Final response
    return Response.json(
      {
        data: [...prepareData, ...completedWithScore],
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
