/* =========================
   Utility Helpers
========================= */

const safe = (value: number): number =>
  Number.isFinite(value) && !Number.isNaN(value) ? value : 0;

type MatchOverConfig = {
  totalOvers: number; // overs
  ballsPerInnings: number; // total balls
  bowlerOverLimit: number; // overs
};

const matchOver = (description: string): MatchOverConfig => {
  const text = description.toLowerCase();

  /* ---------- TEST ---------- */
  if (text.includes("test")) {
    return {
      totalOvers: 90,
      ballsPerInnings: 90 * 6,
      bowlerOverLimit: 30,
    };
  }

  /* ---------- ODI ---------- */
  if (text.includes("odi")) {
    return {
      totalOvers: 50,
      ballsPerInnings: 50 * 6,
      bowlerOverLimit: 10,
    };
  }

  /* ---------- T20 ---------- */
  if (text.includes("t20")) {
    return {
      totalOvers: 20,
      ballsPerInnings: 20 * 6,
      bowlerOverLimit: 4,
    };
  }

  /* ---------- T10 ---------- */
  if (text.includes("t10")) {
    return {
      totalOvers: 10,
      ballsPerInnings: 10 * 6,
      bowlerOverLimit: 2,
    };
  }

  /* ---------- THE HUNDRED ---------- */
  if (text.includes("100") || text.includes("hundred")) {
    return {
      totalOvers: 20, // 100 balls = 20 overs
      ballsPerInnings: 100,
      bowlerOverLimit: 5, // 20 balls
    };
  }

  /* ---------- DEFAULT (T20 DOMESTIC) ---------- */
  return {
    totalOvers: 20,
    ballsPerInnings: 120,
    bowlerOverLimit: 4,
  };
};

const parseBattingScore = (score: string) => {
  const match = score?.match(/\d+/g);
  if (!match || match.length < 2) {
    return { runs: 0, balls: 0 };
  }

  return {
    runs: Number(match[0]),
    balls: Number(match[1]),
  };
};

/* =========================
   Player Batting Analysis
========================= */

const getPlayerBattingStats = (player: any) => {
  const batting = player?.recentForm?.batting ?? [];

  if (!batting.length) {
    return {
      avgRuns: 0,
      avgBalls: 0,
      strikeRate: 0,
      impactRuns: 0,
    };
  }

  let totalRuns = 0;
  let totalBalls = 0;

  batting.forEach((match: any) => {
    const { runs, balls } = parseBattingScore(match.score);
    totalRuns += runs;
    totalBalls += balls;
  });

  const matches = batting.length;

  const avgRuns = safe(totalRuns / matches);
  const avgBalls = safe(totalBalls / matches);
  const strikeRate = safe((avgRuns / avgBalls) * 100);

  /* Role impact */
  let roleMultiplier = 1;
  switch (player.role) {
    case "Batter":
      roleMultiplier = 1.15;
      break;
    case "All Rounder":
      roleMultiplier = 1.05;
      break;
    case "Bowler":
      roleMultiplier = 0.7;
      break;
    default:
      roleMultiplier = 1;
  }

  const impactRuns = safe(avgRuns * roleMultiplier * (strikeRate / 100));

  return {
    avgRuns,
    avgBalls,
    strikeRate,
    impactRuns,
  };
};

/* =========================
   Player Bowling Analysis
========================= */

const getPlayerBowlingStats = (player: any) => {
  const bowling = player?.recentForm?.bowling ?? [];

  if (!bowling.length) {
    return {
      avgRunsConced: 0,
      avgWickets: 0,
      impactWickets: 0,
    };
  }

  let totalRuns = 0;
  let totalWickets = 0;
  let validMatches = 0;

  bowling.forEach((match: any) => {
    if (!match?.figures?.includes("-")) return;

    const [wickets, runs] = match.figures.split("-").map(Number);

    if (!Number.isFinite(wickets) || !Number.isFinite(runs)) return;

    totalRuns += runs;
    totalWickets += wickets;
    validMatches++;
  });

  if (validMatches === 0) {
    return {
      avgRunsConced: 0,
      avgWickets: 0,
      impactWickets: 0,
    };
  }

  const avgRunsConced = safe(totalRuns / validMatches);
  const avgWickets = safe(totalWickets / validMatches);

  /* Role impact */
  let roleMultiplier = 1;
  switch (player.role) {
    case "Batter":
      roleMultiplier = 0.6;
      break;
    case "All Rounder":
      roleMultiplier = 1.05;
      break;
    case "Bowler":
      roleMultiplier = 1.15;
      break;
  }

  /* Convert to impact wickets */
  const impactWickets = safe(avgWickets * roleMultiplier);

  return {
    avgRunsConced,
    avgWickets,
    impactWickets,
  };
};

/* =========================
   Team 1st Innings Prediction
========================= */

const squadAnanlysis = (team: any, matchDescription: string) => {
  const squad =
    team?.playingPlayers?.length > 0
      ? team.playingPlayers
      : (team?.benchPlayers ?? []);

  let teamRuns = 0;
  let teamBallsFaced = 0;

  let teamRunsConced = 0;
  let teamWicket = 0;

  squad.forEach((player: any, index: number) => {
    const battingStats = getPlayerBattingStats(player);
    const bowlingStats = getPlayerBowlingStats(player);

    teamRuns += safe(battingStats.impactRuns);
    teamBallsFaced += safe(battingStats.avgBalls);

    teamRunsConced += safe(bowlingStats.avgRunsConced);
    teamWicket += safe(bowlingStats.impactWickets);
  });

  /* Normalize to T20 (120 balls) */
  const runRate = safe(teamRuns / teamBallsFaced);
  const findOver = matchOver(matchDescription);
  let predictedScore = safe(runRate * findOver.ballsPerInnings);

  let totalTeamRunsConced = safe((teamRunsConced / teamWicket) * 10);

  return {
    predictedScore,
    totalTeamRunsConced,
    teamWicket,
  };
};

/* =========================
   Match Analysis Wrapper
========================= */

export const GetNewAnalysis = async (data: any) => {
  const teamA = data.squads[0];
  const teamB = data.squads[1];

  const matchInfoTeamA = data.matchInfo.teams[0];
  const matchInfoTeamB = data.matchInfo.teams[1];

  const teamAScore = squadAnanlysis(teamA, data.matchInfo.matchDescription);
  const teamBScore = squadAnanlysis(teamB, data.matchInfo.matchDescription);

  let teamAPredictedScore =
    (teamAScore.predictedScore + teamBScore.totalTeamRunsConced) / 2 -
    teamBScore.teamWicket * 5;

  let teamBPredictedScore =
    (teamBScore.predictedScore + teamAScore.totalTeamRunsConced) / 2 -
    teamAScore.teamWicket * 5;

  if (
    data?.venueDetails?.stats?.avg1stInns &&
    data?.venueDetails?.stats?.avg2ndInns
  ) {
    const avg1st = Number(data.venueDetails.stats.avg1stInns);
    const avg2nd = Number(data.venueDetails.stats.avg2ndInns);

    const totalVenueAvgScore = (avg1st + avg2nd) / 2;

    teamAPredictedScore = (teamAPredictedScore + totalVenueAvgScore) / 2;
    teamBPredictedScore = (teamBPredictedScore + totalVenueAvgScore) / 2;
  }

  const response = {
    team1: {
      name: matchInfoTeamA.teamName,
      shortName: teamA.teamName,
      flag: matchInfoTeamA.teamFlagUrl,
      firstInningScore: {
        min: Math.round(teamAPredictedScore * 0.9),
        max: Math.round(teamAPredictedScore * 1.1),
        predicted: Math.round(teamAPredictedScore),
        wickets:
          Math.round(teamBScore.teamWicket * 0.4) > 10
            ? 10
            : Math.round(teamBScore.teamWicket * 0.4),
      },
      // winnerPrediction: {
      //   probability: teamAChance,
      //   confidence: GetConfidence(teamAChance),
      //   hint: {
      //     hintMessage: hintData.team1.message,
      //     badgeColor: hintData.team1.badgeColor,
      //     color: hintData.team1.color,
      //   },
      // },
      // topBatsman: team1TopBatsman
      //   ? {
      //       name: team1TopBatsman.name,
      //       image: team1TopBatsman.image,
      //       role: team1TopBatsman.role,
      //       batting: {
      //         totalRuns: CheckIntValue(
      //           team1TopBatsman.batting.totalRuns.toFixed(0),
      //         ),
      //         totalAvgStrikeRate: CheckIntValue(
      //           SafeDivide(
      //             team1TopBatsman.batting.totalRuns,
      //             team1TopBatsman.batting.totalAvgBallFaced,
      //           ) * 100,
      //         ),
      //         totalAvgBallFaced: CheckIntValue(
      //           team1TopBatsman.batting.totalAvgBallFaced.toFixed(0),
      //         ),
      //       },
      //     }
      //   : null,
      // topBowler: team1TopBowler
      //   ? {
      //       name: team1TopBowler.name,
      //       image: team1TopBowler.image,
      //       role: team1TopBowler.role,
      //       bowling: {
      //         totalAvgEconomy: team1TopBowler.bowling.totalAvgEconomy,
      //         totalAvgOvers: CheckIntValue(
      //           team1TopBowler.bowling.totalAvgOvers.toFixed(0),
      //         ),
      //         totalAvgWickets: CheckIntValue(
      //           team1TopBowler.bowling.totalAvgWickets.toFixed(0),
      //         ),
      //         totalAvgRunsConceded: CheckIntValue(
      //           team1TopBowler.bowling.totalAvgRunsConceded.toFixed(0),
      //         ),
      //       },
      //     }
      //   : null,
    },
    team2: {
      name: matchInfoTeamB.teamName,
      shortName: teamB.teamName,
      flag: matchInfoTeamB.teamFlagUrl,
      firstInningScore: {
        min: Math.round(teamBPredictedScore * 0.9),
        max: Math.round(teamBPredictedScore * 1.1),
        predicted: Math.round(teamBPredictedScore),
        wickets:
          Math.round(teamAScore.teamWicket * 0.6) > 10
            ? 10
            : Math.round(teamAScore.teamWicket * 0.4),
      },
      // winnerPrediction: {
      //   probability: teamBChance,
      //   confidence: GetConfidence(teamBChance),
      //   hint: {
      //     hintMessage: hintData.team2.message,
      //     badgeColor: hintData.team2.badgeColor,
      //     color: hintData.team2.color,
      //   },
      // },
      // topBatsman: team2TopBatsman
      //   ? {
      //       name: team2TopBatsman.name,
      //       image: team2TopBatsman.image,
      //       role: team2TopBatsman.role,
      //       batting: {
      //         totalRuns: CheckIntValue(
      //           team2TopBatsman.batting.totalRuns.toFixed(0),
      //         ),
      //         totalAvgStrikeRate: CheckIntValue(
      //           SafeDivide(
      //             team2TopBatsman.batting.totalRuns,
      //             team2TopBatsman.batting.totalAvgBallFaced,
      //           ) * 100,
      //         ),
      //         totalAvgBallFaced: CheckIntValue(
      //           team2TopBatsman.batting.totalAvgBallFaced.toFixed(0),
      //         ),
      //       },
      //     }
      //   : null,
      // topBowler: team2TopBowler
      //   ? {
      //       name: team2TopBowler.name,
      //       image: team2TopBowler.image,
      //       role: team2TopBowler.role,
      //       bowling: {
      //         totalAvgEconomy: team2TopBowler.bowling.totalAvgEconomy,
      //         totalAvgOvers: CheckIntValue(
      //           team2TopBowler.bowling.totalAvgOvers.toFixed(0),
      //         ),
      //         totalAvgWickets: CheckIntValue(
      //           team2TopBowler.bowling.totalAvgWickets.toFixed(0),
      //         ),
      //         totalAvgRunsConceded: CheckIntValue(
      //           team2TopBowler.bowling.totalAvgRunsConceded.toFixed(0),
      //         ),
      //       },
      //     }
      //   : null,
    },
  };

  return response;
};
