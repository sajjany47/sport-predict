import puppeteer from "puppeteer";

export const CrexV2Details = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  await page.goto(url, { waitUntil: "networkidle2" });

  /* ===============================
     🧑‍🤝‍🧑 SQUADS (ARRAY FORMAT)
  =============================== */

  await page.waitForSelector(".playingxi-button");

  const squads: {
    teamName: string;
    players: any[];
  }[] = [];

  const teamCount = await page.$$eval(
    ".playingxi-button",
    (btns) => btns.length
  );

  for (let i = 0; i < teamCount; i++) {
    const teamName = await page.$$eval(
      ".playingxi-button",
      (btns, idx) => btns[idx]?.textContent?.trim(),
      i
    );

    await page.evaluate((idx) => {
      const btns = document.querySelectorAll(".playingxi-button");
      (btns[idx] as HTMLElement)?.click();
    }, i);

    await new Promise((r) => setTimeout(r, 300));
    await page.waitForFunction(
      () => document.querySelectorAll(".playingxi-card-row").length > 0
    );

    const players = await page.$$eval(".playingxi-card-row", (rows) =>
      rows.map((row) => {
        const a = row.querySelector("a");
        return {
          name: a?.getAttribute("title") || "",
          shortName: row.querySelector(".p-name")?.textContent?.trim() || "",
          role:
            row.querySelector(".bat-ball-type div")?.textContent?.trim() || "",
          isWK: row.textContent?.includes("(WK)") || false,
          playerUrl: a?.getAttribute("href")
            ? "https://crex.com" + a.getAttribute("href")
            : null,
          image:
            row.querySelector(".img-card img")?.getAttribute("src") || null,
        };
      })
    );

    if (teamName) {
      squads.push({
        teamName,
        players,
      });
    }
  }

  await browser.close();

  return { squads };
};
