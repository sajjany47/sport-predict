import moment from "moment";

export const getNewAnalysis = async (data: any) => {
  const matchOver = (format: any) => {
    return format === "T20"
      ? { over: 20, bowlerOverLimit: 4 }
      : format === "ODI"
      ? { over: 50, bowlerOverLimit: 10 }
      : format === "T10"
      ? { over: 10, bowlerOverLimit: 2 }
      : format === "TEST"
      ? { over: 100, bowlerOverLimit: 25 }
      : { over: 16.4, bowlerOverLimit: 3.28 };
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

    const CalculateBowlingForm = (
      bowlingStats: any[],
      matchOverLimit: number
    ) => {
      const sortByDate = bowlingStats.sort(
        (a: any, b: any) =>
          moment(b.date, "DD/MM/YY").valueOf() -
          moment(a.date, "DD/MM/YY").valueOf()
      );

      const last20BowlingInninsg = sortByDate.slice(0, 20).map((item: any) => {
        let over = Number(item.o);
        let avgOver = 0;
        if (over <= 4) {
          avgOver = over / 4;
        } else if (over > 4 && over <= 10) {
          avgOver = over / 10;
        } else {
          avgOver = over / 25;
        }

        return {
          ...item,
          eco: Number(item.eco),
          w: Number(item.w),
          avgOver: Number(avgOver),
        };
      });

      const total = last20BowlingInninsg.reduce(
        (acc, curr) => {
          acc.eco += Number(curr.eco) || 0;
          acc.w += Number(curr.w) || 0;
          acc.avgOver += Number(curr.avgOver) || 0;
          return acc;
        },
        { eco: 0, w: 0, avgOver: 0 }
      );

      const count = last20BowlingInninsg.length;
      const avgEconmy = total.eco / count || 0;
      const avgWicket = total.w / count || 0;
      const avgOver = (total.avgOver / count) * matchOverLimit || 0;

      return { avgEconmy, avgWicket, avgOver };
    };

    const fantasyStats = CalculateFantasy(player.fantasyPoints || []);
    const recentBattingFormStats = CalculateBattingForm(
      player.battingForm || []
    );
    const recentBowlingFormStats = CalculateBowlingForm(
      player.bowlingForm || [],
      matchOver(data?.matchInfo?.format).bowlerOverLimit || 0
    );

    return recentBowlingFormStats;
  };

  const team1 = data.squadList[0];
  const team2 = data.squadList[2];

  const team1Players = playerScoreCalculate(team1.benchPlayer[1]);
  console.log(team1Players);
};
