import moment from "moment";

const commonCricketLeagues = [
  { mode: "ODI", name: "One Day International", over: 50 },
  { mode: "T20I", name: "Twenty20 International", over: 20 },
  { mode: "Test", name: "Test Cricket", over: 90 },
  { mode: "IPL", name: "Indian Premier League", over: 20 },
  { mode: "CPL", name: "Caribbean Premier League", over: 20 },
  { mode: "BBL", name: "Big Bash League", over: 20 },
  { mode: "PSL", name: "Pakistan Super League", over: 20 },
  { mode: "BPL", name: "Bangladesh Premier League", over: 20 },
  { mode: "LPL", name: "Lanka Premier League", over: 20 },
  { mode: "Hundred", name: "The Hundred", over: 16.4 }, // 100 balls = 16.4 overs (100/6)
  { mode: "SA20", name: "SA20 League", over: 20 },
  { mode: "ILT20", name: "International League T20", over: 20 },
  { mode: "MLC", name: "Major League Cricket", over: 20 },
  { mode: "SMASH", name: "Super Smash", over: 20 },
  { mode: "DODI", name: "Domestic One Day", over: 50 },
  { mode: "DT20", name: "Domestic T20", over: 20 },
  { mode: "T10", name: "T10 League", over: 10 },
  { mode: "WBBL", name: "Women's Big Bash League", over: 20 },
  { mode: "WPL", name: "Women's Premier League", over: 20 },
  { mode: "BLAST", name: "Vitality Blast", over: 20 },
];

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

    const CalculateBattingStats = (stats: any[]) => {
      const battingStats = stats.reduce(
        (acc, curr) => {
          acc.average += (Number(curr.runs) || 0) / Number(curr.innings);
          acc.balls += (Number(curr.balls) || 0) / Number(curr.innings);
          acc.strikeRate += Number(curr.strikeRate) || 0;
          return acc;
        },
        { average: 0, balls: 0, strikeRate: 0 }
      );

      const count = stats.length;
      const avgRuns = battingStats.average / count || 0;
      const avgBallFaced = battingStats.balls / count || 0;
      const avgStrikeRate = battingStats.strikeRate / count || 0;

      return { avgRuns, avgBallFaced, avgStrikeRate };
    };

    const CalculateBowlingStats = (stats: any[]) => {
      const bowlingStats = stats.reduce(
        (acc, curr) => {
          acc.innings += Number(curr.innings) || 0;
          acc.balls += Number(curr.balls) || 0;
          acc.runs += Number(curr.runs) || 0;
          acc.wicket += Number(curr.wicket) || 0;
          acc.economy += Number(curr.economy) || 0;
          acc.average += Number(curr.average) || 0;
          return acc;
        },
        { innings: 0, balls: 0, runs: 0, wicket: 0, economy: 0, average: 0 }
      );

      const count = stats.length;
      const avgInnings = bowlingStats.innings / count || 0;
      const avgBowled = bowlingStats.balls / count || 0;
      const avgConsumedRuns = bowlingStats.runs / count || 0;
      const avgWicket = bowlingStats.wicket / count || 0;
      const avgEconomy = bowlingStats.economy / count || 0;
      const average = bowlingStats.average / count || 0;

      return {
        avgInnings,
        avgBowled,
        avgConsumedRuns,
        avgWicket,
        avgEconomy,
        average,
      };
    };

    const CalculateStadiumBattingStats = (stats: any[]) => {
      const battingStats = stats.reduce(
        (acc, curr) => {
          const innings = Number(curr.innings) || 1; // Avoid division by zero
          const runs = Number(curr.runs) || 0;
          const balls = Number(curr.balls) || 0;
          const sr = Number(curr.sr) || 0;

          // Calculate per-innings averages for each stat
          acc.runs += runs / innings;
          acc.balls += balls / innings;
          acc.sr += sr;

          return acc;
        },
        { runs: 0, balls: 0, sr: 0 }
      );

      const count = stats.length;
      const avgRuns = battingStats.runs / count || 0;
      const avgBallFaced = battingStats.balls / count || 0;
      const avgStrikeRate = battingStats.sr / count || 0;

      return { avgRuns, avgBallFaced, avgStrikeRate };
    };

    const CalculateStadiumBowlingStats = (stats: any[]) => {
      const bowlingStats = stats.reduce(
        (acc, curr) => {
          acc.innings += Number(curr.innings) || 0;
          acc.balls += Number(curr.balls) || 0;
          acc.runs += Number(curr.runs) || 0;
          acc.wickets += Number(curr.wickets) || 0;
          acc.econ += Number(curr.econ) || 0;
          acc.avg += Number(curr.avg) || 0;
          return acc;
        },
        { innings: 0, balls: 0, runs: 0, wickets: 0, econ: 0, avg: 0 }
      );

      const count = stats.length;
      const avgInnings = bowlingStats.innings / count || 0;
      const avgBowled = bowlingStats.balls / count || 0;
      const avgConsumedRuns = bowlingStats.runs / count || 0;
      const avgWicket = bowlingStats.wickets / count || 0; // Fixed: wickets not wicket
      const avgEconomy = bowlingStats.econ / count || 0; // Fixed: econ not economy
      const average = bowlingStats.avg / count || 0;

      return {
        avgInnings,
        avgBowled,
        avgConsumedRuns,
        avgWicket,
        avgEconomy,
        average,
      };
    };

    const fantasyStats = CalculateFantasy(player.fantasyPoints || []);
    const recentBattingFormStats = CalculateBattingForm(
      player.battingForm || []
    );
    const recentBowlingFormStats = CalculateBowlingForm(
      player.bowlingForm || [],
      matchOver(data?.matchInfo?.format).bowlerOverLimit || 0
    );

    const battingStats = CalculateBattingStats(player.battingStats || []);
    const bowlingStats = CalculateBowlingStats(player.bowlingStats || []);

    const statdiumBattingStats = CalculateStadiumBattingStats(
      player.stadiumStats.battingStats || []
    );

    const statdiumBowlingStats = CalculateStadiumBowlingStats(
      player.stadiumStats.bowlingStats || []
    );

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

  const team1 = data.squadList[0];
  const team2 = data.squadList[2];

  const team1Players = playerScoreCalculate(team1.benchPlayer[1]);

  const response1 = {
    fantasyStats: {
      avgRunsPoint: 13.32,
      avgBowlPoint: 29.43,
    },
    recentBattingFormStats: {
      averageRuns: 14.65,
      averageBalls: 9.45,
      averageStrikeRate: 106.2405,
    },
    recentBowlingFormStats: {
      avgEconmy: 6.51,
      avgWicket: 0.85,
      avgOver: 8.545,
    },
    battingStats: {
      avgRuns: 16.911055172897278,
      avgBallFaced: 13.84442808653335,
      avgStrikeRate: 118.4625,
    },
    statdiumBowlingStats: {
      avgInnings: 1.7333333333333334,
      avgBowled: 51.6,
      avgConsumedRuns: 54.733333333333334,
      avgWicket: 1.6666666666666667,
      avgEconomy: 6.978666666666666,
      average: 22.40666666666667,
    },
    bowlingStats: {
      avgInnings: 41.375,
      avgBowled: 1306,
      avgConsumedRuns: 1273.75,
      avgWicket: 44.375,
      avgEconomy: 6.831249999999999,
      average: 29.355,
    },
    statdiumBattingStats: {
      avgRuns: 22.58888888888889,
      avgBallFaced: 16.644444444444446,
      avgStrikeRate: 118.60666666666665,
    },
  };
  console.log(team1Players);
};
