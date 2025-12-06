import {
  CalculateBatting,
  CalculateBattingG,
  CalculateBowling,
  CalculateBowlingG,
  CalculateFantasy,
  CheckIntValue,
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

  const prepareTeamSquad = data.squadList.map((item: any) => {
    const playingPlayer = item.playingPlayer.map((p: any) => {
      const playerData = playerScoreCalculate(p);
      return {
        name: p.name,
        image: p.image,
        role: p.role,
        ...playerData,
      };
    });
    const benchPlayer = item.benchPlayer.map((p: any) => {
      const playerData = playerScoreCalculate(p);
      return {
        name: p.name,
        image: p.image,
        role: p.role,
        ...playerData,
      };
    });

    return { ...item, playingPlayer, benchPlayer };
  });

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
      avgOver: 0.85,
      avgRunsConsumed: 29.25,
    },
    battingStats: {
      run: 1.18,
      avgStrikeRate: 118.46,
      avgBallPercentage: 7.16,
    },
    statdiumBowlingStats: {
      avgEconmy: 6.98,
      avgWicket: 0.18,
      avgOverPercentage: 16.49,
    },
    bowlingStats: {
      avgEconmy: 6.83,
      avgWicket: 0.24,
      avgOverPercentage: 17.18,
    },
    statdiumBattingStats: {
      run: 1.19,
      avgStrikeRate: 118.61,
      avgBallPercentage: 9.2,
    },
  };
  console.log(prepareTeamSquad);
};
