import { Target } from "@/types/CricbuzzListType";
import axios from "axios";
import moment from "moment";

export const CricBuzzList = async (fromDate: Date): Promise<Target[]> => {
  const timestamp = Date.now() + 5.5 * 60 * 60 * 1000;

  const apiUrl = `https://www.cricbuzz.com/api/cricket-schedule/upcoming-series/all/${timestamp}`;
  const response = await axios.get(apiUrl);

  if (response.status !== 200) return [];

  const data = response.data ?? [];
  const a = data
    .flatMap(
      (day: any) =>
        day.scheduleAdWrapper?.matchScheduleList?.flatMap(
          (series: any) =>
            series.matchInfo?.map((match: any) => {
              const venue = match.venueInfo || {};

              const makeTeam = (t: any) => ({
                squadId: t.teamId,
                teamName: t.teamName,
                teamShortName: t.teamSName,
                teamFlagUrl: `https://static.cricbuzz.com/a/img/v1/25x18/i1/c${
                  t.imageId
                }/${t.teamName.toLowerCase().trim().replace(/\s+/g, "-")}.jpg`,
                isWinner: null,
                color: null,
                cricketScore: null,
                squadNo: null,
              });

              const formatDate = (ms: string | number | null) =>
                ms ? moment(Number(ms)).format("DD MMM YYYY, HH:mm") : null;

              return {
                tourId: series.seriesId ?? null,
                tourName: series.seriesName ?? null,
                matchId: match.matchId,
                matchName: null,
                matchDescription: match.matchDesc ?? null,
                startTime: formatDate(match.startDate),
                endTime: formatDate(match.endDate),
                status: null,
                venue: {
                  ground: venue.ground ?? null,
                  city: venue.city ?? null,
                  country: venue.country ?? null,
                  timezone: venue.timezone ?? null,
                },
                tour: series.seriesCategory ?? null,
                format: match.matchFormat ?? null,
                sport: "cricket",
                teams: [makeTeam(match.team1), makeTeam(match.team2)],
              } as Target;
            }) ?? []
        ) ?? []
    )
    .filter(Boolean);

  const filterData = fromDate
    ? a.filter(
        (item: any) =>
          moment(item.startTime, "DD MMM YYYY, HH:mm").format("YYYY-MM-DD") ===
          moment(fromDate).format("YYYY-MM-DD")
      )
    : a;
  return filterData;
};
