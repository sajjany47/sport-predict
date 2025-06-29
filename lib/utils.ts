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
    const totalWickets = team1.wickets + team2.wickets;
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

  // const team1 = data.squadList[0];
  // const team2 = data.squadList[1];
  // const team1Squad =
  //   team1.playingPlayer.length > 0 ? team1.playingPlayer : team1.benchPlayer;
  // const team2Squad =
  //   team2.playingPlayer.length > 0 ? team2.playingPlayer : team2.benchPlayer;

  const a = data.squadList.map((item: any) => {
    const squad = (
      item.playingPlayer.length > 0 ? item.playingPlayer : item.benchPlayer
    ).map((elm: any) => {
      let playerData: any = {
        name: elm.name,
        shortName: elm.shortName,
        flag: elm.flag,
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
      // const filterFormatBattingStats = elm.battingStats.filter((a:any)=>a.mode=== data.matchInfo.format.toLowerCase());

      playerData.bowlingForm = {
        totalOver: totalOver / firsttwelveBowlingForm.length,
        totalWicket: totalWicket / firsttwelveBowlingForm.length,
        totalRunConsume: totalRunConsume / firsttwelveBowlingForm.length,
      };

      playerData.battingForm = {
        totalRuns: totalRuns / firsttwelveBattingForm.length,
        totalBalls: totalBalls / firsttwelveBattingForm.length,
        totalSR:
          (totalBalls > 0 ? (totalRuns / totalBalls) * 100 : 0) /
          firsttwelveBattingForm.length,
      };
      playerData.fantasyPoints =
        sumOfFantasyPoints / firsttwelveFantasyPoints.length;
    });
  });

  console.log("avgScore====>", avgScore / totalMatch);
  console.log("avgWicket====>", avgWicket);
  console.log("totalMatch====>", totalMatch);
};
