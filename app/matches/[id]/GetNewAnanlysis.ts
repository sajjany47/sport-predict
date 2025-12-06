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
    let battingRuns = 0;
    let wicketsTaken = 0;
    let oversBowled = 0;
    let runsConceded = 0;

    const processPlayer = (p: any) => {
      const playerData = playerScoreCalculate(p);
      const playerPredictScore = playerPredictionScoreCalculate(
        playerData,
        matchOverInfo.over
      );

      const batting = playerPredictScore?.batting || {};
      const bowling = playerPredictScore?.bowling || {};

      const hasBatting = batting.totalRuns !== 0 && !!batting.totalRuns;
      const hasBowling =
        bowling.totalAvgWickets !== 0 && !!bowling.totalAvgWickets;

      if (hasBatting && hasBowling) {
        // use predicted values
        battingRuns += batting.totalRuns || 0;
        wicketsTaken += bowling.totalAvgWickets || 0;
        oversBowled += bowling.totalAvgOvers || 0;
        runsConceded += bowling.totalAvgRunsConceded || 0;
      } else {
        // fallback: default by role + format
        const def = GetDefaultRolePrediction(p.role, data.matchInfo.format);
        battingRuns += def.runs || 0;
        wicketsTaken += def.wkts || 0;
        oversBowled += def.overs || 0;
        runsConceded += def.runsConceded || 0;
      }

      return {
        name: p.name,
        image: p.image,
        role: p.role,
        ...playerPredictScore, // { batting: {...}, bowling: {...} }
      };
    };

    const playingPlayer = (item.playingPlayer || []).map(processPlayer);
    const benchPlayer = (item.benchPlayer || []).map(processPlayer);

    const playerCount = playingPlayer.length + benchPlayer.length || 1;

    const overallTotalBattingRuns = CheckIntValue(
      SafeDivide(battingRuns, playerCount)
    );
    const overallTotalWickets = CheckIntValue(
      SafeDivide(wicketsTaken, playerCount)
    );
    const overallTotalOvers = CheckIntValue(
      SafeDivide(oversBowled, playerCount)
    );
    const overallTotalRunsConceded = CheckIntValue(
      SafeDivide(runsConceded, playerCount)
    );

    return {
      ...item,
      playingPlayer,
      benchPlayer,
      predict: {
        overallTotalBattingRuns,
        overallTotalOvers,
        overallTotalRunsConceded,
        overallTotalWickets,
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
