import { NextRequest } from "next/server";
import { NewPlayerDetails } from "./NewPlayerDetails";
import { CleanName, FormatErrorMessage, GetStadiumList } from "@/lib/utils";
import { StadiumStats, TeamStats } from "./PerformanceDetail";
import cache from "@/lib/NodeCacheService";
import dbConnect from "../db";
import Stats from "../stats/StatsModel";
import { CricSquadDetails } from "./CricSquadDetails";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    let team1 = body.teams[0].teamShortName.toLowerCase();
    let team2 = body.teams[1].teamShortName.toLowerCase();
    let modDis = body.matchDescription
      .split(",")[0]
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    let modTour = body.tourName
      .replace(/,/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    let url = `https://www.cricbuzz.com/cricket-match-squads/${body.matchId}/${team1}-vs-${team2}-${modDis}-${modTour}`;

    const rowSquadList = await CricSquadDetails(url);

    // return Response.json(
    //   {
    //     data: rowSquadList,
    //   },

    //   { status: 200 }
    // );

    const squadList = rowSquadList.map((item: any) => {
      const matchedTeam = body.teams.find(
        (elm: any) => elm.teamShortName === item.shortName
      );

      return {
        ...item,
        name: matchedTeam ? matchedTeam.teamName : item.name,
      };
    });

    // Fetch stadium details and stats

    const stadiumStatsKey = `stadiumStats-${body.matchId}`;
    const stadiumKey = `stadium-${body.matchId}`;
    let stadium: any = cache.get(stadiumKey);
    let stadiumDetails: any = cache.get(stadiumStatsKey);

    if (!stadiumDetails) {
      try {
        const statdiumReqName = body.venue.ground;
        const stadiumData = await GetStadiumList(statdiumReqName);
        if (stadiumData.length === 0) {
          const findStadium = await Stats.findOne({
            publicName: statdiumReqName,
          });
          if (findStadium) {
            stadiumDetails = await GetStadiumList(findStadium.originalName);
          } else {
            stadiumDetails = [];
          }
        } else {
          stadiumDetails = stadiumData[0];
        }

        stadium = await StadiumStats(stadiumDetails.url);
      } catch (err) {
        stadium = [];
        stadiumDetails = {};
      }
      cache.set(stadiumStatsKey, stadiumDetails, 60 * 60 * 4); // Cache for 4 hours
      cache.set(stadiumKey, stadium, 60 * 60 * 4); //
    }

    // Prepare the final data structure for the response

    const playerDetails = async (
      name: string,
      stadiumName?: string,
      teamName?: string,
      originalName?: string
    ) => {
      const playerData = await NewPlayerDetails(
        name,
        stadiumName || "",
        teamName || "",
        originalName || ""
      );
      return playerData;
    };

    const prepareData = await Promise.all(
      squadList.map(async (item: any, index: number) => {
        const playingPlayers = item.playingPlayer
          ? await Promise.all(
              item.playingPlayer.map(async (elm: any) => {
                const playerData = await playerDetails(
                  CleanName(elm?.name),
                  stadiumDetails?.name || "",
                  squadList[index === 0 ? 1 : 0].shortName,
                  elm?.name
                );
                return {
                  ...elm,
                  ...playerData,
                };
              })
            )
          : [];

        const benchPlayers = item.benchPlayer
          ? await Promise.all(
              item.benchPlayer.map(async (elm: any) => {
                const playerData = await playerDetails(
                  elm.name,
                  stadiumDetails.name || "",
                  squadList[index === 0 ? 1 : 0].shortName,
                  elm.name
                );
                return {
                  ...elm,
                  ...playerData,
                };
              })
            )
          : [];

        return {
          flag: item.flag,
          color: item.color ?? null,
          name: item.name,
          shortName: item.shortName,
          playingPlayer: playingPlayers,
          benchPlayer: benchPlayers,
        };
      })
    );

    const prepareStats = await Promise.all(
      body.teams.map(async (item: any) => {
        const teamData: any = await TeamStats(item.teamName);
        const teamPreapareData = {
          ...teamData,
          flagUrl: item.teamFlagUrl,
          matches: teamData.matches.map((elm: any) => {
            return {
              ...elm,
              team1: {
                ...elm.team1,
                image:
                  elm.team1.name.toLowerCase() ===
                  item.teamShortName.toLowerCase()
                    ? item.teamFlagUrl
                    : elm.team1.image,
              },
              team2: {
                ...elm.team2,
                image:
                  elm.team2.name.toLowerCase() ===
                  item.teamShortName.toLowerCase()
                    ? item.teamFlagUrl
                    : elm.team2.image,
              },
            };
          }),
        };

        return teamPreapareData;
      })
    );

    const team1PrepareData = {
      ...prepareStats[0],
      matches: prepareStats[0].matches.slice(0, 10),
    };
    const team2PrepareData = {
      ...prepareStats[1],
      matches: prepareStats[1].matches.slice(0, 10),
    };
    const h2hStats = prepareStats[0].matches
      .filter(
        (item: any) =>
          (item.team1.name === body.teams[0].teamShortName &&
            item.team2.name === body.teams[1].teamShortName) ||
          (item.team1.name === body.teams[1].teamShortName &&
            item.team2.name === body.teams[0].teamShortName)
      )
      .slice(0, 20) as any[];

    return Response.json(
      {
        data: {
          squadList: prepareData,
          stadiumStats: stadium,
          overview: {
            groundAndWheather: {
              pitchType: "",
              avgScore: "",
              wheatherType: "",
              temprature: "",
            },
            stats: null,
            fullStats: {
              team1: team1PrepareData,
              team2: team2PrepareData,
              h2h: h2hStats,
            },
          },
        },
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
