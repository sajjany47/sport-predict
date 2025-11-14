import { GetHtml } from "@/lib/utils";

export const ScoreCard = async () => {
  try {
    const url = `https://www.cricbuzz.com/live-cricket-scores/137327/paka-vs-oman-1st-match-group-b-acc-mens-asia-cup-rising-stars-2025`;
    const $ = await GetHtml(url);

    const matchName = ($("h1").first().text() || "")
      .trim()
      .replace(/\s+/g, " ");

    // container for miniscore areas
    const container = $(
      "#miniscore-branding-container, #sticky-mscore, #sticky-mcomplete"
    );

    // --- RESULT / SESSION INFO (robust) ---
    // 1) quick checks on known selectors
    let result =
      ($(".text-cbTxtLive").first().text() || "").trim() ||
      ($(".text-cbLive").first().text() || "").trim() ||
      ($(".text-cbTextLink").first().text() || "").trim() ||
      "";

    // 2) If quick checks returned nothing or something not result-like,
    // scan container children for short text nodes that look like a result/session line.
    const isResultLike = (t) => {
      if (!t) return false;
      const s = t.replace(/\s+/g, " ").trim();
      // common patterns: Day X:, Stumps, trail by, Session, Innings, won by
      return /(?:Day\s*\d+\s*:|Stumps|trail by|Session|won by|innings|innings and)\b/i.test(
        s
      );
    };

    if (!isResultLike(result)) {
      // gather candidate texts (short, non-empty) from the container and choose the best match
      const candidates = [];
      container.find("*").each((i, el) => {
        const text = ($(el).text() || "").replace(/\s+/g, " ").trim();
        if (!text) return;
        if (text.length > 200) return; // skip very long blocks
        // prefer strings that contain Day / Stumps / trail by / won by / innings
        if (isResultLike(text)) candidates.push(text);
      });

      if (candidates.length) {
        // prefer the shortest candidate (usually the concise "Day 1: Stumps - ...")
        candidates.sort((a, b) => a.length - b.length);
        result = candidates[0];
      } else {
        // last fallback: scan whole page for "Day X:" pattern
        const bodyText = ($("body").text() || "").replace(/\s+/g, " ").trim();
        const m = bodyText.match(/(Day\s*\d+\s*[:\-–].{1,200})/i);
        if (m) result = m[1].trim();
      }
    }

    result = (result || "").replace(/\s+/g, " ").trim();
    if (!result) result = null;

    // --- SCORE extraction (kept same as before; truncated here for brevity) ---
    // (You can paste your existing score extraction logic here — unchanged.)
    const scoreCandidates = [];
    const norm = (t) => (t || "").trim().replace(/\s+/g, " ");

    // same team extraction logic (compact)
    container.find("*").each((i, el) => {
      const $el = $(el);
      const text = norm($el.text());
      if (!text) return;
      if (/^[A-Z]{2,4}$/.test(text)) {
        const team = text;
        if (scoreCandidates.some((s) => s.team === team)) return;
        let run = null;
        let next = $el.next();
        for (let j = 0; j < 4 && next && next.length; j++, next = next.next()) {
          const nt = norm(next.text());
          if (!nt) continue;
          const m = nt.match(
            /^([0-9]+)(?:[\/\-\u2013]\s*([0-9]+))?(?:\s*\(?([0-9.]+)\)?)?/
          );
          if (m) {
            const runs = m[1];
            const wk = m[2] ? `-${m[2]}` : "";
            const overs = m[3] ? `(${m[3]})` : "";
            run = `${runs}${wk}${overs}`;
            break;
          }
        }
        if (!run) {
          const parentTxt = norm($el.parent().text()).replace(team, "").trim();
          const m = parentTxt.match(
            /^.*?([0-9]+)(?:[\/\-\u2013]\s*([0-9]+))?(?:.*?(\([0-9.]+\)))?/
          );
          if (m) {
            const runs = m[1];
            const wk = m[2] ? `-${m[2]}` : "";
            const overs = m[3] ? m[3] : "";
            run = `${runs}${wk}${overs}`;
          }
        }
        if (run) {
          const teamUp = team.toUpperCase();
          // exclude common stat tokens
          const exclude = new Set([
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
          if (
            !exclude.has(teamUp) &&
            /^[A-Z]{2,4}$/.test(teamUp) &&
            /^[0-9]+(?:[\/\-\u2013][0-9]+)?(?:\s*\([0-9.]+\))?$/.test(run)
          ) {
            scoreCandidates.push({ team: teamUp, run });
          }
        }
      }
    });

    // fallback regex scan if needed
    if (scoreCandidates.length < 2) {
      const big = norm(container.text() || $("body").text());
      const multiRe =
        /([A-Z]{2,4})[^\d\n\r]{0,8}([0-9]+)(?:[\/\-\u2013]\s*([0-9]+))?(?:[^\d\n\r]*(\([0-9.]+\)))?/g;
      let gm;
      while ((gm = multiRe.exec(big)) !== null) {
        const team = gm[1];
        const first = gm[2];
        const second = gm[3];
        const overs = gm[4] ? gm[4] : "";
        const full = second ? `${first}-${second}${overs}` : `${first}${overs}`;
        if (!scoreCandidates.some((s) => s.team === team)) {
          scoreCandidates.push({ team, run: full });
        }
        if (scoreCandidates.length >= 4) break;
      }
    }

    const finalScore = scoreCandidates.slice(0, 2);

    return {
      matchName: matchName || null,
      score: finalScore,
      result: result || null,
    };
  } catch (error) {
    // optionally log error for debugging
    // console.error(error);
    return null;
  }
};
