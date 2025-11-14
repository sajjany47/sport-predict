import { FormatErrorMessage } from "@/lib/utils";
import moment from "moment";
import { CricBuzzList } from "./CricBuzzList";
import { ScoreCard } from "./ScoreCard";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fromDate = body.fromDate ? new Date(body.fromDate) : new Date();
    // const toDate = body.toDate ? moment(body.toDate) : moment().add(1, "days");

    const advanceCricketList = await CricBuzzList(fromDate);

    const modifyResult = await Promise.all(
      advanceCricketList.map(async (item: any) => {
        let team1 = item.teams[0].teamShortName.toLowerCase();
        let team2 = item.teams[1].teamShortName.toLowerCase();
        let modDis = item.matchDescription
          .split(",")[0]
          .trim()
          .replace(/\s+/g, "-")
          .toLowerCase();
        let modTour = item.tourName
          .replace(/,/g, "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
        let url: string = `https://www.cricbuzz.com/live-cricket-scores/${item.matchId}/${team1}-vs-${team2}-${modDis}-${modTour}`;

        const score = await ScoreCard(url);

        let a = {
          ...item,
          status: moment(item.startTime, "DD MMM YYYY, HH:mm").isAfter(moment())
            ? "NOT_STARTED"
            : "LIVE",
          score: score ?? null,
        };
        if (score) {
          const checkScore =
            score.score.find(
              (s: any) => s.team === item.teams[0].teamShortName
            ) ||
            score.score.find(
              (s: any) => s.team === item.teams[1].teamShortName
            );

          if (checkScore) {
            const resultText = (score?.result ?? "").toLowerCase();
            if (resultText.includes("no result")) {
              a.status = "ABANDONED";
            } else if (
              resultText.includes("won") ||
              resultText.includes("win")
            ) {
              a.status = "COMPLETED";
            }
          } else {
            a.score = null;
          }
        }
        return a;
      })
    );

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
