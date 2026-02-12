// import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
// import moment from "moment-timezone";
// import { CrexList } from "./CrexList";
// import dbConnect from "../db";
// import { CrexMatchScorecard } from "./CrexScore";
// import { GetNewAnalysis } from "@/app/matches/[id]/GetNewAnanlysis";
// import Match from "./MatchModel";
// import MatchDetails from "../match-details/MatchDetailsModel";
// import mongoose from "mongoose";

// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const body = await request.json();
//     const fromDate = body.fromDate
//       ? moment(body.fromDate).tz("Asia/Kolkata")
//       : moment().tz("Asia/Kolkata");

//     /* ================= DB MATCHES ================= */

//     const a = await Match.aggregate([
//       {
//         $match: {
//           formatDate: new Date(moment(fromDate).format("YYYY-MM-DD")),
//         },
//       },
//       {
//         $sort: {
//           formatDate: 1,
//           startTime: 1,
//         },
//       },
//     ]);

//     const dbMatches = a.filter((match: any) => {
//       const team1 = match.teams[0].teamName;
//       const team2 = match.teams[1].teamShortName;
//       const searchTermLower = "Team 1 (TBC)";

//       return team1 !== searchTermLower || team2 !== "Team";
//     });

//     /* ================= CREX MATCHES ================= */

//     const crexData = (await CrexList()).map((item: any) => ({
//       ...item,
//       matchDate: moment(item.matchDate, "ddd, DD MMM YYYY")
//         .tz("Asia/Kolkata")
//         .format("ddd, DD MMM YYYY"),
//       startTime: moment(item.startTime, "hh:mm A")
//         .tz("Asia/Kolkata")
//         .format("hh:mm A"),
//       url: NormalizeCrexUrl(item.url),
//     }));

//     // 🔥 Create lookup map (BIG performance win)
//     const crexMap = new Map<string, any>();
//     crexData.forEach((item: any) => crexMap.set(item.url, item));

//     /* ================= RESULT BUCKETS ================= */

//     const filterUpcomingMatches: any[] = [];
//     const filterLiveMatches: any[] = [];
//     const filterCompletedMatches: any[] = [];

//     /* ================= MAIN LOGIC ================= */

//     await Promise.all(
//       dbMatches.map(async (match: any) => {
//         const crexMatch = crexMap.get(match.url);

//         // 👉 CREX MATCH FOUND
//         if (crexMatch) {
//           /* ---------- UPCOMING ---------- */
//           if (crexMatch.status === "UPCOMING") {
//             filterUpcomingMatches.push(match);
//             return;
//           }

//           /* ---------- LIVE ---------- */
//           if (crexMatch.status === "LIVE") {
//             const updatedTeams = match.teams.map((dbTeam: any) => {
//               const liveTeam = crexMatch.teams.find(
//                 (t: any) => t.teamFlagUrl === dbTeam.teamFlagUrl,
//               );

//               return {
//                 ...dbTeam,
//                 teamShortName: liveTeam?.teamShortName ?? dbTeam.teamShortName,
//                 cricketScore: liveTeam?.cricketScore ?? null,
//               };
//             });

//             filterLiveMatches.push({
//               ...match,
//               status: "LIVE",
//               teams: updatedTeams,
//               score: crexMatch.score,
//             });
//             return;
//           }
//         }

//         // 👉 COMPLETED OR NO CREX DATA
//         const isUpcoming = moment(
//           `${match.matchDate} ${match.startTime}`,
//           "ddd, DD MMM YYYY h:mm A",
//         )
//           .tz("Asia/Kolkata")
//           .isAfter(moment().tz("Asia/Kolkata"));

//         let analysis: any = null;
//         if (isUpcoming) {
//           filterUpcomingMatches.push(match);
//           return;
//         } else {
//           const details = await MatchDetails.findOne({
//             matchId: new mongoose.Types.ObjectId(match._id),
//           });
//           const scoreCardUrl = match.url.replace(/\/info(\/)?$/i, "/scorecard");
//           const scoreCard: any = await CrexMatchScorecard(scoreCardUrl);
//           const result = scoreCard?.result?.toLowerCase() ?? "";

//           const updatedTeams = (match.teams ?? []).map((dbTeam: any) => {
//             const scTeam = (scoreCard?.teams ?? []).find(
//               (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
//             );

//             return {
//               ...dbTeam,
//               teamShortName: scTeam?.name ?? dbTeam?.teamShortName,
//               cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
//             };
//           });

//           if (details) {
//             // const latestSquad = await SquadList(match.url, details.squads);
//             analysis = await GetNewAnalysis({
//               ...details,
//               squads: details.squads,
//               matchInfo: match,
//             });
//           }

//           const basePayload = {
//             ...match,
//             teams: updatedTeams,
//             score: {
//               score: (scoreCard?.teams ?? []).map((t: any) => ({
//                 team: t.name,
//                 run: `${t.score} (${t.overs})`,
//               })),
//               result: scoreCard?.result ?? "",
//             },
//             prediction: analysis
//               ? { team1: analysis.team1, team2: analysis.team2 }
//               : null,
//           };
//           if (result.includes("abandoned")) {
//             filterCompletedMatches.push({
//               ...basePayload,
//               status: "ABANDONED",
//             });
//             return;
//           }

//           if (result.includes("won")) {
//             filterCompletedMatches.push({
//               ...basePayload,
//               status: "COMPLETED",
//             });
//             return;
//           }

//           // still live (no result yet)
//           filterLiveMatches.push({
//             ...basePayload,
//             status: "LIVE",
//           });
//         }

//         /* ---------- COMPLETED ---------- */

//         /* ================= FINAL STATUS ROUTING ================= */
//       }),
//     );

//     return Response.json(
//       {
//         // data: [...prepareData, ...completedWithScore],
//         data: [
//           ...filterUpcomingMatches,
//           ...filterLiveMatches,
//           ...filterCompletedMatches,
//         ],
//         date: moment(fromDate).format("DD-MM-YYYY"),
//         success: true,
//         message: "Schedule fetched successfully",
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     return Response.json(
//       { success: false, error: FormatErrorMessage(error) },
//       { status: 500 },
//     );
//   }
// }

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
