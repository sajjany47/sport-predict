import { NextResponse } from "next/server";
import dbConnect from "../../db";
import Match from "../../schedule/MatchModel";
import { FormatErrorMessage } from "@/lib/utils";

export const GET = async () => {
  await dbConnect();
  try {
    // get last 15 completed matches that have a prediction, sort by most recent
    const recentMatches = await Match.find({
      status: "COMPLETED",
      prediction: { $ne: null }
    }).sort({ formatDate: -1 }).limit(15).lean();

    let pass = 0;
    let fail = 0;
    let evaluated = 0;

    for (const match of recentMatches) {
        if (evaluated >= 7) break;
        
        let actualWinner = null;
        let predictedWinner = null;
        
        // determine actual winner
        if (match.score?.result && match.teams?.length) {
            const result = match.score.result.toLowerCase();
            const winningTeam = match.teams.find((team: any) =>
                result.includes((team.teamName || "").toLowerCase()) ||
                result.includes((team.teamShortName || "").toLowerCase())
            );
            actualWinner = winningTeam?.teamShortName || null;
        }

        // determine predicted winner
        if (match.prediction?.team1 && match.prediction?.team2) {
            const t1 = match.prediction.team1;
            const t2 = match.prediction.team2;
            predictedWinner = t1.winnerPrediction.probability > t2.winnerPrediction.probability ? t1.shortName : t2.shortName;
        }

        if (actualWinner && predictedWinner) {
            if (actualWinner === predictedWinner) {
                pass++;
            } else {
                fail++;
            }
            evaluated++;
        }
    }

    return NextResponse.json({
        success: true,
        data: {
            pass,
            fail,
            total: evaluated
        }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: FormatErrorMessage(error) }, { status: 500 });
  }
};
