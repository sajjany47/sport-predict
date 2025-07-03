import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { load } from "cheerio";
import axios from "axios";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GetHtml = async (url: string) => {
  const response = await axios.get(url);
  const data = response.data;
  const $ = load(data);
  return $;
};

export const GetPSearchList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";
  const formData = new FormData();

  formData.append("text", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const $ = load(data);
    const playerList: { name: string; url: string }[] = [];

    $("a[title$='Stats']").each((_, el) => {
      const name = $(el).find("b.card-title").text().trim();
      const href = $(el).attr("href");

      if (name && href) {
        playerList.push({
          name,
          url: href.startsWith("http")
            ? href
            : `https://advancecricket.com${href}`,
        });
      }
    });
    // if (type) {
    //   console.log(playerList);
    // }
    if (playerList.length === 0) {
      throw new Error("No players found");
    }
    return playerList[0]; // Return the first player found
  } catch (error) {
    console.error(
      `Error fetching player search list for ${searchTerm}:`,
      error
    );
    return [];
  }
};

export const GetStadiumList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";
  const formData = new FormData();

  formData.append("stadium", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const $ = load(data);
    const stadiums: { name: string; url: string }[] = [];

    $(".row.row-cols-1.row-cols-lg-3 .col").each((index, element) => {
      const name = $(element).find("b.card-title").text().trim();
      const url = $(element).find("a").attr("href");

      if (name && url) {
        stadiums.push({ name, url });
      }
    });
    if (stadiums.length === 0) {
      throw new Error("No stadium found");
    }
    return stadiums[0]; // Return the first player found
  } catch (error) {
    console.error(
      `Error fetching player search list for ${searchTerm}:`,
      error
    );
    return [];
  }
};

export const TransAdvanceStatData = (originalData: any) => {
  if (Object.keys(originalData).length > 0) {
    // Extract recent matches
    const recentMatch = originalData.data.teamHeadToHead.segments
      .find((segment: any) => segment.type === "RECENT_FORM")
      .data.squads.map((teamData: any) => {
        return {
          teamName: teamData.team.shortName,
          match: teamData.recentMatches.map((match: any) => {
            const team1 = match.squads[0];
            const team2 = match.squads[1];
            return {
              team1: team1.team.shortName,
              team2: team2.team.shortName,
              format: match.format,
              status: match.status,
              date: match.date,
              location: match.location,
              result: match.result,
              team1Score: team1.score,
              team2Score: team2.score,
              winner: team1.isWinner
                ? team1.team.shortName
                : team2.team.shortName,
            };
          }),
        };
      });

    // Extract head-to-head data
    const h2hData = originalData.data.teamHeadToHead.segments.find(
      (segment: any) => segment.type === "H2H"
    ).data;
    const h2h = {
      h2hStat: h2hData.resultCompare.squads.map((team: any) => ({
        team1: team.team.shortName,
        win: team.gameWon,
        totalPlay: h2hData.resultCompare.totalPlayed,
      })),
      recentH2HMatch: [
        {
          match: h2hData.recentMatches.matches.map((match: any) => {
            const team1 = match.squads[0];
            const team2 = match.squads[1];
            return {
              team1: team1.team.shortName,
              team2: team2.team.shortName,
              format: match.format,
              status: match.status,
              date: match.date,
              location: match.location,
              result: match.result,
              team1Score: team1.score,
              team2Score: team2.score,
              winner: team1.isWinner
                ? team1.team.shortName
                : team2.team.shortName,
            };
          }),
        },
      ],
    };

    // Extract team strengths
    const teamStrengthData = originalData.data.teamHeadToHead.segments.find(
      (segment: any) => segment.type === "TEAM_STRENGTH"
    ).data;
    const teamStrength = teamStrengthData.squadChaseDefend.data[0].values.map(
      (value: any, index: any) => ({
        teamName: teamStrengthData.squads[index].shortName,
        battingFirstWin: `${value}%`,
        bowlingFirstWin: `${teamStrengthData.squadChaseDefend.data[1].values[index]}%`,
      })
    );

    return {
      recentMatch,
      h2h,
      teamStrength,
    };
  } else {
    return {
      recentMatch: [],
      h2h: {
        h2hStat: [],
        recentH2HMatch: [],
      },
      teamStrength: [],
    };
  }
};
export const DomesticLeagues = [
  { fullName: "Indian Premier League", shortName: "IPL", overLimit: 20 },
  { fullName: "Big Bash League", shortName: "BBL", overLimit: 20 },
  { fullName: "Pakistan Super League", shortName: "PSL", overLimit: 20 },
  { fullName: "Caribbean Premier League", shortName: "CPL", overLimit: 20 },
  { fullName: "Bangladesh Premier League", shortName: "BPL", overLimit: 20 },
  { fullName: "Lanka Premier League", shortName: "LPL", overLimit: 20 },
  { fullName: "SA20 League", shortName: "SA20", overLimit: 20 },
  {
    fullName: "The Hundred (England)",
    shortName: "The Hundred",
    overLimit: 17,
  }, // 100 balls, not overs
  { fullName: "T20 Blast (England)", shortName: "T20 Blast", overLimit: 20 },
  {
    fullName: "Super Smash (New Zealand)",
    shortName: "Super Smash",
    overLimit: 20,
  },
  { fullName: "Global T20 Canada", shortName: "GT20", overLimit: 20 },
  { fullName: "Zimbabwe Domestic T20", shortName: "ZD T20", overLimit: 20 },
  { fullName: "Afghanistan Premier League", shortName: "APL", overLimit: 20 },
  { fullName: "Nepal T20 League", shortName: "Nepal T20", overLimit: 20 },
  { fullName: "USA Major League Cricket", shortName: "MLC", overLimit: 20 },
  { fullName: "Emirates D10", shortName: "UAE D10", overLimit: 10 },
  { fullName: "Emirates D20", shortName: "UAE D20", overLimit: 20 },
  { fullName: "Qatar T10 League", shortName: "Qatar T10", overLimit: 10 },
  { fullName: "Kuwait T20 League", shortName: "Kuwait T20", overLimit: 20 },
  {
    fullName: "Ireland Inter-Provincial T20",
    shortName: "Ireland T20",
    overLimit: 20,
  },
];

export const DetectMode = (url: any) => {
  if (url.toLowerCase().includes("hundred")) return "17";
  if (url.toLowerCase().includes("odi")) return "50";
  if (url.toLowerCase().includes("test")) return "TEST";
  if (url.toLowerCase().includes("t10")) return "10";
  if (url.toLowerCase().includes("d10")) return "10";
  return "20"; // fallback
};

export const ModifyScore = (score: string) => {
  const match = score.match(/(\d+)-(\d+)/);
  const runs = match ? parseInt(match[1]) : 0;
  const wickets = match ? parseInt(match[2]) : 0;

  return { runs, wickets };
};

export const DynamicSort = (key: any, order = "asc") => {
  return function (a: any, b: any) {
    const valA = a[key];
    const valB = b[key];

    // Handle string and number comparison
    if (typeof valA === "string" && typeof valB === "string") {
      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return order === "asc" ? valA - valB : valB - valA;
    }
  };

  // Sort by age ascending
  // data.sort(dynamicSort("age", "asc"));

  // Sort by name descending
  // data.sort(dynamicSort("name", "desc"));
};

export const CalculateAverageScore = (data: any) => {
  const apiAvgScore = Number(data.overview.groundAndWheather.avgScore) ?? null;
  const stadiumStats = data.stadiumStats
    .filter((match: any) => {
      const matchDate = moment(match.date, "DD/MM/YY");
      const today = moment();
      const twoYearsAgo = moment().subtract(2, "years");

      return (
        matchDate.isSameOrBefore(today, "day") &&
        matchDate.isSameOrAfter(twoYearsAgo, "day")
      );
    })
    .map((match: any) => ({
      ...match,
      mode: DetectMode(match.matchUrl),
    }));

  // let avgScore = { t20: { totalRun: 0, totalWicket: 0, totalMatch: 0 } };
  const matchFormat = data.matchInfo.format.toLowerCase();
  let avgScore = 0;
  let avgWicket = 0;
  let totalMatch = 0;
  stadiumStats.forEach((element: any) => {
    const team1 = ModifyScore(element.inn1Score);
    const team2 = ModifyScore(element.inn2Score);
    const totalScore = team1.runs + team2.runs;
    const totalWickets = (team1.wickets + team2.wickets) / 2;
    let adjustedScore = totalScore / 2;

    if (matchFormat === "t20i") {
      if (element.mode === "10") adjustedScore += 0.8 * totalScore;
      else if (element.mode === "17") adjustedScore += 0.22 * totalScore;
      else if (element.mode === "50") adjustedScore -= 0.35 * totalScore;
      else if (element.mode === "TEST") adjustedScore -= 0.42 * totalScore;
    } else if (matchFormat === "odi") {
      if (element.mode === "20") adjustedScore += 0.4 * totalScore;
      else if (element.mode === "17") adjustedScore += 0.55 * totalScore;
      else if (element.mode === "10") adjustedScore += 0.7 * totalScore;
      else if (element.mode === "TEST") adjustedScore -= 0.45 * totalScore;
    } else if (matchFormat === "test") {
      if (element.mode === "50") adjustedScore += 0.45 * totalScore;
      else if (element.mode === "20") adjustedScore += 0.72 * totalScore;
      else if (element.mode === "10") adjustedScore += 0.9 * totalScore;
      else if (element.mode === "17") adjustedScore += 0.75 * totalScore;
    }
    avgScore += adjustedScore;
    avgWicket += totalWickets;
    totalMatch += 1;
  });

  const accordingToPlayerStats = data.squadList.map((item: any) => {
    const squad = (
      item.playingPlayer.length > 0 ? item.playingPlayer : item.benchPlayer
    ).map((elm: any) => {
      let playerData: any = {
        name: elm.name,
        shortName: elm.shortName,
        batStyle: elm.batStyle,
        bowlStyle: elm.bowlStyle,
        imageUrl: elm.imageUrl.src,
        type: elm.type,
      };
      // Calculate fantasy points
      const firsttwelveFantasyPoints = elm.fantasyPoints.slice(0, 12);
      const sumOfFantasyPoints = firsttwelveFantasyPoints.reduce(
        (acc: any, a: any) => acc + Number(a.total),
        0
      );

      // Calculate batting form
      const firsttwelveBattingForm = elm.battingForm.slice(0, 12);
      let totalRuns = 0;
      let totalBalls = 0;
      let totalSR = 0;
      firsttwelveBattingForm.forEach((a: any) => {
        if (a.run !== "DNB") {
          const runMatch = a.run.match(/^(\d+)\s+\((\d+)\)$/);
          if (runMatch) {
            const runs = Number(runMatch[1]);
            const balls = Number(runMatch[2]);
            const sr = Number(a.sr);

            totalRuns += runs;
            totalBalls += balls;
            totalSR += sr;
          }
        }
      });

      // Calculate bowling form
      const firsttwelveBowlingForm = elm.bowlingForm.slice(0, 12);
      let totalOver = 0;
      let totalWicket = 0;
      let totalRunConsume = 0;
      firsttwelveBowlingForm.forEach((a: any) => {
        if (a.o !== "DNB") {
          const over = Number(a.o);
          const runsConsume = Number(a.r);
          const wicket = Number(a.w);

          totalOver += over;
          totalWicket += wicket;
          totalRunConsume += runsConsume;
        }
      });

      //Calculate Batting Stats

      let battingStatsTotalRuns = 0;
      let battingStatsTotalInnings = 0;
      let battingStatsTotalBall = 0;
      elm.battingStats?.forEach((a: any) => {
        if (a.run !== "DNB") {
          const runs = Number(a.runs);
          const balls = Number(a.balls);
          const innings = Number(a.innings);

          battingStatsTotalRuns += runs;
          battingStatsTotalInnings += innings;
          battingStatsTotalBall += balls;
        }
      });

      //Calculate Bowling Stats

      let bowlingStatsBowlingRuns = 0;
      let bowlingStatsTotalBowlingInnings = 0;
      let bowlingStatsBowlingOver = 0;
      let bowlingStatsTotalWicketS = 0;
      elm.bowlingStats?.forEach((a: any) => {
        if (a.balls !== "DNB") {
          const runs = Number(a.runs);
          const balls = Number(a.balls) / 6;
          const wickets = Number(a.wickets);
          const innings = Number(a.innings);

          bowlingStatsBowlingRuns += runs;
          bowlingStatsBowlingOver += balls;
          bowlingStatsTotalWicketS += wickets;
          bowlingStatsTotalBowlingInnings += innings;
        }
      });

      //calculate stadium Batting Stats

      let stadiumTotalRuns = 0;
      let stadiumTotalInnings = 0;
      let stadiumTotalBowl = 0;
      elm.stadiumStats?.battingStats?.forEach((a: any) => {
        if (a.run !== "DNB") {
          const runs = Number(a.runs);
          const balls = Number(a.balls);
          const totalInnings = Number(a.innings);

          stadiumTotalRuns += runs;
          stadiumTotalBowl += balls;
          stadiumTotalInnings += totalInnings;
        }
      });

      //Calculate stadium Bowling Stats

      let stadiumTotalBowlingRuns = 0;
      let stadiumTotalBowlingInnings = 0;
      let stadiumBowlingOver = 0;
      let stadiumTotalWicketS = 0;
      elm.stadiumStats?.bowlingStats?.forEach((a: any) => {
        if (a.balls !== "DNB") {
          const runs = Number(a.runs);
          const balls = Number(a.balls) / 6;
          const wickets = Number(a.wickets);
          const innings = Number(a.innings);

          stadiumTotalBowlingRuns += runs;
          stadiumBowlingOver += balls;
          stadiumTotalWicketS += wickets;
          stadiumTotalBowlingInnings += innings;
        }
      });

      //calculate Agaist Team Batting Stats

      let againstTeamsTotalRuns = 0;
      let againstTeamsTotalInnings = 0;
      let againstTeamsTotalBowl = 0;
      elm.againstTeamsStats?.battingStats?.forEach((a: any) => {
        if (a.run !== "DNB") {
          const runs = Number(a.runs);
          const balls = Number(a.balls);
          const totalInning = Number(a.innings);

          againstTeamsTotalRuns += runs;
          againstTeamsTotalInnings += totalInning;
          againstTeamsTotalBowl += balls;
        }
      });

      //calculate Agaist Team Bowling Stats

      let againstTeamTotalBowlingRuns = 0;
      let againstTeamTotalBowlingInnings = 0;
      let againstTeamBowlingOver = 0;
      let againstTeamTotalWicketS = 0;
      elm.againstTeamsStats?.bowlingStats?.forEach((a: any) => {
        if (a.balls !== "DNB") {
          const runs = Number(a.runs);
          const balls = Number(a.balls) / 6;
          const wickets = Number(a.wickets);
          const innings = Number(a.innings);

          againstTeamTotalBowlingRuns += runs;
          againstTeamBowlingOver += balls;
          againstTeamTotalWicketS += wickets;
          againstTeamTotalBowlingInnings += innings;
        }
      });

      playerData.againstTeamBowlingStats = {
        totalWicket:
          againstTeamTotalWicketS / againstTeamTotalBowlingInnings || 0,
        totalAvg: againstTeamTotalBowlingRuns / againstTeamBowlingOver || 0,
      };
      playerData.againstTeamBattingStats = {
        totalRuns: againstTeamsTotalRuns / againstTeamsTotalInnings || 0,
        totalSR: againstTeamsTotalRuns / againstTeamsTotalBowl || 0,
      };
      playerData.stadiumBowlingStats = {
        totalWicket: stadiumTotalWicketS / stadiumTotalBowlingInnings || 0,
        totalAvg: stadiumTotalBowlingRuns / stadiumBowlingOver || 0,
      };
      playerData.stadiumBattingStats = {
        totalRuns: stadiumTotalRuns / stadiumTotalInnings || 0,
        totalSR: stadiumTotalRuns / stadiumTotalBowl || 0,
      };
      playerData.battingStats = {
        totalRuns: battingStatsTotalRuns / battingStatsTotalInnings || 0,
        totalSR: battingStatsTotalRuns / battingStatsTotalBall || 0,
      };
      playerData.bowlingStats = {
        totalWicket:
          bowlingStatsTotalWicketS / bowlingStatsTotalBowlingInnings || 0,
        totalAvg: bowlingStatsBowlingRuns / bowlingStatsBowlingOver || 0,
      };
      playerData.bowlingForm = {
        totalOver: totalOver / firsttwelveBowlingForm.length || 0,
        totalWicket: totalWicket / firsttwelveBowlingForm.length || 0,
        totalRunConsume: totalRunConsume / firsttwelveBowlingForm.length || 0,
      };
      playerData.battingForm = {
        totalRuns: totalRuns / firsttwelveBattingForm.length || 0,
        totalBalls: totalBalls / firsttwelveBattingForm.length || 0,
        totalSR:
          (totalBalls > 0 ? (totalRuns / totalBalls) * 100 : 0) /
            firsttwelveBattingForm.length || 0,
      };
      playerData.fantasyPoints =
        sumOfFantasyPoints / firsttwelveFantasyPoints.length || 0;

      return playerData;
    });

    return {
      flag: item.flag,
      color: item.color,
      shortName: item.shortName,
      squad: squad,
    };
  });

  const avgPrepare = {
    stadiumAvg: {
      avgScore: avgScore / totalMatch || apiAvgScore,
      avgWicket: avgWicket / totalMatch,
      totalMatch: totalMatch,
    },
    accordingToPlayerStats: accordingToPlayerStats,
  };
  console.log(avgPrepare);
  //Calculate average and winner prediction.................................................................

  const stadiumAVerageScore = {
    avgScore: avgScore / totalMatch || apiAvgScore,
    avgWicket: avgWicket / totalMatch,
  };

  const team1AvgScore = AnanlysisAvgScore({
    squad: avgPrepare.accordingToPlayerStats[0].squad,
    stadiumAvg: stadiumAVerageScore.avgScore,
  });
  const team2AvgScore = AnanlysisAvgScore({
    squad: avgPrepare.accordingToPlayerStats[1].squad,
    stadiumAvg: stadiumAVerageScore.avgScore,
  });

  // Calculate Player Average Score

  const sortPrepareData: any[] = [];

  accordingToPlayerStats.forEach((element: any) => {
    const againstTeamBowlingStats = [...element.squad].sort(
      (a, b) =>
        b.againstTeamBowlingStats.totalWicket -
        a.againstTeamBowlingStats.totalWicket
    );
    const againstTeamBattingStats = [...element.squad].sort(
      (a, b) =>
        b.againstTeamBattingStats.totalRuns -
        a.againstTeamBattingStats.totalRuns
    );
    const stadiumBattingStats = [...element.squad].sort(
      (a, b) =>
        b.stadiumBattingStats.totalRuns - a.stadiumBattingStats.totalRuns
    );
    const stadiumBowlingStats = [...element.squad].sort(
      (a, b) =>
        b.stadiumBowlingStats.totalWicket - a.stadiumBowlingStats.totalWicket
    );
    const battingStats = [...element.squad].sort(
      (a, b) => b.battingStats.totalRuns - a.battingStats.totalRuns
    );
    const bowlingStats = [...element.squad].sort(
      (a, b) => b.bowlingStats.totalWicket - a.bowlingStats.totalWicket
    );
    const battingForm = [...element.squad].sort(
      (a, b) => b.battingForm.totalRuns - a.battingForm.totalRuns
    );
    const bowlingForm = [...element.squad].sort(
      (a, b) => b.bowlingForm.totalWicket - a.bowlingForm.totalWicket
    );
    const fantasyPoint = [...element.squad].sort(
      (a, b) => b.fantasyPoints - a.fantasyPoints
    );

    sortPrepareData.push({
      flag: element.flag,
      color: element.color,
      shortName: element.shortName,
      squad: {
        againstTeamBowlingStats: againstTeamBowlingStats,
        againstTeamBattingStats: againstTeamBattingStats,
        stadiumBattingStats: stadiumBattingStats,
        stadiumBowlingStats: stadiumBowlingStats,
        battingStats: battingStats,
        bowlingStats: bowlingStats,
        battingForm: battingForm,
        bowlingForm: bowlingForm,
        fantasyPoint: fantasyPoint,
      },
    });
  });

  return { stadiumAVerageScore: stadiumAVerageScore };
};

const AnanlysisAvgScore = (data: any) => {
  const totalRecentBat = data.squad.reduce(
    (acc: number, item: any) => acc + item.battingForm.totalRuns,
    0
  );
  const totalStadiumBat = data.squad.reduce(
    (acc: number, item: any) => acc + item.stadiumBattingStats.totalRuns,
    0
  );
  const totalagainstTeamBat = data.squad.reduce(
    (acc: number, item: any) => acc + item.againstTeamBattingStats.totalRuns,
    0
  );
  const totalBattingStats = data.squad.reduce(
    (acc: number, item: any) => acc + item.battingStats.totalRuns,
    0
  );

  const totalRecentBowl = data.squad.reduce(
    (acc: number, item: any) => acc + item.bowlingForm.totalWicket,
    0
  );
  const totalStadiumBowl = data.squad.reduce(
    (acc: number, item: any) => acc + item.stadiumBowlingStats.totalWicket,
    0
  );
  const totalagainstTeamBowl = data.squad.reduce(
    (acc: number, item: any) => acc + item.againstTeamBowlingStats.totalWicket,
    0
  );
  const totalBowlStats = data.squad.reduce(
    (acc: number, item: any) => acc + item.bowlingStats.totalWicket,
    0
  );

  const playerTotalScore =
    (Number(totalRecentBat) +
      Number(totalStadiumBat) +
      Number(totalagainstTeamBat) +
      Number(totalBattingStats)) /
      data.squad.length || 0;

  const avgScore = Math.floor(
    (playerTotalScore * 11 + data.stadiumAvg) / 2 + 14
  );

  const playerTotalWicket =
    (Number(totalBowlStats) +
      Number(totalagainstTeamBowl) +
      Number(totalStadiumBowl) +
      Number(totalRecentBowl)) /
      data.squad.length || 0;

  const avgWicket = Math.floor((playerTotalWicket * 11) / 2 + 2);

  let totalWicket = 0;
  let totalRunConsume = 0;

  data.squad.forEach((item: any) => {
    const form = item.bowlingForm;
    totalWicket += form.totalWicket;
    // totalOver += form.totalOver;
    totalRunConsume += form.totalRunConsume;
  });

  return { avgScore, avgWicket };
};
