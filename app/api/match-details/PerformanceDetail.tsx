import { GetHtml } from "@/lib/utils";

export const BattingForm = async (url: string) => {
  const $ = await GetHtml(url);
  const matches: any = [];

  // Find the first table inside the tab-pane with id ending in '-batting'
  const table = $('div.tab-pane[id$="-batting"] table');

  table.find("tbody tr").each((_, row) => {
    const columns = $(row).find("td");

    const date = $(columns[0]).text().trim();
    const match = $(columns[1]).text().trim();

    if ($(columns[2]).attr("colspan") === "5") {
      matches.push({
        date,
        match,
        bo: "DNB",
        run: "DNB",
        fours_sixes: "DNB",
        sr: "DNB",
        out: "DNB",
      });
    } else {
      matches.push({
        date,
        match,
        bo: $(columns[2]).text().trim(),
        run: $(columns[3]).text().trim(),
        fours_sixes: $(columns[4]).text().trim(),
        sr: $(columns[5]).text().trim(),
        out: $(columns[6]).text().trim(),
      });
    }
  });

  return matches;
};

export const BowlingForm = async (url: string) => {
  const $ = await GetHtml(url);
  const bowlingStats: any = [];

  // Select bowling table using ID ending in -bowling
  const table = $('div.tab-pane[id$="-bowling"] table');

  table.find("tbody tr").each((_, row) => {
    const columns = $(row).find("td");
    const date = $(columns[0]).text().trim();
    const match = $(columns[1]).text().trim();

    // Handle "DNB" case (colspan = 5)
    if ($(columns[2]).attr("colspan") === "5") {
      bowlingStats.push({
        date,
        match,
        o: "DNB",
        r: "DNB",
        w: "DNB",
        m: "DNB",
        eco: "DNB",
      });
    } else {
      bowlingStats.push({
        date,
        match,
        o: $(columns[2]).text().trim(),
        r: $(columns[3]).text().trim(),
        w: $(columns[4]).text().trim(),
        m: $(columns[5]).text().trim(),
        eco: $(columns[6]).text().trim(),
      });
    }
  });
  return bowlingStats;
};

export const BattingStats = async (url: string) => {
  const $ = await GetHtml(url);
  const result: any = [];

  // Target only rows with class 'tsuccess' inside the correct table
  const tableRows = $("div[id$='-batting-stats'] table tbody tr.tsuccess");

  tableRows.each((_, row) => {
    const cols = $(row).find("td");

    if (cols.length >= 14) {
      result.push({
        year: $(cols[0]).text().trim(),
        mode: $(cols[1]).text().trim(),
        matches: $(cols[2]).text().trim(),
        innings: $(cols[3]).text().trim(),
        runs: $(cols[4]).text().trim(),
        balls: $(cols[5]).text().trim(),
        notOut: $(cols[6]).text().trim(),
        average: $(cols[7]).text().trim(),
        strikeRate: $(cols[8]).text().trim(),
        highScore: $(cols[9]).text().trim(),
        fifty: $(cols[10]).text().trim(),
        hundred: $(cols[11]).text().trim(),
        fours: $(cols[12]).text().trim(),
        sixes: $(cols[13]).text().trim(),
      });
    }
  });

  return result;
};

export const BowlingStats = async (url: string) => {
  const $ = await GetHtml(url);
  const result: any[] = [];

  // Select table rows with class 'tsuccess' inside any div ending with '-bowling-stats'
  const tableRows = $("div[id$='-bowling-stats'] table tbody tr.tsuccess");

  tableRows.each((_, row) => {
    const cols = $(row).find("td");

    if (cols.length >= 13) {
      result.push({
        year: $(cols[0]).text().trim(),
        mode: $(cols[1]).text().trim(),
        matches: $(cols[2]).text().trim(),
        innings: $(cols[3]).text().trim(),
        balls: $(cols[4]).text().trim(),
        runs: $(cols[5]).text().trim(),
        wicket: $(cols[6]).text().trim(),
        strikeRate: $(cols[7]).text().trim(),
        twoWicket: $(cols[8]).text().trim(),
        threeWicket: $(cols[9]).text().trim(),
        fiveWicket: $(cols[10]).text().trim(),
        economy: $(cols[11]).text().trim(),
        average: $(cols[12]).text().trim(),
      });
    }
  });

  return result;
};

export const FantasyStats = async (url: string) => {
  const $ = await GetHtml(url);

  const container = $(
    "div[id$='dream11-points'], div[class*='dream11-points']"
  );
  const rows = container.find("tbody tr");

  const dream11Stats: any = [];

  if (!container.length) {
    console.warn("❌ Dream11 section not found in HTML.");
  }

  rows.each((_, row) => {
    const cols = $(row).find("td");

    if (cols.length < 6) return;

    const date = $(cols[0]).text().trim();
    const matchAnchor = $(cols[1]).find("a");
    const match = matchAnchor.text().trim();

    const bat = $(cols[2]).text().trim();
    const bowl = $(cols[3]).text().trim();
    const field = $(cols[4]).text().trim();
    const total = $(cols[5]).text().trim();

    dream11Stats.push({ date, match, bat, bowl, field, total });
  });

  return dream11Stats;
};

export const OverallStats = async (url: string) => {
  const match = url.match(/cricketer\/([^/]+)\//);
  const selectorName: any = match ? match[1] : null;

  const $ = await GetHtml(url);

  const playerData: any = {
    name: selectorName,
    batting: {},
    bowling: {},
    fielding: {},
  };
  // Dynamic selectors using the player's name
  const battingTableSelector = `#${selectorName}-batting tbody tr`;
  const bowlingTableSelector = `#${selectorName}-bowling tbody tr`;
  const fieldingTableSelector = `#${selectorName}-fielding tbody tr`;
  // Extract Batting Stats
  $(battingTableSelector).each(function () {
    const row = $(this);
    const statName = row.find("td").first().text().trim();

    // Skip the header rows
    if (statName === "Outtype" || statName === "Wicket Taker") return;

    const odi = row.find("td").eq(1).text().trim();
    const t20 = row.find("td").eq(2).text().trim();
    const ipl = row.find("td").eq(3).text().trim();

    playerData.batting[statName] = {
      ODI: odi,
      T20: t20,
      IPL: ipl,
    };
  });

  // Extract Bowling Stats
  $(bowlingTableSelector).each(function () {
    const row = $(this);
    const statName = row.find("td").first().text().trim();

    // Skip the header rows
    if (statName === "Batsman Type" || statName === "Wickets") return;

    const odi = row.find("td").eq(1).text().trim();
    const t20 = row.find("td").eq(2).text().trim();
    const ipl = row.find("td").eq(3).text().trim();

    playerData.bowling[statName] = {
      ODI: odi,
      T20: t20,
      IPL: ipl,
    };
  });

  // Extract Fielding Stats
  $(fieldingTableSelector).each(function () {
    const row = $(this);
    const statName = row.find("td").first().text().trim();

    const odi = row.find("td").eq(1).text().trim();
    const t20 = row.find("td").eq(2).text().trim();
    const ipl = row.find("td").eq(3).text().trim();

    playerData.fielding[statName] = {
      ODI: odi,
      T20: t20,
      IPL: ipl,
    };
  });

  return playerData;
};

export const StadiumStats = async (url: string) => {
  const stadiumSlug = url.split("/stadium/")[1]?.split("/")[0];
  const sectionId = `${stadiumSlug}-recent-matches`;
  const $ = await GetHtml(url);

  const matches: any = [];

  $(`#${sectionId} table tr`).each((i, row) => {
    if (i === 0) return; // Skip table header

    const columns = $(row).find("td");

    const dateLink = $(columns[0]).find("a");
    const date = dateLink.text().trim();
    const matchTitle = dateLink.attr("title") || "";
    const matchUrl = dateLink.attr("href") || "";

    const inn1 = $(columns[1])
      .html()
      ?.replace(/<br\s*\/?>/gi, " - ")
      .trim();
    const inn2 = $(columns[2])
      .html()
      ?.replace(/<br\s*\/?>/gi, " - ")
      .trim();

    matches.push({
      date,
      matchTitle,
      matchUrl: `https://advancecricket.com${matchUrl}`,
      inn1Score: inn1,
      inn2Score: inn2,
    });
  });

  return matches;
};

export const AgaintStadiumStats = async (
  url: string,
  filterStadium: string
) => {
  const $ = await GetHtml(url);

  const headingText = $("div.tab-pane h2").first().text().trim();
  const extractedPlayer = headingText.split(" Against")[0].trim();

  // Dynamically get batting and bowling tab pane IDs from hrefs
  const battingTabHref = $("a.nav-link:contains('Bat')").attr("href"); // e.g., "#virat-kohli-batting-stats"
  const bowlingTabHref = $("a.nav-link:contains('Bowl')").attr("href"); // e.g., "#virat-kohli-bowling-stats"

  const battingStats: any = [];
  $(`${battingTabHref} table tbody .tsuccess`).each((i, el) => {
    const cols = $(el).find("td");
    const stadium = $(cols[0]).text().trim();
    if (stadium.toLowerCase() === filterStadium.toLowerCase()) {
      battingStats.push({
        team: $(cols[1]).text().trim(),
        year: $(cols[2]).text().trim(),
        mode: $(cols[3]).text().trim(),
        matches: $(cols[4]).text().trim(),
        innings: $(cols[5]).text().trim(),
        runs: $(cols[6]).text().trim(),
        balls: $(cols[7]).text().trim(),
        no: $(cols[8]).text().trim(),
        avg: $(cols[9]).text().trim(),
        sr: $(cols[10]).text().trim(),
        hs: $(cols[11]).text().trim(),
        fifty: $(cols[12]).text().trim(),
        hundred: $(cols[13]).text().trim(),
        fours: $(cols[14]).text().trim(),
        sixes: $(cols[15]).text().trim(),
      });
    }
  });

  const bowlingStats: any = [];
  $(`${bowlingTabHref} table tbody .tsuccess`).each((i, el) => {
    const cols = $(el).find("td");
    const stadium = $(cols[0]).text().trim();
    if (stadium.toLowerCase() === filterStadium.toLowerCase()) {
      bowlingStats.push({
        team: $(cols[1]).text().trim(),
        year: $(cols[2]).text().trim(),
        mode: $(cols[3]).text().trim(),
        matches: $(cols[4]).text().trim(),
        innings: $(cols[5]).text().trim(),
        balls: $(cols[6]).text().trim(),
        runs: $(cols[7]).text().trim(),
        wickets: $(cols[8]).text().trim(),
        sr: $(cols[9]).text().trim(),
        twoWkts: $(cols[10]).text().trim(),
        threeWkts: $(cols[11]).text().trim(),
        fiveWkts: $(cols[12]).text().trim(),
        econ: $(cols[13]).text().trim(),
        avg: $(cols[14]).text().trim(),
      });
    }
  });

  return {
    player: extractedPlayer,
    stadium: filterStadium,
    battingStats,
    bowlingStats,
  };
};

export const AgaintTeamStats = async (url: string, filterOpponent: string) => {
  const $ = await GetHtml(url);

  const headingText = $("div.tab-pane h2").first().text().trim();
  const extractedPlayer = headingText.split(" Against")[0].trim();

  // Dynamically get batting and bowling tab pane IDs from hrefs
  const battingTabHref = $("a.nav-link:contains('Bat')").attr("href");
  const bowlingTabHref = $("a.nav-link:contains('Bowl')").attr("href");

  const battingStats: any[] = [];

  $(`${battingTabHref} table tbody .tsuccess`).each((i, el) => {
    const cols = $(el).find("td");
    const team = $(cols[0]).text().trim();
    if (team.toLowerCase() === filterOpponent.toLowerCase()) {
      battingStats.push({
        team: team,
        year: $(cols[1]).text().trim(),
        mode: $(cols[2]).text().trim(),
        matches: $(cols[3]).text().trim(),
        innings: $(cols[4]).text().trim(),
        runs: $(cols[5]).text().trim(),
        balls: $(cols[6]).text().trim(),
        no: $(cols[7]).text().trim(),
        avg: $(cols[8]).text().trim(),
        sr: $(cols[9]).text().trim(),
        hs: $(cols[10]).text().trim(),
        fifty: $(cols[11]).text().trim(),
        hundred: $(cols[12]).text().trim(),
        fours: $(cols[13]).text().trim(),
        sixes: $(cols[14]).text().trim(),
      });
    }
  });

  const bowlingStats: any[] = [];

  $(`${bowlingTabHref} table tbody .tsuccess`).each((i, el) => {
    const cols = $(el).find("td");
    const team = $(cols[0]).text().trim();
    if (team.toLowerCase() === filterOpponent.toLowerCase()) {
      bowlingStats.push({
        team: team,
        year: $(cols[1]).text().trim(),
        mode: $(cols[2]).text().trim(),
        matches: $(cols[3]).text().trim(),
        innings: $(cols[4]).text().trim(),
        balls: $(cols[5]).text().trim(),
        runs: $(cols[6]).text().trim(),
        wickets: $(cols[7]).text().trim(),
        sr: $(cols[8]).text().trim(),
        twoWkts: $(cols[9]).text().trim(),
        threeWkts: $(cols[10]).text().trim(),
        fiveWkts: $(cols[11]).text().trim(),
        econ: $(cols[12]).text().trim(),
        avg: $(cols[13]).text().trim(),
      });
    }
  });

  return {
    player: extractedPlayer,
    againstTeams: filterOpponent,
    battingStats,
    bowlingStats,
  };
};
