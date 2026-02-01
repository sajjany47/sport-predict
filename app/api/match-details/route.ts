import { NextRequest } from "next/server";
import { FormatErrorMessage } from "@/lib/utils";

import dbConnect from "../db";

import { CrexV2Details } from "./CrexV2Details";
import MatchList from "../corn/daily-match-list/DailyMatchListModel";
import mongoose from "mongoose";
import { SquadList } from "./SquadList";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();

    const findMatch = await MatchList.findOne({
      _id: new mongoose.Types.ObjectId(body._id),
    });

    if (!findMatch) {
      return Response.json(
        { success: false, message: "Match not found" },
        { status: 404 },
      );
    }

    if (findMatch.details) {
      const latestSquad = await SquadList(
        findMatch.url,
        findMatch.details.squads,
      );

      return Response.json(
        {
          data: {
            ...findMatch.details,
            squads: latestSquad,
          },
        },
        { status: 200 },
      );
    } else {
      const crexOverallStats: any = body.url
        ? await CrexV2Details(body.url)
        : null;

      const cleanedSquads = crexOverallStats.squads.map((team: any) => ({
        ...team,
        playingPlayers: (team.playingPlayers ?? []).map((player: any) => ({
          ...player,
          careerStats: {
            ...player.careerStats,
            bowling: (player.careerStats?.bowling ?? []).filter(
              (item: any) => !item.format?.toLowerCase().includes("debut"),
            ),
          },
        })),
        benchPlayers: (team.benchPlayers ?? []).map((player: any) => ({
          ...player,
          careerStats: {
            ...player.careerStats,
            bowling: (player.careerStats?.bowling ?? []).filter(
              (item: any) => !item.format?.toLowerCase().includes("debut"),
            ),
          },
        })),
      }));

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
  } catch (error: any) {
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
}
