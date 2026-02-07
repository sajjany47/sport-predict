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

    // 🔥 Create lookup map (BIG performance win)
    const crexMap = new Map<string, any>();
    crexData.forEach((item: any) => crexMap.set(item.url, item));

    /* ================= RESULT BUCKETS ================= */

    const filterUpcomingMatches: any[] = [];
    const filterLiveMatches: any[] = [];
    const filterCompletedMatches: any[] = [];

    /* ================= MAIN LOGIC ================= */

    await Promise.all(
      dbMatches.map(async (match: any) => {
        const crexMatch = crexMap.get(match.url);
        const { details, ...matchWithoutDetails } = match;

        // 👉 CREX MATCH FOUND
        if (crexMatch) {
          /* ---------- UPCOMING ---------- */
          if (crexMatch.status === "UPCOMING") {
            filterUpcomingMatches.push(matchWithoutDetails);
            return;
          }

          /* ---------- LIVE ---------- */
          if (crexMatch.status === "LIVE") {
            const updatedTeams = match.teams.map((dbTeam: any) => {
              const liveTeam = crexMatch.teams.find(
                (t: any) => t.teamFlagUrl === dbTeam.teamFlagUrl,
              );

              return {
                ...dbTeam,
                teamShortName: liveTeam?.teamShortName ?? dbTeam.teamShortName,
                cricketScore: liveTeam?.cricketScore ?? null,
              };
            });

            filterLiveMatches.push({
              ...matchWithoutDetails,
              status: "LIVE",
              teams: updatedTeams,
              score: crexMatch.score,
            });
            return;
          }
        }

        // 👉 COMPLETED OR NO CREX DATA
        const isUpcoming = moment(
          `${match.matchDate} ${match.startTime}`,
          "ddd, DD MMM YYYY h:mm A",
        ).isAfter(moment());

        if (isUpcoming) {
          filterUpcomingMatches.push(matchWithoutDetails);
          return;
        }

        /* ---------- COMPLETED ---------- */
        const scoreCardUrl = match.url.replace(/\/info(\/)?$/i, "/scorecard");
        const scoreCard: any = await CrexMatchScorecard(scoreCardUrl);
        const result = scoreCard?.result?.toLowerCase() ?? "";

        const updatedTeams = (match.teams ?? []).map((dbTeam: any) => {
          const scTeam = (scoreCard?.teams ?? []).find(
            (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
          );

          return {
            ...dbTeam,
            teamShortName: scTeam?.name ?? dbTeam?.teamShortName,
            cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
          };
        });

        let analysis = null;

        if (details) {
          const latestSquad = await SquadList(match.url, details.squads);
          analysis = await GetNewAnalysis({
            ...details,
            squads: latestSquad,
            matchInfo: match,
          });
        }

        const basePayload = {
          ...matchWithoutDetails,
          teams: updatedTeams,
          score: {
            score: (scoreCard?.teams ?? []).map((t: any) => ({
              team: t.name,
              run: `${t.score} (${t.overs})`,
            })),
            result: scoreCard?.result ?? "",
          },
          prediction: analysis
            ? { team1: analysis.team1, team2: analysis.team2 }
            : null,
        };

        /* ================= FINAL STATUS ROUTING ================= */

        if (result.includes("abandoned")) {
          filterCompletedMatches.push({
            ...basePayload,
            status: "ABANDONED",
          });
          return;
        }

        if (result.includes("won")) {
          filterCompletedMatches.push({
            ...basePayload,
            status: "COMPLETED",
          });
          return;
        }

        // still live (no result yet)
        filterLiveMatches.push({
          ...basePayload,
          status: "LIVE",
        });
      }),
    );
    /* =================End  New logic ================= */

    /* ================= SCORECARD CACHE ================= */

    // const scorecardCache = new Map<string, any>();

    /* ================= RESPONSE ================= */

    return Response.json(
      {
        // data: [...prepareData, ...completedWithScore],
        data: [
          ...filterUpcomingMatches,
          ...filterLiveMatches,
          ...filterCompletedMatches,
        ],
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
