/* =========================
   Utility Helpers
========================= */

import { CheckIntValue, GetConfidence, GetHint } from "@/lib/utils";

const safe = (value: number): number =>
  Number.isFinite(value) && !Number.isNaN(value) ? value : 0;

const normalizeRole = (role: string) => {
  const r = role?.toLowerCase() || "";
  if (r?.includes("keeper")) return "Batter";
  if (r?.includes("all")) return "All Rounder";
  if (r?.includes("bowl")) return "Bowler";
  return "Batter";
};

type MatchOverConfig = {
  totalOvers: number;
  ballsPerInnings: number;
  bowlerOverLimit: number;
};

const matchOver = (description: string): MatchOverConfig => {
  const text = description?.toLowerCase();

  if (/\btest\b/.test(text)) {
    return { totalOvers: 90, ballsPerInnings: 540, bowlerOverLimit: 30 };
  }

  if (/\bodi\b/.test(text)) {
    return { totalOvers: 50, ballsPerInnings: 300, bowlerOverLimit: 10 };
  }

  if (/\bt10\b/.test(text)) {
    return { totalOvers: 10, ballsPerInnings: 60, bowlerOverLimit: 2 };
  }

  if (/\bt20\b/.test(text)) {
    return { totalOvers: 20, ballsPerInnings: 120, bowlerOverLimit: 4 };
  }

  if (text?.includes("hundred")) {
    return { totalOvers: 20, ballsPerInnings: 100, bowlerOverLimit: 5 };
  }

  return { totalOvers: 20, ballsPerInnings: 120, bowlerOverLimit: 4 };
};

const parseBattingScore = (score: string) => {
  const match = score?.match(/\d+/g);
  if (!match || match.length < 2) return { runs: 0, balls: 0 };
  return { runs: Number(match[0]), balls: Number(match[1]) };
};

/* =========================
   Batting Analysis
========================= */

const getPlayerBattingStats = (player: any) => {
  const batting = player?.recentForm?.batting ?? [];

  let totalRuns = 0;
  let totalBalls = 0;

  batting.forEach((m: any) => {
    const { runs, balls } = parseBattingScore(m.score);
    totalRuns += runs;
    totalBalls += balls;
  });

  const matches = batting.length || 1;

  let avgRuns = safe(totalRuns / matches);
  let avgBalls = safe(totalBalls / matches);
  let strikeRate = avgBalls > 0 ? safe((avgRuns / avgBalls) * 100) : 0;

  const role = normalizeRole(player.role);
  let roleMultiplier =
    role === "Batter" ? 1.8 : role === "All Rounder" ? 1.2 : 0.3;

  if (player?.careerStats?.batting?.length) {
    const career = player.careerStats.batting[0];

    const careerAvgRuns = Number(career.average);
    const careerStrikeRate = Number(career.strikeRate);
    const careerAvgBalls =
      careerStrikeRate > 0 ? (careerAvgRuns * 100) / careerStrikeRate : 0;

    avgRuns = safe((avgRuns + careerAvgRuns) / 2);
    avgBalls = safe((avgBalls + careerAvgBalls) / 2);
    strikeRate = safe((strikeRate + careerStrikeRate) / 2);
  }

  const impactRuns = safe(avgRuns * roleMultiplier * (strikeRate / 100));

  return { avgRuns, avgBalls, strikeRate, impactRuns };
};

/* =========================
   Bowling Analysis
========================= */

const getPlayerBowlingStats = (player: any) => {
  const bowling = player?.recentForm?.bowling ?? [];

  let totalRuns = 0;
  let totalWickets = 0;
  let validMatches = 0;

  bowling.forEach((m: any) => {
    if (!m?.score?.includes("-")) return;
    const [w, r] = m.score.split("-").map(Number);
    if (!Number.isFinite(w) || !Number.isFinite(r)) return;

    totalWickets += w;
    totalRuns += r;
    validMatches++;
  });

  let avgWickets = validMatches ? safe(totalWickets / validMatches) : 0;
  let avgRunsConced = validMatches ? safe(totalRuns / validMatches) : 0;

  const role = normalizeRole(player.role);
  let roleMultiplier =
    role === "Bowler" ? 1.8 : role === "All Rounder" ? 1.2 : 0.1;

  if (player?.careerStats?.bowling?.length) {
    const career = player.careerStats.bowling[0];
    const careerAvgWickets =
      Number(career.wickets) / Number(career.matches || 1);

    const careerAvgRuns = careerAvgWickets * Number(career.average || 0);

    avgWickets = safe((avgWickets + careerAvgWickets) / 2);
    avgRunsConced = safe((avgRunsConced + careerAvgRuns) / 2);
  }

  return {
    avgRunsConced: safe(avgRunsConced * roleMultiplier),
    avgWickets,
    impactWickets: safe(avgWickets * roleMultiplier),
  };
};

/* =========================
   Squad Analysis
========================= */

const squadAnanlysis = (team: any, matchDescription: string) => {
  const squad = team?.playingPlayers?.length
    ? team.playingPlayers
    : (team?.benchPlayers ?? []);

  let teamRuns = 0;
  let teamBalls = 0;
  let teamRunsConced = 0;
  let teamWickets = 0;

  squad.forEach((p: any) => {
    const bat = getPlayerBattingStats(p);
    const bowl = getPlayerBowlingStats(p);

    teamRuns += bat.impactRuns;
    teamBalls += bat.avgBalls;
    teamRunsConced += bowl.avgRunsConced;
    teamWickets += bowl.impactWickets;
  });

  const runRate = teamBalls > 0 ? safe(teamRuns / teamBalls) : 0;
  const overs = matchOver(matchDescription);

  return {
    predictedScore: safe(runRate * overs.ballsPerInnings),
    totalTeamRunsConced:
      teamWickets > 0 ? safe((teamRunsConced / teamWickets) * 5) : 0,
    teamWicket: teamWickets,
  };
};

const getTopPlayer = (team: any, type: "bat" | "bowl") => {
  const squad =
    team?.playingPlayers?.length > 0
      ? team.playingPlayers
      : (team?.benchPlayers ?? []);

  if (!squad.length) return null;

  const players = squad.map((p: any) => {
    const bat = getPlayerBattingStats(p);
    const bowl = getPlayerBowlingStats(p);

    return {
      name: p.name,
      shortName: p.shortName,
      role: p.role,
      image: p.image,
      playerUrl: p.playerUrl,
      impactRuns: Math.round(bat.impactRuns),
      strikeRate: Math.round(bat.strikeRate),
      avgBalls: Math.round(bat.avgBalls),
      impactWickets: Math.round(bowl.impactWickets),
      avgRunsConced: Math.round(bowl.avgRunsConced),
    };
  });

  return players.reduce((best: any, curr: any) => {
    if (type === "bat") {
      return curr.impactRuns > best.impactRuns ? curr : best;
    }
    return curr.impactWickets > best.impactWickets ? curr : best;
  });
};

export const CalculateTeamFormStats = (team: any) => {
  let totalScored = 0;
  let totalConceded = 0;
  let totalMatches = 0;
  let wins = 0;

  team.matches.forEach((match: any) => {
    const teamData = match.teams.find((t: any) => t.name === team.teamId);

    const opponentData = match.teams.find((t: any) => t.name !== team.teamId);

    if (teamData && opponentData) {
      const scoredRuns = parseInt(teamData.score.split("/")[0]);
      const concededRuns = parseInt(opponentData.score.split("/")[0]);

      totalScored += scoredRuns;
      totalConceded += concededRuns;
      totalMatches++;

      if (match.result === "W") {
        wins++;
      }
    }
  });

  const avgScore = totalScored / totalMatches;
  const avgConceded = totalConceded / totalMatches;
  const winPercentage = (wins / totalMatches) * 100;

  return {
    avgScore,
    avgConceded,
    winPercentage,
    totalMatches,
  };
};

/* =========================
   Final Match Analysis
========================= */

export const GetNewAnalysis = async (data: any) => {
  const teamA = data.squads[0];
  const teamB = data.squads[1];

  const teamRank = data.matchInfo.teams;

  const matchDescription = data.matchInfo.matchDescription;

  let teamAScore = squadAnanlysis(teamA, matchDescription);
  let teamBScore = squadAnanlysis(teamB, matchDescription);

  let teamAPredicted =
    (teamAScore.predictedScore + teamBScore.totalTeamRunsConced) / 2;
  let teamBPredicted =
    (teamBScore.predictedScore + teamAScore.totalTeamRunsConced) / 2;

  //------------Factor added to prediction----------------
  let teamARankFactor = 1;
  let teamBRankFactor = 1;
  let teamAWinPercentage = 50;
  let teamBWinPercentage = 50;

  if (teamRank[0]?.teamRank && teamRank[1]?.teamRank) {
    const findTeamARank = teamRank.find(
      (item: any) => item.teamShortName === teamA.teamName,
    );

    const findTeamBRank = teamRank.find(
      (item: any) => item.teamShortName === teamB.teamName,
    );

    if (findTeamARank && findTeamBRank) {
      const aRank = Number(findTeamARank.teamRank.rank);
      const bRank = Number(findTeamBRank.teamRank.rank);

      // convert rank to strength
      const strengthA = 1 / aRank;
      const strengthB = 1 / bRank;

      const totalStrength = strengthA + strengthB;

      const probA = strengthA / totalStrength;
      const probB = strengthB / totalStrength;

      // control how much rank affects match (20% recommended)
      const RANK_IMPACT_WEIGHT = 0.9;

      // final factor around 1
      teamARankFactor = 1 + (probA - 0.5) * 2 * RANK_IMPACT_WEIGHT;
      teamBRankFactor = 1 + (probB - 0.5) * 2 * RANK_IMPACT_WEIGHT;

      // teamAPredicted = teamAPredicted * teamARankFactor;
      // teamBPredicted = teamBPredicted * teamBRankFactor;
    }
  }

  if (data?.teamForm && data?.teamForm.length > 0) {
    const findTeamAForm = data.teamForm.find(
      (e: any) => e.teamId === teamA.teamName,
    );
    const findTeamBForm = data.teamForm.find(
      (e: any) => e.teamId === teamB.teamName,
    );
    const teamAFormStats = CalculateTeamFormStats(findTeamAForm);
    const teamBFormStats = CalculateTeamFormStats(findTeamBForm);

    teamAWinPercentage = teamAFormStats.winPercentage;
    teamBWinPercentage = teamBFormStats.winPercentage;

    teamAPredicted =
      (teamAPredicted +
        (teamAFormStats.avgScore + teamBFormStats.avgConceded) / 2) /
      2;
    teamBPredicted =
      (teamBPredicted +
        (teamBFormStats.avgScore + teamAFormStats.avgConceded) / 2) /
      2;
  }
  return { teamAPredicted, teamBPredicted };

  //-----------------close-------Factor added to prediction-------------

  teamAPredicted = Math.max(teamAPredicted, 80);
  teamBPredicted = Math.max(teamBPredicted, 80);

  /* =========================
     Winner Probability
  ========================= */

  const totalScore = teamAPredicted + teamBPredicted;

  const teamAChance =
    totalScore > 0 ? CheckIntValue((teamAPredicted / totalScore) * 100) : 50;

  const teamBChance =
    totalScore > 0 ? CheckIntValue((teamBPredicted / totalScore) * 100) : 50;

  const hintData = GetHint(teamAChance, teamBChance);

  return {
    team1: {
      name: data.matchInfo.teams[0].teamName,
      shortName: teamA.teamName,
      flag: data.matchInfo.teams[0].teamFlagUrl,

      firstInnings: {
        min: Math.round(teamAPredicted * 0.9),
        max: Math.round(teamAPredicted * 1.1),
        predicted: Math.round(teamAPredicted),
        wickets:
          Math.round(teamBScore.teamWicket * 0.4) > 10
            ? 10
            : Math.round(teamBScore.teamWicket * 0.4),
      },
      winnerPrediction: {
        probability: teamAChance,
        confidence: GetConfidence(teamAChance),
        hint: {
          hintMessage: hintData.team1.message,
          badgeColor: hintData.team1.badgeColor,
          color: hintData.team1.color,
        },
      },
      topBatsman: getTopPlayer(teamA, "bat"),
      topBowler: getTopPlayer(teamA, "bowl"),
    },

    team2: {
      name: data.matchInfo.teams[1].teamName,
      shortName: teamB.teamName,
      flag: data.matchInfo.teams[1].teamFlagUrl,

      firstInnings: {
        min: Math.round(teamBPredicted * 0.9),
        max: Math.round(teamBPredicted * 1.1),
        predicted: Math.round(teamBPredicted),
        wickets:
          Math.round(teamAScore.teamWicket * 0.4) > 10
            ? 10
            : Math.round(teamAScore.teamWicket * 0.4),
      },
      winnerPrediction: {
        probability: teamBChance,
        confidence: GetConfidence(teamBChance),
        hint: {
          hintMessage: hintData.team2.message,
          badgeColor: hintData.team2.badgeColor,
          color: hintData.team2.color,
        },
      },
      topBatsman: getTopPlayer(teamB, "bat"),
      topBowler: getTopPlayer(teamB, "bowl"),
    },
    recentMatchOnVenue: data?.venueDetails?.recentMatches ?? null,

    venueStats: data?.venueDetails?.stats?.matches
      ? data.venueDetails.stats
      : null,

    venueRecords: data?.venueDetails?.records?.["Highest Total"]
      ? data.venueDetails.records
      : null,

    venuePaceVsSpin: data?.venueDetails?.paceVsSpin?.paceWickets
      ? data.venueDetails.paceVsSpin
      : null,

    venueWeather: data?.venueDetails?.weather?.temperature
      ? data.venueDetails.weather
      : null,
  };
};
