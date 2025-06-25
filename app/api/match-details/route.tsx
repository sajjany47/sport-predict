import axios from "axios";
import { NextRequest } from "next/server";
import { NewPlayerDetails } from "./NewPlayerDetails";
import { GetStadiumList } from "@/lib/utils";
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
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
