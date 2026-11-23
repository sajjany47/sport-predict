import { GetConfidence, GetHint } from "@/lib/utils";

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
  const match = String(score ?? "").match(/(\d+)\s*\((\d+)\)/);
  if (!match) return { runs: 0, balls: 0 };
  return { runs: Number(match[1]), balls: Number(match[2]) };
};

const numberValue = (value: any): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const relevantFormat = (format: string) => {
  const f = format?.toLowerCase() ?? "t20";
  if (f.includes("test")) return "test";
  if (f.includes("odi") || f.includes("one day")) return "odi";
  if (f.includes("t10")) return "t10";
  if (f.includes("hundred")) return "hundred";
  return "t20";
};

const getPlayerBattingStats = (player: any, format: string) => {
  const mode = relevantFormat(format);
  const batting = (player?.recentForm?.batting ?? []).filter((m: any) =>
    String(m.match ?? "").toLowerCase().includes(mode),
  );
  let totalRuns = 0;
  let totalBalls = 0;
  batting.forEach((m: any) => {
    const { runs, balls } = parseBattingScore(m.score);
    totalRuns += runs;
    totalBalls += balls;
  });
  const matches = batting.length;
  let avgRuns = matches ? safe(totalRuns / matches) : 0;
  let avgBalls = matches ? safe(totalBalls / matches) : 0;
  let strikeRate = avgBalls > 0 ? safe((avgRuns / avgBalls) * 100) : 0;

  const role = normalizeRole(player.role);
  let roleMultiplier =
    role === "Batter" ? 1.8 : role === "All Rounder" ? 1.2 : 0.3;

  const career = (player?.careerStats?.batting ?? []).find((s: any) =>
    String(s.format ?? "").toLowerCase().includes(mode),
  );
  if (career) {
    const careerAvgRuns = numberValue(career.average);
    const careerStrikeRate = numberValue(career.strikeRate);
    const careerAvgBalls =
      careerStrikeRate > 0 ? (careerAvgRuns * 100) / careerStrikeRate : 0;

    const recentWeight = matches ? Math.min(0.75, matches / 10) : 0;
    avgRuns = safe(avgRuns * recentWeight + careerAvgRuns * (1 - recentWeight));
    avgBalls = safe(avgBalls * recentWeight + careerAvgBalls * (1 - recentWeight));
    strikeRate = safe(strikeRate * recentWeight + careerStrikeRate * (1 - recentWeight));
  }
  const impactRuns = safe(avgRuns * roleMultiplier * (strikeRate / 100));
  return { avgRuns, avgBalls, strikeRate, impactRuns };
};

const getPlayerBowlingStats = (player: any, format: string) => {
  const mode = relevantFormat(format);
  const bowling = (player?.recentForm?.bowling ?? []).filter((m: any) =>
    String(m.match ?? "").toLowerCase().includes(mode),
  );
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

  const career = (player?.careerStats?.bowling ?? []).find((s: any) =>
    String(s.format ?? "").toLowerCase().includes(mode),
  );
  if (career) {
    const careerAvgWickets = numberValue(career.wickets) / Math.max(1, numberValue(career.matches));
    const careerAvgRuns = numberValue(career.economy) * matchOver(format).bowlerOverLimit;

    avgWickets = safe((avgWickets + careerAvgWickets) / 2);
    avgRunsConced = safe((avgRunsConced + careerAvgRuns) / 2);
  }

  return {
    avgRunsConced: safe(avgRunsConced * roleMultiplier),
    avgWickets,
    impactWickets: safe(avgWickets * roleMultiplier),
  };
};

const getPlayerFullStats = (player: any, format: string) => {
  const bat = getPlayerBattingStats(player, format);
  const bowl = getPlayerBowlingStats(player, format);

  const impactRuns = bat.impactRuns;
  const impactWickets = bowl.impactWickets;
  const impactRunsConced = bowl.avgRunsConced;

  const impactScore = safe(impactRuns + impactWickets * 25);

  return {
    name: player.name,
    shortName: player.shortName,
    role: player.role,
    isWK: player.isWK || !!player.role?.toLowerCase().includes("keeper"),
    image: player.image,
    style: player.style,
    impactRun: impactRuns,
    impactWicket: impactWickets,
    impactRunConced: impactRunsConced,
    impactScore,
    strikeRate: bat.strikeRate,
    avgBalls: bat.avgBalls,
    avgRunsConced: bowl.avgRunsConced,
  };
};

const squadAnanlysis = (team: any, matchDescription: string) => {
  const squad = team?.playingPlayers?.length
    ? team.playingPlayers
    : (team?.benchPlayers ?? []);

  let teamRuns = 0;
  let teamRunsConced = 0;
  let teamWickets = 0;

  const processedSquad: any[] = [];

  squad.forEach((p: any) => {
    const stats = getPlayerFullStats(p, matchDescription);
    processedSquad.push(stats);

    teamRuns += stats.impactRun;
    teamRunsConced += stats.impactRunConced;
    teamWickets += stats.impactWicket;
  });

  const overs = matchOver(matchDescription);
  // Player averages describe likely contribution, not a full innings rate.
  // Sum projected batting output, then shrink toward a format baseline.
  const baseline = overs.totalOvers <= 10 ? 100 : overs.totalOvers <= 20 ? 160 : overs.totalOvers <= 50 ? 260 : 300;
  const lineupProjection = teamRuns * (squad.length ? 11 / squad.length : 1);
  const bowlingExpected = teamWickets > 0 ? (teamRunsConced / teamWickets) * Math.min(7, teamWickets) : baseline;

  return {
    predictedScore: safe(lineupProjection * 0.55 + baseline * 0.45),
    totalTeamRunsConced: safe(bowlingExpected),
    teamWicket: teamWickets,
    processedSquad,
  };
};

export const CalculateTeamFormStats = (team: any) => {
  let totalScored = 0;
  let totalConceded = 0;
  let totalMatches = 0;
  let wins = 0;

  (team?.matches ?? []).forEach((match: any) => {
    const teams = match?.teams ?? [];
    const teamData = teams.find((t: any) => t.name === team.teamId);
    const opponentData = teams.find((t: any) => t.name !== team.teamId);

    if (teamData && opponentData) {
      const scoredRuns = numberValue(String(teamData.score ?? "").split("/")[0]);
      const concededRuns = numberValue(String(opponentData.score ?? "").split("/")[0]);
      if (!scoredRuns && !concededRuns) return;
      totalScored += scoredRuns;
      totalConceded += concededRuns;
      totalMatches++;
      if (match.result === "W") {
        wins++;
      }
    }
  });

  const avgScore = totalMatches ? totalScored / totalMatches : 0;
  const avgConceded = totalMatches ? totalConceded / totalMatches : 0;
  const winPercentage = totalMatches ? (wins / totalMatches) * 100 : 50;

  return { avgScore, avgConceded, winPercentage, totalMatches };
};

const getTopPerformers = (processedSquad: any[], rankNormalised: number) => {
  if (!processedSquad || !processedSquad.length) {
    return { topRunner: null, topWicketTaker: null, keyPlayers: [] };
  }

  const squadWithNormalized = processedSquad.map((p) => ({
    ...p,
    impactRun:
      Math.round(((p.strikeRate * p.avgBalls) / 100 + p.impactRun) / 2) *
      rankNormalised,
    impactWicket: Math.round(p.impactWicket * rankNormalised),
    impactScore: p.impactScore * rankNormalised,
  }));

  const topRunner = [...squadWithNormalized].sort(
    (a, b) => b.impactRun - a.impactRun,
  )[0];
  const topWicketTaker = [...squadWithNormalized].sort(
    (a, b) => b.impactWicket - a.impactWicket,
  )[0];
  const keyPlayers = [...squadWithNormalized]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 5);

  return { topRunner, topWicketTaker, keyPlayers };
};

const generateDream11Team = (teamA: any, teamB: any) => {
  const teamAPlayers = (teamA.processedSquad ?? []).map((p: any) => ({
    ...p,
    team: teamA.teamName,
  }));

  const teamBPlayers = (teamB.processedSquad ?? []).map((p: any) => ({
    ...p,
    team: teamB.teamName,
  }));

  const allPlayers = [...teamAPlayers, ...teamBPlayers].sort(
    (a, b) => b.impactScore - a.impactScore,
  );

  const team: any[] = [];
  const teamCount: any = {};
  const roleCount: any = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };

  const addPlayer = (player: any, roleType: string) => {
    if (team.length >= 11) return false;

    const currentTeamCount = teamCount[player.team] || 0;
    if (currentTeamCount >= 7) return false;

    if (team.find((p) => p.name === player.name)) return false;

    team.push(player);

    teamCount[player.team] = currentTeamCount + 1;
    roleCount[roleType]++;

    return true;
  };

  // WK
  allPlayers
    .filter((p) => p.isWK)
    .forEach((p) => {
      if (roleCount.WK < 1) addPlayer(p, "WK");
    });

  // BAT
  allPlayers
    .filter((p) => p.role === "Batter" || normalizeRole(p.role) === "Batter")
    .forEach((p) => {
      if (roleCount.BAT < 3) addPlayer(p, "BAT");
    });

  // AR
  allPlayers
    .filter(
      (p) =>
        p.role === "All Rounder" || normalizeRole(p.role) === "All Rounder",
    )
    .forEach((p) => {
      if (roleCount.AR < 1) addPlayer(p, "AR");
    });

  // BOWL
  allPlayers
    .filter((p) => p.role === "Bowler" || normalizeRole(p.role) === "Bowler")
    .forEach((p) => {
      if (roleCount.BOWL < 3) addPlayer(p, "BOWL");
    });

  // Fill remaining slots
  for (const p of allPlayers) {
    if (team.length >= 11) break;
    addPlayer(p, "BAT");
  }

  // Find captain & vice captain
  const sortedTeam = [...team].sort((a, b) => b.impactScore - a.impactScore);

  const captainName = sortedTeam[0]?.name;
  const viceCaptainName = sortedTeam[1]?.name;

  const finalTeam = team.map((player) => ({
    ...player,
    isCaptain: player.name === captainName,
    isViceCaptain: player.name === viceCaptainName,
  }));

  return finalTeam;
};

export const Prediction = async (data: any): Promise<any> => {
  const teamA = data.squads?.[0] || {};
  const teamB = data.squads?.[1] || {};

  const teamRank = data.matchInfo?.teams || [];
  const matchDescription = data.matchInfo?.format || data.matchInfo?.matchDescription || "T20";
  const teamAScore = squadAnanlysis(teamA, matchDescription);
  const teamBScore = squadAnanlysis(teamB, matchDescription);
  const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));
  const average = (...values: any[]) => {
    const nums = values.map(numberValue).filter((n) => n > 0);
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  };
  const comparisonTeams = data?.comparision?.teams ?? {};
  const teamAKey = Object.keys(comparisonTeams).find((key) => comparisonTeams[key]?.name === teamA.teamName) || "team1";
  const teamBKey = Object.keys(comparisonTeams).find((key) => comparisonTeams[key]?.name === teamB.teamName) || "team2";
  const getComparison = (metric: string, section: "overall" | "venue", key: string) => {
    const row = data?.comparision?.comparison?.[section]?.find((x: any) => x.metric === metric);
    return row ? numberValue(row[key]) : 0;
  };
  // Estimate expected first innings from the batting XI, opponent bowling, recent team scores and venue.
  const formA = data?.teamForm?.find((t: any) => t.teamId === teamA.teamName);
  const formB = data?.teamForm?.find((t: any) => t.teamId === teamB.teamName);
  const formStatsA = formA ? CalculateTeamFormStats(formA) : null;
  const formStatsB = formB ? CalculateTeamFormStats(formB) : null;
  const venue = data?.venueDetails?.stats ?? {};
  const baseline = average(venue.avg1stInns, venue.avg2ndInns) || (matchOver(matchDescription).totalOvers <= 10 ? 100 : matchOver(matchDescription).totalOvers <= 20 ? 160 : 260);
  const teamAComparison = average(getComparison("Avg Score", "overall", teamAKey), getComparison("Avg Score", "venue", teamAKey));
  const teamBComparison = average(getComparison("Avg Score", "overall", teamBKey), getComparison("Avg Score", "venue", teamBKey));
  const teamAPredicted = Math.round(clamp(average(teamAScore.predictedScore, teamBScore.totalTeamRunsConced, formStatsA?.avgScore, formStatsB?.avgConceded, teamAComparison, baseline), baseline * 0.55, baseline * 1.55));
  const teamBPredicted = Math.round(clamp(average(teamBScore.predictedScore, teamAScore.totalTeamRunsConced, formStatsB?.avgScore, formStatsA?.avgConceded, teamBComparison, baseline), baseline * 0.55, baseline * 1.55));

  // Blend independent signals first, then map the rating difference through a logistic curve.
  const probabilitySignals: { a: number; b: number; weight: number }[] = [];
  probabilitySignals.push({ a: teamAPredicted, b: teamBPredicted, weight: 0.35 });
  if (formStatsA && formStatsB && formStatsA.totalMatches + formStatsB.totalMatches > 0) probabilitySignals.push({ a: formStatsA.winPercentage, b: formStatsB.winPercentage, weight: 0.3 });
  const overallA = getComparison("Win", "overall", teamAKey), overallB = getComparison("Win", "overall", teamBKey);
  if (overallA + overallB > 0) probabilitySignals.push({ a: overallA, b: overallB, weight: 0.18 });
  const venueA = getComparison("Win", "venue", teamAKey), venueB = getComparison("Win", "venue", teamBKey);
  if (venueA + venueB > 0) probabilitySignals.push({ a: venueA, b: venueB, weight: 0.1 });
  const rankA = teamRank.find((t: any) => t.teamShortName === teamA.teamName)?.teamRank;
  const rankB = teamRank.find((t: any) => t.teamShortName === teamB.teamName)?.teamRank;
  if (numberValue(rankA?.rating) + numberValue(rankB?.rating) > 0) probabilitySignals.push({ a: numberValue(rankA.rating), b: numberValue(rankB.rating), weight: 0.07 });
  const totalWeight = probabilitySignals.reduce((sum, s) => sum + s.weight, 0);
  const ratingA = probabilitySignals.reduce((sum, s) => sum + (s.a / Math.max(1, s.a + s.b)) * 100 * s.weight, 0) / totalWeight;
  const ratingB = probabilitySignals.reduce((sum, s) => sum + (s.b / Math.max(1, s.a + s.b)) * 100 * s.weight, 0) / totalWeight;
  const rawA = 100 / (1 + Math.exp(-(ratingA - ratingB) / 12));
  const winA = Math.round(clamp(rawA, 5, 95) * 10) / 10;
  const avgWinningChance = { teamA: winA, teamB: Math.round((100 - winA) * 10) / 10 };
  const teamARankNormalised = 1, teamBRankNormalised = 1;

  const maxProbability = Math.max(
    avgWinningChance.teamA,
    avgWinningChance.teamB,
  );
  let risk = "High";
  let riskMessage = "Both side match";

  if (maxProbability > 57) {
    risk = "Low";
    riskMessage = "One side match";
  } else if (maxProbability > 52) {
    risk = "Medium";
    riskMessage = "Slight rate come oppent";
  }

  const hintData = GetHint(avgWinningChance.teamA, avgWinningChance.teamB);

  const teamATopPerformers = getTopPerformers(
    teamAScore.processedSquad,
    teamARankNormalised,
  );
  const teamBTopPerformers = getTopPerformers(
    teamBScore.processedSquad,
    teamBRankNormalised,
  );

  const mergedTeamA = { ...teamA, processedSquad: teamAScore.processedSquad };
  const mergedTeamB = { ...teamB, processedSquad: teamBScore.processedSquad };
  const dream11Team = generateDream11Team(mergedTeamA, mergedTeamB);

  return {
    matchRisk: {
      risk,
      message: riskMessage,
    },
    team1: {
      name: data?.matchInfo?.teams?.[0]?.teamName ?? teamA.teamName,
      shortName: teamA.teamName,
      flag: data?.matchInfo?.teams?.[0]?.teamFlagUrl || "",

      firstInnings: {
        min: Math.round(teamAPredicted * 0.9),
        max: Math.round(teamAPredicted * 1.1),
        predicted: Math.round(teamAPredicted),
        wickets: Math.min(10, Math.round(teamBScore.teamWicket * 0.4)),
      },
      winnerPrediction: {
        probability: avgWinningChance.teamA || 50,
        confidence: GetConfidence(avgWinningChance.teamA || 50),
        hint: {
          hintMessage: hintData.team1.message,
          badgeColor: hintData.team1.badgeColor,
          color: hintData.team1.color,
        },
      },
      topBatsman: teamATopPerformers.topRunner,
      topBowler: teamATopPerformers.topWicketTaker,
      keyPlayers: teamATopPerformers.keyPlayers,
    },

    team2: {
      name: data?.matchInfo?.teams?.[1]?.teamName ?? teamB.teamName,
      shortName: teamB.teamName,
      flag: data?.matchInfo?.teams?.[1]?.teamFlagUrl || "",

      firstInnings: {
        min: Math.round(teamBPredicted * 0.9),
        max: Math.round(teamBPredicted * 1.1),
        predicted: Math.round(teamBPredicted),
        wickets: Math.min(10, Math.round(teamAScore.teamWicket * 0.4)),
      },
      winnerPrediction: {
        probability: avgWinningChance.teamB || 50,
        confidence: GetConfidence(avgWinningChance.teamB || 50),
        hint: {
          hintMessage: hintData.team2.message,
          badgeColor: hintData.team2.badgeColor,
          color: hintData.team2.color,
        },
      },
      topBatsman: teamBTopPerformers.topRunner,
      topBowler: teamBTopPerformers.topWicketTaker,
      keyPlayers: teamBTopPerformers.keyPlayers,
    },

    dream11Team,

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
