import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import moment from "moment-timezone";
import MatchList from "../corn/daily-match-list/DailyMatchListModel";
import { CrexList } from "./CrexList";
import dbConnect from "../db";
import { CrexMatchScorecard } from "./CrexScore";
import { SquadList } from "../match-details/SquadList";
import { GetNewAnalysis } from "@/app/matches/[id]/GetNewAnanlysis";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const fromDate = body.fromDate ? new Date(body.fromDate) : new Date();

    /* ================= DB MATCHES ================= */

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

    /* ================= CREX MATCHES ================= */

    const crexData = (await CrexList()).map((item: any) => ({
      ...item,
      url: NormalizeCrexUrl(item.url),
    }));

    /* ================= SCORECARD CACHE ================= */

    const scorecardCache = new Map<string, any>();

    await Promise.all(
      [...crexData, ...dbMatches].map(async (m: any) => {
        if (!m?.url) return;

        const scorecardUrl = m.url.replace(/\/info(\/)?$/i, "/scorecard");

        if (!scorecardCache.has(scorecardUrl)) {
          try {
            const data = await CrexMatchScorecard(scorecardUrl);
            scorecardCache.set(scorecardUrl, data);
          } catch {
            scorecardCache.set(scorecardUrl, null);
          }
        }
      }),
    );

    /* ================= LIVE / UPCOMING ================= */

    const prepareData = crexData
      .map((item: any) => {
        const match = dbMatches.find((m: any) => m.url === item.url);
        if (!match) return null;

        const scorecardData = scorecardCache.get(
          item.url.replace(/\/info(\/)?$/i, "/scorecard"),
        );

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
            result: scorecardData?.result ?? "",
          },
        };
      })
      .filter(Boolean);

    /* ================= COMPLETED ================= */

    const completedMatches = dbMatches.filter(
      (dbMatch: any) =>
        !prepareData.some((liveMatch: any) => liveMatch.url === dbMatch.url),
    );

    const completedWithScore = await Promise.all(
      completedMatches.map(async (item: any) => {
        const scorecardData = scorecardCache.get(
          item.url.replace(/\/info(\/)?$/i, "/scorecard"),
        );

        if (!scorecardData) return item;

        const updatedTeams = (item.teams ?? []).map((dbTeam: any) => {
          const scTeam = (scorecardData?.teams ?? []).find(
            (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
          );

          return {
            ...dbTeam,
            teamShortName: scTeam?.name ?? dbTeam?.teamShortName,
            cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
          };
        });

        const latesSquad = await SquadList(item.url, item.details?.squads);
        const analysis = await GetNewAnalysis({
          ...item.details,
          squads: latesSquad,
          matchInfo: item,
        });

        const { details, ...matchWithoutDetails } = item;

        return {
          ...matchWithoutDetails,
          teams: updatedTeams,
          score: {
            score: (scorecardData?.teams ?? []).map((a: any) => ({
              team: a.name,
              run: `${a.score} (${a.overs})`,
            })),
            result: scorecardData?.result ?? "",
          },
          status: "COMPLETED",
          prediction: { team1: analysis?.team1, team2: analysis?.team2 },
        };
      }),
    );

    /* ================= RESPONSE ================= */

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
