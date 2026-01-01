import { GetHtml } from "@/lib/utils";

export const CrexDetails = async (url: string): Promise<any> => {
  const $: any = await GetHtml(url);

  /* =====================================================
     1️⃣ TEAMS (DYNAMIC) + RECENT 5 MATCHES
  ====================================================== */

  const teams: Record<string, any> = {};

  $(".format-match-exp").each((_, el) => {
    const teamId = $(el).attr("id");
    const header = $(el).prev(".format-match");

    if (!teamId) return;

    teams[teamId] = {
      teamId,
      teamName: header.find(".form-team-name").text().trim(),
      teamFlag: header.find(".form-team-img").attr("src"),
      recent5: [],
    };
  });

  const getTeamRecentMatches = (teamId: string) => {
    const matches: any[] = [];

    $(`#${teamId} a.team-form-card`).each((_, el) => {
      const teamScores: any[] = [];

      $(el)
        .find(".form-team-detail")
        .each((_, t) => {
          teamScores.push({
            team: $(t).find(".team-name").text().trim(),
            score: $(t).find(".team-score").text().trim(),
            overs: $(t).find(".team-over").text().trim(),
            flag: $(t).find("img").attr("src"),
          });
        });

      matches.push({
        matchName: $(el).find(".match-name").text().trim(),
        series: $(el).find(".series-name").text().trim(),
        result: $(el).find(".win.match span, .loss.match span").text().trim(),
        teams: teamScores,
        url: "https://crex.com" + $(el).attr("href"),
      });
    });

    return matches.slice(0, 5);
  };

  Object.keys(teams).forEach((teamId) => {
    teams[teamId].recent5 = getTeamRecentMatches(teamId);
  });

  /* =====================================================
     2️⃣ HEAD TO HEAD (LAST MATCHES)
  ====================================================== */

  const h2h: any[] = [];

  $(".global-match-card.gmc-without-logo").each((_, el) => {
    h2h.push({
      team1: {
        name: $(el).find(".global-match-team .team-name").first().text().trim(),
        score: $(el)
          .find(".global-match-team .team-score")
          .first()
          .text()
          .trim(),
        overs: $(el)
          .find(".global-match-team .team-over")
          .first()
          .text()
          .trim(),
      },
      team2: {
        name: $(el).find(".global-match-end .team-name").text().trim(),
        score: $(el).find(".global-match-end .team-score").text().trim(),
        overs: $(el).find(".global-match-end .team-over").text().trim(),
      },
      result: $(el).find(".match-dec-text").text().trim(),
      series: $(el).find(".series-name").text().trim(),
      url: "https://crex.com" + $(el).attr("href"),
    });
  });

  /* =====================================================
     3️⃣ POINTS TABLE
  ====================================================== */

  const pointsTable: any[] = [];

  $("#table tbody tr").each((_, row) => {
    const td = $(row).find("td");
    if (td.length < 6) return;

    pointsTable.push({
      team: $(td[0]).text().trim(),
      flag: $(td[0]).find("img").attr("src"),
      played: $(td[1]).text().trim(),
      won: $(td[2]).text().trim(),
      lost: $(td[3]).text().trim(),
      nrr: $(td[4]).text().trim(),
      points: $(td[5]).text().trim(),
    });
  });

  /* =====================================================
     4️⃣ TEAM COMPARISON (LAST 10 – OVERALL)
  ====================================================== */

  const teamComparison: any[] = [];

  $(".table.colHeader tbody tr").each((_, row) => {
    teamComparison.push({
      team1: $(row).find("td").first().text().trim(),
      metric: $(row).find("td").eq(1).text().trim(),
      team2: $(row).find("td").last().text().trim(),
    });
  });

  /* =====================================================
     5️⃣ WEATHER DETAILS
  ====================================================== */

  const weather = {
    venue: $(".weather-place-hum-text").first().text().trim(),
    temperature: $(".weather-temp").text().trim(),
    condition: $(".weather-cloudy-text").first().text().trim(),
    humidity: $(".humidity-text").text().trim(),
    rainChance: $(".weather-place-hum-text").last().text().trim(),
  };

  /* =====================================================
     6️⃣ VENUE STATS
  ====================================================== */

  const venueStats = {
    matches: $(".match-count").text().trim(),
    winBatFirst: $(".win-bat-first .match-win-per").text().trim(),
    winBowlFirst: $(".venue-per .match-win-per").last().text().trim(),
    avg1stInns: $(".venue-avg-val").first().text().trim(),
    avg2ndInns: $(".venue-avg-val").last().text().trim(),
  };

  /* =====================================================
     7️⃣ PACE vs SPIN (LAST 10)
  ====================================================== */

  const paceVsSpin = {
    paceWickets: $(".pace-text").first().next(".wicket-count").text().trim(),
    spinWickets: $(".red-color").text().trim(),
    pacePercent: $(".s-format").first().text().trim(),
    spinPercent: $(".s-format").last().text().trim(),
  };

  /* =====================================================
     8️⃣ RECENT MATCHES ON VENUE
  ====================================================== */

  const venueRecentMatches: any[] = [];

  $(".global-match-card:not(.gmc-without-logo)").each((_, el) => {
    venueRecentMatches.push({
      team1: $(el).find(".global-match-team .team-name").text().trim(),
      team1Score: $(el).find(".global-match-team .team-score").text().trim(),
      team2: $(el).find(".global-match-end .team-name").text().trim(),
      team2Score: $(el).find(".global-match-end .team-score").text().trim(),
      result: $(el).find(".match-dec-text").text().trim(),
      series: $(el).find(".series-name").text().trim(),
      url: "https://crex.com" + $(el).attr("href"),
    });
  });

  /* =====================================================
     8️⃣ Squad Details (IF AVAILABLE)
  ====================================================== */

  const extractPlayer = (el: any) => ({
    name: $(el).find(".p-name").text().trim(),
    image: $(el).find("img").first().attr("src") || "",
    role: $(el).find(".bat-ball-type div").text().trim(),
    url: "https://crex.com" + $(el).attr("href"),
  });

  const squadList: any[] = [];

  // Team buttons (JSK / DSG)
  $(".playingxi-button").each((index, btn) => {
    const shortName = $(btn).text().trim();

    // Team flag & full name
    const teamHeader = $(".form-match-team")
      .filter((_, el) =>
        $(el).find(".form-team-name").text().includes(shortName)
      )
      .first();

    const teamFlag = teamHeader.find(".form-team-img").attr("src") || null;

    const teamName =
      teamHeader.find(".form-team-name").text().trim() || shortName;

    // Players block
    const playerBlock = $(".playingxi-card").eq(index);
    const players = playerBlock.find(".playingxi-card-row a");

    const playingPlayer: any[] = [];
    const benchPlayer: any[] = [];

    players.each((i, el) => {
      const player = extractPlayer(el);

      // First 11 → Playing XI
      if (i < 11) {
        playingPlayer.push(player);
      } else {
        benchPlayer.push(player);
      }
    });

    squadList.push({
      flag: teamFlag,
      color: null,
      name: teamName,
      shortName,
      playingPlayer,
      benchPlayer,
    });
  });

  /* =====================================================
     ✅ FINAL RESPONSE
  ====================================================== */

  return {
    teams,
    h2h,
    pointsTable,
    teamComparison,
    weather,
    venueStats,
    paceVsSpin,
    venueRecentMatches,
    squadList,
  };
};
