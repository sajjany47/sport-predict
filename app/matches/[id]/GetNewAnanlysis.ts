import { CheckIntValue, SafeDivide, SortArray } from "@/lib/utils";
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

const findModeOver = (format: any) => {
  switch (format) {
    case "t20":
    case "dt20":
      return { over: 20, bowlerOverLimit: 4 };

    case "odi":
    case "dodi":
      return { over: 50, bowlerOverLimit: 10 };

    case "t10":
      return { over: 10, bowlerOverLimit: 2 };

    case "test":
      return { over: 100, bowlerOverLimit: 25 };

    case "hundred":
      return { over: 16.4, bowlerOverLimit: 3.28 };

    default:
      return { over: 20, bowlerOverLimit: 4 };
  }
};

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
      const sortLatestDate = SortArray(fantasy).slice(0, 20);

      const result = sortLatestDate.reduce(
        (acc, curr) => {
          acc.bat += CheckIntValue(curr.bat);
          acc.bowl += CheckIntValue(curr.bowl);
          return acc;
        },
        { bat: 0, bowl: 0 }
      );
      const count = sortLatestDate.length;

      const avgRunsPoint = CheckIntValue((result.bat / count) * 0.9);
      const avgBowlPoint = CheckIntValue((result.bowl / count) * 0.9);

      return { avgRunsPoint, avgBowlPoint };
    };

    const CalculateBatting = (stats: any[], isIninngs?: any) => {
      const result = stats.reduce(
        (acc, curr) => {
          const runs = CheckIntValue(curr.runs);
          const balls = CheckIntValue(curr.ballFaced);
          const sr = CheckIntValue(curr.strikeRate);
          const innings = isIninngs ? Number(curr.innings) : 1;
          acc.runs += SafeDivide(runs, innings);
          acc.ballFaced += SafeDivide(balls, innings);
          acc.strikeRate += sr;
          return acc;
        },
        { runs: 0, ballFaced: 0, strikeRate: 0 }
      );

      const count = stats.length || 1;

      return {
        averageRuns: CheckIntValue(SafeDivide(result.runs, count)),
        averageBalls: CheckIntValue(SafeDivide(result.ballFaced, count)),
        averageStrikeRate: CheckIntValue(SafeDivide(result.strikeRate, count)),
      };
    };

    const CalculateBowling = (bowlingStats: any[], matchOverLimit: number) => {
      const total = bowlingStats.reduce(
        (acc, curr) => {
          acc.run += CheckIntValue(curr.run);
          acc.wicket += CheckIntValue(curr.wicket);
          acc.eco += CheckIntValue(curr.eco);
          acc.avgOver += CheckIntValue(curr.avgOver);
          return acc;
        },
        {
          run: 0,
          wicket: 0,
          eco: 0,
          avgOver: 0,
        }
      );

      const count = bowlingStats.length;
      const avgEconmy = CheckIntValue(SafeDivide(total.eco, count));
      const avgWicket = CheckIntValue(SafeDivide(total.wicket, count));
      const avgOver = CheckIntValue(
        SafeDivide(total.avgOver, count) * matchOverLimit
      );

      return { avgEconmy, avgWicket, avgOver };
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

    //---------------------------Recent batting & Bowling form stats------------------------
    const sortBattingFormLatestData = SortArray(player.battingForm || [])
      .slice(0, 20)
      .map((innings: any) => {
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

    const recentBattingFormStats = CalculateBatting(
      sortBattingFormLatestData || []
    );

    const sortBowlingFormLatestData = SortArray(player.bowlingForm || [])
      .slice(0, 20)
      .map((item: any) => {
        let over = CheckIntValue(item.o);
        let avgOver = 0;
        if (over <= 4) {
          avgOver = over / 4;
        } else if (over > 4 && over <= 10) {
          avgOver = over / 10;
        } else {
          avgOver = over / 25;
        }

        return {
          over: CheckIntValue(item.o),
          run: CheckIntValue(item.r),
          wicket: CheckIntValue(item.w),
          eco: CheckIntValue(item.eco),
          avgOver: CheckIntValue(avgOver),
        };
      });

    const recentBowlingFormStats = CalculateBowling(
      sortBowlingFormLatestData || [],
      matchOver(data?.matchInfo?.format).bowlerOverLimit || 0
    );
    //----------------Finish Recent Batting & Bowling Form Stats-----------------------

    //--------------------------- batting & bowling  stats------------------------
    const prepareBattingStats = (player.battingStats || []).map(
      (item: any) => ({
        runs: CheckIntValue(item.runs),
        ballFaced: CheckIntValue(item.balls),
        strikeRate: CheckIntValue(item.strikeRate),
        innings: CheckIntValue(item.innings),
      })
    );

    const battingStats = CalculateBatting(prepareBattingStats || [], true);

    const prepareBowlingStats = (player.bowlingStats || []).map((item: any) => {
      const modeOver = findModeOver(item.mode.toLowerCase());
      const matches = CheckIntValue(item.matches);
      const balls = CheckIntValue(item.balls);
      const runs = CheckIntValue(item.runs);
      const wicket = CheckIntValue(item.wicket);
      const maxOversPerMatch = modeOver.over;

      const totalOversBowled = balls / 6;
      const avgOversPerMatch = matches ? totalOversBowled / matches : 0;

      // percentage value (0–100)
      const avgOverPercentage =
        maxOversPerMatch > 0 ? (avgOversPerMatch / maxOversPerMatch) * 100 : 0;

      // your required calculation
      const avgRunsPerOver = (runs / balls) * 6;
      const avgWicketsPerOver = (wicket / balls) * 6;

      return {
        run: avgRunsPerOver,
        wicket: avgWicketsPerOver,
        eco: CheckIntValue(item.economy),
        avgOverPercentage: CheckIntValue(avgOverPercentage), // **percentage**
      };
    });
    console.log(prepareBowlingStats);
    const bowlingStats = CalculateBowlingStats(player.bowlingStats || []);
    //----------------Finish Batting & bowling Stats-----------------------

    //---------------------------statdium batting  stats------------------------
    const prepareStadiumBattingStats = (
      player.stadiumStats.battingStats || []
    ).map((item: any) => ({
      runs: CheckIntValue(item.runs),
      ballFaced: CheckIntValue(item.balls),
      strikeRate: CheckIntValue(item.sr),
      innings: CheckIntValue(item.innings),
    }));

    const statdiumBattingStats = CalculateBatting(
      prepareStadiumBattingStats || [],
      true
    );
    //----------------Finish statdium Batting Stats-----------------------
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
