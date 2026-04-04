import { NextResponse } from "next/server";
import dbConnect from "../../db";
import Match from "../../schedule/MatchModel";
import moment from "moment";
import { FormatErrorMessage } from "@/lib/utils";

export const GET = async () => {
  await dbConnect();

  try {
    // ✅ last 7 days filter
    const last7Days = moment().subtract(7, "days").toDate();

    const recentMatches = await Match.find({
      status: "COMPLETED",
      isCompleted: true,
      prediction: { $ne: null },
      formatDate: { $gte: last7Days }, // 🔥 main fix
    }).lean();

    let pass = 0;
    let fail = 0;

    for (const match of recentMatches) {
      let actualWinner = null;
      let predictedWinner = null;

      /* ================= ACTUAL WINNER ================= */

      const resultText =
        match.matchResult?.toLowerCase() ||
        match.score?.result?.toLowerCase() ||
        "";

      if (resultText && match.teams?.length) {
        const winningTeam = match.teams.find(
          (team: any) =>
            resultText.includes(team.teamName?.toLowerCase()) ||
            resultText.includes(team.teamShortName?.toLowerCase())
        );

        actualWinner = winningTeam?.teamShortName || null;
      }

      /* ================= PREDICTED WINNER ================= */

      if (match.prediction?.team1 && match.prediction?.team2) {
        const t1 = match.prediction.team1;
        const t2 = match.prediction.team2;

        predictedWinner =
          t1.winnerPrediction.probability >
            t2.winnerPrediction.probability
            ? t1.shortName
            : t2.shortName;
      }

      /* ================= RESULT ================= */

      if (actualWinner && predictedWinner) {
        if (actualWinner === predictedWinner) {
          pass++;
        } else {
          fail++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        pass,
        fail,
        total: pass + fail,
        accuracy:
          pass + fail > 0
            ? ((pass / (pass + fail)) * 100).toFixed(2) + "%"
            : "0%",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};