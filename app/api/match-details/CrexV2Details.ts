import puppeteer from "puppeteer";
import { CrexPlayerDetails } from "./CrexPlayerDetails";

export const CrexV2Details = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  page.setDefaultTimeout(60000);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await sleep(1000);

  // ✅ wait some safe selector
  await page.waitForSelector("body", { timeout: 15000 });

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
    (btns) => btns.length,
  );

  for (let i = 0; i < teamCount; i++) {
    const teamName = await page.$$eval(
      ".playingxi-button",
      (btns, idx) => btns[idx]?.textContent?.trim(),
      i,
    );

    await page.evaluate((idx) => {
      const btns = document.querySelectorAll(".playingxi-button");
      (btns[idx] as HTMLElement)?.click();
    }, i);

    await new Promise((r) => setTimeout(r, 300));
    await page.waitForFunction(
      () => document.querySelectorAll(".playingxi-card-row").length > 0,
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
      }),
    );

    if (teamName) {
      squads.push({
        teamName,
        players,
      });
    }
  }

  //..............close the browser after squads extraction..............

  /* ===============================
     🧑‍🤝‍🧑 Team Form (Last 5 Matches )
  =============================== */

  await page.waitForSelector(".format-match");

  const teamForm = await page.$$eval(".format-match", (blocks) =>
    blocks.map((block) => {
      const teamName =
        block.querySelector(".form-team-name")?.textContent?.trim() || "";

      const teamFlag =
        block.querySelector(".form-team-img")?.getAttribute("src") || null;

      const arrow = block.querySelector("img[id$='arrow']");
      const teamId = arrow?.getAttribute("id")?.replace("arrow", "") || "";

      const last5 = Array.from(block.querySelectorAll(".match span"))
        .map((el) => el.textContent?.trim())
        .filter(Boolean);

      return {
        teamId,
        teamName,
        teamFlag,
        last5,
      };
    }),
  );

  //Expand match details to get more data of team form
  const teamFormDetails = await page.$$eval(".format-match-exp", (sections) =>
    sections.map((section) => {
      const teamId = section.getAttribute("id") || "";

      const matches = Array.from(
        section.querySelectorAll(".team-form-card"),
      ).map((card) => {
        const teams = Array.from(
          card.querySelectorAll(".form-team-detail"),
        ).map((t) => ({
          name: t.querySelector(".team-name")?.textContent?.trim() || "",
          score: t.querySelector(".team-score")?.textContent?.trim() || "",
          overs: t.querySelector(".team-over")?.textContent?.trim() || "",
          flag: t.querySelector("img")?.getAttribute("src") || null,
        }));

        return {
          matchName:
            card.querySelector(".match-name")?.textContent?.trim() || "",
          series: card.querySelector(".series-name")?.textContent?.trim() || "",
          result:
            card
              .querySelector(".win.match span, .loss.match span")
              ?.textContent?.trim() || "",
          teams,
          matchUrl: card.getAttribute("href")
            ? "https://crex.com" + card.getAttribute("href")
            : null,
        };
      });

      return { teamId, matches };
    }),
  );

  const teamFormFinal = teamForm.map((team) => ({
    ...team,
    matches:
      teamFormDetails.find((t) => t.teamId === team.teamId)?.matches || [],
  }));

  //..............close the browser after team form extraction..............

  /* ===============================
     🆚 HEAD TO HEAD
  =============================== */

  await page.waitForSelector(".team-header-card");

  const h2h = await page.evaluate(() => {
    const header = document.querySelector(".team-header-card");
    if (!header) return null;

    const team1 = {
      name:
        header.querySelector(".team1 .team-name")?.textContent?.trim() || "",
      logo: header.querySelector(".team1 img")?.getAttribute("src") || "",
      wins: Number(
        header.querySelector(".team1-wins")?.textContent?.trim() || 0,
      ),
    };

    const team2 = {
      name:
        header.querySelector(".team2 .team-name")?.textContent?.trim() || "",
      logo: header.querySelector(".team2 img")?.getAttribute("src") || "",
      wins: Number(
        header.querySelector(".team2-wins")?.textContent?.trim() || 0,
      ),
    };

    const matches = Array.from(
      document.querySelectorAll(".global-match-card"),
    ).map((card) => {
      const teams = card.querySelectorAll(".team-name");
      const scores = card.querySelectorAll(".team-score");
      const overs = card.querySelectorAll(".team-over");

      return {
        matchUrl: card.getAttribute("href")
          ? "https://crex.com" + card.getAttribute("href")
          : null,
        team1: teams[0]?.textContent?.trim() || "",
        team1Score: scores[0]?.textContent?.trim() || "",
        team1Overs: overs[0]?.textContent?.trim() || "",
        team2: teams[1]?.textContent?.trim() || "",
        team2Score: scores[1]?.textContent?.trim() || "",
        team2Overs: overs[1]?.textContent?.trim() || "",
        result:
          card.querySelector(".match-dec-text")?.textContent?.trim() || "",
        series: card.querySelector(".series-name")?.textContent?.trim() || "",
      };
    });

    return {
      team1,
      team2,
      matches,
    };
  });

  // ..............close the browser after H2H extraction..............

  /* ===============================
     📊 POINTS TABLE
  =============================== */

  // wait for Angular table render
  await page.waitForFunction(
    () => document.querySelectorAll("table#table tbody tr").length >= 2,
  );

  const pointsTable = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("table#table tbody tr"));

    return rows.map((row) => {
      const tds = row.querySelectorAll("td");

      return {
        team: tds[0]?.textContent?.replace(/\s+/g, " ").trim() || "",
        logo: tds[0]?.querySelector("img")?.getAttribute("src") || null,
        played: Number(tds[1]?.textContent?.trim() || 0),
        wins: Number(tds[2]?.textContent?.trim() || 0),
        losses: Number(tds[3]?.textContent?.trim() || 0),
        nrr: tds[4]?.textContent?.trim() || "",
        points: Number(tds[5]?.textContent?.trim() || 0),
      };
    });
  });

  // ..............close the browser after points table extraction..............

  /* ===============================
     🆔 TEAM Comparison DETAILS
  =============================== */

  await page.waitForSelector(".team-header-card");

  const teams = await page.evaluate(() => {
    const team1 = document.querySelector(".team1");
    const team2 = document.querySelector(".team2");

    return {
      team1: {
        name: team1?.querySelector(".team-name")?.textContent?.trim() || "",
        logo: team1?.querySelector("img")?.getAttribute("src") || null,
      },
      team2: {
        name: team2?.querySelector(".team-name")?.textContent?.trim() || "",
        logo: team2?.querySelector("img")?.getAttribute("src") || null,
      },
    };
  });

  /* ===============================
     🔁 HELPER → READ TABLE
  =============================== */

  const readComparisonTable = async () => {
    await page.waitForFunction(
      () => document.querySelectorAll("table.colHeader tbody tr").length > 0,
    );

    return page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.colHeader tbody tr"),
      );

      return rows.map((row) => {
        const tds = row.querySelectorAll("td");
        return {
          team1: tds[0]?.textContent?.trim() || "",
          metric: tds[1]?.textContent?.trim() || "",
          team2: tds[2]?.textContent?.trim() || "",
        };
      });
    });
  };

  /* ===============================
     📊 OVERALL (DEFAULT)
  =============================== */

  const overall = await readComparisonTable();

  /* ===============================
     📍 ON VENUE (CLICK TOGGLE)
  =============================== */

  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll(".team-comp-type"));
    const venueTab = tabs.find((el) => el.textContent?.trim() === "On Venue");
    (venueTab as HTMLElement)?.click();
  });

  // wait for Angular re-render
  await page.waitForFunction(() =>
    document
      .querySelector(".team-comp-type.highlited")
      ?.textContent?.includes("Venue"),
  );

  const venue = await readComparisonTable();

  //close the browser after all team comparison extraction

  /* ===============================
     📍 WAIT FOR VENUE SECTION
  =============================== */

  await page.waitForSelector("#venue-details");

  const venuedetails = await page.evaluate(() => {
    /* ===============================
       🏟 VENUE NAME
    =============================== */

    const name =
      document
        .querySelector("#venue-details .title-text")
        ?.textContent?.trim() || "";

    /* ===============================
       🌦 WEATHER
    =============================== */

    const weatherWrap = document.querySelector("app-weather-details");

    const weather = {
      temperature:
        weatherWrap?.querySelector(".weather-temp")?.textContent?.trim() || "",
      condition:
        weatherWrap
          ?.querySelector(".weather-cloudy-text, .weather-cloudy-text-mweb")
          ?.textContent?.trim() || "",
      humidity:
        weatherWrap
          ?.querySelector(".humidity-text div:last-child")
          ?.textContent?.trim() || "",
      rainChance:
        weatherWrap
          ?.querySelectorAll(".weather-place-hum-text")[1]
          ?.textContent?.trim() || "",
    };

    /* ===============================
       📊 VENUE STATS
    =============================== */

    const stats = {
      matches:
        document.querySelector(".match-count")?.textContent?.trim() || "",
      winBatFirst:
        document
          .querySelector(".win-bat-first .match-win-per")
          ?.textContent?.trim() || "",
      winBowlFirst:
        document
          .querySelectorAll(".venue-per .match-win-per")[1]
          ?.textContent?.trim() || "",
      avg1stInns:
        document.querySelectorAll(".venue-avg-val")[0]?.textContent?.trim() ||
        "",
      avg2ndInns:
        document.querySelectorAll(".venue-avg-val")[1]?.textContent?.trim() ||
        "",
    };

    /* ===============================
       🏏 RECORDS
    =============================== */

    const records: Record<string, any> = {};

    document.querySelectorAll(".venue-table-head").forEach((head, idx) => {
      const row = head.parentElement;
      records[head.textContent!.trim()] = {
        vs:
          row?.querySelector(".venue-vs-team-text")?.textContent?.trim() || "",
        score: row?.querySelector(".venue-score")?.textContent?.trim() || "",
      };
    });

    /* ===============================
       ⚡ PACE vs SPIN
    =============================== */

    const paceVsSpin = {
      paceWickets:
        document
          .querySelector(".pace-text")
          ?.nextElementSibling?.textContent?.trim() || "",
      spinWickets:
        document
          .querySelector(".wicket-count.red-color")
          ?.textContent?.trim() || "",
      pacePercent:
        document.querySelectorAll(".s-format")[0]?.textContent?.trim() || "",
      spinPercent:
        document.querySelectorAll(".s-format")[1]?.textContent?.trim() || "",
    };

    /* ===============================
       🕒 RECENT MATCHES
    =============================== */

    const recentMatches = Array.from(
      document.querySelectorAll(".global-match-card"),
    ).map((card) => {
      const teams = card.querySelectorAll(".team-name");
      const scores = card.querySelectorAll(".team-score");
      const overs = card.querySelectorAll(".team-over");

      return {
        team1: teams[0]?.textContent?.trim() || "",
        team1Score: scores[0]?.textContent?.trim() || "",
        team1Overs: overs[0]?.textContent?.trim() || "",
        team2: teams[1]?.textContent?.trim() || "",
        team2Score: scores[1]?.textContent?.trim() || "",
        team2Overs: overs[1]?.textContent?.trim() || "",
        result:
          card.querySelector(".match-dec-text")?.textContent?.trim() || "",
        series: card.querySelector(".series-name")?.textContent?.trim() || "",
        url: card.getAttribute("href")
          ? "https://crex.com" + card.getAttribute("href")
          : null,
      };
    });

    return {
      name,
      weather,
      stats,
      records,
      paceVsSpin,
      recentMatches,
    };
  });

  await browser.close();
  // const prepareData = await Promise.all(
  //   squads.map(async (team: any) => {
  //     const teamPlayers = await Promise.all(
  //       team.players.map(async (player: any) => {
  //         const playerDetails = await CrexPlayerDetails(player.playerUrl);

  //         return {
  //           ...player,
  //           style: playerDetails.player.style,
  //           rank: playerDetails.player.rank,
  //           recentForm: playerDetails.stats.recentForm,
  //           careerStats: playerDetails.stats.careerStats,
  //           details: playerDetails,
  //         };
  //       })
  //     );

  //     return {
  //       ...team,
  //       players: teamPlayers,
  //     };
  //   })
  // );

  return {
    squads,
    teamForm: teamFormFinal,
    h2h,
    pointsTable,
    comparision: {
      teams,
      comparison: {
        overall,
        venue,
      },
    },
    venueDetails: venuedetails,
  };
};
