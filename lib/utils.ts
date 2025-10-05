import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { load } from "cheerio";
import axios from "axios";

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

    if (playerList.length === 0) {
      throw new Error("No players found");
    }
    return playerList; // Return the first player found
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
    return stadiums; // Return the first player found
  } catch (error) {
    console.error(
      `Error fetching player search list for ${searchTerm}:`,
      error
    );
    return [];
  }
};

export const GetTeamList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";
  const formData = new FormData();

  formData.append("team", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const $ = load(data);
    const teams: { name: string; url: string }[] = [];

    $(".row.row-cols-1.row-cols-lg-3 .col").each((index, element) => {
      const name = $(element).find("b.card-title").text().trim();
      const url = $(element).find("a").attr("href");

      if (name && url) {
        teams.push({ name, url });
      }
    });

    if (teams.length === 0) {
      throw new Error("No team found");
    }

    return teams;
  } catch (error) {
    console.error(`Error fetching team search list for ${searchTerm}:`, error);
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
  const token = localStorage.getItem("token"); // or whatever key you used
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
