import { GetHtml, GetPSearchList } from "@/lib/utils";
import {
  AgaintStadiumStats,
  AgaintTeamStats,
  BattingForm,
  BattingStats,
  BowlingForm,
  BowlingStats,
  FantasyStats,
  OverallStats,
} from "./PerformanceDetail";
import Stats from "../stats/StatsModel";
import dbConnect from "../db";

type StatData = {
  fantasyPoints: any[];
  battingForm: any[];
  bowlingForm: any[];
  battingStats: any[];
  bowlingStats: any[];
  overallStats: any;
  stadiumStats?: any;
  againstTeamsStats?: any;
};

const DEFAULT_RESULT: StatData = {
  fantasyPoints: [],
  battingForm: [],
  bowlingForm: [],
  battingStats: [],
  bowlingStats: [],
  overallStats: {},
  stadiumStats: {},
  againstTeamsStats: {},
};

function toAbsolute(href: string) {
  if (!href) return "";
  return href.startsWith("http") ? href : `https://advancecricket.com${href}`;
}

export const NewPlayerDetails = async (
  name: string,
  stadiumName: string,
  teamName: string,
  originalName: string
) => {
  // Ensure DB connection — if it fails, return default immediately
  try {
    await dbConnect();
  } catch (err) {
    console.error("dbConnect failed:", (err as any)?.message || err);
    return DEFAULT_RESULT;
  }

  try {
    // 1) Try searching by provided name
    let playerData = await GetPSearchList(name).catch((e) => {
      console.error("GetPSearchList(name) failed:", e?.message || e);
      return [] as { name: string; url: string }[];
    });

    // 2) If none found, try Stats collection using originalName
    if (!playerData || playerData.length === 0) {
      let playerDetails: any = null;
      try {
        playerDetails = await Stats.findOne({
          publicName: originalName,
        }).lean();
      } catch (err) {
        console.error("Stats.findOne failed:", (err as any)?.message || err);
      }

      if (playerDetails?.originalName) {
        playerData = await GetPSearchList(playerDetails.originalName).catch(
          (e) => {
            console.error(
              "GetPSearchList(originalName) failed:",
              e?.message || e
            );
            return [] as { name: string; url: string }[];
          }
        );
      } else {
        playerData = [];
      }
    }

    // If still empty => return defaults
    if (!playerData || playerData.length === 0) {
      return DEFAULT_RESULT;
    }

    const playerList = playerData[0];
    if (!playerList?.url) {
      console.error("playerList has no url:", playerList);
      return DEFAULT_RESULT;
    }

    // 3) Fetch main player page HTML
    const $main = await GetHtml(playerList.url);
    if (!$main) {
      console.error("GetHtml returned null for player url:", playerList.url);
      return DEFAULT_RESULT;
    }

    // 4) Build list of links we want to fetch
    const requiredNames = [
      "Dream11 Points",
      "Batting Form",
      "Bowling Form",
      "Batting Stats",
      "Bowling Stats",
      "Against Teams",
      "Against Teams On Stadiums",
    ];
    const resultLinks: { name: string; url: string }[] = [
      { name: "Overall Stats", url: playerList.url },
    ];

    $main(".dropdown-menu a").each((_, el) => {
      const name = $main(el).text().trim();
      const href = ($main(el).attr("href") || "").trim();
      if (!name || !href) return;
      if (requiredNames.includes(name)) {
        resultLinks.push({ name, url: toAbsolute(href) });
      }
    });

    // 5) Prepare statData and fetch each stat in parallel but isolated
    const statData: StatData = {
      fantasyPoints: [],
      battingForm: [],
      bowlingForm: [],
      battingStats: [],
      bowlingStats: [],
      overallStats: {},
      stadiumStats: {},
      againstTeamsStats: {},
    };

    // Map each item to a promise; use allSettled so one failure doesn't stop others
    const tasks = resultLinks.map(async (item) => {
      try {
        switch (item.name) {
          case "Dream11 Points":
            statData.fantasyPoints = (await FantasyStats(item.url)) || [];
            break;
          case "Batting Form":
            statData.battingForm = (await BattingForm(item.url)) || [];
            break;
          case "Bowling Form":
            statData.bowlingForm = (await BowlingForm(item.url)) || [];
            break;
          case "Batting Stats":
            statData.battingStats = (await BattingStats(item.url)) || [];
            break;
          case "Bowling Stats":
            statData.bowlingStats = (await BowlingStats(item.url)) || [];
            break;
          case "Overall Stats":
            statData.overallStats = (await OverallStats(item.url)) || {};
            break;
          case "Against Teams On Stadiums":
            statData.stadiumStats =
              (await AgaintStadiumStats(item.url, stadiumName)) || {};
            break;
          case "Against Teams":
            statData.againstTeamsStats =
              (await AgaintTeamStats(item.url, teamName)) || {};
            break;
          default:
            // ignore unneeded pages
            break;
        }
      } catch (err) {
        // log but do not throw or modify other results
        console.error(
          `Failed to fetch "${item.name}" from ${item.url}:`,
          (err as any)?.message || err
        );
      }
    });

    await Promise.allSettled(tasks);

    return statData;
  } catch (err) {
    console.error(
      "NewPlayerDetails unexpected error:",
      (err as any)?.message || err
    );
    return DEFAULT_RESULT;
  }
};
