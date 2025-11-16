// scoreCard.ts

import { GetHtml } from "@/lib/utils";

export type ScoreEntry = { team: string; run: string };
export type ScoreCardResult = {
  matchName: string | null;
  score: ScoreEntry[];
  result: string | null;
} | null;

/**
 * ScoreCard(url)
 * - url: full cricbuzz live-match url
 * - returns: { matchName, score: [{team, run}, ...], result } or null on error
 */
export const ScoreCard = async (url: string): Promise<ScoreCardResult> => {
  try {
    const $ = await GetHtml(url);
    // --- MATCH NAME ---
    const matchName = ($("h1").first().text() || "")
      .trim()
      .replace(/\s+/g, " ");

    // container for miniscore areas
    const container = $(
      "#miniscore-branding-container, #sticky-mscore, #sticky-mcomplete"
    );

    // ---------------- RESULT / SESSION INFO (improved) ----------------
    // collect candidates from known selectors, sticky, and container children
    const quickSelectors = [
      ".text-cbTxtLive",
      ".text-cbLive",
      ".text-cbTextLink",
      "#sticky-mscore .text-cbLive",
      "#sticky-mscore .text-cbTxtLive",
      "#sticky-mcomplete .text-cbTextLink",
    ];

    const candidatesSet = new Set<string>();
    const addCandidate = (t?: string | null) => {
      if (!t) return;
      const s = (t || "").replace(/\s+/g, " ").trim();
      if (!s) return;
      // ignore long blocks
      if (s.length > 200) return;
      candidatesSet.add(s);
    };

    // add quick selectors
    quickSelectors.forEach((sel) => addCandidate($(sel).first().text()));

    // scan container children for short result-like texts
    container.find("*").each((i, el) => {
      const txt = ($(el).text() || "").replace(/\s+/g, " ").trim();
      if (!txt) return;
      if (txt.length > 160) return;
      addCandidate(txt);
    });

    // also add a few small obvious places (header area)
    addCandidate($(".bg-cbGrnCyn .text-cbTxtLive").first().text());
    addCandidate(container.find(".text-cbTxtLive").first().text());
    addCandidate(container.find(".text-cbTextLink").first().text());

    // fallback: body-wide short matches containing Day or need/won keywords
    const bodyText = ($("body").text() || "").replace(/\s+/g, " ").trim();
    const bodyMatches = bodyText.match(
      /(Day\s*\d+\s*[:\-–][^\.]{1,120}|[A-Z][a-z]+ (?:need|needs|require|requires|required) [0-9]+ runs|[A-Za-z ]{1,30} (?:need|needs|required|require) [0-9]+|[A-Za-z ]{1,30} (?:won by|lost by|lead by|trail by|lead the match by|lead by))/gi
    );
    if (bodyMatches) bodyMatches.forEach((m) => addCandidate(m));

    // prepare array of unique candidates
    const candidates = Array.from(candidatesSet)
      .map((s) => s.trim())
      .filter(Boolean);

    // scoring / priority rules for candidates
    // higher number = more likely to be the "result" line
    const priorityScore = (s: string) => {
      const lower = s.toLowerCase();

      // exact high-priority patterns
      if (/\bneed\s+[0-9]+\s+runs\b/i.test(lower)) return 100; // "West Indies need 260 runs"
      if (/\breq[:\s]/i.test(s)) return 95; // "REQ: 5.47"
      if (/\bwon by\b/i.test(lower)) return 90; // "Bangladesh won by..."
      if (/\blead by\b/i.test(lower)) return 85; // "lead by 63"
      if (/\btrail by\b/i.test(lower)) return 85;
      if (/\binnings\b/i.test(lower) && /\bwon by/i.test(lower)) return 92;
      if (/\bstumps\b/i.test(lower)) return 80; // "Stumps - India trail by..."
      if (/\bday\s*\d+\b/i.test(lower)) return 80; // Day x
      if (/\bsession\b/i.test(lower)) return 70;
      if (/\btargets?\b/i.test(lower)) return 60;
      if (/\bpartnership\b/i.test(lower)) return 40;

      // presence of "REQ" or "CRR" but alone is lower priority
      if (/\bcrr\b/i.test(lower) || /\bsreq\b/i.test(lower)) return 30;

      // short informative lines still OK
      if (lower.length < 40) return 20;

      // everything else fallback
      return 10;
    };

    // choose best candidate: highest priority, then shortest length
    let bestResult: string | null = null;
    if (candidates.length) {
      candidates.sort((a, b) => {
        const pa = priorityScore(a);
        const pb = priorityScore(b);
        if (pa !== pb) return pb - pa; // descending priority
        return a.length - b.length; // shorter preferred
      });
      bestResult = candidates[0];
    }

    // final fallback: try to extract "Team need X runs" from the compact sticky area
    if (!bestResult) {
      const sticky =
        $("#sticky-mscore, #miniscore-branding-container").text() || "";
      const m = sticky.match(
        /([A-Za-z ]{2,40}\s+(?:need|needs)\s+[0-9]+(?:\s*runs)?)/i
      );
      if (m) bestResult = m[1].trim();
    }

    // normalize whitespace and set null if empty
    const result = bestResult ? bestResult.replace(/\s+/g, " ").trim() : null;

    // ---------------- SCORE extraction (kept from previous robust version) ----------------
    const scoreCandidates: ScoreEntry[] = [];
    const norm = (t?: string) =>
      (t || "").toString().trim().replace(/\s+/g, " ");
    const normalizeRunText = (raw?: string) => {
      if (!raw) return "";
      return raw
        .toString()
        .replace(/\s*&\s*/g, " & ")
        .replace(/\band\b/gi, "&")
        .replace(/\s+/g, " ")
        .trim();
    };

    const runPattern =
      /^(?:[0-9]+(?:[\/\-\u2013][0-9]+)?(?:\s*\([0-9.]+\))?(?:\s*[dD])?)(?:\s*(?:&|\band\b)\s*[0-9]+(?:[\/\-\u2013][0-9]+)?(?:\s*\([0-9.]+\))?(?:\s*[dD])?)*$/i;

    const excludeSet = new Set([
      "CRR",
      "SR",
      "OVS",
      "OVERS",
      "P'SHIP",
      "PSHIP",
      "PARTNERSHIP",
      "LAST",
      "TOSS",
      "KEY",
      "RECENT",
    ]);

    // Primary strategy: when a team token is found, read siblings in same parent row
    container.find("*").each((i, el) => {
      const $el = $(el);
      const text = norm($el.text());
      if (!text) return;
      if (/^[A-Z]{2,4}$/.test(text)) {
        const team = text.toUpperCase();
        if (scoreCandidates.some((s) => s.team === team)) return;
        let run: string | null = null;

        // inspect parent children after token
        const parent = $el.parent();
        if (parent && parent.length) {
          const children = parent.children().toArray();
          let idx = -1;
          for (let k = 0; k < children.length; k++) {
            if (norm($(children[k]).text()) === team) {
              idx = k;
              break;
            }
          }
          if (idx === -1) {
            for (let k = 0; k < children.length; k++) {
              if (norm($(children[k]).text()).includes(team)) {
                idx = k;
                break;
              }
            }
          }
          if (idx >= 0) {
            const parts: string[] = [];
            for (let p = idx + 1; p < children.length; p++) {
              const part = norm($(children[p]).text());
              if (!part) continue;
              if (/^[A-Z]{2,6}$/.test(part) && !/^[0-9]/.test(part)) break;
              parts.push(part);
            }
            const joined = normalizeRunText(parts.join(" "));
            if (joined && runPattern.test(joined)) run = joined;
            else {
              const numericParts: string[] = [];
              for (let p = idx + 1; p < children.length; p++) {
                const part = norm($(children[p]).text());
                if (!part) continue;
                if (/[0-9\&\(\)\/\-dD]/.test(part)) numericParts.push(part);
                else break;
              }
              const combo = normalizeRunText(numericParts.join(" "));
              if (combo && runPattern.test(combo)) run = combo;
            }
          }
        }

        // fallback: scan next siblings
        if (!run) {
          let next = $el.next();
          const collected: string[] = [];
          for (
            let j = 0;
            j < 10 && next && next.length;
            j++, next = next.next()
          ) {
            const nt = norm(next.text());
            if (!nt) continue;
            if (/^[A-Z]{2,6}$/.test(nt) && !/^[0-9]/.test(nt)) break;
            collected.push(nt);
          }
          const candidate = normalizeRunText(collected.join(" "));
          if (candidate && runPattern.test(candidate)) run = candidate;
        }

        // final fallback: search container text
        if (!run) {
          const big = normalizeRunText(
            norm(container.text() || $("body").text())
          );
          const rx = new RegExp(
            `${team.replace(
              /[-/\\^$*+?.()|[\\]{}]/g,
              "\\\\$&"
            )}[^A-Z0-9\\n]{0,10}([0-9][0-9\\s\\/\\-\\&\\(\\)\\.dD]+)`,
            "i"
          );
          const m = big.match(rx);
          if (m) {
            const candidate = normalizeRunText(m[1]);
            if (candidate && runPattern.test(candidate)) run = candidate;
          }
        }

        if (run && !excludeSet.has(team) && runPattern.test(run)) {
          scoreCandidates.push({ team, run });
        }
      }
    });

    // fallback scan if needed
    if (scoreCandidates.length < 2) {
      const big = normalizeRunText(norm(container.text() || $("body").text()));
      const multiRe = new RegExp(
        `([A-Z]{2,4})[^\\d\\n\\r]{0,8}([0-9][0-9\\s\\/\\-\\&\\(\\)\\.dD]+)`,
        "gi"
      );
      let gm;
      while ((gm = multiRe.exec(big)) !== null) {
        const team = (gm[1] || "").toUpperCase();
        const runRaw = normalizeRunText(gm[2] || "");
        if (
          team &&
          !scoreCandidates.some((s) => s.team === team) &&
          /^[A-Z]{2,4}$/.test(team) &&
          runPattern.test(runRaw) &&
          !excludeSet.has(team)
        ) {
          scoreCandidates.push({ team, run: runRaw });
        }
        if (scoreCandidates.length >= 4) break;
      }
    }

    const finalScore = scoreCandidates.slice(0, 2);

    return {
      matchName: matchName || null,
      score: finalScore,
      result,
    };
  } catch (error) {
    // optional: console.error("ScoreCard error", error);
    return null;
  }
};
