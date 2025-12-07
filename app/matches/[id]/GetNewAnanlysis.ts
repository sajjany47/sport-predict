import {
  FindMatchOver,
  GetConfidence,
  GetDefaultRolePrediction,
  GetHint,
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
    const processPlayer = (p: any) => {
      const playerData = playerScoreCalculate(p);
      const playerPredictScore = playerPredictionScoreCalculate(
        playerData,
        matchOverInfo.over
      );

      const batting = playerPredictScore?.batting || {};
      const bowling = playerPredictScore?.bowling || {};

      // -------------------------------
      // 1️⃣ Check if BATTING BLOCK is fully zero
      // -------------------------------
      const isZero =
        (!batting.totalRuns || batting.totalRuns === 0) &&
        (!batting.totalAvgBallFaced || batting.totalAvgBallFaced === 0) &&
        (!batting.totalAvgStrikeRate || batting.totalAvgStrikeRate === 0) &&
        (!bowling.totalAvgOvers || bowling.totalAvgOvers === 0) &&
        (!bowling.totalAvgWickets || bowling.totalAvgWickets === 0) &&
        (!bowling.totalAvgRunsConceded || bowling.totalAvgRunsConceded === 0);

      // -------------------------------
      let a = {
        batting: {
          fantasyBattingRuns: 0,
          totalRuns: 0,
          totalAvgStrikeRate: 0,
          totalAvgBallFaced: 0,
        },
        bowling: {
          fantasyBowlingPoints: 0,
          totalAvgOvers: 0,
          totalAvgWickets: 0,
          totalAvgRunsConceded: 0,
          totalAvgEconomy: 0,
        },
      };

      if (isZero) {
        const def = GetDefaultRolePrediction(p.role, data.matchInfo.format);

        a = {
          batting: {
            fantasyBattingRuns: def.battingPoint || 0,
            totalRuns: def.runs || 0,
            totalAvgStrikeRate: def.strikeRate || 0,
            totalAvgBallFaced: def.totalBallsFaced || 0,
          },
          bowling: {
            fantasyBowlingPoints: def.bowlingPoint || 0,
            totalAvgOvers: def.overs || 0,
            totalAvgWickets: def.wkts || 0,
            totalAvgRunsConceded: def.runsConceded || 0,
            totalAvgEconomy: def.economy || 0,
          },
        };
      } else {
        const addFantasyRuns = CheckIntValue(
          SafeDivide(
            playerPredictScore.batting.fantasyBattingRuns +
              playerPredictScore.batting.totalRuns,
            2
          )
        );
        const extraBalls = SafeDivide(
          playerPredictScore.batting.fantasyBattingRuns,
          playerPredictScore.batting.totalAvgStrikeRate
        );
        a = {
          ...playerPredictScore,
          batting: {
            ...playerPredictScore.batting,
            totalRuns: CheckIntValue(addFantasyRuns.toFixed(0)),
            totalAvgBallFaced: CheckIntValue(
              (
                playerPredictScore.batting.totalAvgBallFaced + extraBalls
              ).toFixed(0)
            ),
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

    const selectPlayeList =
      item.playingPlayer.length > 0 ? playingPlayer : benchPlayer;

    const count = selectPlayeList.length;

    const totals = selectPlayeList.reduce(
      (acc: any, p: any) => {
        acc.battingRunsTotal += p.batting.totalRuns || 0;
        acc.wicketsTotal += p.bowling.totalAvgWickets || 0;
        acc.oversTotal += p.bowling.totalAvgOvers || 0;
        acc.runsConcededTotal += p.bowling.totalAvgRunsConceded || 0;
        return acc;
      },
      {
        battingRunsTotal: 0,
        wicketsTotal: 0,
        oversTotal: 0,
        runsConcededTotal: 0,
      }
    );

    return {
      ...item,
      playingPlayer,
      benchPlayer,
      predict: {
        totalBattingRuns: CheckIntValue(
          SafeDivide(totals.battingRunsTotal, count) * selectPlayeList.length
        ),
        totalOvers: CheckIntValue(
          SafeDivide(totals.oversTotal, count) * selectPlayeList.length
        ),
        totalRunsConceded: CheckIntValue(
          SafeDivide(totals.runsConcededTotal, count) * selectPlayeList.length
        ),
        totalWickets:
          CheckIntValue(
            SafeDivide(totals.wicketsTotal, count) * selectPlayeList.length
          ) > 10
            ? 10
            : CheckIntValue(
                SafeDivide(totals.wicketsTotal, count) * selectPlayeList.length
              ),
      },
    };
  });

  const team1 = prepareTeamSquad[0];
  const team2 = prepareTeamSquad[1];

  // const team1FirstInningScore = CheckIntValue(
  //   SafeDivide(
  //     team1.predict.totalBattingRuns + team2.predict.totalRunsConceded,
  //     2
  //   )
  // );
  // const team2FirstInningScore = CheckIntValue(
  //   SafeDivide(
  //     team2.predict.totalBattingRuns + team1.predict.totalRunsConceded,
  //     2
  //   )
  // );

  const team1FirstInningScore = CheckIntValue(team1.predict.totalBattingRuns);
  const team2FirstInningScore = CheckIntValue(team2.predict.totalBattingRuns);

  const totalScore = team1FirstInningScore + team2FirstInningScore;

  const team1Chance =
    totalScore > 0
      ? CheckIntValue((team1FirstInningScore / totalScore) * 100)
      : Number("50.00");
  const team2Chance =
    totalScore > 0
      ? CheckIntValue((team2FirstInningScore / totalScore) * 100)
      : Number("50.00");

  const hintData = GetHint(team1Chance, team2Chance);

  const team1PlayerList = team1.playingPlayer.length
    ? team1.playingPlayer
    : team1.benchPlayer;
  const team2PlayerList = team2.playingPlayer.length
    ? team2.playingPlayer
    : team2.benchPlayer;

  const team1TopBatsman =
    team1PlayerList.sort(
      (a: any, b: any) => b.batting.totalRuns - a.batting.totalRuns
    )[0] || null;
  const team2TopBatsman =
    team2PlayerList.sort(
      (a: any, b: any) => b.batting.totalRuns - a.batting.totalRuns
    )[0] || null;

  const team1TopBowler =
    team1PlayerList.sort(
      (a: any, b: any) => b.bowling.totalAvgWickets - a.bowling.totalAvgWickets
    )[0] || null;

  const team2TopBowler =
    team2PlayerList.sort(
      (a: any, b: any) => b.bowling.totalAvgWickets - a.bowling.totalAvgWickets
    )[0] || null;
  const response = {
    team1: {
      name: team1.name,
      shortName: team1.shortName,
      flag: team1.flag,
      firstInningScore: {
        min: CheckIntValue(team1FirstInningScore.toFixed(0)) - 10,
        max: CheckIntValue(team1FirstInningScore.toFixed(0)) + 10,
        predicted: CheckIntValue(team1FirstInningScore.toFixed(0)),
        wickets: CheckIntValue(team2.predict.totalWickets.toFixed(0)),
      },
      winnerPrediction: {
        probability: team1Chance,
        confidence: GetConfidence(team1Chance),
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
                team1TopBatsman.batting.totalRuns.toFixed(0)
              ),
              totalAvgStrikeRate: CheckIntValue(
                SafeDivide(
                  team1TopBatsman.batting.totalRuns,
                  team1TopBatsman.batting.totalAvgBallFaced
                ) * 100
              ),
              totalAvgBallFaced: CheckIntValue(
                team1TopBatsman.batting.totalAvgBallFaced.toFixed(0)
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
                team1TopBowler.bowling.totalAvgOvers.toFixed(0)
              ),
              totalAvgWickets: CheckIntValue(
                team1TopBowler.bowling.totalAvgWickets.toFixed(0)
              ),
              totalAvgRunsConceded: CheckIntValue(
                team1TopBowler.bowling.totalAvgRunsConceded.toFixed(0)
              ),
            },
          }
        : null,
    },
    team2: {
      name: team2.name,
      shortName: team2.shortName,
      flag: team2.flag,
      firstInningScore: {
        min: CheckIntValue(team2FirstInningScore.toFixed(0)) - 10,
        max: CheckIntValue(team2FirstInningScore.toFixed(0)) + 10,
        predicted: CheckIntValue(team2FirstInningScore.toFixed(0)),
        wickets: CheckIntValue(team1.predict.totalWickets.toFixed(0)),
      },
      winnerPrediction: {
        probability: team2Chance,
        confidence: GetConfidence(team2Chance),
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
                team2TopBatsman.batting.totalRuns.toFixed(0)
              ),
              totalAvgStrikeRate: CheckIntValue(
                SafeDivide(
                  team2TopBatsman.batting.totalRuns,
                  team2TopBatsman.batting.totalAvgBallFaced
                ) * 100
              ),
              totalAvgBallFaced: CheckIntValue(
                team2TopBatsman.batting.totalAvgBallFaced.toFixed(0)
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
                team2TopBowler.bowling.totalAvgOvers.toFixed(0)
              ),
              totalAvgWickets: CheckIntValue(
                team2TopBowler.bowling.totalAvgWickets.toFixed(0)
              ),
              totalAvgRunsConceded: CheckIntValue(
                team2TopBowler.bowling.totalAvgRunsConceded.toFixed(0)
              ),
            },
          }
        : null,
    },
  };

  return response;

  // const a = playerPredictionScoreCalculate(response1, 20);
  // console.log(a);
};
