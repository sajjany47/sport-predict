const CalculateBattingAverages = (data: any) => {
  let totalRuns = 0;
  let totalBalls = 0;
  let totalSR = 0;

  data.forEach((item: any) => {
    const runMatch = item.run.match(/(\d+)\s*\((\d+)\)/);
    if (runMatch) {
      const runs = parseInt(runMatch[1], 10);
      const balls = parseInt(runMatch[2], 10);
      totalRuns += runs;
      totalBalls += balls;
      totalSR += parseFloat(item.sr) || 0;
    }
  });

  const count = data.length;

  return {
    averageRuns: (totalRuns / count).toFixed(2),
    averageBalls: (totalBalls / count).toFixed(2),
    averageSR: (totalSR / count).toFixed(2),
  };
};

const CalculateBowlingAverages = (data: any) => {
  let totalRuns = 0;
  let totalWickets = 0;
  let totalOvers = 0;
  let totalEco = 0;
  let count = 0;

  data.forEach((item: any) => {
    if (item.o !== "DNB") {
      totalOvers += parseFloat(item.o); // overs
      totalRuns += parseInt(item.r, 10); // runs
      totalWickets += parseInt(item.w, 10); // wickets
      totalEco += parseFloat(item.eco); // economy
      count++;
    }
  });

  if (count === 0) return null;

  return {
    averageRuns: (totalRuns / count).toFixed(2),
    averageWickets: (totalWickets / count).toFixed(2),
    averageOvers: (totalOvers / count).toFixed(2),
    averageEconomy: (totalEco / count).toFixed(2),
  };
};

const CalculateFantasyAverages = (data: any) => {
  let totalBat = 0;
  let totalBowl = 0;
  let totalField = 0;
  let count = data.length;

  data.forEach((item: any) => {
    totalBat += parseInt(item.bat, 10);
    totalBowl += parseInt(item.bowl, 10);
    totalField += parseInt(item.field, 10);
  });

  return {
    averageBatting: (totalBat / count).toFixed(2),
    averageBowling: (totalBowl / count).toFixed(2),
    averageFielding: (totalField / count).toFixed(2),
  };
};

const ParseScore = (score: any) => {
  const match = score.match(/(\d+)-\d+\s*\(([\d.]+)\)/);
  if (!match) return { runs: 0, overs: 0 };
  return {
    runs: parseInt(match[1], 10),
    overs: parseFloat(match[2]),
  };
};
const CalculateStadiumAverage = (matches: any[]) => {
  if (!matches || matches.length === 0) {
    return {
      averageInnings1Score: 0,
      averageInnings2Score: 0,
      innings1RunRate: 0,
      innings2RunRate: 0,
    };
  }

  let totalInn1Runs = 0;
  let totalInn2Runs = 0;
  let totalInn1Overs = 0;
  let totalInn2Overs = 0;
  const count = matches.length;

  matches.forEach((match: any) => {
    const inn1 = match.inn1Score
      ? ParseScore(match.inn1Score)
      : { runs: 0, overs: 0 };
    const inn2 = match.inn2Score
      ? ParseScore(match.inn2Score)
      : { runs: 0, overs: 0 };

    totalInn1Runs += inn1.runs || 0;
    totalInn2Runs += inn2.runs || 0;
    totalInn1Overs += inn1.overs || 0;
    totalInn2Overs += inn2.overs || 0;
  });

  return {
    averageInnings1Score: count ? (totalInn1Runs / count).toFixed(2) : "0.00",
    averageInnings2Score: count ? (totalInn2Runs / count).toFixed(2) : "0.00",
    innings1RunRate: totalInn1Overs
      ? (totalInn1Runs / totalInn1Overs).toFixed(2)
      : "0.00",
    innings2RunRate: totalInn2Overs
      ? (totalInn2Runs / totalInn2Overs).toFixed(2)
      : "0.00",
  };
};

const AccordingPlayerTeamAvg = (squad: any, format: any, stadiumAvg: any) => {
  const playerSquad =
    squad.playingPlayer.length > 0 ? squad.playingPlayer : squad.benchPlayer;

  let totalScore = 0;
  playerSquad.forEach((element: any) => {
    totalScore += Number(element.battingAvg?.averageRuns) || 0;
  });

  const innings1RunRate = Number(stadiumAvg?.innings1RunRate) || 0;
  const innings2RunRate = Number(stadiumAvg?.innings2RunRate) || 0;
  const avgInnings1Score = Number(stadiumAvg?.averageInnings1Score) || 0;
  const avgInnings2Score = Number(stadiumAvg?.averageInnings2Score) || 0;

  const bothIningAvgRunRate = (innings1RunRate + innings2RunRate) / 2;
  const bothIningsAvgScore = (avgInnings1Score + avgInnings2Score) / 2;

  // ✅ Check if stadium average is zero
  const isStadiumAvgZero =
    avgInnings1Score === 0 &&
    avgInnings2Score === 0 &&
    innings1RunRate === 0 &&
    innings2RunRate === 0;

  let teamAvgScore;

  if (isStadiumAvgZero) {
    // ⚡ If stadium average is zero, don't divide by 2 — use only player data
    teamAvgScore = totalScore + format.over * bothIningAvgRunRate;
  } else {
    // ✅ Normal formula
    teamAvgScore =
      ((totalScore + bothIningsAvgScore) / 2 +
        format.over * bothIningAvgRunRate) /
      2;
  }

  return teamAvgScore;
};

const CalculateMatchPoint = (matchFormat: any) => {
  switch (matchFormat) {
    case "T20I":
      return { point: 0.6, over: 20 };
    case "T10":
      return { point: 0.8, over: 10 };
    case "ODI":
      return { point: 0.5, over: 50 };
    case "TEST":
      return { point: 0.4, over: 70 };
    default:
      return { point: 0.7, over: 16.4 };
  }
};

const CalculateWinnerTeam = (team: any) => {
  const playerSquad =
    team.playingPlayer.length > 0 ? team.playingPlayer : team.benchPlayer;
  let batScore = 0;
  let bowlScore = 0;

  playerSquad.forEach((element: any) => {
    if (element.battingAvg) {
      batScore += Number(element.battingAvg.averageRuns) || 0;
    }
    if (element.bowlingAvg) {
      bowlScore += Number(element.bowlingAvg.averageWickets) || 0;
    }
  });

  return batScore * 0.6 + bowlScore * 0.5;
};

const FantasyAnalysis = (squad: any) => {
  const prepareSquad = squad.map((item: any) => {
    const currentSquad =
      item.playingPlayer.length > 0 ? item.playingPlayer : item.benchPlayer;
    return {
      flag: item.flag,
      color: item.color,
      shortName: item.shortName,
      squad: currentSquad,
    };
  });

  const mergePlayers = prepareSquad
    .flatMap((team: any) =>
      team.squad.map((player: any) => ({
        ...player,
        teamFlag: team.flag,
        teamShortName: team.shortName,
        teamColor: team.color,
        totalPoint:
          Number(player.fantasyAvg.averageBatting || 0) +
          Number(player.fantasyAvg.averageBowling || 0) +
          Number(player.fantasyAvg.averageFielding || 0),
      }))
    )
    .sort((a: any, b: any) => b.totalPoint - a.totalPoint);

  const filterWK = mergePlayers.find((item: any) => item.type === "WK");
  const filterAR = mergePlayers.find((item: any) => item.type === "AR");
  const filterBat = mergePlayers
    .filter((item: any) => item.type === "BAT")
    .slice(0, 2);
  const filterBowl = mergePlayers
    .filter((item: any) => item.type === "BOWL")
    .slice(0, 2);

  const requiredArray = [
    { ...filterWK },
    { ...filterAR },
    ...filterBat,
    ...filterBowl,
  ];

  const uniqueInArr1 = mergePlayers
    .filter((a: any) => !requiredArray.some((b: any) => b.id === a.id))
    .sort((a: any, b: any) => b.totalPoint - a.totalPoint);

  const playingPlayer = [...requiredArray, ...uniqueInArr1.slice(0, 5)].sort(
    (a: any, b: any) => b.totalPoint - a.totalPoint
  );

  // Step 4: Build dream11Team
  const dream11Team = {
    captain: {
      ...playingPlayer[0],
      points: parseFloat(playingPlayer[0].totalPoint.toFixed(1)),
      form: "Excellent",
    },
    viceCaptain: {
      ...playingPlayer[1],
      points: parseFloat(playingPlayer[1].totalPoint.toFixed(1)),
      form: "Good",
    },
    players: playingPlayer.filter(
      (p: any) => p.id !== mergePlayers[0].id && p.id !== mergePlayers[1].id
    ),
  };

  // Step 5: Key players per team
  const keyPlayers = {
    team1: prepareSquad[0].squad.slice(0, 5).map((item: any) => ({
      ...item,
      impact: item.totalPoint > 40 ? "High" : "Medium",
    })),
    team2: prepareSquad[1].squad.slice(0, 5).map((item: any) => ({
      ...item,
      impact: item.totalPoint > 40 ? "High" : "Medium",
    })),
  };

  // Step 6: Top batsman per team
  const topBatsman = (team: any) =>
    team.squad.reduce((best: any, p: any) =>
      parseFloat(p.battingAvg?.averageRuns || 0) >
      parseFloat(best.battingAvg?.averageRuns || 0)
        ? p
        : best
    );

  // Step 7: Top bowler per team
  const topBowler = (team: any) =>
    team.squad.reduce((best: any, p: any) =>
      parseFloat(p.bowlingAvg?.averageWickets || 0) >
      parseFloat(best.bowlingAvg?.averageWickets || 0)
        ? p
        : best
    );

  return {
    dream11Team,
    keyPlayers,
    topBatsman: {
      team1: topBatsman(prepareSquad[0]),
      team2: topBatsman(prepareSquad[1]),
    },
    topBowler: {
      team1: topBowler(prepareSquad[0]),
      team2: topBowler(prepareSquad[1]),
    },
  };
};

export const getConfidence = (chance: number) => {
  switch (true) {
    case chance < 30:
      return "Low";
    case chance >= 30 && chance <= 55:
      return "Medium";
    case chance > 55:
      return "High";
    default:
      return "Unknown";
  }
};

export const GetAIPrediction = (data: any) => {
  const squadList = data.squadList.map((item: any) => {
    const playingPlayer = item.playingPlayer.map((playing: any) => {
      const battingAvg = CalculateBattingAverages(
        playing.battingForm.slice(0, 20)
      );
      const bowlingAvg = CalculateBowlingAverages(
        playing.bowlingForm.slice(0, 20)
      );
      const fantasyAvg = CalculateFantasyAverages(
        playing.fantasyPoints.slice(0, 20)
      );
      return {
        id: playing.id,
        name: playing.name,
        shortName: playing.shortName,
        batStyle: playing.batStyle,
        bowlStyle: playing.bowlStyle,
        imageUrl: playing.imageUrl.src,
        type: playing.type,
        battingAvg: battingAvg,
        bowlingAvg: bowlingAvg,
        fantasyAvg: fantasyAvg,
      };
    });
    const benchPlayer = item.benchPlayer.map((bench: any) => {
      const battingAvg = CalculateBattingAverages(
        bench.battingForm.slice(0, 20)
      );
      const bowlingAvg = CalculateBowlingAverages(
        bench.bowlingForm.slice(0, 20)
      );
      const fantasyAvg = CalculateFantasyAverages(
        bench.fantasyPoints.slice(0, 20)
      );
      return {
        id: bench.id,
        name: bench.name,
        shortName: bench.shortName,
        batStyle: bench.batStyle,
        bowlStyle: bench.bowlStyle,
        imageUrl: bench.imageUrl.src,
        type: bench.type,
        battingAvg: battingAvg,
        bowlingAvg: bowlingAvg,
        fantasyAvg: fantasyAvg,
      };
    });

    return {
      flag: item.flag,
      color: item.color,
      shortName: item.shortName,
      playingPlayer: playingPlayer,
      benchPlayer: benchPlayer,
    };
  });
  const stadiumAvg = CalculateStadiumAverage(data.stadiumStats);

  const team1AvgScore = AccordingPlayerTeamAvg(
    squadList[0],
    CalculateMatchPoint(data.matchInfo.format),
    stadiumAvg
  );
  const team2AvgScore = AccordingPlayerTeamAvg(
    squadList[1],
    CalculateMatchPoint(data.matchInfo.format),
    stadiumAvg
  );

  const team1WinnerCalculation = CalculateWinnerTeam(squadList[0]);
  const team2WinnerCalculation = CalculateWinnerTeam(squadList[1]);

  const total = Number(team1WinnerCalculation) + Number(team2WinnerCalculation);

  const team1Chance =
    total > 0
      ? Number((team1WinnerCalculation / total) * 100).toFixed(2)
      : Number("50.00");
  const team2Chance =
    total > 0
      ? Number((team2WinnerCalculation / total) * 100).toFixed(2)
      : Number("50.00");

  const fantasyReport = FantasyAnalysis(squadList);

  const response = {
    team1: {
      flag: squadList[0].flag,
      color: squadList[0].color,
      shortName: squadList[0].shortName,
    },
    team2: {
      flag: squadList[1].flag,
      color: squadList[1].color,
      shortName: squadList[1].shortName,
    },
    firstInningScore: {
      team1: {
        min: Number(team1AvgScore) - 10,
        max: Number(team1AvgScore) + 10,
        predicted: Number(team1AvgScore),
      },
      team2: {
        min: Number(team2AvgScore) - 10,
        max: Number(team2AvgScore) + 10,
        predicted: Number(team2AvgScore),
      },
    },
    winnerPrediction: {
      team1: {
        probability: Number(team1Chance).toFixed(2),
        confidence: getConfidence(Number(team1Chance) || 0),
      },
      team2: {
        probability: Number(team2Chance).toFixed(2),
        confidence: getConfidence(Number(team2Chance) || 0),
      },
    },
    ...fantasyReport,
  };

  return response;
};
