import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
// import moment from "moment-timezone";
import moment from "moment";
import Match from "../../schedule/MatchModel";
import MatchDetails from "../../match-details/MatchDetailsModel";
import { SquadList } from "../../match-details/SquadList";
import mongoose from "mongoose";

const CHUNK_SIZE = 10;

export const GET = async (_req: NextRequest) => {
  await dbConnect();

  try {
    console.log("CRON HIT ✅", new Date());
    // const cutoffDate = moment()
    //   .tz("Asia/Kolkata")
    //   .subtract(1, "days")
    //   .format("YYYY-MM-DD");

    const cutoffDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    /* ================= FETCH UNPROCESSED MATCHES ================= */

    const fixtures = await Match.find({
      formatDate: { $gte: cutoffDate },
      isPlayingPlayerFetched: false,
      isDetailsFetched: true,
    });

    if (!fixtures.length) {
      return NextResponse.json({
        success: true,
        message: "No fixtures found",
      });
    }

    /* ================= FILTER ONLY STARTED MATCHES ================= */

    // const startedMatches = fixtures.filter((match: any) => {
    //   if (!match.matchDate || !match.startTime) return false;

    //   const matchStartDateTime = moment(
    //     `${match.matchDate} ${match.startTime}`,
    //     "ddd, D MMM YYYY h:mm A",
    //   ).tz("Asia/Kolkata");

    //   return matchStartDateTime.isSameOrBefore(moment().tz("Asia/Kolkata"));
    // });

    const startedMatches = fixtures.filter((match: any) => {
      if (!match.matchDate || !match.startTime) return false;

      const matchStartDateTime = moment(
        `${match.matchDate} ${match.startTime}`,
        "ddd, D MMM YYYY h:mm A",
      );

      return matchStartDateTime.isSameOrBefore(moment());
    });

    if (!startedMatches.length) {
      return NextResponse.json({
        success: true,
        message: "No matches started yet",
      });
    }

    for (let index = 0; index < startedMatches.length; index++) {
      const match = startedMatches[index];

      const matchDetails = await MatchDetails.findOne({
        matchId: new mongoose.Types.ObjectId(match._id.toString()),
      });

      const latestSquad = await SquadList(match.url, matchDetails.squads);

      try {
        const updateMatchDetails = await MatchDetails.updateOne(
          {
            matchId: new mongoose.Types.ObjectId(match._id.toString()),
          },
          { $set: { squads: latestSquad } },
        );
        if (updateMatchDetails) {
          await Match.updateOne(
            { _id: new mongoose.Types.ObjectId(match._id.toString()) },
            {
              $set: {
                isPlayingPlayerFetched: true,
                playingXiFetchedAt: new Date(),
              },
            },
          );
        }
      } catch (err) {
        if (err) continue;
      }
    }

    return Response.json(
      {
        success: true,
        message: "Match status updated successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("CRON ERROR ❌", error);

    return NextResponse.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
