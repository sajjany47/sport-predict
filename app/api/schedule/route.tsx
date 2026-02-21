import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import { CrexList } from "./CrexList";
import dbConnect from "../db";
import { CrexMatchScorecard } from "./CrexScore";
import { GetNewAnalysis } from "@/app/matches/[id]/GetNewAnanlysis";
import Match from "./MatchModel";
import MatchDetails from "../match-details/MatchDetailsModel";
import mongoose from "mongoose";
// import moment from "moment-timezone";
import moment from "moment";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const timezone = body?.timezone || "UTC";

    const fromDate = body?.fromDate ? moment(body.fromDate) : moment();
    // const base = body?.fromDate
    //   ? moment.tz(body?.fromDate, timezone)
    //   : moment.tz(timezone);

    const base = body?.fromDate ? moment(body?.fromDate) : moment();

    const todayStart = base.startOf("day").toDate();
    const todayEnd = base.endOf("day").toDate();

    /* ================= DB MATCHES ================= */

    const dbMatches = await Match.aggregate([
      {
        $match: {
          formatDate: { $gte: todayStart, $lte: todayEnd },
        },
      },
      { $sort: { formatDate: 1, startTime: 1 } },
    ]);

    const filteredDbMatches = dbMatches.filter((match: any) => {
      if (!match?.teams?.length) return false;
      return (
        match.teams[0]?.teamName !== "Team 1 (TBC)" &&
        match.teams[1]?.teamShortName !== "Team"
      );
    });

    /* ================= CREX ================= */

    const crexRaw = await CrexList();

    const crexMap = new Map<string, any>();
    crexRaw.forEach((item: any) => {
      const normalizedUrl = NormalizeCrexUrl(item.url);
      crexMap.set(normalizedUrl, {
        ...item,
        url: normalizedUrl,
      });
    });

    /* ================= BUCKETS ================= */

    const upcoming: any[] = [];
    const live: any[] = [];
    const completed: any[] = [];

    const now = moment();

    /* ================= MAIN LOOP ================= */

    await Promise.all(
      filteredDbMatches.map(async (match: any) => {
        try {
          const crexMatch = crexMap.get(match.url);

          const matchDateTime = moment(
            `${match.matchDate} ${match.startTime}`,
            "ddd, DD MMM YYYY h:mm A",
          );

          // const matchDateTime = moment
          //   .utc(
          //     `${match.matchDate} ${match.startTime}`,
          //     "ddd, DD MMM YYYY h:mm A",
          //   )
          //   .tz(timezone);

          let scoreCard: any = null;
          let result = "";
          let analysis: any = null;

          /* ================= CHECK COMPLETED FIRST ================= */

          if (matchDateTime.isBefore(now)) {
            const scoreCardUrl = match.url.replace(
              /\/info(\/)?$/i,
              "/scorecard",
            );

            scoreCard = await CrexMatchScorecard(scoreCardUrl);
            result = scoreCard?.result?.toLowerCase() ?? "";
          }

          /* ================= PREPARE UPDATED TEAMS ================= */

          const updatedTeams = (match.teams ?? []).map((dbTeam: any) => {
            const scTeam = scoreCard?.teams?.find(
              (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
            );

            return {
              ...dbTeam,
              teamShortName: scTeam?.name ?? dbTeam.teamShortName,
              cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
            };
          });

          /* ================= GET ANALYSIS (ONLY IF DETAILS EXIST) ================= */

          const details = await MatchDetails.findOne({
            matchId: new mongoose.Types.ObjectId(match._id),
          });

          if (details) {
            analysis = await GetNewAnalysis({
              ...details,
              squads: details.squads,
              matchInfo: match,
            });
          }

          const basePayload = {
            ...match,
            matchDate: matchDateTime.format("ddd, DD MMM YYYY"),
            startTime: matchDateTime.format("hh:mm A"),
            matchDateTimeUser: matchDateTime.format("DD MMM YYYY, hh:mm A"),
            teams: updatedTeams,
            score: scoreCard
              ? {
                  score: (scoreCard.teams ?? []).map((t: any) => ({
                    team: t.name,
                    run: `${t.score} (${t.overs})`,
                  })),
                  result: scoreCard?.result ?? "",
                }
              : null,
            prediction: analysis
              ? {
                  team1: analysis.team1,
                  team2: analysis.team2,
                }
              : null,
          };

          /* ================= COMPLETED ================= */

          if (result.includes("abandoned")) {
            completed.push({
              ...basePayload,
              status: "ABANDONED",
            });
            return;
          }

          if (result.includes("won")) {
            completed.push({
              ...basePayload,
              status: "COMPLETED",
            });
            return;
          }

          /* ================= LIVE ================= */

          if (crexMatch?.status === "LIVE") {
            live.push({
              ...basePayload,
              status: "LIVE",
              score: crexMatch?.score ?? basePayload.score,
            });
            return;
          }

          /* ================= UPCOMING ================= */

          if (matchDateTime.isAfter(now)) {
            upcoming.push({
              ...basePayload,
              status: "UPCOMING",
            });
            return;
          }

          /* ================= FALLBACK LIVE ================= */

          live.push({
            ...basePayload,
            status: "LIVE",
          });
        } catch (innerError) {
          console.error("Match process error:", innerError);
        }
      }),
    );

    /* ================= RESPONSE ================= */
    const sortedUpcoming = upcoming.sort((a, b) =>
      moment(a.matchDateTimeUser, "DD MMM YYYY, hh:mm A").diff(
        moment(b.matchDateTimeUser, "DD MMM YYYY, hh:mm A"),
      ),
    );

    const sortedLive = live.sort((a, b) =>
      moment(a.matchDateTimeUser, "DD MMM YYYY, hh:mm A").diff(
        moment(b.matchDateTimeUser, "DD MMM YYYY, hh:mm A"),
      ),
    );
    const sortedCompleted = completed.sort((a, b) =>
      moment(b.matchDateTimeUser, "DD MMM YYYY, hh:mm A").diff(
        moment(a.matchDateTimeUser, "DD MMM YYYY, hh:mm A"),
      ),
    );

    return Response.json(
      {
        data: [...sortedUpcoming, ...sortedLive, ...sortedCompleted],
        date: moment(fromDate).format("DD-MM-YYYY"),
        success: true,
        message: "Schedule fetched successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
}
