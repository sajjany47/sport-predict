import { GetHtml } from "@/lib/utils";

export const AdvanceCricketList = async () => {
  const $ = await GetHtml(
    "https://advancecricket.com/upcoming-cricket-matches"
  );

  const matches: any[] = [];

  $(".carousel-item .card").each((_, card) => {
    const $card = $(card);

    // full stats (from main <a>)
    const fullStats = $card.find("a").attr("href")?.trim() || "";

    // league/match name
    const leageName = $card.find("b.font-14").last().text().trim() || "";

    // team short names
    const shortNames = $card
      .find(".mainhead")
      .map((_, el) => $(el).text().trim())
      .get();

    // team full names (bottom row)
    const teamNames = $card
      .find(".d-flex.justify-content-between b")
      .map((_, el) => $(el).text().trim())
      .get();

    // simple records link (from footer first <a>)
    const simpleRecord =
      $card.find(".card-footer a").attr("href")?.trim() || "";

    matches.push({
      fullStats,
      leageName: leageName,
      team1: { shortName: shortNames[0], name: teamNames[0] },
      team2: { shortName: shortNames[1], name: teamNames[1] },
      simpleRecord,
    });
  });

  return matches;
};
