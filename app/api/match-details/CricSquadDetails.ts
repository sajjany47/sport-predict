import { GetHtml } from "@/lib/utils";

type Player = { name: string; image: string; role: string };
type TeamResult = {
  flag: string;
  name: string;
  shortName: string;
  playingPlayer: Player[];
  benchPlayer: Player[];
};

/**
 * CricSquadDetails(matchUrl)
 * - Returns array of two teams with flags, names, shortName, playingPlayer[], benchPlayer[]
 */
export const CricSquadDetails = async (
  matchUrl: string
): Promise<TeamResult[]> => {
  try {
    const $ = await GetHtml(matchUrl);

    // helpers
    const norm = (t?: any) => (t || "").toString().trim();
    const toTitleCase = (s: any) => {
      if (!s) return s || "";
      return s
        .toString()
        .split(/\s+/)
        .map((w: string) =>
          w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""
        )
        .join(" ");
    };

    const parsePlayer = ($inner: any, anchorEl: any): Player => {
      const $a = $inner(anchorEl);
      const span = $a.find("span").first();
      const name = (span && norm(span.text())) || norm($a.text());
      const img =
        $a.find("img").attr("src") || $a.find("img").attr("data-src") || "";
      let role = $a.find(".text-cbTxtSec").text().trim() || "";
      // capture bracketed suffix like "(c)" or "(vc)" appearing inside a span
      const capSpan = $a
        .find("span")
        .filter((i: any, el: any) => $inner(el).text().includes("("))
        .first();
      const suffix = capSpan ? $inner(capSpan).text().trim() : "";
      if (suffix && !role.includes(suffix))
        role = (role ? role + " " : "") + suffix;
      return { name: name || "", image: img || "", role: role || "" };
    };

    const getAltOrFallback = ($inner: any, index: number, fallback: string) => {
      const img = $inner("img").eq(index);
      if (img && img.attr && img.attr("alt")) return img.attr("alt").trim();
      return fallback || "";
    };

    // Find team short-name elements (heuristic: short uppercase tokens like IND, RSA)
    let teamShortEls: any[] = $("h1.font-bold")
      .toArray()
      .filter((el) => {
        const t = $(el).text().trim();
        return !!t && /^[A-Z]{2,4}$/.test(t);
      });

    // fallback: search first few divs for uppercase tokens if not found
    if (teamShortEls.length < 2) {
      $("div")
        .slice(0, 12)
        .each((i, el) => {
          if (teamShortEls.length >= 2) return;
          $(el)
            .find("*")
            .each((j, ch) => {
              const txt = $(ch).text().trim();
              if (txt && /^[A-Z]{2,4}$/.test(txt)) teamShortEls.push(ch);
            });
        });
    }

    // prepare teams placeholders
    const teams: TeamResult[] = [
      { flag: "", name: "", shortName: "", playingPlayer: [], benchPlayer: [] },
      { flag: "", name: "", shortName: "", playingPlayer: [], benchPlayer: [] },
    ];

    // helper to find a flag near an element
    const findFlagFor = (el: any) => {
      const $el = $(el);
      // 1) previous sibling img
      let img = $el.prevAll("img").first();
      if (img && img.attr && img.attr("src")) return img.attr("src");
      // 2) image inside same parent (left-most)
      img = $el.parent().find("img").first();
      if (img && img.attr && img.attr("src")) return img.attr("src");
      // 3) image in previous block (common header layout)
      const prevBlock = $el.parent().prev();
      if (prevBlock && prevBlock.length) {
        img = prevBlock.find("img").first();
        if (img && img.attr && img.attr("src")) return img.attr("src");
      }
      // 4) image in next block
      const nextBlock = $el.parent().next();
      if (nextBlock && nextBlock.length) {
        img = nextBlock.find("img").first();
        if (img && img.attr && img.attr("src")) return img.attr("src");
      }
      // 5) fallback: small-sized img anywhere
      const anySmall = $("img[width][height]")
        .filter((i, im) => {
          const w = parseInt($(im).attr("width") || "0", 10);
          const h = parseInt($(im).attr("height") || "0", 10);
          return w > 0 && h > 0 && w <= 40 && h <= 30;
        })
        .first();
      if (anySmall && anySmall.attr && anySmall.attr("src"))
        return anySmall.attr("src");
      // 6) last fallback: first img on page
      const firstImg = $("img").first();
      if (firstImg && firstImg.attr && firstImg.attr("src"))
        return firstImg.attr("src");
      return "";
    };

    if (teamShortEls.length >= 1) {
      const el0 = teamShortEls[0];
      const short0 = norm($(el0).text());
      teams[0].shortName = short0 || "";
      teams[0].flag = findFlagFor(el0) || "";
      teams[0].name = toTitleCase(getAltOrFallback($, 0, short0));
    }

    if (teamShortEls.length >= 2) {
      const el1 = teamShortEls[1];
      const short1 = norm($(el1).text());
      teams[1].shortName = short1 || "";
      teams[1].flag = findFlagFor(el1) || "";
      teams[1].name = toTitleCase(getAltOrFallback($, 1, short1));
    }

    // Last-resort flag fill: if any flag missing, use header heuristics
    if (!teams[0].flag || !teams[1].flag) {
      const altFlags: string[] = [];
      $("div").each((i, el) => {
        const imgs = $(el).find("img").toArray();
        if (imgs.length >= 2 && $(el).find("h1").length >= 2) {
          $(imgs).each((j, img) => {
            const src = $(img).attr("src");
            if (src) altFlags.push(src);
          });
          return false;
        }
      });
      if (!teams[0].flag && altFlags[0]) teams[0].flag = altFlags[0];
      if (!teams[1].flag && altFlags[1]) teams[1].flag = altFlags[1];

      if (!teams[0].flag || !teams[1].flag) {
        const smallImgs: string[] = [];
        $("img").each((i, im) => {
          const src = $(im).attr("src");
          if (src && smallImgs.length < 4) smallImgs.push(src);
        });
        if (!teams[0].flag && smallImgs[0]) teams[0].flag = smallImgs[0];
        if (!teams[1].flag && smallImgs[1]) teams[1].flag = smallImgs[1];
      }
    }

    // Now parse players sections: look for headers like "playing XI", "bench", "squad"
    $("h1").each((i, el) => {
      const headerText = $(el).text().trim().toLowerCase();
      if (!headerText) return;

      const isSquad =
        headerText.includes("squad") && !headerText.includes("playing");
      const isPlaying = headerText.includes("playing");
      const isBench = headerText.includes("bench");

      if (!isSquad && !isPlaying && !isBench) return;

      // find next sibling block that likely contains player columns
      const containerBlock = $(el)
        .nextAll("div.w-full.flex, div.w-full .flex")
        .first();
      if (!containerBlock || !containerBlock.length) return;

      // find two columns
      let teamCols = containerBlock.find("> .w-1\\/2, .w-1\\/2").toArray();
      if (teamCols.length < 2) {
        teamCols = containerBlock.find(".w-1\\/2").toArray().slice(0, 2);
      }
      if (teamCols.length < 2) return;

      for (let ti = 0; ti < 2; ti++) {
        const col = $(teamCols[ti]);
        const anchors = col.find('a[href^="/profiles/"]').toArray();
        const players = anchors.map((a) => parsePlayer($, a));
        if (isPlaying) teams[ti].playingPlayer.push(...players);
        else if (isBench) teams[ti].benchPlayer.push(...players);
        else if (isSquad) teams[ti].benchPlayer.push(...players);
      }
    });

    // Fallback: if no explicit playing/bench found, try to infer from any .w-1/2 blocks
    teams.forEach((team, idx) => {
      if (team.playingPlayer.length === 0 && team.benchPlayer.length === 0) {
        const globalCols = $(".w-1\\/2").toArray().slice(0, 2);
        if (globalCols.length === 2) {
          const fallbackCol = $(globalCols[idx]);
          const fallbackPlayers = fallbackCol
            .find('a[href^="/profiles/"]')
            .toArray()
            .map((a) => parsePlayer($, a));
          if (fallbackPlayers.length > 0) {
            if (fallbackPlayers.length <= 11)
              team.playingPlayer = fallbackPlayers;
            else team.benchPlayer = fallbackPlayers;
          }
        }
      }
    });

    return teams;
  } catch (err) {
    // optional: console.error("CricSquadDetails error", err);
    return [];
  }
};
