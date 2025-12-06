import {
  FindMatchOver,
  GetDefaultRolePrediction,
  SafeDivide,
} from "./../../../lib/utils";
import {
  CalculateBatting,
  CalculateBattingG,
  CalculateBowling,
  CalculateBowlingG,
  CalculateFantasy,
  CheckIntValue,
  playerPredictionScoreCalculate,
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
    ).map((item: any) => ({
      ...item,
      wicket: CheckIntValue(item.wickets),
      economy: CheckIntValue(item.econ),
    }));
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
  const matchOverInfo = FindMatchOver(data.matchInfo.format);

  // console.log(playerScoreCalculate(data.squadList[0].benchPlayer[1]));
  const prepareTeamSquad = data.squadList.map((item: any) => {
    let battingRunsTotal = 0;
    let wicketsTotal = 0;
    let oversTotal = 0;
    let runsConcededTotal = 0;

    const processPlayer = (p: any) => {
      const playerData = playerScoreCalculate(p);
      const playerPredictScore = playerPredictionScoreCalculate(
        playerData,
        matchOverInfo.over
      );

      const batting = playerPredictScore?.batting || {};
      const bowling = playerPredictScore?.bowling || {};

      const def = GetDefaultRolePrediction(p.role, data.matchInfo.format);

      // -------------------------------
      // 1️⃣ Check if BATTING BLOCK is fully zero
      // -------------------------------
      const battingIsZero =
        (!batting.totalRuns || batting.totalRuns === 0) &&
        (!batting.totalAvgBallFaced || batting.totalAvgBallFaced === 0) &&
        (!batting.totalAvgStrikeRate || batting.totalAvgStrikeRate === 0);

      // -------------------------------
      // 2️⃣ Check if BOWLING BLOCK is fully zero
      // -------------------------------
      const bowlingIsZero =
        (!bowling.totalAvgOvers || bowling.totalAvgOvers === 0) &&
        (!bowling.totalAvgWickets || bowling.totalAvgWickets === 0) &&
        (!bowling.totalAvgRunsConceded || bowling.totalAvgRunsConceded === 0);

      // -------------------------------
      // 3️⃣ Final values (Predicted OR Default)
      // -------------------------------
      const finalBattingRuns =
        battingIsZero && bowlingIsZero ? def.runs : batting.totalRuns || 0;

      const finalWickets =
        battingIsZero && bowlingIsZero
          ? def.wkts
          : bowling.totalAvgWickets || 0;

      const finalOvers =
        battingIsZero && bowlingIsZero ? def.overs : bowling.totalAvgOvers || 0;

      const finalRunsConceded =
        battingIsZero && bowlingIsZero
          ? def.runsConceded
          : bowling.totalAvgRunsConceded || 0;

      // -------------------------------
      // 4️⃣ Add to team totals
      // -------------------------------
      battingRunsTotal += finalBattingRuns;
      wicketsTotal += finalWickets;
      oversTotal += finalOvers;
      runsConcededTotal += finalRunsConceded;

      return {
        name: p.name,
        image: p.image,
        role: p.role,
        ...playerPredictScore,
      };
    };

    const playingPlayer = (item.playingPlayer || []).map(processPlayer);
    const benchPlayer = (item.benchPlayer || []).map(processPlayer);

    return {
      ...item,
      playingPlayer,
      benchPlayer,
      predict: {
        totalBattingRuns: CheckIntValue(battingRunsTotal),
        totalOvers: CheckIntValue(oversTotal),
        totalRunsConceded: CheckIntValue(runsConcededTotal),
        totalWickets: CheckIntValue(wicketsTotal),
      },
    };
  });

  console.log(prepareTeamSquad);
  const response1 = {
    fantasyStats: {
      avgRunsPoint: 14.8,
      avgBowlPoint: 32.7,
    },
    recentBattingFormStats: {
      averageRuns: 14.65,
      averageBallsFaced: 9.45,
      averageStrikeRate: 106.24,
    },
    recentBowlingFormStats: {
      avgEconmy: 6.51,
      avgWicket: 0.85,
      avgOver: 0.17,
      avgRunsConsumed: 29.25,
    },
    battingStats: {
      run: 1.19,
      avgStrikeRate: 118.46,
      avgBallPercentage: 7.16,
    },
    statdiumBowlingStats: {
      avgEconmy: 6.98,
      avgWicket: 0.18,
      avgOverPercentage: 16.49,
      avgRunsPerOver: 6.98,
    },
    bowlingStats: {
      avgEconmy: 6.83,
      avgWicket: 0.24,
      avgOverPercentage: 17.18,
      avgRunsPerOver: 6.84,
    },
    statdiumBattingStats: {
      run: 1.19,
      avgStrikeRate: 118.61,
      avgBallPercentage: 9.2,
    },
  };
  // const a = playerPredictionScoreCalculate(response1, 20);
  // console.log(a);
};
