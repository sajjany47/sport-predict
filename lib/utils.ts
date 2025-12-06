import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { load } from "cheerio";
import axios from "axios";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CustomStyles = {
  headCells: {
    style: {
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: "#f9fafb",
    },
  },
  rows: {
    style: {
      minHeight: "56px",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "10px",
    },
  },
};

export const GetHtml = async (url: string) => {
  try {
    if (!url) return null;

    const response = await axios.get(url, {
      timeout: 15000,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (!response?.data) return null;

    const $ = load(response.data);
    return $;
  } catch (error: any) {
    // log error internally but return empty
    console.error("GetHtml Error:", error?.message || error);
    return null; // return empty instead of throwing
  }
};

export const GetPSearchList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";
  const formData = new FormData();

  formData.append("text", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 15000, // prevent stuck requests
      validateStatus: (status) => status >= 200 && status < 400,
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

    return playerList.length > 0 ? playerList : [];
  } catch (error: any) {
    console.error(
      `GetPSearchList error for "${searchTerm}":`,
      error?.message || error
    );
    return []; // always return empty on error
  }
};

export const GetStadiumList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";

  // quick guard
  if (!searchTerm) return [];

  const formData = new FormData();
  formData.append("stadium", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000, // avoid hanging requests
      validateStatus: (status) => status >= 200 && status < 400, // treat 4xx/5xx as error
    });

    if (!data) return [];

    const $ = load(data);
    const stadiums: { name: string; url: string }[] = [];

    $(".row.row-cols-1.row-cols-lg-3 .col").each((_, element) => {
      const name = $(element).find("b.card-title").text().trim();
      const href = $(element).find("a").attr("href") || "";

      if (name && href) {
        const stadiumUrl = href.startsWith("http")
          ? href
          : `https://advancecricket.com${href}`;
        stadiums.push({ name, url: stadiumUrl });
      }
    });

    return stadiums.length > 0 ? stadiums : [];
  } catch (err) {
    // internal logging only — function never throws
    console.error(
      `GetStadiumList error for "${searchTerm}":`,
      (err as any)?.message || err
    );
    return [];
  }
};

export const GetTeamList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";

  if (!searchTerm) return [];

  const formData = new FormData();
  formData.append("team", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000, // prevents long wait
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (!data) return [];

    const $ = load(data);
    const teams: { name: string; url: string }[] = [];

    $(".row.row-cols-1.row-cols-lg-3 .col").each((_, element) => {
      const name = $(element).find("b.card-title").text().trim();
      const href = $(element).find("a").attr("href") || "";

      if (name && href) {
        const teamUrl = href.startsWith("http")
          ? href
          : `https://advancecricket.com${href}`;
        teams.push({ name, url: teamUrl });
      }
    });

    return teams.length > 0 ? teams : [];
  } catch (err) {
    console.error(
      `GetTeamList error for "${searchTerm}":`,
      (err as any)?.message || err
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

export const CleanName = (name: any) => {
  return (
    name
      // Replace curly apostrophes (’‘) and normal apostrophes (') and capitalize next letter
      .replace(/[’'‘]([a-z])/gi, (_: any, char: any) => char.toUpperCase())
      // Replace hyphens and commas with space
      .replace(/[-,]+/g, " ")
      // Replace multiple spaces with a single space
      .replace(/\s+/g, " ")
      .trim()
  );
};

export const FormatErrorMessage = (error: any) => {
  if (error.errors) {
    // Case 1: error.errors is an array
    if (Array.isArray(error.errors)) {
      return error.errors.join(", ") || "Validation error occurred";
    }

    // Case 2: error.errors is an object (common in Zod/Mongoose validation errors)
    if (typeof error.errors === "object") {
      return Object.values(error.errors)
        .map((err: any) => err?.message || String(err))
        .join(", ");
    }

    // Case 3: already a string
    if (typeof error.errors === "string") {
      return error.errors;
    }
  } else if (error.message) {
    return error.message;
  }

  return "An unknown error occurred";
};

export const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

export const getHeadersWithToken = () => {
  const token = sessionStorage.getItem("token"); // or whatever key you used
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const GenerateTicketNumber = (type: any) => {
  // Mapping option to prefix
  const prefixes: any = {
    general: "GEN",
    payment: "PAY",
    prediction: "PRE",
    technical: "TEC",
    account: "ACC",
  };

  // Get prefix based on type
  const prefix = prefixes[type] || "GEN";

  // Current date (YYYYMMDD)
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // Random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  // Final Ticket Number
  return `${prefix}${date}${random}`;
};

export const ParseScore = (scoreStr: any) => {
  if (!scoreStr || scoreStr.includes("-0 ()")) return null; // invalid or abandoned
  const [runsWickets, oversStr] = scoreStr.split(" ");
  const [runs, wickets] = runsWickets.split("-").map(Number);
  const overs = parseFloat(oversStr?.replace(/[()]/g, "")) || 0;
  return { runs, wickets, overs };
};

export const FindWinner = (team: any, selectedMatch: any, teamName: any) => {
  const prepareData = team.map((match: any) => {
    const findTeamShortName = selectedMatch?.teams.find(
      (item: any) => item.teamName === teamName
    )?.teamShortName;

    const team1Score: any = ParseScore(match.team1?.score);
    const team2Score: any = ParseScore(match.team2?.score);

    let winnerType = "";
    let winner = "";

    if (match.result.toLowerCase().includes("abandoned")) {
      winner = "A";
    } else if (!team1Score || !team2Score) {
      winner = "A";
    } else if (match.result.toLowerCase().includes("dls")) {
      if (
        match.result.toLowerCase().includes(`${teamName.toLowerCase()} beat`)
      ) {
        if (match.result.toLowerCase().includes("wickets")) {
          winner = "W";
          winnerType = "bowling";
        } else {
          winner = "W";
          winnerType = "batting";
        }
      } else {
        winner = "L";
        winnerType = "";
      }
    } else if (team1Score.runs > team2Score.runs) {
      winner =
        match.team1?.name.toLowerCase() ===
        findTeamShortName?.toLocaleLowerCase()
          ? "W"
          : "L";
      winnerType = "batting";
    } else if (team2Score.runs > team1Score.runs) {
      winner =
        match.team2?.name.toLowerCase() ===
        findTeamShortName?.toLocaleLowerCase()
          ? "W"
          : "L";
      winnerType = "bowling";
    }

    return { ...match, winner, winnerType };
  });

  return prepareData;
};

export const ToFixed = (num: string | number, digit?: number | string) => {
  const digitValue = digit ? Number(digit) : 2;
  return Number(Number(num).toFixed(digitValue));
};

export const CheckIntValue = (num: any, digit?: number | string) => {
  const digitValue = digit ? Number(digit) : 2;
  const n = Number(num);

  if (Number.isNaN(n)) return 0;
  return Number(n.toFixed(digitValue));
};

// safe divide helper to avoid division by 0 / NaN
export const SafeDivide = (a: number, b: number) => {
  if (!Number.isFinite(a)) return 0;
  if (!b || !Number.isFinite(b)) return 0;

  return a / b;
};

export const SortArray = (arr: any[]) => {
  return arr.sort(
    (a: any, b: any) =>
      moment(b.date, "DD/MM/YY").valueOf() -
      moment(a.date, "DD/MM/YY").valueOf()
  );
};
export const findModeOver = (format: any) => {
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
export const matchOver = (format: any) => {
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
// ---------- Helpers (assumed to exist) ----------
// findModeOver(mode: string) => { over: number }
// SortArray<T>(arr: T[]): T[]
// CheckIntValue(num: any, digit?: number | string): number
// SafeDivide(a: number, b: number): number

// ---------- 1. Career Bowling (all formats combined, by rows) ----------

export const CalculateBowlingG = (bowlingStats: any[]) => {
  const rows = bowlingStats || [];

  const prepared = rows.map((item: any) => {
    const modeOver = findModeOver(String(item.mode || "").toLowerCase());
    const matches = CheckIntValue(item.matches);
    const balls = CheckIntValue(item.balls);
    const runs = CheckIntValue(item.runs);
    const wickets = CheckIntValue(item.wicket);
    const maxOversPerMatch = modeOver?.over || 0;

    const totalOversBowled = SafeDivide(balls, 6);
    const avgOversPerMatch = SafeDivide(totalOversBowled, matches);

    // 0–100: how much of the maximum spell he bowls on average
    const avgOverPercentage =
      maxOversPerMatch > 0 ? (avgOversPerMatch / maxOversPerMatch) * 100 : 0;

    // runs/over & wickets/over for this row
    const avgRunsPerOver = SafeDivide(runs, balls) * 6;
    const avgWicketsPerOver = SafeDivide(wickets, balls) * 6;

    return {
      run: avgRunsPerOver,
      wicket: avgWicketsPerOver,
      eco: CheckIntValue(item.economy),
      avgOverPercentage: CheckIntValue(avgOverPercentage),
    };
  });

  const total = prepared.reduce(
    (acc, curr) => {
      acc.run += curr.run;
      acc.wicket += curr.wicket;
      acc.eco += curr.eco;
      acc.avgOverPercentage += curr.avgOverPercentage;
      return acc;
    },
    {
      run: 0,
      wicket: 0,
      eco: 0,
      avgOverPercentage: 0,
    }
  );

  const count = prepared.length;

  const avgEconmy = CheckIntValue(SafeDivide(total.eco, count));
  const avgWicket = CheckIntValue(SafeDivide(total.wicket, count));
  const avgOverPercentage = CheckIntValue(
    SafeDivide(total.avgOverPercentage, count)
  );

  return { avgEconmy, avgWicket, avgOverPercentage };
};

// ---------- 2. Career Batting (all formats combined, by rows) ----------

export const CalculateBattingG = (battingStats: any[]) => {
  const rows = battingStats || [];

  const prepared = rows.map((item: any) => {
    const modeOver = findModeOver(String(item.mode || "").toLowerCase());
    const matches = CheckIntValue(item.matches);
    const balls = CheckIntValue(item.balls);
    const runs = CheckIntValue(item.runs);
    const strikeRate = CheckIntValue(item.strikeRate);
    const maxBallsPerMatch = (modeOver?.over || 0) * 6;

    const avgBallsPerMatch = SafeDivide(balls, matches);

    // 0–100: how many of the team's balls he faces on avg
    const avgBallsPercentage =
      maxBallsPerMatch > 0 ? (avgBallsPerMatch / maxBallsPerMatch) * 100 : 0;

    // runs per ball for this row
    const avgRunsPerBall = SafeDivide(runs, balls);

    return {
      run: avgRunsPerBall,
      strikeRate,
      avgBallPercentage: CheckIntValue(avgBallsPercentage),
    };
  });

  const total = prepared.reduce(
    (acc, curr) => {
      acc.run += curr.run;
      acc.strikeRate += curr.strikeRate;
      acc.avgBallPercentage += curr.avgBallPercentage;
      return acc;
    },
    {
      run: 0,
      strikeRate: 0,
      avgBallPercentage: 0,
    }
  );

  const count = prepared.length;

  const run = CheckIntValue(SafeDivide(total.run, count)); // average runs per ball across rows
  const avgStrikeRate = CheckIntValue(SafeDivide(total.strikeRate, count));
  const avgBallPercentage = CheckIntValue(
    SafeDivide(total.avgBallPercentage, count)
  );

  return { run, avgStrikeRate, avgBallPercentage };
};

// ---------- 3. Fantasy (last 20 games) ----------

export const CalculateFantasy = (fantasy: any[]) => {
  const sorted = SortArray(fantasy || []).slice(0, 20);

  const result = sorted.reduce(
    (acc, curr) => {
      const bat = CheckIntValue(curr.bat);
      const bowl = CheckIntValue(curr.bowl);
      acc.bat += bat;
      acc.bowl += bowl;
      return acc;
    },
    { bat: 0, bowl: 0 }
  );

  const count = sorted.length;

  const avgRunsPoint = CheckIntValue(SafeDivide(result.bat, count));
  const avgBowlPoint = CheckIntValue(SafeDivide(result.bowl, count));

  return { avgRunsPoint, avgBowlPoint };
};

// ---------- 4. Recent Batting Form (last 20 innings) ----------

export const CalculateBatting = (battingForm: any[]) => {
  const sorted = SortArray(battingForm || []).slice(0, 20);

  const mapped = sorted.map((innings: any) => {
    const runStr = innings.run;
    let runs = 0;
    let balls = 0;

    if (runStr && typeof runStr === "string" && runStr.includes("(")) {
      const [r, b] = runStr.replace(")", "").split("(");
      runs = Number(r.trim()) || 0;
      balls = Number(b.trim()) || 0;
    }

    const strikeRate =
      innings.sr === "DNB" || innings.sr === "" || innings.sr == null
        ? 0
        : Number(innings.sr);

    return {
      runs,
      ballFaced: balls,
      strikeRate: CheckIntValue(strikeRate),
    };
  });

  const total = mapped.reduce(
    (acc, curr) => {
      acc.runs += curr.runs;
      acc.ballFaced += curr.ballFaced;
      acc.strikeRate += curr.strikeRate;
      return acc;
    },
    { runs: 0, ballFaced: 0, strikeRate: 0 }
  );

  const count = mapped.length;

  const averageRuns = CheckIntValue(SafeDivide(total.runs, count));
  const averageBallsFaced = CheckIntValue(SafeDivide(total.ballFaced, count));
  const averageStrikeRate = CheckIntValue(SafeDivide(total.strikeRate, count));

  return { averageRuns, averageBallsFaced, averageStrikeRate };
};

// ---------- 5. Recent Bowling Form (last 20 matches) ----------

export const CalculateBowling = (bowlingForm: any[]) => {
  const sorted = SortArray(bowlingForm || []).slice(0, 20);

  const mapped = sorted.map((item: any) => {
    const overRaw = CheckIntValue(item.o); // "6.2", "4.0", "DNB" -> 0
    let avgOverFactor = 0;

    if (overRaw > 0 && overRaw <= 4) {
      avgOverFactor = overRaw / 4;
    } else if (overRaw > 4 && overRaw <= 10) {
      avgOverFactor = overRaw / 10;
    } else if (overRaw > 10) {
      avgOverFactor = overRaw / 25;
    }

    return {
      over: overRaw,
      run: CheckIntValue(item.r),
      wicket: CheckIntValue(item.w),
      eco: CheckIntValue(item.eco),
      avgOver: CheckIntValue(avgOverFactor),
    };
  });

  const total = mapped.reduce(
    (acc, curr) => {
      acc.run += curr.run;
      acc.wicket += curr.wicket;
      acc.eco += curr.eco;
      acc.avgOver += curr.avgOver;
      return acc;
    },
    {
      run: 0,
      wicket: 0,
      eco: 0,
      avgOver: 0,
    }
  );

  const count = mapped.length;

  const avgEconmy = CheckIntValue(SafeDivide(total.eco, count));
  const avgWicket = CheckIntValue(SafeDivide(total.wicket, count));
  const avgOver = CheckIntValue(SafeDivide(total.avgOver, count));
  const avgRunsConsumed = CheckIntValue(SafeDivide(total.run, count));

  return { avgEconmy, avgWicket, avgOver, avgRunsConsumed };
};
