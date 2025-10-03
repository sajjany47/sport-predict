const calculateBattingBowlingContributetion = (players: any) => {
  const latest20Matches = players.fantasyPoints.slice(0, 20);
  const totalBattingPoints = latest20Matches.reduce(
    (acc: number, match: any) => acc + Number(match.bat),
    0
  );
  const totalBowlingPoints = latest20Matches.reduce(
    (acc: number, match: any) => acc + Number(match.bowl),
    0
  );

  const averageBattingPoints = totalBattingPoints / latest20Matches.length;
  const averageBowlingPoints = totalBowlingPoints / latest20Matches.length;

  return {
    averageBattingPoints,
    averageBowlingPoints,
  };
};

const InningScoreAndWicketCaculation = (team: any) => {
  const playerList =
    team.playingPlayer.length > 0 ? team.playingPlayer : team.benchPlayer;
  const totalBattingContribute = playerList.reduce(
    (acc: number, player: any) => acc + player.battingContribute,
    0
  );
  const totalBowlingContribute = playerList.reduce(
    (acc: number, player: any) => acc + player.bowlingContribute,
    0
  );

  const avgInningScore = totalBattingContribute / playerList.length;
  const avgWicket = totalBowlingContribute / 20 / playerList.length;

  return { inningScore: avgInningScore, wicket: avgWicket };
};

export const V2Prediction = (match: any) => {
  const matchFormat = {
    t10: 10,
    t20: 20,
    odi: 50,
    test: 100,
    H100: 16.4,
  };
  const prepareData = match?.squadList.map((team: any) => {
    const preparePlayingPlayers = team.playingPlayer.map((player: any) => ({
      id: player.id,
      name: player.name,
      shortName: player.shortName,
      batStyle: player.batStyle,
      bowlStyle: player.bowlStyle,
      imageUrl: player.imageUrl,
      type: player.type,
      battingContribute:
        calculateBattingBowlingContributetion(player).averageBattingPoints,
      bowlingContribute:
        calculateBattingBowlingContributetion(player).averageBowlingPoints,
    }));
    const prepareBenchPlayers = team.benchPlayer.map((player: any) => ({
      id: player.id,
      name: player.name,
      shortName: player.shortName,
      batStyle: player.batStyle,
      bowlStyle: player.bowlStyle,
      imageUrl: player.imageUrl,
      type: player.type,
      battingContribute:
        calculateBattingBowlingContributetion(player).averageBattingPoints,
      bowlingContribute:
        calculateBattingBowlingContributetion(player).averageBowlingPoints,
    }));

    return {
      flag: team.flag,
      color: team.color,
      shortName: team.shortName,
      playingPlayer: preparePlayingPlayers,
      benchPlayer: prepareBenchPlayers,
    };
  });

  const bothTeamInninScoreAndWicket = prepareData.map(
    (team: any, index: number) => {
      const { inningScore, wicket } = InningScoreAndWicketCaculation(team);
      return {
        flag: team.flag,
        color: team.color,
        shortName: team.shortName,
        inningScore: inningScore,
        wicket: wicket,
      };
    }
  );
  const predictedInningScore = bothTeamInninScoreAndWicket.map(
    (team: any, index: number) => {
      const totalScore =
        ((team.inningScore * 11 -
          bothTeamInninScoreAndWicket[index === 0 ? 1 : 0].wicket * 11) /
          matchFormat.odi -
          bothTeamInninScoreAndWicket[index === 0 ? 1 : 0].wicket) *
          matchFormat.odi -
        (11 + matchFormat.odi);
      let a =
        team.inningScore -
        bothTeamInninScoreAndWicket[index === 0 ? 1 : 0].wicket;
      return {
        ...team,
        predictedInningScore: Math.round(totalScore),
        a: a,
      };
    }
  );
  return predictedInningScore;
};
