import { NextRequest } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../db";
import { FormatErrorMessage } from "@/lib/utils";

import { CrexV2Details } from "./CrexV2Details";
import { SquadList } from "./SquadList";
import MatchDetails from "./MatchDetailsModel";

const cleanPlayer = (player: any) => ({
  ...player,
  careerStats: {
    ...player.careerStats,
    bowling: (player.careerStats?.bowling ?? []).filter(
      (item: any) => !item.format?.toLowerCase().includes("debut"),
    ),
  },
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();

    if (!body?._id) {
      return Response.json(
        { success: false, error: "Match id required" },
        { status: 400 },
      );
    }

    const matchId = new mongoose.Types.ObjectId(body._id);

    const [findMatch] = await MatchDetails.aggregate([
      { $match: { _id: matchId } },
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
      { $limit: 1 },
    ]);

    /**
     * ===============================
     * IF MATCH NOT FOUND → SCRAPE
     * ===============================
     */
    if (!findMatch) {
      if (!body?.url) {
        return Response.json(
          { success: false, error: "Match url required" },
          { status: 400 },
        );
      }

      const crexOverallStats: any = await CrexV2Details(body.url);

      const cleanedSquads = (crexOverallStats?.squads ?? []).map(
        (team: any) => ({
          ...team,
          playingPlayers: (team.playingPlayers ?? []).map(cleanPlayer),
          benchPlayers: (team.benchPlayers ?? []).map(cleanPlayer),
        }),
      );

      return Response.json(
        {
          data: {
            ...crexOverallStats,
            squads: cleanedSquads,
          },
        },
        { status: 200 },
      );
    }

    /**
     * ===============================
     * IF MATCH FOUND → UPDATE SQUAD
     * ===============================
     */
    const latestSquad = await SquadList(findMatch.match?.url, findMatch.squads);

    return Response.json(
      {
        data: {
          ...findMatch,
          squads: latestSquad,
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
