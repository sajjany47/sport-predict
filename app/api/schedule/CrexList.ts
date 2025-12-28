import { GetHtml } from "@/lib/utils";
import { Target } from "@/types/CricbuzzListType";

export const CrexList = async (
  fromDate: Date,
  timeZone: string
): Promise<Target[]> => {
  const $ = await GetHtml("https://crex.com/fixtures/match-list");

  const results: Target[] = [];

  $(".date-wise-matches-card").each((_, dateBlock) => {
    const dateText = $(dateBlock).find(".date div").first().text().trim(); // e.g. Sun, 28 Dec 2025

    $(dateBlock)
      .find("li.match-card-container")
      .each((_, matchEl) => {
        const link = $(matchEl).find("a.match-card-wrapper").attr("href");

        if (!link) return;

        const fullUrl = `https://crex.com${link}`;

        // 🔹 matchId from URL
        // /scoreboard/Z2R/27O/8th-Match/O4/SY/...
        const urlParts = link.split("/");
        const matchId = parseInt(urlParts[2], 36) || Date.now();

        // 🔹 status
        let status: string | null = "UPCOMING";
        if ($(matchEl).find(".liveTag").length) status = "LIVE";
        if ($(matchEl).find(".result").length) status = "COMPLETED";

        // 🔹 description & series
        const matchDescription =
          $(matchEl)
            .find(".time span")
            .map((_, el) => $(el).text().trim())
            .get()
            .join(" ") || null;

        const seriesText = $(matchEl)
          .find(".time")
          .text()
          .replace(matchDescription ?? "", "")
          .trim();

        // 🔹 format
        const format = matchDescription?.includes("ODI")
          ? "ODI"
          : matchDescription?.includes("T20")
          ? "T20"
          : null;

        // 🔹 teams
        const teams: Target["teams"] = [];

        $(matchEl)
          .find(".team")
          .each((_, teamEl) => {
            const teamName = $(teamEl).find(".team-name").first().text().trim();

            if (!teamName) return;

            const img = $(teamEl).find("img").attr("src") || null;

            // teamId from image URL (Teams/O4.png)
            let squadId = 0;
            if (img) {
              const match = img.match(/Teams\/(.+)\.png/);
              if (match) squadId = parseInt(match[1], 36);
            }

            teams.push({
              squadId,
              teamName,
              teamShortName:
                teamName.length <= 4
                  ? teamName
                  : teamName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase(),
              teamFlagUrl: img,
              isWinner: null,
              color: null,
              cricketScore: null,
              squadNo: null,
            });
          });

        results.push({
          tourId: null,
          tourName: seriesText || null,
          matchId,
          matchName: null,
          matchDescription,
          startTime: dateText ? new Date(dateText).getTime().toString() : null,
          endTime: null,
          status,
          venue: null,
          tour: "International",
          format,
          sport: "cricket",
          teams,
          url: fullUrl,
        });
      });
  });

  return results;
};
