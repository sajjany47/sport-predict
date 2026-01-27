const safeNumber = (value: number): number =>
  Number.isFinite(value) ? value : 0;

const getPlayerAnalysis = (player: any) => {
  /* ================= BATTTING ================= */

  let totalRuns = 0;
  let totalBalls = 0;
  let battingMatches = 0;

  (player.batting ?? []).forEach((item: any) => {
    const numbers = item.score?.match(/\d+/g);
    if (!numbers) return;

    const [runs, balls] = numbers.map(Number);
    totalRuns += runs;
    totalBalls += balls;
    battingMatches += 1;
  });

  const avgRuns = safeNumber(totalRuns / battingMatches);
  const avgBallsFaced = safeNumber(totalBalls / battingMatches);
  const perBallRuns = safeNumber(totalRuns / totalBalls);

  /* ================= BOWLING ================= */

  let totalRunsConceded = 0;
  let totalWickets = 0;
  let bowlingMatches = 0;

  (player.bowling ?? []).forEach((item: any) => {
    if (!item.figures?.includes("-")) return;

    const [wickets, runs] = item.figures.split("-").map(Number);
    totalRunsConceded += runs;
    totalWickets += wickets;
    bowlingMatches += 1;
  });

  const avgRunsConceded = safeNumber(totalRunsConceded / bowlingMatches);

  const avgWickets = safeNumber(totalWickets / bowlingMatches);

  return {
    batting: {
      avgRuns,
      avgBallsFaced,
      perBallRuns,
    },
    bowling: {
      avgRunsConceded,
      avgWickets,
    },
  };
};

export const GetNewAnalysis = async (data: any) => {
  const teamASquad = data.squads[0];
  const teamBSquad = data.squads[1];

  const playerStats = getPlayerAnalysis({
    batting: teamASquad.benchPlayers[3].recentForm.batting,
    bowling: teamASquad.benchPlayers[3].recentForm.bowling,
  });

  console.log(playerStats);
};
