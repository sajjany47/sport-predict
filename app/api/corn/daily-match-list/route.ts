import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import { CrexNext3DaysFixturesArray } from "../CrexNext3DayList";
import Match from "../../schedule/MatchModel";
import { CrexV2Details } from "../../match-details/CrexV2Details";
import MatchDetails from "../../match-details/MatchDetailsModel";
import mongoose from "mongoose";
// import moment from "moment-timezone";
import moment from "moment";
import { TeamRank } from "../../match-details/TeamRank";

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    console.log("CRON HIT ✅", new Date());

    // ---------------- DELETE OLD MATCHES ----------------
    const cutoffDate = moment().subtract(7, "days").format("YYYY-MM-DD");
    const fixtures = await CrexNext3DaysFixturesArray();

    // 1️⃣ Old matches list
    const oldMatchList = await Match.find(
      { formatDate: { $lte: cutoffDate } },
      { _id: 1 },
    );

    const matchIds = oldMatchList.map((m) => m._id);
    // 2️⃣ MatchDetails delete
    if (matchIds.length > 0) {
      await MatchDetails.deleteMany({
        matchId: { $in: matchIds },
      });
    }

    await Match.deleteMany({
      formatDate: { $lte: cutoffDate },
    });

    // ---------------- FETCH FIXTURES ----------------

    if (!fixtures?.length) {
      return NextResponse.json({ success: true, message: "No fixtures found" });
    }

    const filteredFixtureMatches = fixtures.filter((match: any) => {
      if (!match?.teams?.length) return false;
      return (
        match.teams[0]?.teamName !== "Team 1 (TBC)" &&
        match.teams[1]?.teamShortName !== "Team"
      );
    });

    // ---------------- UPSERT MATCHES ----------------

    for (let index = 0; index < filteredFixtureMatches.length; index++) {
      const match = filteredFixtureMatches[index];
      const url = NormalizeCrexUrl(match.url);
      const findMatch = await Match.findOne({ url });
      if (findMatch) {
        console.log("Match already exists, skipping:", url);
        continue;
      }
      const matchStartUTC = moment.utc(
        `${match.matchDate} ${match.startTime}`,
        "ddd, DD MMM YYYY h:mm A",
      );

      const prepareTeam = await Promise.all(
        (match?.teams ?? []).map(async (team: any) => {
          const teamRank = await TeamRank(
            team.teamName,
            team.teamName?.includes("Women") ? "WOMEN" : "MEN",
            match.format,
          );

          return {
            ...team,
            teamRank,
          };
        }),
      );

      await Match.insertOne({
        ...match,
        teams: prepareTeam,
        isCompleted: false,
        isPlayingPlayerFetched: false,
        isDetailsFetched: false,
        // formatDate: moment(match.matchDate, "ddd, DD MMM YYYY").format(
        //   "YYYY-MM-DD",
        // ),
        formatDate: matchStartUTC.toDate(),
        url,
        createdAt: new Date(),
      });
    }

    // ---------------- FETCH UNPROCESSED MATCHES ----------------
    const dbMatches = await Match.find({ isDetailsFetched: false });

    for (let index = 0; index < dbMatches.length; index++) {
      const match = dbMatches[index];
      try {
        const crexOverallStats = await CrexV2Details(match.url);

        if (!crexOverallStats) continue;

        const squads = (crexOverallStats.squads ?? []).map((team: any) => ({
          ...team,
          playingPlayers: (team.playingPlayers ?? []).map((p: any) => ({
            ...p,
            careerStats: {
              ...p.careerStats,
              bowling: (p.careerStats?.bowling ?? []).filter(
                (b: any) => !b.format?.toLowerCase().includes("debut"),
              ),
            },
          })),
          benchPlayers: (team.benchPlayers ?? []).map((p: any) => ({
            ...p,
            careerStats: {
              ...p.careerStats,
              bowling: (p.careerStats?.bowling ?? []).filter(
                (b: any) => !b.format?.toLowerCase().includes("debut"),
              ),
            },
          })),
        }));

        const insertMatchDetails = await MatchDetails.insertOne({
          matchId: match._id,
          ...crexOverallStats,
          squads,
          updatedAt: new Date(),
        });

        if (insertMatchDetails) {
          await Match.updateOne(
            { _id: new mongoose.Types.ObjectId(match._id) },
            {
              $set: {
                isDetailsFetched: true,
                detailsFetchedAt: new Date(),
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
        message: "Match list updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("CRON ERROR ❌", error);

    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
