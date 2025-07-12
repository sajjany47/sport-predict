export const GetMatchPrediction = (data: any) => {
  //fantasy points calculation based on DummyData//////////////////////////////////
  const fantasyPoints = 0.2;
  const battingForm = 0.4;
  const bowlingForm = 0.5;
  const battingStats = 0.3;
  const bowlingStats = 0.4;
  const stadiumBattingStats = 0.2;
  const stadiumBowlingStats = 0.3;
  const againstTeamBattingStats = 0.1;
  const againstTeamBowlingStats = 0.2;

  const prepareSquad = data.map((item: any) => {
    const squad = item.squad.map((elm: any) => {
      const totalPoint =
        Number(elm.fantasyPoints) * fantasyPoints +
        Number(elm.battingForm.totalRuns) * battingForm +
        Number(elm.bowlingForm.totalWicket) * bowlingForm +
        Number(elm.battingStats.totalRuns) * battingStats +
        Number(elm.bowlingStats.totalWicket) * bowlingStats +
        Number(elm.stadiumBattingStats.totalRuns) * stadiumBattingStats +
        Number(elm.stadiumBowlingStats.totalWicket) * stadiumBowlingStats +
        Number(elm.againstTeamBattingStats.totalRuns) *
          againstTeamBattingStats +
        Number(elm.againstTeamBowlingStats.totalWicket) *
          againstTeamBowlingStats +
        3;
      const battingTotalPoint =
        Number(elm.battingForm.totalRuns) * battingForm +
        Number(elm.battingStats.totalRuns) * battingStats +
        Number(elm.stadiumBattingStats.totalRuns) * stadiumBattingStats +
        Number(elm.againstTeamBattingStats.totalRuns) *
          againstTeamBattingStats +
        7;
      const bowlingTotalPoint =
        Number(elm.bowlingForm.totalWicket) * bowlingForm +
        Number(elm.bowlingStats.totalWicket) * bowlingStats +
        Number(elm.stadiumBowlingStats.totalWicket) * stadiumBowlingStats +
        Number(elm.againstTeamBowlingStats.totalWicket) *
          againstTeamBowlingStats +
        1;

      const venueBowlingPoint =
        Number(elm.bowlingForm.totalWicket) * bowlingForm +
        Number(elm.stadiumBowlingStats.totalWicket) * stadiumBowlingStats +
        Number(elm.againstTeamBowlingStats.totalWicket) *
          againstTeamBowlingStats +
        1;
      const venueBattingPoint =
        Number(elm.battingForm.totalRuns) * battingForm +
        Number(elm.stadiumBattingStats.totalRuns) * stadiumBattingStats +
        Number(elm.againstTeamBattingStats.totalRuns) *
          againstTeamBattingStats +
        7;
      return {
        name: elm.name,
        shortName: elm.shortName,
        batStyle: elm.batStyle,
        bowlStyle: elm.bowlStyle,
        imageUrl: elm.imageUrl,
        type: elm.type,
        totalPoint: totalPoint,
        battingTotalPoint: battingTotalPoint,
        bowlingTotalPoint: bowlingTotalPoint,
        venueBowlingPoint: venueBowlingPoint,
        venueBattingPoint: venueBattingPoint,
      };
    });
    return {
      flag: item.flag,
      color: item.color,
      teamShortName: item.shortName,
      squad: squad.sort((a: any, b: any) => b.totalPoint - a.totalPoint),
    };
  });
  const players = prepareSquad
    .flatMap((team: any) =>
      team.squad.map((player: any) => ({
        ...player,
        teamFlag: team.flag,
        teamShortName: team.teamShortName,
        teamColor: team.color,
      }))
    )
    .sort((a: any, b: any) => b.totalPoint - a.totalPoint);
  const wicketKeeper = players.find((player: any) => player.type === "WK");
  const batsman = players.find((player: any) => player.type === "BAT");
  const bowler = players.find((player: any) => player.type === "BOWL");
  const allrounder = players.find((player: any) => player.type === "AR");
  const filteredPlayers = players
    .filter(
      (player: any) =>
        player.name !== wicketKeeper.name &&
        player.name !== batsman.name &&
        player.name !== bowler.name &&
        player.name !== allrounder.name
    )
    .sort((a: any, b: any) => b.totalPoint - a.totalPoint);
  const topplayer = filteredPlayers.slice(0, 7);
  const mergePlayers = [
    ...topplayer,
    wicketKeeper,
    batsman,
    bowler,
    allrounder,
  ].sort((a, b) => b.totalPoint - a.totalPoint);

  const topBatsman = (team: any) => {
    const sortSquad = team.squad.sort(
      (a: any, b: any) => b.battingTotalPoint - a.battingTotalPoint
    );

    const probability = Math.min(
      100,
      Math.round((sortSquad[0].battingTotalPoint / 50) * 100)
    );

    return {
      name: sortSquad[0].name,
      predictedRuns: `${Math.round(
        sortSquad[0].battingTotalPoint - 10
      )}-${Math.round(sortSquad[0].battingTotalPoint + 10)}`,
      probability: `${probability}%`,
      recentAvg: parseFloat(sortSquad[0].battingTotalPoint.toFixed(1)),
      venueAvg: parseFloat(sortSquad[0].venueBattingPoint.toFixed(1)),
    };
  };
  const topBowler = (team: any) => {
    const sortSquad = team.squad.sort(
      (a: any, b: any) => b.bowlingTotalPoint - a.bowlingTotalPoint
    );

    const probability = Math.min(
      100,
      Math.round((sortSquad[0].bowlingTotalPoint / 3) * 100)
    );

    return {
      name: sortSquad[0].name,
      predictedWickets: `${Math.floor(
        sortSquad[0].bowlingTotalPoint
      )}-${Math.ceil(sortSquad[0].bowlingTotalPoint + 1)}`,
      probability: `${probability}%`,
      recentAvg: parseFloat(sortSquad[0].bowlingTotalPoint.toFixed(1)),
      venueAvg: parseFloat(sortSquad[0].venueBowlingPoint.toFixed(1)),
    };
  };

  const CalculateWinnerPrediction = (team: any, opponent: any) => {
    const scoreWeight = 0.4; // scoring power
    const wicketWeight = 0.3; // wicket-taking

    // Normalize by using both teams’ data
    const maxScore = Math.max(team.avgScore, opponent.avgScore);
    const maxWicket = Math.max(team.avgWicket, opponent.avgWicket);

    const score = (team.avgScore / maxScore) * scoreWeight;
    const wickets = (team.avgWicket / maxWicket) * wicketWeight;

    return score + wickets;
  };

  const teamAverageScore = (team: any) => {
    const toatlBattingPoint = team.squad.reduce(
      (acc: number, player: any) => acc + player.battingTotalPoint,
      0
    );
    const totalStadiumBattingStats = team.squad.reduce(
      (acc: number, player: any) => acc + player.venueBattingPoint,
      0
    );

    return (toatlBattingPoint + totalStadiumBattingStats) * 0.4;
  };

  const teamAverageWicket = (team: any) => {
    const toatlBowlingPoint = team.squad.reduce(
      (acc: number, player: any) => acc + player.bowlingTotalPoint,
      0
    );
    const totalStadiumBowlingStats = team.squad.reduce(
      (acc: number, player: any) => acc + player.venueBowlingPoint,
      0
    );

    return (toatlBowlingPoint + totalStadiumBowlingStats) * 0.2;
  };

  const team1AvgScore = teamAverageScore(prepareSquad[0]);
  const team2AvgScore = teamAverageScore(prepareSquad[1]);

  const team1AvgWkt = teamAverageWicket(prepareSquad[0]);
  const team2AvgWkt = teamAverageWicket(prepareSquad[1]);

  const team1WinnerChance = CalculateWinnerPrediction(
    {
      avgScore: team1AvgScore,
      avgWicket: team1AvgWkt,
    },
    { avgScore: team2AvgScore, avgWicket: team2AvgWkt }
  );

  const team2WinnerChance = CalculateWinnerPrediction(
    {
      avgScore: team2AvgScore,
      avgWicket: team2AvgWkt,
    },
    { avgScore: team1AvgScore, avgWicket: team1AvgWkt }
  );

  // Convert to probabilities
  const totalWinningChance = team1WinnerChance + team2WinnerChance;
  const team1Prob = (team1WinnerChance / totalWinningChance) * 100;
  const team2Prob = (team2WinnerChance / totalWinningChance) * 100;

  const result = {
    firstInningScore: {
      team1: {
        min: team1AvgScore - 10,
        max: team1AvgScore + 10,
        predicted: team1AvgScore,
      },
      team2: {
        min: team2AvgScore - 10,
        max: team2AvgScore + 10,
        predicted: team2AvgScore,
      },
    },
    winnerPrediction: {
      team1: {
        probability: team1Prob.toFixed(2),
        confidence: Number(team1Prob) > Number(team2Prob) ? "High" : "Medium",
      },
      team2: {
        probability: team2Prob.toFixed(2),
        confidence: Number(team2Prob) > Number(team1Prob) ? "High" : "Medium",
      },
    },
    dream11Team: {
      captain: {
        name: mergePlayers[0].name,
        team: mergePlayers[0].teamShortName,
        role: mergePlayers[0].type,
        points: parseFloat(mergePlayers[0].totalPoint.toFixed(1)),
        form: "Excellent",
      },
      viceCaptain: {
        name: mergePlayers[1].name,
        team: mergePlayers[1].teamShortName,
        role: mergePlayers[1].type,
        points: parseFloat(mergePlayers[1].totalPoint.toFixed(1)),
        form: "Good",
      },
      players: mergePlayers
        .filter(
          (p) =>
            p.name !== mergePlayers[0].name && p.name !== mergePlayers[1].name
        )
        .map((p, i) => ({
          id: i + 1,
          name: p.name,
          team: p.teamShortName,
          role: p.type,
          points: parseFloat(p.totalPoint.toFixed(1)),
        })),
    },
    keyPlayers: {
      team1: prepareSquad[0].squad.slice(0, 5).map((item: any) => ({
        name: item.name,
        role: item.type,
        impact: item.totalPoint > 40 ? "High" : "Medium",
        recentForm: `${item.totalPoint.toFixed(0)}`,
      })),
      team2: prepareSquad[1].squad.slice(0, 5).map((item: any) => ({
        name: item.name,
        role: item.type,
        impact: item.totalPoint > 40 ? "High" : "Medium",
        recentForm: `${item.totalPoint.toFixed(0)}`,
      })),
    },
    topBatsman: {
      team1: topBatsman(prepareSquad[0]),
      team2: topBatsman(prepareSquad[1]),
    },
    topBowler: {
      team1: topBowler(prepareSquad[0]),
      team2: topBowler(prepareSquad[1]),
    },
  };

  return result;
};
