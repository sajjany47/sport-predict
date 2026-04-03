import { NextRequest } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../db";
import { FormatErrorMessage } from "@/lib/utils";
import { SquadList } from "./SquadList";
import MatchDetails from "./MatchDetailsModel";
// import { TeamRank } from "./TeamRank";
import Match from "../schedule/MatchModel";
import { ExtractMatchDetails } from "./ExtractMatchDetails";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();

    // ✅ Validate Match ID
    if (!body?._id) {
      return Response.json(
        { success: false, error: "Match id required" },
        { status: 400 },
      );
    }

    const matchId = new mongoose.Types.ObjectId(body._id);

    // ✅ Find Match
    const [findMatch] = await MatchDetails.aggregate([
      { $match: { matchId: matchId } },
      {
        $lookup: {
          from: "matches",
          localField: "matchId",
          foreignField: "_id",
          as: "match",
        },
      },
      {
        $unwind: {
          path: "$match",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    /**
     * ===============================
     * PREPARE TEAM WITH RANK
     * ===============================
     */

    // const matchFormat = body?.format;

    // const prepareTeam = await Promise.all(
    //   (body?.teams ?? []).map(async (team: any) => {
    //     const teamRank = await TeamRank(
    //       team.teamName,
    //       team.teamName?.includes("Women") ? "WOMEN" : "MEN",
    //       matchFormat,
    //     );

    //     return {
    //       ...team,
    //       teamRank,
    //     };
    //   }),
    // );

    const matchInfo = {
      ...body,
      // teams: prepareTeam,
    };

    /**
     * ===============================
     * IF MATCH NOT FOUND → SCRAPE
     * ===============================
     */

    if (!findMatch) {
      const crexOverallStats: any = await ExtractMatchDetails(body.url);

      const insertMatchDetails = await MatchDetails.insertOne({
        matchId: matchId,
        ...crexOverallStats,
        updatedAt: new Date(),
      });

      if (insertMatchDetails) {
        await Match.updateOne(
          { _id: matchId },
          {
            $set: {
              isPlayingPlayerFetched:
                crexOverallStats.squads[0]?.playingPlayers?.length > 0 &&
                crexOverallStats.squads[1]?.playingPlayers?.length > 0
                  ? true
                  : false,
              isDetailsFetched: true,
              detailsFetchedAt: new Date(),
            },
          },
        );
      }

      return Response.json(
        {
          data: {
            ...crexOverallStats,
            matchInfo,
          },
        },
        { status: 200 },
      );
    }

    /**
     * ===============================
     * IF MATCH FOUND
     * ===============================
     */

    if (findMatch?.match?.isPlayingPlayerFetched) {
      return Response.json(
        {
          data: {
            ...findMatch,
            matchInfo,
          },
        },
        { status: 200 },
      );
    }

    // 🔄 Fetch Latest Squad
    const latestSquad = await SquadList(
      `${body.url}/match-details`,
      findMatch?.squads,
    );

    await Match.updateOne(
      { _id: matchId },
      {
        $set: {
          isPlayingPlayerFetched:
            latestSquad[0]?.playingPlayers?.length > 0 &&
            latestSquad[1]?.playingPlayers?.length > 0
              ? true
              : false,
          isDetailsFetched: true,
          detailsFetchedAt: new Date(),
        },
      },
    );

    return Response.json(
      {
        data: {
          ...findMatch,
          squads: latestSquad,
          matchInfo,
        },
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
