/* =========================
   Batting Analysis
========================= */

const getPlayerStats = (player: any) => {
  const batting = player?.recentForm?.batting || [];
  const bowling = player?.recentForm?.bowling || [];
  const role = player?.role;

  let totalRuns = 0;
  let totalBalls = 0;

  let totalRunConceded = 0;
  let totalWickets = 0;

  // Batting
  batting.forEach((item: any) => {
    const score = item.score;

    const runs = parseInt(score.split(" ")[0]);

    const ballsMatch = score.match(/\((\d+)\)/);
    const balls = ballsMatch ? parseInt(ballsMatch[1]) : 0;

    totalRuns += runs;
    totalBalls += balls;
  });

  // Bowling
  bowling.forEach((item: any) => {
    const score = item.score;

    const [wicket, run] = score.split("-");

    totalWickets += parseInt(wicket);
    totalRunConceded += parseInt(run);
  });

  const avgTotalRun = batting.length ? totalRuns / batting.length : 0;
  const avgTotalBall = batting.length ? totalBalls / batting.length : 0;

  const avgRunConced = bowling.length ? totalRunConceded / bowling.length : 0;
  const avgWicket = bowling.length ? totalWickets / bowling.length : 0;

  // Role based multipliers
  const roleMultiplier: any = {
    Batter: { run: 1.1, wicket: 0.3, concede: 1.1 },
    Bowler: { run: 0.3, wicket: 1.1, concede: 0.8 },
    "All Rounder": { run: 0.7, wicket: 0.8, concede: 0.9 },
  };

  const multiplier = roleMultiplier[role] || {
    run: 1,
    wicket: 1,
    concede: 1,
  };

  const impactRun = avgTotalRun * multiplier.run;
  const impactWicket = avgWicket * multiplier.wicket;
  const impactRunConced = avgRunConced * multiplier.concede;

  return {
    avgTotalRun,
    avgTotalBall,
    avgRunConced,
    avgWicket,

    impactRun,
    impactWicket,
    impactRunConced,
  };
};

/* =========================
   Bowling Analysis
========================= */

const squadAnanlysis = (team: any, matchDescription: string) => {
  const squad = team?.playingPlayers?.length
    ? team.playingPlayers
    : (team?.benchPlayers ?? []);

  let totalImpactRun = 0;
  let totalImpactWicket = 0;
  let totalImpactRunConced = 0;

  squad.forEach((element: any) => {
    const playerStats = getPlayerStats(element);

    totalImpactRun += playerStats.impactRun;
    totalImpactWicket += playerStats.impactWicket;
    totalImpactRunConced += playerStats.impactRunConced;
  });

  return {
    totalImpactRun,
    totalImpactWicket,
    totalImpactRunConced,
  };
};

const PrepareScore = (teamA: any, teamB: any) => {
  const teamAScore =
    (teamA.totalImpactRun + teamB.totalImpactRunConced) / 2 -
    teamB.totalImpactWicket * 5;

  const teamBScore =
    (teamB.totalImpactRun + teamA.totalImpactRunConced) / 2 -
    teamA.totalImpactWicket * 5;

  const roundedAScore = Math.round(teamAScore);
  const roundedBScore = Math.round(teamBScore);

  const totalScore = roundedAScore + roundedBScore;

  const teamAWinChance = totalScore
    ? ((roundedAScore / totalScore) * 100).toFixed(2)
    : 50;

  const teamBWinChance = totalScore
    ? ((roundedBScore / totalScore) * 100).toFixed(2)
    : 50;

  return {
    teamAPredictedScore: {
      score: roundedAScore,
      wicket:
        teamA.totalImpactWicket > 10 ? 10 : Math.round(teamA.totalImpactWicket),
    },
    teamBPredictedScore: {
      score: roundedBScore,
      wicket:
        teamB.totalImpactWicket > 10 ? 10 : Math.round(teamB.totalImpactWicket),
    },

    teamAWinChance: Number(teamAWinChance),
    teamBWinChance: Number(teamBWinChance),
  };
};
export const Prediction = (data: any): any => {
  const teamA = data.squads[0];
  const teamB = data.squads[1];

  const matchDescription = data.matchInfo.matchDescription;

  let teamAScore = squadAnanlysis(teamA, matchDescription);
  let teamBScore = squadAnanlysis(teamB, matchDescription);

  const teamPrediction = PrepareScore(teamAScore, teamBScore);

  console.log("teamPrediction===>", teamPrediction);
};
