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

    // --- build url for squad scraping ---
    const team1 = body.teams[0].teamShortName.toLowerCase();
    const team2 = body.teams[1].teamShortName.toLowerCase();
    const modDis = body.matchDescription
      .split(",")[0]
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    const modTour = body.tourName
      .replace(/,/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const url = `https://www.cricbuzz.com/cricket-match-squads/${body.matchId}/${team1}-vs-${team2}-${modDis}-${modTour}`;

    const rowSquadList = await CricSquadDetails(url);

    const squadList = rowSquadList.map((item: any) => {
      const matchedTeam = body.teams.find(
        (elm: any) => elm.teamShortName === item.shortName
      );

      return {
        ...item,
        name: matchedTeam ? matchedTeam.teamName : item.name,
      };
    });

    // --- Stadium caching + fetch ---
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
      cache.set(stadiumKey, stadium, 60 * 60 * 4);
    }

    // --- helper to fetch player details (unchanged) ---
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

    // --- prepare squad players (unchanged) ---
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

    // --- NEW: fetch team stats in a deduplicated, cached, fault-tolerant way ---
    // Build list of unique team names we need stats for (use teamName as the key)
    const requestedTeams = body.teams.map((t: any) => ({
      teamName: String(t.teamName),
      teamShortName: String(t.teamShortName),
      teamFlagUrl: t.teamFlagUrl,
    }));

    // dedupe by teamName (case-insensitive)
    const uniqueTeamNameMap = new Map<
      string,
      { teamName: string; originalIndex: number }
    >();
    requestedTeams.forEach((t: any, idx: number) => {
      const key = String(t.teamName).trim().toLowerCase();
      if (!uniqueTeamNameMap.has(key)) {
        uniqueTeamNameMap.set(key, {
          teamName: t.teamName,
          originalIndex: idx,
        });
      }
    });

    // fetch function that uses cache
    const fetchTeamStat = async (teamName: string) => {
      const cacheKey = `teamStats:${teamName}`; // choose a stable cache key
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      // call TeamStats - may throw
      const data = await TeamStats(teamName);
      // store to cache (TTL here is 4 hours; adjust if needed)
      cache.set(cacheKey, data, 60 * 60 * 4);
      return data;
    };

    // Kick off fetches for unique teams
    const uniqueTeamNames = Array.from(uniqueTeamNameMap.values()).map(
      (v) => v.teamName
    );

    const fetchPromises = uniqueTeamNames.map(async (name) => {
      try {
        const data = await fetchTeamStat(name);
        return { name, status: "fulfilled", data };
      } catch (err: any) {
        return {
          name,
          status: "rejected",
          reason: err?.message ?? String(err),
        };
      }
    });

    const settled = await Promise.allSettled(fetchPromises);
    // build a map name -> data | null and errors
    const teamStatsMap = new Map<string, any>();
    const teamErrors: Record<string, string | null> = {};

    // Note: fetchPromises already handle try/catch and return objects, but we use allSettled to be safe
    for (const res of settled) {
      if (res.status === "fulfilled") {
        const payload = res.value;
        if (payload.status === "fulfilled") {
          teamStatsMap.set(payload.name, payload.data);
          teamErrors[payload.name] = null;
        } else {
          teamStatsMap.set(payload.name, null);
          teamErrors[payload.name] = payload.reason ?? "Unknown error";
        }
      } else {
        // unlikely path (promise rejected at top-level), but handle anyway
        const payload = (res as any).reason;
        // We don't have the team name here; skip - nothing to set
        console.error(
          "Unexpected rejection while fetching team stats:",
          payload
        );
      }
    }

    // Now construct prepareStats in the original request order (one entry per body.teams)
    const prepareStats = requestedTeams.map((item: any) => {
      const teamNameKey = String(item.teamName).trim(); // exact match to keys we used
      const cachedStat = teamStatsMap.get(teamNameKey) ?? null;

      if (!cachedStat) {
        // failed to fetch; return null so the frontend can see missing data
        return null;
      }

      // Ensure matches is an array
      const matches = Array.isArray(cachedStat.matches)
        ? cachedStat.matches
        : [];

      const teamPreapareData = {
        ...cachedStat,
        flagUrl: item.teamFlagUrl,
        matches: matches.map((elm: any) => {
          const t1 = elm.team1 ?? {};
          const t2 = elm.team2 ?? {};
          const shortLower = String(item.teamShortName).toLowerCase();

          return {
            ...elm,
            team1: {
              ...t1,
              image:
                String(t1.name ?? "").toLowerCase() === shortLower &&
                item.teamFlagUrl
                  ? item.teamFlagUrl
                  : t1.image,
            },
            team2: {
              ...t2,
              image:
                String(t2.name ?? "").toLowerCase() === shortLower &&
                item.teamFlagUrl
                  ? item.teamFlagUrl
                  : t2.image,
            },
          };
        }),
      };

      return teamPreapareData;
    });

    // Build team1/team2 response objects (defensive)
    const team1PrepareData = prepareStats[0]
      ? {
          ...prepareStats[0],
          matches: (prepareStats[0].matches || []).slice(0, 10),
        }
      : null;
    const team2PrepareData = prepareStats[1]
      ? {
          ...prepareStats[1],
          matches: (prepareStats[1].matches || []).slice(0, 10),
        }
      : null;

    // Build H2H from the matches of whichever team had data (combine both lists to be thorough)
    const shortA = String(body.teams[0].teamShortName).toLowerCase();
    const shortB = String(body.teams[1].teamShortName).toLowerCase();

    const sourceMatches: any[] = [];
    if (Array.isArray(prepareStats[0]?.matches))
      sourceMatches.push(...prepareStats[0].matches);
    if (Array.isArray(prepareStats[1]?.matches))
      sourceMatches.push(...prepareStats[1].matches);

    const normalize = (s: string) => String(s ?? "").toLowerCase();

    const seen = new Set<string>();
    const h2h: any[] = [];
    for (const m of sourceMatches) {
      const t1name = normalize(m?.team1?.name);
      const t2name = normalize(m?.team2?.name);

      const matchBetween =
        (t1name === shortA && t2name === shortB) ||
        (t1name === shortB && t2name === shortA);

      if (matchBetween) {
        // Try to dedupe by id/date if present
        const uniqueKey = JSON.stringify([
          m?.id ??
            m?.uniqueId ??
            m?.date ??
            `${t1name}-${t2name}-${m?.score ?? ""}`,
        ]);
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          h2h.push(m);
        }
      }
      if (h2h.length >= 20) break;
    }

    // Response (include per-team errors)
    const errorsByTeam: Record<string, string | null> = {};
    // Map the teamErrors (which keyed by uniqueTeamName) to requestedTeams order
    requestedTeams.forEach((t: any) => {
      const key = String(t.teamName).trim();
      errorsByTeam[key] = teamErrors[key] ?? null;
    });

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
              h2h: h2h.slice(0, 20),
              errors: errorsByTeam,
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
