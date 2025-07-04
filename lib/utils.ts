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

export const CalculateWinnerPrediction = (team: any, opponent: any) => {
  const scoreWeight = 0.4; // scoring power
  const wicketWeight = 0.3; // wicket-taking
  const defenseWeight = 0.3; // run consumption

  // Normalize by using both teams’ data
  const maxScore = Math.max(team.avgScore, opponent.avgScore);
  const maxWicket = Math.max(team.avgWicket, opponent.avgWicket);
  const maxRunConsume = Math.max(team.avgRunconsume, opponent.avgRunconsume);

  const score = (team.avgScore / maxScore) * scoreWeight;
  const wickets = (team.avgWicket / maxWicket) * wicketWeight;
  const defense =
    ((maxRunConsume - team.avgRunconsume) / maxRunConsume) * defenseWeight;

  return score + wickets + defense;
};

export const AnalyzeFantasyData = (data: any) => {
  const getTopPlayers = (squad: any) =>
    [...squad].sort((a, b) => b.fantasyPoints - a.fantasyPoints);

  const getTopBatsman = (squad: any) =>
    [...squad]
      .filter((p) => p.type === "BAT" || p.type === "WK" || p.type === "AR")
      .sort((a, b) => b.battingForm.totalRuns - a.battingForm.totalRuns)[0];

  const getTopBowler = (squad: any) =>
    [...squad]
      .filter((p) => p.type === "BOWL" || p.type === "AR")
      .sort((a, b) => b.bowlingForm.totalWicket - a.bowlingForm.totalWicket)[0];

  const formatBatsman = (player: any) => {
    const recentAvg = player.battingForm.totalRuns || 0;
    const venueAvg = player.stadiumBattingStats.totalRuns || 0;

    // Weighted formula for probability (you can tweak weights)
    const score = recentAvg * 0.7 + venueAvg * 0.3;
    const probability = Math.min(100, Math.round((score / 50) * 100)); // Assuming 50 is "excellent" base

    return {
      name: player.name,
      predictedRuns: `${Math.round(recentAvg - 10)}-${Math.round(
        recentAvg + 10
      )}`,
      probability: `${probability}%`,
      recentAvg: parseFloat(recentAvg.toFixed(1)),
      venueAvg: parseFloat(venueAvg.toFixed(1)),
    };
  };

  const formatBowler = (player: any) => {
    const recentAvg = player.bowlingForm.totalWicket || 0;
    const venueAvg = player.stadiumBowlingStats.totalWicket || 0;

    // Weighted formula for probability
    const score = recentAvg * 0.6 + venueAvg * 0.4;
    const probability = Math.min(100, Math.round((score / 3) * 100)); // 3 wickets = strong bowler performance

    return {
      name: player.name,
      predictedWickets: `${Math.floor(recentAvg)}-${Math.ceil(recentAvg + 1)}`,
      probability: `${probability}%`,
      recentAvg: parseFloat(recentAvg.toFixed(1)),
      venueAvg: parseFloat(venueAvg.toFixed(1)),
    };
  };

  const teamData = data.map((team: any) => {
    const topPlayers = getTopPlayers(team.squad);
    const topBat = getTopBatsman(team.squad);
    const topBowl = getTopBowler(team.squad);

    return {
      teamName: team.shortName,
      topPlayers,
      topBatsman: formatBatsman(topBat),
      topBowler: formatBowler(topBowl),
      keyPlayers: topPlayers.slice(0, 5).map((p) => ({
        name: p.name,
        role: p.type,
        impact: p.fantasyPoints > 40 ? "High" : "Medium",
        recentForm: `${p.fantasyPoints.toFixed(0)}, ...`,
      })),
    };
  });

  const [team1Data, team2Data] = teamData;

  return {
    dream11Team: {
      captain: {
        name: team1Data.topPlayers[0].name,
        team: team1Data.teamName,
        role: team1Data.topPlayers[0].type,
        points: parseFloat(team1Data.topPlayers[0].fantasyPoints.toFixed(1)),
        form: "Excellent",
      },
      viceCaptain: {
        name: team2Data.topPlayers[0].name,
        team: team2Data.teamName,
        role: team2Data.topPlayers[0].type,
        points: parseFloat(team2Data.topPlayers[0].fantasyPoints.toFixed(1)),
        form: "Good",
      },
      players: [
        ...team1Data.topPlayers.slice(0, 4),
        ...team2Data.topPlayers.slice(0, 4),
      ].map((p, i) => ({
        id: i + 1,
        name: p.name,
        team: team1Data.teamName.includes(p.name)
          ? team1Data.teamName
          : team2Data.teamName,
        role: p.type,
        points: parseFloat(p.fantasyPoints.toFixed(1)),
      })),
    },
    keyPlayers: {
      [team1Data.teamName]: team1Data.keyPlayers,
      [team2Data.teamName]: team2Data.keyPlayers,
    },
    topBatsman: {
      [team1Data.teamName]: team1Data.topBatsman,
      [team2Data.teamName]: team2Data.topBatsman,
    },
    topBowler: {
      [team1Data.teamName]: team1Data.topBowler,
      [team2Data.teamName]: team2Data.topBowler,
    },
  };
};

export const CalculatAIPrediction = (data: any) => {
  const apiAvgScore = Number(data.overview.groundAndWheather.avgScore) ?? null;

  const stadiumAvg = StadiumAvgScore(data);

  const accordingToPlayerStats = data.squadList.map((item: any) => {
    const players =
      item.playingPlayer.length > 0 ? item.playingPlayer : item.benchPlayer;
    const squad = players.map(ExtractPlayerData);

    return {
      flag: item.flag,
      color: item.color,
      shortName: item.shortName,
      squad: squad,
    };
  });

  const avgPrepare = {
    stadiumAvg: {
      avgScore: stadiumAvg.avgScore || apiAvgScore,
      avgWicket: stadiumAvg.avgWicket,
    },
    accordingToPlayerStats: accordingToPlayerStats,
  };

  //Calculate average and winner prediction.................................................................
  const team1AvgScore = AnanlysisAvgScore({
    squad: avgPrepare.accordingToPlayerStats[0].squad,
    stadiumAvg: avgPrepare.stadiumAvg,
  });
  const team2AvgScore = AnanlysisAvgScore({
    squad: avgPrepare.accordingToPlayerStats[1].squad,
    stadiumAvg: avgPrepare.stadiumAvg,
  });

  const team1Score = CalculateWinnerPrediction(team1AvgScore, team2AvgScore);
  const team2Score = CalculateWinnerPrediction(team2AvgScore, team1AvgScore);

  // Convert to probabilities
  const totalScore = team1Score + team2Score;
  const team1Prob = (team1Score / totalScore) * 100;
  const team2Prob = (team2Score / totalScore) * 100;
  // ..............................calculate average score and winner prediction........................................................

  //Calculate Fantasy Team List and Key Player.................................................................................

  const fantasyData = AnalyzeFantasyData(avgPrepare.accordingToPlayerStats);

  //..........................Calculate Fantasy Team List and Key Player........................................................
  const result = {
    firstInningScore: {
      team1: {
        min: team1AvgScore.avgScore - 10,
        max: team1AvgScore.avgScore + 20,
        predicted: team1AvgScore.avgScore,
      },
      team2: {
        min: team2AvgScore.avgScore - 10,
        max: team2AvgScore.avgScore + 20,
        predicted: team2AvgScore.avgScore,
      },
    },
    winnerPrediction: {
      team1: {
        probability: team1Prob.toFixed(2),
        confidence: Number(team1Prob) > Number(team2Prob) ? "High" : "Medium",
      },
      team2: {
        probability: team2Prob.toFixed(2),
        confidence: Number(team2Prob) > Number(team1Prob) ? "High" : "Medium",
      },
    },
    ...fantasyData,
  };

  console.log(result);

  return result;
};

export const AnanlysisAvgScore = (data: any) => {
  // Calculate Bowler Avg Runs Consume and Avg Wicket
  let totalWicket = 0;
  let totalRunConsume = 0;

  data.squad.forEach((item: any) => {
    totalWicket +=
      Number(item.bowlingStats.totalWicket) +
      Number(item.againstTeamBowlingStats.totalWicket) +
      Number(item.stadiumBowlingStats.totalWicket) +
      Number(item.bowlingForm.totalWicket);
    totalRunConsume +=
      Number(item.bowlingStats.totalAvg) +
      Number(item.againstTeamBowlingStats.totalAvg) +
      Number(item.stadiumBowlingStats.totalAvg) +
      Number(item.bowlingForm.totalAvg);
  });
  const avgWicket = Math.floor(
    ((totalWicket / data.squad.length) * 11 + data.stadiumAvg.avgWicket) / 2 + 2
  );
  const avgRunconsume = Math.floor(
    (totalRunConsume / data.squad.length) * 11 + 14
  );

  //Calculate Avg Score using player stats and Ground Stats

  let totalScore = 0;

  data.squad.forEach((item: any) => {
    totalScore +=
      Number(item.battingStats.totalRuns) +
      Number(item.againstTeamBattingStats.totalRuns) +
      Number(item.stadiumBattingStats.totalRuns) +
      Number(item.battingForm.totalRuns);
  });

  const avgScore = Math.floor(
    ((totalScore / data.squad.length) * 11 + data.stadiumAvg.avgScore) / 2 + 14
  );

  return { avgScore, avgWicket, avgRunconsume };
};

export const StadiumAvgScore = (data: any) => {
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
    avgScore += Number(adjustedScore);
    avgWicket += Number(totalWickets);
    totalMatch += 1;
  });

  return {
    avgWicket: avgWicket / totalMatch,
    avgScore: avgScore / totalMatch,
  };
};

export const ParseOvers = (overStr: string): number => {
  const [overs, balls] = overStr.split(".").map(Number);
  return (overs || 0) + (balls || 0) / 6;
};
export const GetFantasyPoints = (points: any[]): number => {
  const sliced = points.slice(0, 12);
  const total = sliced.reduce((acc, p) => acc + Number(p.total || 0), 0);
  return sliced.length ? total / sliced.length : 0;
};
export const GetBattingForm = (
  form: any[]
): {
  totalRuns: number;
  totalSR: number;
} => {
  const sliced = form.slice(0, 12);
  let runs = 0,
    balls = 0,
    innings = 0;

  sliced.forEach((a) => {
    if (a.run !== "DNB") {
      const match = a.run.match(/^(\d+)\s+\((\d+)\)$/);
      if (match) {
        runs += Number(match[1]);
        balls += Number(match[2]);
        innings++;
      }
    }
  });

  return {
    totalRuns: innings ? runs / innings : 0,
    totalSR: balls ? (runs / balls) * 100 : 0,
  };
};

export const GetBowlingForm = (
  form: any[]
): {
  totalWicket: number;
  totalAvg: number;
} => {
  const sliced = form.slice(0, 12);
  let runs = 0,
    overs = 0,
    wickets = 0,
    innings = 0;

  sliced.forEach((a) => {
    if (a.o !== "DNB") {
      overs += Number(a.o);
      runs += Number(a.r);
      wickets += Number(a.w);
      innings++;
    }
  });

  return {
    totalWicket: innings ? wickets / innings : 0,
    totalAvg: overs ? runs / overs : 0,
  };
};

export const GetBattingStats = (
  stats: any[]
): {
  totalRuns: number;
  totalSR: number;
} => {
  let runs = 0,
    balls = 0,
    innings = 0;

  stats?.forEach((a) => {
    if (a.run !== "DNB") {
      runs += Number(a.runs);
      balls += Number(a.balls);
      innings += Number(a.innings);
    }
  });

  return {
    totalRuns: innings ? runs / innings : 0,
    totalSR: balls ? runs / balls : 0,
  };
};

export const GetBowlingStats = (
  stats: any[]
): {
  totalWicket: number;
  totalAvg: number;
} => {
  let runs = 0,
    balls = 0,
    wickets = 0,
    innings = 0;

  stats?.forEach((a) => {
    const correctWicketKey = a.wickets ? Number(a.wickets) : Number(a.wicket);
    if (a.balls !== "DNB") {
      runs += Number(a.runs);
      balls += Number(a.balls);
      wickets += correctWicketKey;
      innings += Number(a.innings);
    }
  });

  const overs = balls / 6;
  return {
    totalWicket: innings ? wickets / innings : 0,
    totalAvg: overs ? runs / overs : 0,
  };
};

export const ExtractPlayerData = (elm: any): any => {
  return {
    name: elm.name,
    shortName: elm.shortName,
    batStyle: elm.batStyle,
    bowlStyle: elm.bowlStyle,
    imageUrl: elm.imageUrl?.src || "",
    type: elm.type,

    fantasyPoints: GetFantasyPoints(elm.fantasyPoints),

    battingForm: GetBattingForm(elm.battingForm),
    bowlingForm: GetBowlingForm(elm.bowlingForm),

    battingStats: GetBattingStats(elm.battingStats),
    bowlingStats: GetBowlingStats(elm.bowlingStats),

    stadiumBattingStats: GetBattingStats(elm.stadiumStats?.battingStats),
    stadiumBowlingStats: GetBowlingStats(elm.stadiumStats?.bowlingStats),

    againstTeamBattingStats: GetBattingStats(
      elm.againstTeamsStats?.battingStats
    ),
    againstTeamBowlingStats: GetBowlingStats(
      elm.againstTeamsStats?.bowlingStats
    ),
  };
};
