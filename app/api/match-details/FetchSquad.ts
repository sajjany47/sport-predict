import { getBrowser } from "@/lib/browser";
import { CrexPlayerDetails } from "./CrexPlayerDetails";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 🔥 concurrency limiter
const asyncPool = async (poolLimit: number, array: any[], iteratorFn: any) => {
  const ret: any[] = [];
  const executing: any[] = [];

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(ret);
};

export const fetchSquadWithDetails = async (url: string) => {
  let browser;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const toss = await page
      .$eval(".toss-wrap p", (el) => el.textContent?.trim())
      .catch(() => null);

    const isAfterToss = Boolean(toss);

    await page.waitForSelector(".playingxi-button");

    const teamCount = await page.$$eval(
      ".playingxi-button",
      (btns) => btns.length,
    );

    const squads: any[] = [];

    const extractPlayers = async () => {
      return page.$$eval(".playingxi-card-row", (rows) =>
        rows.map((row) => {
          const a = row.querySelector("a");

          return {
            name: a?.getAttribute("title") || "",
            shortName: row.querySelector(".p-name")?.textContent?.trim() || "",
            role:
              row.querySelector(".bat-ball-type div")?.textContent?.trim() ||
              "",
            isWK: row.textContent?.includes("(WK)") || false,
            playerUrl: a?.getAttribute("href")
              ? "https://crex.com" + a.getAttribute("href")
              : null,
            image:
              row.querySelector(".img-card img")?.getAttribute("src") || null,
          };
        }),
      );
    };

    // 🔥 enrich player (with details)
    const enrichPlayer = async (player: any) => {
      if (!player.playerUrl) {
        return { ...player, style: null, rank: null };
      }

      try {
        const details = await CrexPlayerDetails(player.playerUrl);

        return {
          ...player,
          style: details?.player?.style || null,
          rank: details?.player?.rank || null,
          recentForm: details?.stats?.recentForm || null,
          careerStats: details?.stats?.careerStats || null,
        };
      } catch {
        return {
          ...player,
          style: null,
          rank: null,
          recentForm: null,
          careerStats: null,
        };
      }
    };

    for (let i = 0; i < teamCount; i++) {
      const teamName = await page.$$eval(
        ".playingxi-button",
        (btns, idx) => btns[idx]?.textContent?.trim(),
        i,
      );

      await page.evaluate((idx) => {
        const btn = document.querySelectorAll(".playingxi-button")[
          idx
        ] as HTMLElement;
        btn?.click();
      }, i);

      await delay(400);

      if (isAfterToss) {
        await page.evaluate(() => {
          const arrow = document.querySelector("#bench-arrow") as HTMLElement;
          arrow?.click();
        });
        await delay(300);
      }

      const allPlayers = await extractPlayers();

      let playingPlayers: any[] = [];
      let benchPlayers: any[] = [];

      if (!isAfterToss) {
        benchPlayers = allPlayers;
      } else {
        playingPlayers = allPlayers.slice(0, 11);
        benchPlayers = allPlayers.slice(11);
      }

      // 🔥 IMPORTANT → limit 5 parallel calls only
      const enrichedPlaying = await asyncPool(5, playingPlayers, enrichPlayer);

      const enrichedBench = await asyncPool(5, benchPlayers, enrichPlayer);

      squads.push({
        teamName,
        toss,
        playingPlayers: enrichedPlaying,
        benchPlayers: enrichedBench,
      });
    }

    await page.close();

    return squads;
  } catch (error) {
    console.error("fetchSquadWithDetails error:", error);
    return [];
  } finally {
    if (browser) await browser.close().catch(() => null);
  }
};
