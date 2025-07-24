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
const CalculateStadiumAverage = (matches: any) => {
  let totalInn1Runs = 0;
  let totalInn2Runs = 0;
  let totalInn1Overs = 0;
  let totalInn2Overs = 0;
  let count = matches.length;

  matches.forEach((match: any) => {
    const inn1 = ParseScore(match.inn1Score) || 0;
    const inn2 = ParseScore(match.inn2Score) || 0;

    totalInn1Runs += inn1.runs || 0;
    totalInn2Runs += inn2.runs || 0;
    totalInn1Overs += inn1.overs || 0;
    totalInn2Overs += inn2.overs || 0;
  });

  return {
    averageInnings1Score: (totalInn1Runs / count).toFixed(2),
    averageInnings2Score: (totalInn2Runs / count).toFixed(2),
    innings1RunRate: (totalInn1Runs / totalInn1Overs).toFixed(2),
    innings2RunRate: (totalInn2Runs / totalInn2Overs).toFixed(2),
  };
};

const AccordingPlayerTeamAvg = (squad: any, format: any, stadiumAvg: any) => {
  const playerSquad =
    squad.playingPlayer.length > 0 ? squad.playingPlayer : squad.benchPlayer;
  let totalScore = 0;
  playerSquad.forEach((element: any) => {
    totalScore += Number(element.battingAvg.averageRuns) || 0;
  });

  const bothIningAvgRunRate =
    (Number(stadiumAvg.innings1RunRate) + Number(stadiumAvg.innings2RunRate)) /
    2;

  const bothIningsAvgScore =
    (Number(stadiumAvg.averageInnings1Score) +
      Number(stadiumAvg.averageInnings2Score)) /
    2;

  const teamAvgScore =
    ((totalScore + bothIningsAvgScore) / 2 +
      format.over * bothIningAvgRunRate) /
    2;

  return teamAvgScore;
  // totalScore=======> 197.64999999999998

  // format=======> 0.5

  // stadiumAvg====> {averageInnings1Score: '181.00', averageInnings2Score: '172.90', innings1RunRate: '7.87', innings2RunRate: '8.24'}
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

  console.log("team1AvgScore======>", team1AvgScore);
  console.log("team2AvgScore======>", team2AvgScore);
};
