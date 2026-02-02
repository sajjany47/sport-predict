import {
  FindMatchOver,
  GetConfidence,
  GetDefaultRolePrediction,
  GetHint,
  MaxMin,
  PickTop,
  PickTopBatter,
  PickTopBowler,
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

export const GetNewAnalysis = async (data: any) => {
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
      prepareStadiumBattingStats || [],
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
    const processPlayer = (p: any) => {
      const playerData = playerScoreCalculate(p);
      const playerPredictScore = playerPredictionScoreCalculate(
        playerData,
        matchOverInfo.over,
      );

      const batting = playerPredictScore?.batting || {};
      const bowling = playerPredictScore?.bowling || {};

      const isZero =
        (!batting.totalRuns || batting.totalRuns === 0) &&
        (!batting.totalAvgBallFaced || batting.totalAvgBallFaced === 0) &&
        (!batting.totalAvgStrikeRate || batting.totalAvgStrikeRate === 0) &&
        (!bowling.totalAvgOvers || bowling.totalAvgOvers === 0) &&
        (!bowling.totalAvgWickets || bowling.totalAvgWickets === 0) &&
        (!bowling.totalAvgRunsConceded || bowling.totalAvgRunsConceded === 0);

      let a = {
        batting: {
          // fantasyBattingRuns: 0,
          totalRuns: 0,
          totalAvgStrikeRate: 0,
          totalAvgBallFaced: 0,
        },
        bowling: {
          // fantasyBowlingPoints: 0,
          totalAvgOvers: 0,
          totalAvgWickets: 0,
          totalAvgRunsConceded: 0,
          totalAvgEconomy: 0,
        },
      };

      if (isZero) {
        const def =
          GetDefaultRolePrediction(p.role, data.matchInfo.format) || {};
        a = {
          batting: {
            // fantasyBattingRuns: def.battingPoint || 0,
            totalRuns: def.runs || 0,
            totalAvgStrikeRate: def.strikeRate || 0,
            totalAvgBallFaced: def.totalBallsFaced || 0,
          },
          bowling: {
            // fantasyBowlingPoints: def.bowlingPoint || 0,
            totalAvgOvers: def.overs || 0,
            totalAvgWickets: def.wkts || 0,
            totalAvgRunsConceded: def.runsConceded || 0,
            totalAvgEconomy: def.economy || 0,
          },
        };
      } else {
        a = {
          ...playerPredictScore,
          batting: {
            ...playerPredictScore.batting,
          },
        };
      }

      return {
        name: p.name,
        image: p.image,
        role: p.role,
        ...a,
      };
    };

    const playingPlayer = (item.playingPlayer || []).map(processPlayer);
    const benchPlayer = (item.benchPlayer || []).map(processPlayer);

    const selectPlayerList =
      Array.isArray(item.playingPlayer) && item.playingPlayer.length > 0
        ? playingPlayer
        : benchPlayer;

    const count = selectPlayerList.length;

    const totals = selectPlayerList.reduce(
      (acc: any, pl: any) => {
        acc.battingRunsTotal += Number(pl.batting.totalRuns || 0);
        acc.wicketsTotal += Number(pl.bowling.totalAvgWickets || 0);
        acc.oversTotal += Number(pl.bowling.totalAvgOvers || 0);
        acc.runsConcededTotal += Number(pl.bowling.totalAvgRunsConceded || 0);
        return acc;
      },
      {
        battingRunsTotal: 0,
        wicketsTotal: 0,
        oversTotal: 0,
        runsConcededTotal: 0,
      },
    );

    const safePredict = () => {
      if (count === 0) {
        return {
          totalBattingRuns: 0,
          totalOvers: 0,
          totalRunsConceded: 0,
          totalWickets: 0,
        };
      }

      const avgBattingRuns = SafeDivide(totals.battingRunsTotal, count);
      const avgOvers = SafeDivide(totals.oversTotal, count);
      const avgRunsConceded = SafeDivide(totals.runsConcededTotal, count);
      const avgWickets = SafeDivide(totals.wicketsTotal, count);

      const totalBattingRuns = CheckIntValue(avgBattingRuns * 11, 0);
      const totalOvers = CheckIntValue(avgOvers * 11, 2);
      const totalRunsConceded = CheckIntValue(avgRunsConceded * 11, 2);

      let totalWickets = CheckIntValue(avgWickets * 11, 2);
      // if (totalWickets > 10) totalWickets = 10;

      return {
        totalBattingRuns,
        totalOvers,
        totalRunsConceded,
        totalWickets,
      };
    };

    return {
      ...item,
      playingPlayer,
      benchPlayer,
      predict: safePredict(),
    };
  });

  //.............................................................................
  const teamPredictCalculate = (teamA: any, teamB: any) => {
    let wkt_rate = 5;

    const teamAFirstInningScore = CheckIntValue(
      SafeDivide(
        teamA.predict.totalBattingRuns + teamB.predict.totalRunsConceded,
        2,
      ) -
        teamB.predict.totalWickets * wkt_rate,
    );

    const teamBFirstInningScore = CheckIntValue(
      SafeDivide(
        teamB.predict.totalBattingRuns + teamA.predict.totalRunsConceded,
        2,
      ) -
        teamA.predict.totalWickets * wkt_rate,
    );

    const totalBothTeamScore = teamAFirstInningScore + teamBFirstInningScore;

    const teamAChance =
      totalBothTeamScore > 0
        ? CheckIntValue((teamAFirstInningScore / totalBothTeamScore) * 100)
        : Number("50.00");
    const teamBChance =
      totalBothTeamScore > 0
        ? CheckIntValue((teamBFirstInningScore / totalBothTeamScore) * 100)
        : Number("50.00");

    const hintData = GetHint(teamAChance, teamBChance);

    // choose active list (playingPlayer if exists else benchPlayer)
    // helpers to pick the top batsman/bowler without mutating arrays

    const t1Players =
      teamA.playingPlayer && teamA.playingPlayer.length
        ? teamA.playingPlayer.slice()
        : teamA.benchPlayer.slice();
    const t2Players =
      teamB.playingPlayer && teamB.playingPlayer.length
        ? teamB.playingPlayer.slice()
        : teamB.benchPlayer.slice();

    // top batsman by batting.totalRuns and top bowler by bowling.totalAvgWickets
    const team1TopBatsman = PickTopBatter(t1Players);

    const team2TopBatsman = PickTopBatter(t2Players);

    const team1TopBowler = PickTopBowler(
      t1Players,
      matchOverInfo.bowlerOverLimit,
    );

    const team2TopBowler = PickTopBowler(
      t2Players,
      matchOverInfo.bowlerOverLimit,
    );

    const response = {
      team1: {
        name: teamA.name,
        shortName: teamA.shortName,
        flag: teamA.flag,
        firstInningScore: {
          ...MaxMin(teamAFirstInningScore, teamB.predict.totalWickets),
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
        topBatsman: team1TopBatsman
          ? {
              name: team1TopBatsman.name,
              image: team1TopBatsman.image,
              role: team1TopBatsman.role,
              batting: {
                totalRuns: CheckIntValue(
                  team1TopBatsman.batting.totalRuns.toFixed(0),
                ),
                totalAvgStrikeRate: CheckIntValue(
                  SafeDivide(
                    team1TopBatsman.batting.totalRuns,
                    team1TopBatsman.batting.totalAvgBallFaced,
                  ) * 100,
                ),
                totalAvgBallFaced: CheckIntValue(
                  team1TopBatsman.batting.totalAvgBallFaced.toFixed(0),
                ),
              },
            }
          : null,
        topBowler: team1TopBowler
          ? {
              name: team1TopBowler.name,
              image: team1TopBowler.image,
              role: team1TopBowler.role,
              bowling: {
                totalAvgEconomy: team1TopBowler.bowling.totalAvgEconomy,
                totalAvgOvers: CheckIntValue(
                  team1TopBowler.bowling.totalAvgOvers.toFixed(0),
                ),
                totalAvgWickets: CheckIntValue(
                  team1TopBowler.bowling.totalAvgWickets.toFixed(0),
                ),
                totalAvgRunsConceded: CheckIntValue(
                  team1TopBowler.bowling.totalAvgRunsConceded.toFixed(0),
                ),
              },
            }
          : null,
      },
      team2: {
        name: teamB.name,
        shortName: teamB.shortName,
        flag: teamB.flag,
        firstInningScore: {
          ...MaxMin(teamBFirstInningScore, teamA.predict.totalWickets),
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
        topBatsman: team2TopBatsman
          ? {
              name: team2TopBatsman.name,
              image: team2TopBatsman.image,
              role: team2TopBatsman.role,
              batting: {
                totalRuns: CheckIntValue(
                  team2TopBatsman.batting.totalRuns.toFixed(0),
                ),
                totalAvgStrikeRate: CheckIntValue(
                  SafeDivide(
                    team2TopBatsman.batting.totalRuns,
                    team2TopBatsman.batting.totalAvgBallFaced,
                  ) * 100,
                ),
                totalAvgBallFaced: CheckIntValue(
                  team2TopBatsman.batting.totalAvgBallFaced.toFixed(0),
                ),
              },
            }
          : null,
        topBowler: team2TopBowler
          ? {
              name: team2TopBowler.name,
              image: team2TopBowler.image,
              role: team2TopBowler.role,
              bowling: {
                totalAvgEconomy: team2TopBowler.bowling.totalAvgEconomy,
                totalAvgOvers: CheckIntValue(
                  team2TopBowler.bowling.totalAvgOvers.toFixed(0),
                ),
                totalAvgWickets: CheckIntValue(
                  team2TopBowler.bowling.totalAvgWickets.toFixed(0),
                ),
                totalAvgRunsConceded: CheckIntValue(
                  team2TopBowler.bowling.totalAvgRunsConceded.toFixed(0),
                ),
              },
            }
          : null,
      },
    };

    return response;
  };
  //.............................................................................
  const result = teamPredictCalculate(prepareTeamSquad[0], prepareTeamSquad[1]);
  return result;
};
