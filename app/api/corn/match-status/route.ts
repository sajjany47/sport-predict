// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "../../db";
// import { FormatErrorMessage } from "@/lib/utils";
// import moment from "moment-timezone";
// import Match from "../../schedule/MatchModel";
// import MatchDetails from "../../match-details/MatchDetailsModel";
// import { SquadList } from "../../match-details/SquadList";
// import mongoose from "mongoose";

// const CHUNK_SIZE = 10;

// export const GET = async (_req: NextRequest) => {
//   await dbConnect();

//   try {
//     console.log("CRON HIT ✅", new Date().toISOString());
//     const cutoffDate = moment()
//       .tz("Asia/Kolkata")
//       .subtract(1, "days")
//       .format("YYYY-MM-DD");
//     /* ================= FETCH UNPROCESSED MATCHES ================= */

//     const fixtures = await Match.find({
//       formatDate: { $gte: cutoffDate },
//       isPlayingPlayerFetched: false,
//     }).lean();

//     if (!fixtures.length) {
//       return NextResponse.json({
//         success: true,
//         message: "No fixtures found",
//       });
//     }

//     /* ================= FILTER ONLY STARTED MATCHES ================= */

//     const startedMatches = fixtures.filter((match: any) => {
//       if (!match.matchDate || !match.startTime) return false;

//       const matchStartDateTime = moment(
//         `${match.matchDate} ${match.startTime}`,
//         "ddd, D MMM YYYY h:mm A",
//       ).tz("Asia/Kolkata");

//       return matchStartDateTime.isSameOrBefore(moment().tz("Asia/Kolkata"));
//     });

//     if (!startedMatches.length) {
//       return NextResponse.json({
//         success: true,
//         message: "No matches started yet",
//       });
//     }

//     let processed = 0;

//     /* ================= CHUNK PROCESSING ================= */

//     for (let i = 0; i < startedMatches.length; i += CHUNK_SIZE) {
//       const chunk = startedMatches.slice(i, i + CHUNK_SIZE);

//       const matchBulkOps: any[] = [];

//       for (const match of chunk) {
//         // console.log("Processing match:", (match as any)._id);
//         try {
//           const matchDetails = await MatchDetails.findOne({
//             matchId: new mongoose.Types.ObjectId((match as any)._id.toString()),
//           });

//           if (!matchDetails?.squads?.length) continue;

//           const latestSquad = await SquadList(match.url, matchDetails.squads);

//           // Update squads
//           await MatchDetails.updateOne(
//             {
//               matchId: new mongoose.Types.ObjectId(
//                 (match as any)._id.toString(),
//               ),
//             },
//             { $set: { squads: latestSquad } },
//           );

//           // Mark match as processed
//           matchBulkOps.push({
//             updateOne: {
//               filter: { _id: match._id },
//               update: {
//                 $set: {
//                   isPlayingPlayerFetched: true,
//                   playingXiFetchedAt: new Date(),
//                 },
//               },
//             },
//           });

//           processed++;
//         } catch (err) {
//           console.error("❌ Squad update failed:", match.url);
//         }
//       }

//       if (matchBulkOps.length) {
//         await Match.bulkWrite(matchBulkOps);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       totalFound: fixtures.length,
//       startedMatches: startedMatches.length,
//       processed,
//     });
//   } catch (error: any) {
//     console.error("CRON ERROR ❌", error);

//     return NextResponse.json(
//       { success: false, error: FormatErrorMessage(error) },
//       { status: 500 },
//     );
//   }
// };

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import moment from "moment-timezone";
import Match from "../../schedule/MatchModel";
import MatchDetails from "../../match-details/MatchDetailsModel";
import { SquadList } from "../../match-details/SquadList";
import mongoose from "mongoose";
import { getRequestNowUTC } from "@/lib/time/requestNowUTC";

const CHUNK_SIZE = 10;

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    console.log("CRON / MANUAL HIT ✅", new Date().toISOString());

    // =====================================================
    // Detect caller timezone (optional)
    // =====================================================
    const timezone = req.headers.get("x-timezone");
    const nowUtc = getRequestNowUTC(timezone);

    console.log("Timezone:", timezone || "UTC");
    console.log("UTC Used:", nowUtc.toISOString());

    // =====================================================
    // UTC Cutoff Date (1 day back)
    // =====================================================
    const cutoffDate = moment.utc().subtract(1, "days").startOf("day").toDate();

    // =====================================================
    // Fetch matches not processed yet
    // =====================================================
    const fixtures = await Match.find({
      formatDate: { $gte: cutoffDate },
      isPlayingPlayerFetched: false,
    }).lean();

    if (!fixtures.length) {
      return NextResponse.json({
        success: true,
        message: "No fixtures found",
      });
    }

    // =====================================================
    // Check match started (PURE UTC COMPARISON)
    // =====================================================
    const startedMatches = fixtures.filter((match: any) => {
      if (!match.formatDate) return false;
      return new Date(match.formatDate) <= nowUtc;
    });

    if (!startedMatches.length) {
      return NextResponse.json({
        success: true,
        message: "No matches started yet",
      });
    }

    let processed = 0;

    // =====================================================
    // CHUNK PROCESSING
    // =====================================================
    for (let i = 0; i < startedMatches.length; i += CHUNK_SIZE) {
      const chunk: any = startedMatches.slice(i, i + CHUNK_SIZE);
      const matchBulkOps: any[] = [];

      for (const match of chunk) {
        try {
          const matchDetails = await MatchDetails.findOne({
            matchId: new mongoose.Types.ObjectId(match._id.toString()),
          });

          if (!matchDetails?.squads?.length) continue;

          const latestSquad = await SquadList(match.url, matchDetails.squads);

          // Update squads
          await MatchDetails.updateOne(
            { matchId: new mongoose.Types.ObjectId(match._id.toString()) },
            { $set: { squads: latestSquad } },
          );

          // Mark match processed
          matchBulkOps.push({
            updateOne: {
              filter: { _id: match._id },
              update: {
                $set: {
                  isPlayingPlayerFetched: true,
                  playingXiFetchedAt: new Date(), // UTC always
                },
              },
            },
          });

          processed++;
        } catch (err) {
          console.error("❌ Squad update failed:", match.url);
        }
      }

      if (matchBulkOps.length) {
        await Match.bulkWrite(matchBulkOps);
      }
    }

    // =====================================================
    // RESPONSE
    // =====================================================
    return NextResponse.json({
      success: true,
      totalFound: fixtures.length,
      startedMatches: startedMatches.length,
      processed,
      usedUtcTime: nowUtc.toISOString(),
    });
  } catch (error: any) {
    console.error("CRON ERROR ❌", error);

    return NextResponse.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
