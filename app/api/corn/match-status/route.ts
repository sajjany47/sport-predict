import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, GetTeamShortName } from "@/lib/utils";
import moment from "moment";
import Match from "../../schedule/MatchModel";
import MatchDetails from "../../match-details/MatchDetailsModel";
import { SquadList } from "../../match-details/SquadList";
import { CrexMatchScorecard } from "../../schedule/CrexScore";
import { ExtractMatchDetails } from "../../match-details/ExtractMatchDetails";
import { Prediction } from "../../order/Prediction";

export const GET = async (_req: NextRequest) => {
  await dbConnect();

  try {
    console.log("CRON HIT ✅", new Date());

    const now = moment();

    const fixtures = await Match.find({
      isCompleted: true,
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
          const details = await ExtractMatchDetails(`${match.url}`);

          if (details) {
            const analysis = await Prediction({
              ...details,
              matchInfo: match,
            });
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
                  isPlayingPlayerFetched:
                    details?.squads[0]?.playingPlayers?.length > 0 &&
                    details?.squads[1]?.playingPlayers?.length > 0
                      ? true
                      : false,
                  prediction: analysis,
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
            const latestSquad = await SquadList(
              `${match.url}/match-details`,
              matchDetails.squads,
            );

            const analysis = await Prediction({
              ...matchDetails,
              squads: latestSquad,
              matchInfo: match,
            });

            await MatchDetails.updateOne(
              { matchId: match._id },
              {
                $set: {
                  squads: latestSquad,
                },
              },
            );

            await Match.updateOne(
              { _id: match._id },
              {
                $set: {
                  prediction: analysis,
                  isPlayingPlayerFetched: true,
                  updatedAt: new Date(),
                },
              },
            );
          }
        }

        /* ================= SCORECARD ================= */

        // const scoreCardUrl = match.url.replace(/\/info(\/)?$/i, "/scorecard");
        const scoreCardUrl = `${match.url}/match-scorecard`;

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
