import {
  CalculateBatting,
  CalculateBattingG,
  CalculateBowling,
  CalculateBowlingG,
  CalculateFantasy,
  CheckIntValue,
  SortArray,
} from "@/lib/utils";

export const getNewAnalysis = async (data: any) => {
  const playerScoreCalculate = (player: any) => {
    const fantasyStats = CalculateFantasy(player.fantasyPoints || []);

    //---------------------------Recent batting & Bowling form stats------------------------

    const recentBattingFormStats = CalculateBatting(player.battingForm);

    const recentBowlingFormStats = CalculateBowling(player.bowlingForm || []);

    //----------------Finish Recent Batting & Bowling Form Stats-----------------------

    //--------------------------- batting & bowling  stats------------------------

    const battingStats = CalculateBattingG(player.battingStats || []);

    const bowlingStats = CalculateBowlingG(player.bowlingStats || []);

    //----------------Finish Batting & bowling Stats-----------------------

    //---------------------------statdium batting  stats------------------------
    const prepareStadiumBattingStats = (
      player.stadiumStats.battingStats || []
    ).map((item: any) => ({
      ...item,
      strikeRate: CheckIntValue(item.sr),
    }));

    const statdiumBattingStats = CalculateBattingG(
      prepareStadiumBattingStats || []
    );

    const prepareStadiumBowlingStats = (
      player.stadiumStats.bowlingStats || []
    ).map((item: any) => ({ ...item, economy: CheckIntValue(item.econ) }));
    const statdiumBowlingStats = CalculateBowlingG(prepareStadiumBowlingStats);

    //----------------Finish statdium Batting Stats-----------------------

    return {
      fantasyStats,
      recentBattingFormStats,
      recentBowlingFormStats,
      battingStats,
      statdiumBowlingStats,
      bowlingStats,
      statdiumBattingStats,
    };
  };

  const team1 = data.squadList[0];
  const team2 = data.squadList[2];

  const team1Players = playerScoreCalculate(team1.benchPlayer[1]);

  const response1 = {
    fantasyStats: {
      avgRunsPoint: 13.32,
      avgBowlPoint: 29.43,
    },
    recentBattingFormStats: {
      averageRuns: 14.65,
      averageBalls: 9.45,
      averageStrikeRate: 106.2405,
    },
    recentBowlingFormStats: {
      avgEconmy: 6.51,
      avgWicket: 0.85,
      avgOver: 8.545,
    },
    battingStats: {
      avgRuns: 16.911055172897278,
      avgBallFaced: 13.84442808653335,
      avgStrikeRate: 118.4625,
    },
    statdiumBowlingStats: {
      avgInnings: 1.7333333333333334,
      avgBowled: 51.6,
      avgConsumedRuns: 54.733333333333334,
      avgWicket: 1.6666666666666667,
      avgEconomy: 6.978666666666666,
      average: 22.40666666666667,
    },
    bowlingStats: {
      avgInnings: 41.375,
      avgBowled: 1306,
      avgConsumedRuns: 1273.75,
      avgWicket: 44.375,
      avgEconomy: 6.831249999999999,
      average: 29.355,
    },
    statdiumBattingStats: {
      avgRuns: 22.58888888888889,
      avgBallFaced: 16.644444444444446,
      avgStrikeRate: 118.60666666666665,
    },
  };
  console.log(team1Players);
};
