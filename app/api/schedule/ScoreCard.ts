import { GetHtml } from "@/lib/utils";

export const ScoreCard = async () => {
  try {
    const url = `https://www.cricbuzz.com/live-cricket-scores/117371/rsa-vs-ind-1st-test-south-africa-tour-of-india-2025`;
    const $ = await GetHtml(url);

    // --- MATCH NAME ---
    const matchName = ($("h1").first().text() || "")
      .trim()
      .replace(/\s+/g, " ");

    // --- RESULT / SESSION INFO ---
    let result =
      ($(".text-cbTextLink").first().text() || "").trim() ||
      ($(".text-cbTxtLive").first().text() || "").trim() ||
      ($(".text-cbLive").first().text() || "").trim() ||
      ($("#sticky-mcomplete .text-cbTextLink").first().text() || "").trim() ||
      "";
    result = result.replace(/\s+/g, " ");

    // --- SCORE extraction (support multiple layouts) ---
    const scoreCandidates = []; // { team, run }

    const container = $(
      "#miniscore-branding-container, #sticky-mscore, #sticky-mcomplete"
    );

    const norm = (t) => (t || "").trim().replace(/\s+/g, " ");

    // Helper to push if looks valid and not duplicate
    const pushIfValid = (team, run) => {
      if (!team || !run) return;
      team = team.toUpperCase().trim();
      run = run.trim();
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
      if (exclude.has(team)) return;
      if (!/^[A-Z]{2,4}$/.test(team)) return;
      if (!/^[0-9]+(?:[\/\-\u2013][0-9]+)?(?:\s*\([0-9.]+\))?$/.test(run))
        return;
      if (!scoreCandidates.some((s) => s.team === team)) {
        scoreCandidates.push({ team, run });
      }
    };

    // 1) Layout: compact rows like your first HTML (team token in small div + sibling number)
    container.find("*").each((i, el) => {
      const $el = $(el);
      const text = norm($el.text());
      if (!text) return;

      // if element text is exact uppercase token (IND, RSA, BAN, IRE, etc.)
      if (/^[A-Z]{2,4}$/.test(text)) {
        const team = text;
        // try immediate siblings for numbers
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
        // try parent text (token + rest in same row)
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
        if (run) pushIfValid(team, run);
      }
    });

    // 2) Layout: 'complete' block (your second HTML) where .text-lg.font-bold contains two flex rows
    // Find .text-lg.font-bold (or similar) with direct child flex rows
    const boldContainers = $(
      ".text-lg.font-bold, .text-lg.font-bold > div"
    ).toArray();
    if (boldContainers.length) {
      $(boldContainers).each((i, bc) => {
        // look for immediate child flex rows
        $(bc)
          .find("> .flex, > div.flex, .flex.flex-row")
          .each((j, row) => {
            const pieces = $(row)
              .children()
              .toArray()
              .map((ch) => norm($(ch).text()))
              .filter(Boolean);
            if (pieces.length === 0) return;
            // pattern: [teamToken, scorePart, possibly more parts]
            const teamToken = pieces[0].match(/^[A-Z]{2,4}$/)
              ? pieces[0]
              : null;
            if (teamToken) {
              // join rest of pieces as run (e.g. "587/8 d" or "286  & 254" -> "286 & 254" -> we'll parse first numeric)
              const rest = pieces
                .slice(1)
                .join(" ")
                .replace(/\s*&\s*/g, " & ");
              // look for first numeric group or a "num/num" pattern
              const m = rest.match(
                /([0-9]+(?:[\/\-\u2013][0-9]+)?)(?:\s*([dD]))?(?:.*?(\([0-9.]+\)))?/
              );
              if (m) {
                const runs = m[1];
                const overs = m[3] ? m[3] : "";
                pushIfValid(teamToken[0], `${runs}${overs}`);
              } else {
                // if contains two numbers (like "286 & 254") capture as "286 & 254" only if first numeric accepted
                const nums = rest.match(/[0-9]+/g);
                if (nums && nums.length) {
                  pushIfValid(teamToken[0], nums.slice(0, 2).join("&"));
                }
              }
            }
          });
      });
    }

    // 3) Fallback: scan container text with TEAM + number regex (capture up to first 4 matches)
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

    // final filter + only keep first two valid team entries (dynamic)
    const final = scoreCandidates
      .filter((e) => {
        // ensure run matches team-run form strictly
        return (
          /^[A-Z]{2,4}$/.test(e.team) &&
          /^[0-9]+(?:[\/\-\u2013][0-9]+)?(?:\s*\([0-9.]+\))?$/.test(e.run)
        );
      })
      .slice(0, 2);

    return {
      matchName: matchName || null,
      score: final,
      result: result || null,
    };
  } catch (error) {
    // optionally log error for debugging
    // console.error(error);
    return null;
  }
};
