import { GetHtml } from "@/lib/utils";

export const CricSquadDetails = async (matchUrl: string) => {
  try {
    /* --- helpers --- */

    const parsePlayer = ($: any, anchorEl: any) => {
      const $a = $(anchorEl);
      const name = $a.find("span").first().text().trim() || $a.text().trim();
      const img =
        $a.find("img").attr("src") || $a.find("img").attr("data-src") || "";
      let role = $a.find(".text-cbTxtSec").text().trim() || "";
      const capSpan = $a
        .find("span")
        .filter((i: any, el: any) => $(el).text().includes("("))
        .first();
      const suffix = capSpan ? $(capSpan).text().trim() : "";
      if (suffix && !role.includes(suffix))
        role = (role ? role + " " : "") + suffix;
      return { name: name || "", image: img || "", role: role || "" };
    };

    const cheerioLoadElement = ($: any, el: any) => {
      // helper to wrap a DOM element into cheerio for chaining
      return $(el);
    };

    const getAltOrFallback = ($: any, index: any, fallback: any) => {
      const img = $("img").eq(index);
      if (img && img.attr && img.attr("alt")) return img.attr("alt").trim();
      return fallback || "";
    };

    const toTitleCase = (s: any) => {
      if (!s) return s;
      return s
        .split(/\s+/)
        .map((w: any) =>
          w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""
        )
        .join(" ");
    };
    //helper..................
    const $ = await GetHtml(matchUrl);
    // collect short names & flag imgs (attempt order left->right)
    const teamShorts: any = [];
    $("h1.font-bold").each((i, el) => {
      const txt = $(el).text().trim();
      if (txt) teamShorts.push(txt);
    });

    // collect flag srcs in header area (order should match short names)
    const flagImgs: any = [];
    // search header images near the top (heuristic)
    $("div").each((i, el) => {
      const imgs = $(el).find("img").toArray();
      if (imgs.length >= 2 && $(el).find("h1").length >= 2) {
        // use these imgs if they look like header flags
        $(imgs).each((j, img) => {
          const src = $(img).attr("src");
          if (src) flagImgs.push(src);
        });
        return false; // break out of .each
      }
    });
    // fallback: any small imgs
    if (flagImgs.length < 2) {
      $("img").each((i, el) => {
        const src = $(el).attr("src");
        if (src && flagImgs.length < 2) flagImgs.push(src);
      });
    }

    // prepare results placeholders
    const teams: any[] = [
      {
        flag: flagImgs[0] || "",
        name: toTitleCase(getAltOrFallback($, 0, teamShorts[0])),
        shortName: teamShorts[0] || "",
        playingPlayer: [],
        benchPlayer: [],
      },
      {
        flag: flagImgs[1] || "",
        name: toTitleCase(getAltOrFallback($, 1, teamShorts[1])),
        shortName: teamShorts[1] || "",
        playingPlayer: [],
        benchPlayer: [],
      },
    ];

    // Find section headers (h1) that indicate Squad / playing XI / bench
    // We'll iterate each relevant header, find its immediate following .w-full.flex block,
    // then read its two .w-1/2 columns as team-left / team-right players.
    $("h1").each((i, el) => {
      const headerText = $(el).text().trim().toLowerCase();
      if (!headerText) return;

      // consider only headers that include 'squad' or 'playing' or 'bench'
      const isSquad =
        headerText.includes("squad") && !headerText.includes("playing");
      const isPlaying = headerText.includes("playing");
      const isBench = headerText.includes("bench");

      if (!isSquad && !isPlaying && !isBench) return;

      // find the next sibling that contains the two columns (div.w-full.flex)
      const container = $(el)
        .nextAll("div.w-full.flex, div.w-full .flex")
        .first();
      if (!container || !container.length) return;

      // select the two team columns inside this container
      const cols = container.find("> .w-1\\/2, .w-1\\/2").toArray();
      // if not found as direct children, fallback to any .w-1/2 in container
      const teamCols =
        cols.length >= 2
          ? cols.slice(0, 2)
          : container.find(".w-1\\/2").toArray().slice(0, 2);
      if (teamCols.length < 2) return; // can't detect both teams here

      // parse players for each column
      for (let ti = 0; ti < 2; ti++) {
        const col = cheerioLoadElement($, teamCols[ti]);
        const playerAnchors = col.find('a[href^="/profiles/"]').toArray();
        const players: any = playerAnchors.map((a: any) => parsePlayer($, a));

        // decide where to put them based on header type
        if (isPlaying) {
          teams[ti].playingPlayer.push(...players);
        } else if (isBench) {
          teams[ti].benchPlayer.push(...players);
        } else if (isSquad) {
          // per your request: if header is "Squad" (no playing/bench), treat as benchPlayer
          teams[ti].benchPlayer.push(...players);
        }
      }
    });

    // Final cleanup: if a team has no playingPlayer but benchPlayer length > 11 and no explicit 'playing' section found,
    // we might want to split first 11 as playing (optional). But per your request we will NOT auto-split when 'Squad' exists.
    // However if neither playing nor bench were found (rare), fall back to any single .w-1/2 listing as playing.
    teams.forEach((team) => {
      if (team.playingPlayer.length === 0 && team.benchPlayer.length === 0) {
        // fallback: try to parse first .w-1/2 on page globally (best-effort)
        const globalCols = $(".w-1\\/2").toArray().slice(0, 2);
        if (globalCols.length === 2) {
          const fallbackCol = cheerioLoadElement(
            $,
            globalCols[teams.indexOf(team)]
          );
          const fallbackPlayers = fallbackCol
            .find('a[href^="/profiles/"]')
            .toArray()
            .map((a: any) => parsePlayer($, a));
          // assume these are playing XI if count <= 11 else put them in bench (but keep simple: playing if <=11)
          if (fallbackPlayers.length <= 11)
            team.playingPlayer = fallbackPlayers;
          else team.benchPlayer = fallbackPlayers;
        }
      }
    });

    return teams;
  } catch {
    return [];
  }
};

/* ================= helpers ================= */
