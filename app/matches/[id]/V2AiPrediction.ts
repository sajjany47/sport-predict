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

  const avgInningScore = totalBattingContribute;
  const avgWicket = totalBowlingContribute / 20;

  return { inningScore: avgInningScore, wicket: avgWicket };
};

export const V2Prediction = (match: any) => {
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

  const bothTeamInninScoreAndWicket = prepareData.map((team: any) => {
    const { inningScore, wicket } = InningScoreAndWicketCaculation(team);
    return {
      flag: team.flag,
      color: team.color,
      shortName: team.shortName,
      inningScore: inningScore,
      wicket: wicket,
    };
  });
  return bothTeamInninScoreAndWicket;
};
