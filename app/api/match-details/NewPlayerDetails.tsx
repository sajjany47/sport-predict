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

export const NewPlayerDetails = async (
  name: string,
  stadiumName: string,
  teamName: string
) => {
  try {
    const playerList: any = await GetPSearchList(name);
    const getInfoUrl = await GetHtml(playerList.url);
    const requiredNames = [
      "Dream11 Points",
      "Batting Form",
      "Bowling Form",
      "Batting Stats",
      "Bowling Stats",
      "Against Teams",
      "Against Teams On Stadiums",
    ];
    const result: { name: string; url: string }[] = [
      { name: "Overall Stats", url: playerList.url },
    ];

    getInfoUrl(".dropdown-menu a").each((_, el) => {
      const name = getInfoUrl(el).text().trim();
      const href = getInfoUrl(el).attr("href") || "";

      if (requiredNames.includes(name)) {
        result.push({ name, url: href });
      }
    });

    const statData: {
      fantasyPoints: any[];
      battingForm: any[];
      bowlingForm: any[];
      battingStats: any[];
      bowlingStats: any[];
      overallStats: any;
      stadiumStats?: any;
      againstTeamsStats?: any;
    } = {
      fantasyPoints: [],
      battingForm: [],
      bowlingForm: [],
      battingStats: [],
      bowlingStats: [],
      overallStats: {},
      stadiumStats: {},
      againstTeamsStats: {},
    };
    await Promise.all(
      result.map(async (item) => {
        switch (item.name) {
          case "Dream11 Points":
            statData.fantasyPoints = await FantasyStats(item.url);
            break;
          case "Batting Form":
            statData.battingForm = await BattingForm(item.url);
            break;
          case "Bowling Form":
            statData.bowlingForm = await BowlingForm(item.url);
            break;
          case "Batting Stats":
            statData.battingStats = await BattingStats(item.url);
            break;
          case "Bowling Stats":
            statData.bowlingStats = await BowlingStats(item.url);
            break;
          case "Overall Stats":
            statData.overallStats = await OverallStats(item.url);
            break;
          case "Against Teams On Stadiums":
            statData.stadiumStats = await AgaintStadiumStats(
              item.url,
              stadiumName
            );
            break;
          case "Against Teams":
            statData.againstTeamsStats = await AgaintTeamStats(
              item.url,
              teamName
            );
            break;
        }
      })
    );

    return statData;
  } catch (error) {
    console.log(error);
    return {
      fantasyPoints: [],
      battingForm: [],
      bowlingForm: [],
      battingStats: [],
      bowlingStats: [],
      overallStats: {},
      stadiumStats: {},
      againstTeamsStats: {},
    };
  }
};
