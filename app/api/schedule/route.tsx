import { FormatErrorMessage } from "@/lib/utils";
import moment from "moment-timezone";
import { CricBuzzList } from "./CricBuzzList";
import { ScoreCard } from "./ScoreCard";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fromDate = body.fromDate ? new Date(body.fromDate) : new Date();

    const advanceCricketList = await CricBuzzList(fromDate, body.timezone);

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
      scoreUrls.map((url) => ScoreCard(url).catch(() => null))
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

    return Response.json(
      {
        data: modifyResult,
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
