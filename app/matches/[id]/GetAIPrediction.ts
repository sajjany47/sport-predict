export const CalculateBattingAverages = (data: any) => {
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
    }
    totalSR += parseFloat(item.sr);
  });

  const count = data.length;

  return {
    averageRuns: (totalRuns / count).toFixed(2),
    averageBalls: (totalBalls / count).toFixed(2),
    averageSR: (totalSR / count).toFixed(2),
  };
};

export const CalculateBowlingAverages = (data: any) => {
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

export const CalculateFantasyAverages = (data: any) => {
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
  console.log(squadList);
};
