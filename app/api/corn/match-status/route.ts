import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, GetTeamShortName } from "@/lib/utils";
import moment from "moment";
import Match from "../../schedule/MatchModel";
import MatchDetails from "../../match-details/MatchDetailsModel";
import { SquadList } from "../../match-details/SquadList";
import mongoose from "mongoose";
import { CrexMatchScorecard } from "../../schedule/CrexScore";
import { CrexV2Details } from "../../match-details/CrexV2Details";

export const GET = async (_req: NextRequest) => {
  await dbConnect();

  try {
    console.log("CRON HIT ✅", new Date());

    const now = moment();

    const fixtures = await Match.find({
      isCompleted: false,
      formatDate: { $lte: now },
    }).lean();

    if (!fixtures.length) {
      return NextResponse.json({
        success: true,
        message: "No fixtures found",
      });
    }

    for (const match of fixtures) {
      try {
        console.log("Processing match:", match._id);

        /* ================= MATCH DETAILS ================= */

        if (!match.isDetailsFetched) {
          const details = await CrexV2Details(match.url);

          if (details) {
            await MatchDetails.updateOne(
              { matchId: match._id },
              {
                $set: {
                  ...details,
                  updatedAt: new Date(),
                },
              },
              { upsert: true },
            );

            await Match.updateOne(
              { _id: match._id },
              {
                $set: {
                  isDetailsFetched: true,
                  detailsFetchedAt: new Date(),
                },
              },
            );
          }
        }

        /* ================= PLAYING XI ================= */

        if (!match.isPlayingPlayerFetched) {
          const matchDetails = await MatchDetails.findOne({
            matchId: match._id,
          });

          if (matchDetails) {
            const latestSquad = await SquadList(match.url, matchDetails.squads);

            await MatchDetails.updateOne(
              { matchId: match._id },
              {
                $set: {
                  squads: latestSquad,
                  isPlayingPlayerFetched: true,
                  playingXiFetchedAt: new Date(),
                },
              },
            );
          }
        }

        /* ================= SCORECARD ================= */

        const scoreCardUrl = match.url.replace(/\/info(\/)?$/i, "/scorecard");

        const scoreCard = await CrexMatchScorecard(scoreCardUrl);

        const result = scoreCard?.result?.toLowerCase() ?? "";

        const updatedTeams = (match.teams ?? []).map((dbTeam: any) => {
          const scTeam = scoreCard?.teams?.find(
            (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
          );

          return {
            ...dbTeam,
            teamShortName: scTeam?.name ?? GetTeamShortName(dbTeam.teamName),
            cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
          };
        });

        const matchDateTime = moment(match.formatDate);

        const status = matchDateTime.isAfter(moment())
          ? "UPCOMING"
          : result.includes("abandoned")
            ? "ABANDONED"
            : result.includes("won") ||
                result.includes("match drawn") ||
                result.includes("no result")
              ? "COMPLETED"
              : "LIVE";

        await Match.updateOne(
          { _id: match._id },
          {
            $set: {
              isCompleted:
                result.includes("abandoned") ||
                result.includes("won") ||
                result.includes("match drawn") ||
                result.includes("no result"),
              teams: updatedTeams,
              status,
            },
          },
        );

        console.log("Match updated:", match._id);

        /* optional delay to avoid scraping block */

        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error("Match error:", match._id, err);
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Matches processed",
    });
  } catch (error) {
    console.error("CRON ERROR ❌", error);

    return NextResponse.json(
      {
        success: false,
        error: FormatErrorMessage(error),
      },
      { status: 500 },
    );
  }
};

// export const GET = async (_req: NextRequest) => {
//   await dbConnect();

//   try {
//     console.log("CRON HIT ✅", new Date());

//     const now = moment();

//     const fixtures = await Match.find({
//       isCompleted: false,
//       formatDate: { $lte: now },
//     });

//     if (!fixtures.length) {
//       return NextResponse.json({
//         success: true,
//         message: "No fixtures found",
//       });
//     }

//     const startedMatches = fixtures.filter((match: any) => {
//       if (!match.matchDate || !match.startTime) return false;

//       const matchStartDateTime = moment(
//         `${match.matchDate} ${match.startTime}`,
//         "ddd, DD MMM YYYY h:mm A",
//       );

//       return matchStartDateTime.isSameOrBefore(moment());
//     });

//     if (!startedMatches.length) {
//       return NextResponse.json({
//         success: true,
//         message: "No matches started yet",
//       });
//     }

//     for (const match of startedMatches) {
//       try {
//         /* ================= FETCH MATCH DETAILS ================= */

//         if (!match.isDetailsFetched) {
//           try {
//             const crexOverallStats = await CrexV2Details(match.url);
//             if (!crexOverallStats) continue;

//             const squads = (crexOverallStats.squads ?? []).map((team: any) => ({
//               ...team,
//               playingPlayers: (team.playingPlayers ?? []).map((p: any) => ({
//                 ...p,
//                 careerStats: {
//                   ...p.careerStats,
//                   bowling: (p.careerStats?.bowling ?? []).filter(
//                     (b: any) => !b.format?.toLowerCase().includes("debut"),
//                   ),
//                 },
//               })),
//               benchPlayers: (team.benchPlayers ?? []).map((p: any) => ({
//                 ...p,
//                 careerStats: {
//                   ...p.careerStats,
//                   bowling: (p.careerStats?.bowling ?? []).filter(
//                     (b: any) => !b.format?.toLowerCase().includes("debut"),
//                   ),
//                 },
//               })),
//             }));

//             await MatchDetails.insertOne({
//               matchId: match._id,
//               ...crexOverallStats,
//               squads,
//               updatedAt: new Date(),
//             });

//             await Match.updateOne(
//               { _id: match._id },
//               {
//                 $set: {
//                   isDetailsFetched: true,
//                   detailsFetchedAt: new Date(),
//                 },
//               },
//             );
//           } catch {
//             continue;
//           }
//         }

//         /* ================= PLAYING XI ================= */

//         if (!match.isPlayingPlayerFetched) {
//           const matchDetails = await MatchDetails.findOne({
//             matchId: match._id,
//           });

//           if (matchDetails) {
//             const latestSquad = await SquadList(match.url, matchDetails.squads);

//             await MatchDetails.updateOne(
//               { matchId: match._id },
//               {
//                 $set: {
//                   squads: latestSquad,
//                   isPlayingPlayerFetched: true,
//                   playingXiFetchedAt: new Date(),
//                 },
//               },
//             );
//           }
//         }

//         /* ================= SCORECARD ================= */

//         let scoreCard: any = null;

//         try {
//           const scoreCardUrl = match.url.replace(/\/info(\/)?$/i, "/scorecard");

//           scoreCard = await CrexMatchScorecard(scoreCardUrl);
//         } catch {
//           scoreCard = null;
//         }

//         const result = scoreCard?.result?.toLowerCase() ?? "";

//         const updatedTeams = (match.teams ?? []).map((dbTeam: any) => {
//           const scTeam = scoreCard?.teams?.find(
//             (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
//           );

//           return {
//             ...dbTeam,
//             teamShortName: scTeam?.name ?? GetTeamShortName(dbTeam.teamName),
//             cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
//           };
//         });

//         const matchDateTime = moment(match.formatDate);

//         const status = matchDateTime.isAfter(moment())
//           ? "UPCOMING"
//           : result.includes("abandoned")
//             ? "ABANDONED"
//             : result.includes("won") ||
//                 result.includes("match drawn") ||
//                 result.includes("no result")
//               ? "COMPLETED"
//               : "LIVE";

//         await Match.updateOne(
//           { _id: match._id },
//           {
//             $set: {
//               isCompleted:
//                 result.includes("abandoned") ||
//                 result.includes("won") ||
//                 result.includes("match drawn") ||
//                 result.includes("no result"),
//               teams: updatedTeams,
//               status,
//             },
//           },
//         );
//       } catch (err) {
//         console.error("Match processing error:", err);
//         continue;
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Match status updated successfully",
//     });
//   } catch (error: any) {
//     console.error("CRON ERROR ❌", error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: FormatErrorMessage(error),
//       },
//       { status: 500 },
//     );
//   }
// };
