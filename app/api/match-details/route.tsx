import axios from "axios";
import { NextRequest } from "next/server";
import { NewPlayerDetails } from "./NewPlayerDetails";
import { GetStadiumList, TransAdvanceStatData } from "@/lib/utils";
import { StadiumStats } from "./PerformanceDetail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payload = {
      operationName: "Squads",
      operation: "query",
      variables: {
        matchId: body.matchId,
      },
      query:
        "fragment SquadPlayer on SquadPlayer {\n  id\n  name\n  shortName\n  batStyle\n  bowlStyle\n  imageUrl {\n    src\n  }\n  type\n}\n\nquery Squads($matchId: Int!) {\n  squadSegment(matchId: $matchId) {\n    flag {\n      src\n    }\n    color\n    shortName\n    playingPlayers {\n      ...SquadPlayer\n    }\n    benchPlayers {\n      ...SquadPlayer\n    }\n  }\n}\n        ",
    };

    const squadList = await axios.post(
      "https://www.fancode.com/graphql",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const statsPayload = {
      operationName: "fantasyDetailsPage",
      operation: "query",
      variables: {
        input: {
          matchId: body.matchId,
          segments: [
            "VENUE_STATS_SUMMARY",
            "PLAYER_STATS_SUMMARY",
            "EXPERT_ANALYSIS_SUMMARY",
            "RECENT_FORM_SUMMARY",
            "EXPERT_LEADER_BOARD",
            "GALLERY",
          ],
        },
      },
      query:
        "fragment venueStats on VenueStatRow {\n  value1 {\n    text\n    subText\n  }\n  value2 {\n    text\n    subText\n  }\n}\n\nfragment FantasyVenuSegment on VenueStatsSummarySegment {\n  title\n  subTitle\n  venue {\n    name\n    location\n  }\n  updatedAt\n  seeAllMessageCopy\n  venueStats {\n    ...venueStats\n  }\n}\n\nfragment teamComparisonSquads on Team {\n  shortName\n  color\n}\n\nfragment squadsRecentMatches on SquadRecentForm {\n  recentMatches {\n    status\n    squads {\n      isWinner\n    }\n  }\n}\n\nfragment FantasyRecentFormSegment on RecentFormSummarySegment {\n  title\n  subTitle\n  teamComparisonSquads {\n    ...teamComparisonSquads\n  }\n  teamWinProbability\n  squadsRecentMatches {\n    ...squadsRecentMatches\n  }\n  seeAllMessageCopy\n}\n\nfragment PlayerStatsSegment on PlayerStatsSegment {\n  title\n  subTitle\n  isLineupAnnounced\n  seeAllMessageCopy\n  playerStats {\n    headers {\n      title\n      sortable\n      icon {\n        icon {\n          src\n        }\n        direction\n      }\n    }\n    rows {\n      dataPoint {\n        title\n        subTitle\n      }\n    }\n  }\n}\n\nquery fantasyDetailsPage($input: FantasyDetailsInput!) {\n  fantasyLandingPage(input: $input) {\n    isUserEntitled\n    isPremium\n    authorizationType\n    freeSegments {\n      segments {\n        id\n        title\n        type\n        data {\n          ... on RecentFormSummarySegment {\n            ...FantasyRecentFormSegment\n          }\n          ... on VenueStatsSummarySegment {\n            ...FantasyVenuSegment\n          }\n        }\n      }\n    }\n    premiumSegments {\n      segments {\n        id\n        title\n        type\n        data {\n          ... on PlayerStatsSegment {\n            ...PlayerStatsSegment\n          }\n          __typename\n          ... on FantasyExpertsSegment {\n            ...FantasyExpertsSegment\n          }\n          __typename\n          ... on FantasyVideosSegment {\n            title\n          }\n        }\n      }\n    }\n  }\n}\n        fragment FantasyExpertsSegment on FantasyExpertsSegment {\n  title\n  subTitle\n  isForNewArticle\n  seeAllMessageCopy\n  expertTeamSummary {\n    headers {\n      ...header\n    }\n    rows {\n      ...row\n    }\n  }\n}\nfragment header on FantasyLandingTableHeader {\n  title\n}\nfragment row on FantasyLandingTableRow {\n  dataPoint {\n    title\n  }\n}",
    };

    const statsList = await axios.post(
      "https://www.fancode.com/graphql",
      statsPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const prepareStatsList =
      statsList.data.data.fantasyLandingPage.freeSegments.segments.map(
        (item: any) => {
          let data: any = {};
          if (item.type === "VENUE_STATS_SUMMARY") {
            data.pitchType = item.data.venueStats[0].value1.subText;
            data.avgScore = item.data.venueStats[0].value2.subText;
            data.wheatherType = item.data.venueStats[1].value1.subText;
            data.temprature = item.data.venueStats[1].value2.subText;
          }
          return data;
        }
      );

    const expertPayload = {
      operationName: "teamHeadToHead",
      operation: "query",
      variables: {
        input: {
          matchId: body.matchId,
          segments: ["TEAM_STRENGTH", "SQUAD_COMPARE", "RECENT_FORM", "H2H"],
        },
        matchId: body.matchId,
      },
      query:
        "query teamHeadToHead($input: HeadToHeadInput, $matchId: Int!) { teamHeadToHead(input: $input) { poweredBy segments { id title type data { __typename ... on H2H { title subTitle resultCompare { totalPlayed noResult squads { team { shortName color } gameWon } } recentMatches { title subTitle squads { shortName color } matches { ...RecentMatchesFragment } } } ... on RecentForm { title subTitle squads { team { shortName } recentMatches { ...RecentMatchesFragment } } } ... on TeamStrength { title subTitle squads { shortName color } squadStrength { strength message } squadMatch { message totalMatches } squadChaseDefend { title data { values title } } } ... on TeamCompare { squads { team { name shortName color } winProbability } } } } } match: matchWithScores(id: $matchId) { id matchDesc name status startTime format deferredDeepLink streamingStatus venue sport { name } tour { id name } squads { name } }}fragment RecentMatchesFragment on MatchResult { status format squads { isWinner score { runs wickets overs } team { shortName } } date location result}",
    };

    const advanceStats = await axios.post(
      "https://www.fancode.com/graphql",
      expertPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const transformedData = TransAdvanceStatData(advanceStats.data);

    const stadiumDetails: any = await GetStadiumList("Headingley");
    const stadium = await StadiumStats(stadiumDetails.url);

    const playerDetails = async (
      name: string,
      stadiumName?: string,
      teamName?: string
    ) => {
      const playerData = await NewPlayerDetails(
        name,
        stadiumName || "",
        teamName || ""
      );
      return playerData;
    };

    const prepareData = await Promise.all(
      squadList.data.data.squadSegment.map(async (item: any, index: number) => {
        const playingPlayers = item.playingPlayers
          ? await Promise.all(
              item.playingPlayers.map(async (elm: any) => {
                const playerData = await playerDetails(
                  elm.name,
                  stadiumDetails.name,
                  squadList.data.data.squadSegment[index === 0 ? 1 : 0]
                    .shortName
                );
                return {
                  ...elm,
                  ...playerData,
                };
              })
            )
          : [];

        const benchPlayers = item.benchPlayers
          ? await Promise.all(
              item.benchPlayers.map(async (elm: any) => {
                const playerData = await playerDetails(
                  elm.name,
                  stadiumDetails.name,
                  item.shortName
                );
                return {
                  ...elm,
                  ...playerData,
                };
              })
            )
          : [];

        return {
          flag: item.flag?.src,
          color: item.color,
          shortName: item.shortName,
          playingPlayer: playingPlayers,
          benchPlayer: benchPlayers,
        };
      })
    );

    return Response.json(
      {
        data: {
          squadList: prepareData,
          stadiumStats: stadium,
          overview: {
            groundAndWheather: prepareStatsList[0] ?? null,
            stats: transformedData ?? null,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
