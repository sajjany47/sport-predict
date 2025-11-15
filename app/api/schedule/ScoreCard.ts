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

    // container for miniscore areas (cover multiple possible ids)
    const container = $(
      "#miniscore-branding-container, #sticky-mscore, #sticky-mcomplete"
    );

    // --- RESULT / SESSION INFO (robust) ---
    let result: string | null =
      ($(".text-cbTxtLive").first().text() || "").trim() ||
      ($(".text-cbLive").first().text() || "").trim() ||
      ($(".text-cbTextLink").first().text() || "").trim() ||
      "";

    const isResultLike = (t: string | undefined | null) => {
      if (!t) return false;
      const s = (t || "").replace(/\s+/g, " ").trim();
      return /(?:Day\s*\d+\s*:|Stumps|trail by|Session|won by|innings|innings and)\b/i.test(
        s
      );
    };

    if (!isResultLike(result)) {
      const candidates: string[] = [];
      container.find("*").each((i, el) => {
        const text = ($(el).text() || "").replace(/\s+/g, " ").trim();
        if (!text) return;
        if (text.length > 200) return;
        if (isResultLike(text)) candidates.push(text);
      });

      if (candidates.length) {
        candidates.sort((a, b) => a.length - b.length);
        result = candidates[0];
      } else {
        const bodyText = ($("body").text() || "").replace(/\s+/g, " ").trim();
        const m = bodyText.match(/(Day\s*\d+\s*[:\-–].{1,200})/i);
        if (m) result = m[1].trim();
      }
    }

    result = (result || "").replace(/\s+/g, " ").trim();
    if (!result) result = null;

    // ---------------- SCORE EXTRACTION ----------------
    const scoreCandidates: ScoreEntry[] = [];
    const norm = (t: string | undefined | null) =>
      (t || "").toString().trim().replace(/\s+/g, " ");
    const normalizeRunText = (raw: string | undefined | null) => {
      if (!raw) return "";
      return raw
        .toString()
        .replace(/\s*&\s*/g, " & ")
        .replace(/\band\b/gi, "&")
        .replace(/\s+/g, " ")
        .trim();
    };

    // permissive run pattern:
    // - single number: 159
    // - wickets: 37/1 or 37-1
    // - overs: (35) or (35.0)
    // - multi-innings joined by &: "286 & 254"
    // - declared: "587/8 d"
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

    // Primary strategy: when a team token is found, read siblings in same parent row,
    // combine adjacent numeric children, and validate the combined run string.
    container.find("*").each((i, el) => {
      const $el = $(el);
      const text = norm($el.text());
      if (!text) return;

      // team token heuristic: 2-4 uppercase letters (IND, RSA, BAN, IRE, ENG)
      if (/^[A-Z]{2,4}$/.test(text)) {
        const team = text.toUpperCase();
        if (scoreCandidates.some((s) => s.team === team)) return;

        let run: string | null = null;

        // 1) inspect parent row children: collect parts after the team token
        const parent = $el.parent();
        if (parent && parent.length) {
          const children = parent.children().toArray();
          // find index of the child that exactly equals this token (or contains it)
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
            if (joined && runPattern.test(joined)) {
              run = joined;
            } else {
              // try combining only numeric-like children
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

        // 2) fallback: scan next siblings in DOM (small window)
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

        // 3) final fallback: search container text for "TEAM <numbers...>"
        if (!run) {
          const big = normalizeRunText(
            norm(container.text() || $("body").text())
          );
          const rx = new RegExp(
            `${team.replace(
              /[-/\\^$*+?.()|[\\]{}]/g,
              "\\$&"
            )}[^A-Z0-9\\n]{0,10}([0-9][0-9\\s\\/\\-\\&\\(\\)\\.dD]+)`,
            "i"
          );
          const m = big.match(rx);
          if (m) {
            const candidate = normalizeRunText(m[1]);
            if (candidate && runPattern.test(candidate)) run = candidate;
          }
        }

        // push validated entry
        if (run && !excludeSet.has(team) && runPattern.test(run)) {
          scoreCandidates.push({ team, run });
        }
      }
    });

    // Additional fallback scanning for team + run pairs if not enough candidates
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

    // Return only the first two valid team entries (dynamic)
    const finalScore = scoreCandidates.slice(0, 2);

    return {
      matchName: matchName || null,
      score: finalScore,
      result: result || null,
    };
  } catch (error) {
    // optional: console.error("ScoreCard error", error);
    return null;
  }
};
