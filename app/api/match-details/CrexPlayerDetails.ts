import puppeteer from "puppeteer";

export const CrexPlayerDetails = async (url: string): Promise<any> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  await page.goto(url, { waitUntil: "networkidle2" });

  // wait until player name loads (Angular safe)
  await page.waitForSelector(".playerFName");

  const player = await page.evaluate(() => {
    /* ===============================
       🧑 PLAYER NAME
    =============================== */
    const firstName =
      document.querySelector(".playerFName")?.textContent?.trim() || "";
    const lastName =
      document.querySelector(".playerLName")?.textContent?.trim() || "";

    const name = `${firstName} ${lastName}`.trim();

    /* ===============================
       🖼 PLAYER IMAGE
    =============================== */
    const image =
      document.querySelector("#playerWrap img")?.getAttribute("src") || null;

    /* ===============================
       🏏 BATTING STYLE
    =============================== */
    const style =
      document.querySelector(".btText span")?.textContent?.trim() || "";

    /* ===============================
       🏅 PLAYER RANK
    =============================== */
    const rank =
      document.querySelector(".playerTop")?.textContent?.trim() || "";

    return {
      name,
      image,
      style,
      rank,
    };
  });

  await page.waitForSelector(".careerTitle");

  const stats = await page.evaluate(() => {
    /* ===============================
       🔥 RECENT FORM (BATTING)
    =============================== */
    const recentBatting = Array.from(
      document.querySelectorAll("#rfContainer\\ Batting tr.formItems")
    ).map((row) => ({
      match: row.querySelector(".itemSubtext")?.textContent?.trim() || "",
      score: row.querySelector(".itemText span")?.textContent?.trim() || "",
      scorecardUrl: row.querySelector(".itemText")?.getAttribute("href")
        ? "https://crex.com" +
          row.querySelector(".itemText")?.getAttribute("href")
        : null,
    }));

    /* ===============================
       🔥 RECENT FORM (BOWLING)
    =============================== */
    const recentBowling = Array.from(
      document.querySelectorAll("#rfContainer\\ Bowling tr.formItems")
    ).map((row) => ({
      match: row.querySelector(".itemSubtext")?.textContent?.trim() || "",
      figures: row.querySelector(".itemText span")?.textContent?.trim() || "",
      scorecardUrl: row.querySelector(".itemText")?.getAttribute("href")
        ? "https://crex.com" +
          row.querySelector(".itemText")?.getAttribute("href")
        : null,
    }));

    /* ===============================
       📊 CAREER STATS – BATTING
    =============================== */
    const battingCareer = Array.from(
      document.querySelectorAll(".careerSection:not(.d-none) table tbody tr")
    )
      .slice(1)
      .map((row) => {
        const td = row.querySelectorAll("td");
        return {
          format: td[0]?.textContent?.trim(),
          matches: td[1]?.textContent?.trim(),
          innings: td[2]?.textContent?.trim(),
          runs: td[3]?.textContent?.trim(),
          hundreds: td[4]?.textContent?.trim(),
          fifties: td[5]?.textContent?.trim(),
          highScore: td[6]?.textContent?.trim(),
          strikeRate: td[7]?.textContent?.trim(),
          average: td[8]?.textContent?.trim(),
          fours: td[9]?.textContent?.trim(),
          sixes: td[10]?.textContent?.trim(),
          ducks: td[11]?.textContent?.trim(),
          rank: td[12]?.textContent?.trim(),
        };
      });

    /* ===============================
       📊 CAREER STATS – BOWLING
    =============================== */
    const bowlingCareer = Array.from(
      document.querySelectorAll(".careerSection.d-none table tbody tr")
    )
      .slice(1)
      .map((row) => {
        const td = row.querySelectorAll("td");
        return {
          format: td[0]?.textContent?.trim(),
          matches: td[1]?.textContent?.trim(),
          innings: td[2]?.textContent?.trim(),
          wickets: td[3]?.textContent?.trim(),
          economy: td[4]?.textContent?.trim(),
          average: td[5]?.textContent?.trim(),
          best: td[6]?.textContent?.trim(),
          threeWickets: td[7]?.textContent?.trim(),
          fiveWickets: td[8]?.textContent?.trim(),
          strikeRate: td[9]?.textContent?.trim(),
          maidens: td[10]?.textContent?.trim(),
          rank: td[11]?.textContent?.trim(),
        };
      });

    return {
      recentForm: {
        batting: recentBatting,
        bowling: recentBowling,
      },
      careerStats: {
        batting: battingCareer,
        bowling: bowlingCareer,
      },
    };
  });
  await browser.close();
  return { player, stats };
};
