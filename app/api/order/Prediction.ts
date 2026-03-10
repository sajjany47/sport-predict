/* =========================
   Batting Analysis
========================= */

const getPlayerStats = (player: any) => {
  const batting = player?.recentForm?.batting || [];
  const bowling = player?.recentForm?.bowling || [];
  const role = player?.role; /*"Bowler" | "All Rounder" | "Batter"*/

  let totalRuns = 0;
  let totalBalls = 0;

  let totalRunConceded = 0;
  let totalWickets = 0;

  // Batting
  batting.forEach((item: any) => {
    const score = item.score;

    const runs = parseInt(score.split(" ")[0]);

    const ballsMatch = score.match(/\((\d+)\)/);
    const balls = ballsMatch ? parseInt(ballsMatch[1]) : 0;

    totalRuns += runs;
    totalBalls += balls;
  });

  // Bowling
  bowling.forEach((item: any) => {
    const score = item.score;

    const [wicket, run] = score.split("-");

    totalWickets += parseInt(wicket);
    totalRunConceded += parseInt(run);
  });

  const avgTotalRun = batting.length ? totalRuns / batting.length : 0;
  const avgTotalBall = batting.length ? totalBalls / batting.length : 0;

  const avgRunConced = bowling.length ? totalRunConceded / bowling.length : 0;

  const avgWicket = bowling.length ? totalWickets / bowling.length : 0;

  return {
    avgTotalRun: avgTotalRun.toFixed(2),
    avgTotalBall: avgTotalBall.toFixed(2),
    avgRunConced: avgRunConced.toFixed(2),
    avgWicket: avgWicket.toFixed(2),
  };
};

/* =========================
   Bowling Analysis
========================= */

const squadAnanlysis = (team: any, matchDescription: string) => {
  const squad = team?.playingPlayers?.length
    ? team.playingPlayers
    : (team?.benchPlayers ?? []);

  squad.forEach((element: any) => {
    const playerStats = getPlayerStats(element);
  });
};

export const Prediction = (data: any): any => {
  const teamA = data.squads[0];
  const teamB = data.squads[1];

  const matchDescription = data.matchInfo.matchDescription;

  let teamAScore = squadAnanlysis(teamA, matchDescription);
  let teamBScore = squadAnanlysis(teamB, matchDescription);
};
