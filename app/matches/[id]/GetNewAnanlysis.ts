import moment from "moment";

export const getNewAnalysis = async (data: any) => {
  const matchOver = (format: any) => {
    return format === "T20"
      ? 20
      : format === "ODI"
      ? 50
      : format === "T10"
      ? 10
      : format === "TEST"
      ? 90
      : 16.4;
  };
  const playerScoreCalculate = (player: any) => {
    const CalculateFantasy = (fantasy: any[]) => {
      const sortLatestDate = fantasy.sort(
        (a: any, b: any) =>
          moment(b.date, "DD/MM/YY").valueOf() -
          moment(a.date, "DD/MM/YY").valueOf()
      );

      const last20MatchesData = sortLatestDate.slice(0, 20);

      const totalRunsPoint = last20MatchesData.reduce(
        (acc, curr) => acc + Number(curr.bat),
        0
      );
      const totalBowlPoint = last20MatchesData.reduce(
        (acc, curr) => acc + Number(curr.bowl),
        0
      );
      const avgRunsPoint = Number(
        ((totalRunsPoint / last20MatchesData.length) * 0.9 || 0).toFixed(2)
      );
      const avgBowlPoint = Number(
        ((totalBowlPoint / last20MatchesData.length) * 0.9 || 0).toFixed(2)
      );
      return { avgRunsPoint, avgBowlPoint };
    };

    const CalculateBattingForm = (battingStats: any[]) => {
      const sortByDate = battingStats.sort(
        (a: any, b: any) =>
          moment(b.date, "DD/MM/YY").valueOf() -
          moment(a.date, "DD/MM/YY").valueOf()
      );
      const last20Inninsg = sortByDate.slice(0, 20);
      const modifyedInnings = last20Inninsg.map((innings: any) => {
        const runStr = innings.run;
        let runs = 0;
        let balls = 0;
        if (runStr && runStr.includes("(")) {
          const [r, b] = runStr.replace(")", "").split("(");
          runs = Number(r.trim());
          balls = Number(b.trim());
        }
        return {
          runs,
          ballFaced: balls,
          strikeRate: innings.sr === "DNB" ? 0 : Number(innings.sr),
        };
      });
      const totalRuns = modifyedInnings.reduce(
        (acc, curr) => acc + curr.runs,
        0
      );
      const totalBallFaced = modifyedInnings.reduce(
        (acc, curr) => acc + curr.ballFaced,
        0
      );
      const totalStrikeRate = modifyedInnings.reduce(
        (acc, curr) => acc + curr.strikeRate,
        0
      );
      return {
        averageRuns: totalRuns / last20Inninsg.length || 0,
        averageBalls: totalBallFaced / last20Inninsg.length || 0,
        averageStrikeRate: totalStrikeRate / last20Inninsg.length || 0,
      };
    };

    const fantasyStats = CalculateFantasy(player.fantasyPoints || []);
    const recentBattingFormStats = CalculateBattingForm(
      player.battingForm || []
    );
    return recentBattingFormStats;
  };

  const team1 = data.squadList[0];
  const team2 = data.squadList[2];

  const team1Players = playerScoreCalculate(team1.benchPlayer[1]);
  console.log(team1Players);
};
