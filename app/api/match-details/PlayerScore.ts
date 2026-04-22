import { getBrowser } from "@/lib/browser";

export const PlayerScore = async (playerUrl: string, scorecardUrl: string) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(scorecardUrl, { waitUntil: "networkidle2" });

    await page.waitForSelector(".score-card");

    const data = await page.evaluate((playerUrl) => {
      const teams = Array.from(document.querySelectorAll(".team-name")).map(
        (el) => el.textContent?.trim(),
      );

      const formatText =
        document.querySelector(".score-over span:last-child")?.textContent ||
        "";
      const matchFormat = parseInt(formatText.replace(/[^\d]/g, "")) || 20;

      let finalPlayer: any = null;

      document.querySelectorAll(".card.score-card").forEach((card, index) => {
        const teamName = teams[index] || "";

        const tables = card.querySelectorAll("table");

        const battingRows = tables[0]?.querySelectorAll("tbody tr") || [];
        const bowlingRows = tables[1]?.querySelectorAll("tbody tr") || [];

        let battingData: any = null;
        let bowlingData: any = null;

        // ✅ BATTING (match by playerUrl)
        Array.from(battingRows).forEach((row, i) => {
          const a = row.querySelector("a");
          const href = a?.getAttribute("href");

          const fullUrl = href ? "https://crex.com" + href : null;

          if (fullUrl === playerUrl) {
            const td = row.querySelectorAll("td");

            battingData = {
              name: a?.textContent?.trim() || "",
              batting: Number(td[1]?.textContent?.trim() || 0),
              ballFaced: Number(td[2]?.textContent?.trim() || 0),
              position: i + 1,
            };
          }
        });

        // ✅ BOWLING (match by playerUrl)
        Array.from(bowlingRows).forEach((row) => {
          const a = row.querySelector("a");
          const href = a?.getAttribute("href");

          const fullUrl = href ? "https://crex.com" + href : null;

          if (fullUrl === playerUrl) {
            const td = row.querySelectorAll("td");

            bowlingData = {
              overs: Number(td[1]?.textContent?.trim() || 0),
              wickets: Number(td[4]?.textContent?.trim() || 0),
            };
          }
        });

        // ✅ if player found in this team
        if (battingData || bowlingData) {
          finalPlayer = {
            name: battingData?.name || "",
            batting: battingData?.batting || 0,
            bowling: bowlingData?.wickets || 0,
            ballFaced: battingData?.ballFaced || 0,
            overs: bowlingData?.overs || 0,
            position: battingData?.position || null,
            matchFormat,
            teamName,
          };
        }
      });

      return finalPlayer;
    }, playerUrl);

    return data;
  } catch (err) {
    console.error("PlayerScore Error:", err);
    throw err;
  } finally {
    await page.close();
  }
};
