import { FormatErrorMessage } from "@/lib/utils";
import axios from "axios";
import moment from "moment";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fromDate = body.fromDate
      ? moment(body.fromDate).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    const toDate = body.toDate
      ? moment(body.toDate).format("YYYY-MM-DD")
      : moment().add(1, "days").format("YYYY-MM-DD");
    const encodeData = encodeURIComponent(
      JSON.stringify({
        filter: {
          slug: "cricket",
          collectionId: null,
          dateRange: { fromDate: fromDate, toDate: toDate },
          streamingFilter: "ALL",
          isLive: false,
          tours: [],
          format: null,
          gender: null,
          matchType: null,
          category: null,
          direction: "BACKWARD",
        },
      })
    );

    const extension = `%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22daa7405dc9b181163b7140f8ff190c08155f1cdb925d122725922a7199b3773b%22%7D%7D`;

    const targetUrl = `https://www.fancode.com/graphql?extensions=${extension}&operation=query&operationName=FetchScheduleData&variables=${encodeData}`;

    const data = await axios.get(targetUrl);
    const prepareData = (
      data.data.data.fetchScheduleData.edges[0].tours ?? []
    ).flatMap((item: any) =>
      item.matches.map((match: any) => ({
        tourId: item.id,
        tourName: item.name,
        matchId: match.id,
        matchName: match.name,
        matchDescription: match.matchDesc,
        startTime: match.startTime,
        endTime: match.endTime,
        status: match.status,
        venue: match.venue,
        tour: match.tour,
        format: match.format,
        sport: match.sport.slug,
        teams: match.squads.map((team: any) => ({
          squadId: team.squadId,
          teamName: team.name,
          teamShortName: team.shortName,
          teamFlagUrl: team.flag.src,
          isWinner: team.isWinner,
          color: team.color,
          cricketScore: team.cricketScore,
          squadNo: team.squadNo,
        })),
      }))
    );

    return Response.json(
      {
        data: prepareData,
        fromDate: fromDate,
        toDate: toDate,
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
