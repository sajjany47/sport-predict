/* =========================
   Utility Helpers
========================= */

const safe = (value: number): number =>
  Number.isFinite(value) && !Number.isNaN(value) ? value : 0;

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

const squadAnanlysis = (team: any) => {
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

  // /* Normalize to T20 (120 balls) */
  // const runRate = safe(teamRuns / teamBallsFaced);
  // let predictedScore = safe(runRate * 120);

  // /* Clamp realistic T20 scores */
  // predictedScore = Math.max(120, Math.min(220, Math.round(predictedScore)));

  // return {
  //   teamName: team.teamName,
  //   predictedFirstInningsScore: predictedScore,
  //   estimatedRunRate: safe(predictedScore / 20),
  // };

  return {
    teamRuns,
    teamBallsFaced,
    teamRunsConced,
    teamWicket,
  };
};

/* =========================
   Match Analysis Wrapper
========================= */

export const GetNewAnalysis = async (data: any) => {
  const teamA = data.squads[0];
  const teamB = data.squads[1];

  const teamAScore = squadAnanlysis(teamA);
  const teamBScore = squadAnanlysis(teamB);

  return {
    teamA: teamAScore,
    teamB: teamBScore,
  };
};
