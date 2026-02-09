import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import moment from "moment-timezone";
import MatchList from "../corn/daily-match-list/DailyMatchListModel";
import { CrexList } from "./CrexList";
import dbConnect from "../db";
import { CrexMatchScorecard } from "./CrexScore";
import { SquadList } from "../match-details/SquadList";
import { GetNewAnalysis } from "@/app/matches/[id]/GetNewAnanlysis";
import Match from "./MatchModel";
import MatchDetails from "../match-details/MatchDetailsModel";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const fromDate = body.fromDate ? new Date(body.fromDate) : new Date();

    /* ================= DB MATCHES ================= */

    const a = await Match.aggregate([
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

    const dbMatches = a.filter((match: any) => {
      const team1 = match.teams[0].teamName;
      const team2 = match.teams[1].teamShortName;
      const searchTermLower = "Team 1 (TBC)";

      return team1 !== searchTermLower || team2 !== "Team";
    });

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

        // 👉 CREX MATCH FOUND
        if (crexMatch) {
          /* ---------- UPCOMING ---------- */
          if (crexMatch.status === "UPCOMING") {
            filterUpcomingMatches.push(match);
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
              ...match,
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

        let analysis: any = null;
        if (isUpcoming) {
          filterUpcomingMatches.push(match);
          return;
        } else {
          const details = await MatchDetails.findOne({
            matchId: new mongoose.Types.ObjectId(match._id),
          });
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

          if (details) {
            // const latestSquad = await SquadList(match.url, details.squads);
            analysis = await GetNewAnalysis({
              ...details,
              squads: details.squads,
              matchInfo: match,
            });
          }

          const basePayload = {
            ...match,
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
        }

        /* ---------- COMPLETED ---------- */

        /* ================= FINAL STATUS ROUTING ================= */
      }),
    );

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
