import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import { CrexList } from "./CrexList";
import dbConnect from "../db";
import { CrexMatchScorecard } from "./CrexScore";
import { GetNewAnalysis } from "@/app/matches/[id]/GetNewAnanlysis";
import Match from "./MatchModel";
import MatchDetails from "../match-details/MatchDetailsModel";
import mongoose from "mongoose";
import moment from "@/lib/moment";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    const fromDate = body?.fromDate ? moment(body.fromDate) : moment();

    const todayStart = moment(fromDate).startOf("day").toDate();
    const todayEnd = moment(fromDate).endOf("day").toDate();

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

    return Response.json(
      {
        data: [...upcoming, ...live, ...completed],
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

// import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
// import { CrexList } from "./CrexList";
// import dbConnect from "../db";
// import { CrexMatchScorecard } from "./CrexScore";
// import { GetNewAnalysis } from "@/app/matches/[id]/GetNewAnanlysis";
// import Match from "./MatchModel";
// import MatchDetails from "../match-details/MatchDetailsModel";
// import mongoose from "mongoose";
// import moment from "moment-timezone";

// import {
//   getUserTimezone,
//   getUserDayUtcRange,
//   utcToUser,
//   getMatchStatus,
// } from "@/lib/time/timezone";

// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const body = await request.json();

//     /* ======================================================
//        🌍 USER TIMEZONE
//     ====================================================== */
//     const userTimezone = getUserTimezone(body, request);

//     /* ======================================================
//        📅 USER DAY RANGE → UTC
//     ====================================================== */
//     const { startUtc, endUtc, userMoment } = getUserDayUtcRange(
//       body?.fromDate,
//       userTimezone,
//     );

//     /* ======================================================
//        🧠 FETCH MATCHES (WIDE RANGE FOR RUNNING MATCHES)
//     ====================================================== */
//     const dbMatches = await Match.aggregate([
//       {
//         $match: {
//           formatDate: {
//             $gte: moment(startUtc).subtract(12, "hours").toDate(),
//             $lte: moment(endUtc).add(12, "hours").toDate(),
//           },
//         },
//       },
//       { $sort: { formatDate: 1 } },
//     ]);

//     /* ======================================================
//        CREX LIVE STATUS MAP
//     ====================================================== */
//     const crexRaw = await CrexList();

//     const crexMap = new Map<string, any>();
//     crexRaw.forEach((item: any) => {
//       crexMap.set(NormalizeCrexUrl(item.url), item);
//     });

//     /* ======================================================
//        RESULT BUCKETS
//     ====================================================== */
//     const upcoming: any[] = [];
//     const live: any[] = [];
//     const completed: any[] = [];

//     /* ======================================================
//        MAIN LOOP
//     ====================================================== */
//     await Promise.all(
//       dbMatches.map(async (match: any) => {
//         try {
//           // ensure same user day
//           const isSameDay = moment
//             .utc(match.formatDate)
//             .tz(userTimezone)
//             .isSame(userMoment, "day");

//           if (!isSameDay) return;

//           const crexMatch = crexMap.get(match.url);
//           const userTime = utcToUser(match.formatDate, userTimezone);

//           let scoreCard: any = null;
//           let result = "";

//           /* ===== SCORECARD FETCH ONLY IF STARTED ===== */
//           if (moment.utc(match.formatDate).isBefore(moment.utc())) {
//             const scoreUrl = match.url.replace(/\/info(\/)?$/i, "/scorecard");
//             scoreCard = await CrexMatchScorecard(scoreUrl);
//             result = scoreCard?.result ?? "";
//           }

//           /* ===== TEAMS UPDATE ===== */
//           const updatedTeams = (match.teams ?? []).map((dbTeam: any) => {
//             const scTeam = scoreCard?.teams?.find(
//               (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
//             );

//             return {
//               ...dbTeam,
//               teamShortName: scTeam?.name ?? dbTeam.teamShortName,
//               cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
//             };
//           });

//           /* ===== ANALYSIS ===== */
//           let prediction = null;
//           const details = await MatchDetails.findOne({
//             matchId: new mongoose.Types.ObjectId(match._id),
//           });

//           if (details) {
//             const analysis = await GetNewAnalysis({
//               ...details,
//               squads: details.squads,
//               matchInfo: match,
//             });

//             prediction = analysis
//               ? { team1: analysis.team1, team2: analysis.team2 }
//               : null;
//           }

//           /* ===== STATUS ENGINE ===== */
//           const status = getMatchStatus(
//             match.formatDate,
//             crexMatch?.status,
//             result,
//           );

//           const payload = {
//             ...match,
//             matchDate: userTime.matchDate,
//             startTime: userTime.startTime,
//             matchDateTimeUser: userTime.matchDateTime,
//             teams: updatedTeams,
//             status,
//             prediction,
//             score: scoreCard
//               ? {
//                   score: (scoreCard.teams ?? []).map((t: any) => ({
//                     team: t.name,
//                     run: `${t.score} (${t.overs})`,
//                   })),
//                   result: scoreCard?.result ?? "",
//                 }
//               : null,
//           };

//           if (status === "UPCOMING") upcoming.push(payload);
//           else if (status === "LIVE") live.push(payload);
//           else completed.push(payload);
//         } catch (err) {
//           console.error("Match process error:", err);
//         }
//       }),
//     );

//     return Response.json({
//       success: true,
//       timezone: userTimezone,
//       date: userMoment.format("DD-MM-YYYY"),
//       data: [...upcoming, ...live, ...completed],
//       message: "Schedule fetched successfully",
//     });
//   } catch (error: any) {
//     console.error(error);
//     return Response.json(
//       { success: false, error: FormatErrorMessage(error) },
//       { status: 500 },
//     );
//   }
// }
