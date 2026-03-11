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

const PrepareScore = (
  teamA: any,
  teamB: any,
  teamARank?: any,
  teamBRank?: any,
) => {
  const maxRank = 147;

  let rankMultiplierA = 1;
  let rankMultiplierB = 1;

  if (teamARank?.teamRank?.rank && teamBRank?.teamRank?.rank) {
    const aRank = Number(teamARank.teamRank.rank);
    const bRank = Number(teamBRank.teamRank.rank);

    const rankFactorA = (maxRank - aRank + 1) / maxRank;
    const rankFactorB = (maxRank - bRank + 1) / maxRank;

    rankMultiplierA = 0.8 + rankFactorA * 0.4;
    rankMultiplierB = 0.8 + rankFactorB * 0.4;
  }

  const baseAScore =
    (teamA.totalImpactRun + teamB.totalImpactRunConced) / 2 -
    teamB.totalImpactWicket * 5;

  const baseBScore =
    (teamB.totalImpactRun + teamA.totalImpactRunConced) / 2 -
    teamA.totalImpactWicket * 5;

  const teamAScore = baseAScore * rankMultiplierA;
  const teamBScore = baseBScore * rankMultiplierB;

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

const getTopPerformers = (team: any, teamRank?: any) => {
  const squad = team?.playingPlayers?.length
    ? team.playingPlayers
    : (team?.benchPlayers ?? []);

  let rankMultiplier = 1;

  if (teamRank?.teamRank?.rank) {
    const maxRank = 147;
    const rank = Number(teamRank.teamRank.rank);

    const rankFactor = (maxRank - rank + 1) / maxRank;

    rankMultiplier = 0.9 + rankFactor * 0.2;
  }

  const players = squad.map((player: any) => {
    const stats = getPlayerStats(player);

    return {
      name: player.name,
      shortName: player.shortName,
      role: player.role,
      isWK: player.isWK,
      image: player.image,
      style: player.style,
      impactRun: stats.impactRun * rankMultiplier,
      impactWicket: stats.impactWicket * rankMultiplier,
    };
  });

  const topRunner = [...players].sort((a, b) => b.impactRun - a.impactRun)[0];

  const topWicketTaker = [...players].sort(
    (a, b) => b.impactWicket - a.impactWicket,
  )[0];

  return {
    topRunner,
    topWicketTaker,
  };
};

const generateDream11Team = (
  teamA: any,
  teamB: any,
  teamARank?: any,
  teamBRank?: any,
) => {
  const getPlayers = (team: any, teamRank?: any) => {
    const squad = team?.playingPlayers?.length
      ? team.playingPlayers
      : (team?.benchPlayers ?? []);

    let rankMultiplier = 1;

    if (teamRank?.teamRank?.rank) {
      const maxRank = 147;
      const rank = Number(teamRank.teamRank.rank);
      const rankFactor = (maxRank - rank + 1) / maxRank;

      rankMultiplier = 0.9 + rankFactor * 0.2;
    }

    return squad.map((player: any) => {
      const stats = getPlayerStats(player);

      const impactRun = stats.impactRun * rankMultiplier;
      const impactWicket = stats.impactWicket * rankMultiplier;

      return {
        name: player.name,
        shortName: player.shortName,
        role: player.role,
        isWK: player.isWK,
        team: team.teamName,
        impactRun,
        impactWicket,
        impactScore: impactRun + impactWicket * 25,
      };
    });
  };

  const teamAPlayers = getPlayers(teamA, teamARank);
  const teamBPlayers = getPlayers(teamB, teamBRank);

  const allPlayers = [...teamAPlayers, ...teamBPlayers].sort(
    (a, b) => b.impactScore - a.impactScore,
  );

  const wk = allPlayers.filter((p) => p.isWK).slice(0, 2);
  const bat = allPlayers.filter((p) => p.role === "Batter").slice(0, 4);
  const ar = allPlayers.filter((p) => p.role === "All Rounder").slice(0, 2);
  const bowl = allPlayers.filter((p) => p.role === "Bowler").slice(0, 3);

  let team = [...wk, ...bat, ...ar, ...bowl];

  team = team.slice(0, 11);

  const captain = [...team].sort((a, b) => b.impactScore - a.impactScore)[0];
  const viceCaptain = [...team]
    .filter((p) => p.name !== captain.name)
    .sort((a, b) => b.impactScore - a.impactScore)[0];

  return {
    team,
    captain,
    viceCaptain,
  };
};

const getKeyPlayers = (team: any, teamRank?: any) => {
  const squad = team?.playingPlayers?.length
    ? team.playingPlayers
    : (team?.benchPlayers ?? []);

  let rankMultiplier = 1;

  if (teamRank?.teamRank?.rank) {
    const maxRank = 147;
    const rank = Number(teamRank.teamRank.rank);
    const rankFactor = (maxRank - rank + 1) / maxRank;

    rankMultiplier = 0.9 + rankFactor * 0.2;
  }

  const players = squad.map((player: any) => {
    const stats = getPlayerStats(player);

    const impactRun = stats.impactRun * rankMultiplier;
    const impactWicket = stats.impactWicket * rankMultiplier;

    const impactScore = impactRun + impactWicket * 25;

    return {
      name: player.name,
      shortName: player.shortName,
      role: player.role,
      isWK: player.isWK,
      image: player.image,
      style: player.style,
      impactRun,
      impactWicket,
      impactScore,
    };
  });

  const keyPlayers = players
    .sort((a: any, b: any) => b.impactScore - a.impactScore)
    .slice(0, 5);

  return keyPlayers;
};
export const Prediction = (data: any): any => {
  const teamA = data.squads[0];
  const teamB = data.squads[1];

  const matchDescription = data.matchInfo.matchDescription;

  let teamAScore = squadAnanlysis(teamA, matchDescription);
  let teamBScore = squadAnanlysis(teamB, matchDescription);

  const teamRank = data.matchInfo.teams;

  const findTeamARank = teamRank.find(
    (item: any) => item.teamShortName === teamA.teamName,
  );

  const findTeamBRank = teamRank.find(
    (item: any) => item.teamShortName === teamB.teamName,
  );

  const teamPrediction = PrepareScore(
    teamAScore,
    teamBScore,
    findTeamARank,
    findTeamBRank,
  );

  const teamATopPerformer = getTopPerformers(teamA, findTeamARank);
  const teamBTopPerformer = getTopPerformers(teamB, findTeamBRank);

  const dream11Team = generateDream11Team(
    teamA,
    teamB,
    findTeamARank,
    findTeamBRank,
  );

  const teamAKeyPlayers = getKeyPlayers(teamA, findTeamARank);
  const teamBKeyPlayers = getKeyPlayers(teamB, findTeamBRank);

  console.log("teamAKeyPlayers===>", teamAKeyPlayers);
};
