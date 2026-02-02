import puppeteer from "puppeteer";

export const SquadList = async (url: string, squad: any[]) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    );

    page.setDefaultTimeout(60000);

    await page.goto(url, { waitUntil: "networkidle2" });

    // wait squads wrapper (more reliable than button)
    await page.waitForSelector(".playingxi", { timeout: 30000 });

    const latestSquad = await page.evaluate(async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      const output: any[] = [];

      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>(".playingxi-button"),
      );

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].click();
        await sleep(400);

        const teamShortName = buttons[i].textContent?.trim() || "";

        const players = Array.from(
          document.querySelectorAll(".playingxi-card-row"),
        ).map((row) => {
          const a = row.querySelector("a");

          return {
            name: a?.getAttribute("title") || "",
            role:
              row.querySelector(".bat-ball-type div")?.textContent?.trim() ||
              "",
            playerUrl: a?.getAttribute("href")
              ? "https://crex.com" + a.getAttribute("href")
              : null,
            playerImage:
              row.querySelector(".img-card img")?.getAttribute("src") || null,
          };
        });

        output.push({
          teamName: teamShortName,
          players,
        });
      }

      return output;
    });

    const prepareSquad = squad.map((team: any) => {
      const liveTeam = latestSquad.find(
        (t: any) => t.teamName === team.teamName,
      );
      if (!liveTeam) return team;
      const fullPlayerList = [...team.playingPlayers, ...team.benchPlayers];
      const updatedPlayingPlayers = fullPlayerList.filter((lp: any) =>
        liveTeam.players.some(
          (fp: any) => fp.playerUrl === lp.playerUrl || fp.name === lp.name,
        ),
      );
      const updatedBenchPlayers = fullPlayerList.filter(
        (lp: any) =>
          !liveTeam.players.some(
            (fp: any) => fp.playerUrl === lp.playerUrl || fp.name === lp.name,
          ),
      );
      return {
        ...team,
        playingPlayers: updatedPlayingPlayers,
        benchPlayers: updatedBenchPlayers,
      };
    });

    return prepareSquad;
  } finally {
    await browser.close();
  }
};
