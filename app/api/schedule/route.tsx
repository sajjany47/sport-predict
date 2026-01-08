import { FormatErrorMessage } from "@/lib/utils";
import moment from "moment-timezone";
import { CricBuzzList } from "./CricBuzzList";
import { ScoreCard } from "./ScoreCard";
import { extractAndTransformSchedule } from "./CricBuzzScarbList";
import { CrexList } from "./CrexList";
import { CrexDetails } from "../match-details/CrexDetails";
import { CrexV2Details } from "../match-details/CrexV2Details";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fromDate = body.fromDate ? new Date(body.fromDate) : new Date();

    // const advanceCricketList = await CricBuzzList(fromDate, body.timezone);

    const advanceCricketList: any = await extractAndTransformSchedule(
      fromDate,
      body.timezone
    );

    // return Response.json({
    //   success: true,
    //   count: matches.length,
    //   matches: matches,
    // });

    // -------------------------
    // STEP 1: Build URLs FIRST
    // -------------------------
    const scoreUrls = advanceCricketList.map((item: any) => {
      const team1 = item.teams[0].teamShortName.toLowerCase();
      const team2 = item.teams[1].teamShortName.toLowerCase();
      const modDis = item.matchDescription
        .split(",")[0]
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      const modTour = item.tourName
        .replace(/,/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      return `https://www.cricbuzz.com/live-cricket-scores/${item.matchId}/${team1}-vs-${team2}-${modDis}-${modTour}`;
    });

    // ---------------------------------------
    // STEP 2: Fetch ALL scorecards AT ONCE
    // ---------------------------------------
    const allScores = await Promise.all(
      scoreUrls.map((url: any) => ScoreCard(url).catch(() => null))
    );

    // ---------------------------------------
    // STEP 3: Merge Score Results
    // ---------------------------------------
    const modifyResult = advanceCricketList.map((item: any, index: number) => {
      const score = allScores[index];
      const obj: any = {
        ...item,
        score: score ?? null,
        status: moment(Number(item.originalStartTime))
          .tz(body.timezone)
          .isAfter(moment().tz(body.timezone))
          ? "NOT_STARTED"
          : "LIVE",
      };

      if (score) {
        const checkScore =
          score.score.find(
            (s: any) => s.team === item.teams[0].teamShortName
          ) ||
          score.score.find((s: any) => s.team === item.teams[1].teamShortName);

        if (checkScore) {
          const resultText = (score?.result ?? "").toLowerCase();

          if (resultText.includes("no result")) obj.status = "ABANDONED";
          else if (resultText.includes("won") || resultText.includes("win"))
            obj.status = "COMPLETED";
        } else {
          obj.score = null;
        }
      }

      return obj;
    });

    // const modifyResult = advanceCricketList.map((item) => ({
    //   ...item,
    //   status: moment(item.startTime, "DD MMM YYYY, HH:mm").isAfter(moment())
    //     ? "NOT_STARTED"
    //     : "LIVE",
    //   score: null,
    // }));

    const normalizeCrexUrl = (url: string) => url.replace(/\/live$/, "/info");

    let crexData = await CrexList(fromDate, "");
    const prepareData = modifyResult.map((item: any) => {
      let cricbuzzTeam1 = item?.teams[0];
      let cricbuzzTeam2 = item.teams[1];
      let data = item;
      let matchedCrex = crexData.find((crxItem: any) => {
        let crexTeam1 = crxItem?.teams[0];
        let crexTeam2 = crxItem?.teams[1];
        if (
          cricbuzzTeam1?.teamName?.toLowerCase() ===
            crexTeam1?.teamName?.toLowerCase() ||
          cricbuzzTeam1?.teamShortName.toLowerCase() ===
            crexTeam1?.teamShortName.toLowerCase() ||
          cricbuzzTeam2?.teamName?.toLowerCase() ===
            crexTeam2?.teamName?.toLowerCase() ||
          cricbuzzTeam2?.teamShortName.toLowerCase() ===
            crexTeam2?.teamShortName.toLowerCase()
        ) {
          return { url: crxItem.url };
        }
      });

      return {
        ...data,
        crexUrl: matchedCrex ? normalizeCrexUrl(matchedCrex.url) : null,
      };
    });

    // const data: any = await CrexDetails(
    //   "https://crex.com/scoreboard/VDR/1VD/21st-Match/40/51/hbh-vs-syt-21st-match-big-bash-league-2025-26/info"
    // );

    // const data = await CrexV2Details(
    //   "https://crex.com/scoreboard/VDX/1VD/27th-Match/4M/4O/mls-vs-sys-27th-match-big-bash-league-2025-26/info"
    // );

    return Response.json(
      {
        data: prepareData,
        date: moment(fromDate).format("DD-MM-YYYY"),
        success: true,
        message: "Schedule fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
