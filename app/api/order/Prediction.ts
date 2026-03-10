export const Prediction = (data: any): any => {
  const matchData = data;

  // Helper function to get team players (playing XI or bench)
  const getTeamPlayers = (teamName: string): any[] => {
    const team = matchData.squads?.find((t: any) => t.teamName === teamName);
    if (!team) return [];

    // Use playingPlayers if available (length > 0), otherwise use benchPlayers
    return team.playingPlayers?.length > 0
      ? team.playingPlayers
      : team.benchPlayers || [];
  };

  // Get both teams' players
  const slPlayers = getTeamPlayers("SL");
  const nzPlayers = getTeamPlayers("NZ");

  // Calculate batting average from recent scores
  const calculateBattingAverage = (player: any): number => {
    if (!player.recentForm?.batting?.length) return 0;

    const scores = player.recentForm.batting
      .map((b) => {
        const score = b.score.split(" ")[0];
        return score === "DNB" ? 0 : parseInt(score) || 0;
      })
      .filter((s) => s > 0);

    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s, 0);
    return Math.round((total / scores.length) * 10) / 10;
  };

  // Calculate strike rate
  const calculateStrikeRate = (player: any): number => {
    if (!player.recentForm?.batting?.length) return 0;

    let totalRuns = 0;
    let totalBalls = 0;

    player.recentForm.batting.forEach((b) => {
      const match = b.score.match(/(\d+)\s*\((\d+)\)/);
      if (match) {
        totalRuns += parseInt(match[1]);
        totalBalls += parseInt(match[2]);
      }
    });

    if (totalBalls === 0) return 0;
    return Math.round((totalRuns / totalBalls) * 100);
  };

  // Calculate bowling economy
  const calculateEconomy = (player: any): number => {
    if (!player.recentForm?.bowling?.length) return 0;

    let totalRuns = 0;
    let totalOvers = 0;

    player.recentForm.bowling.forEach((b) => {
      const figures = b.score.split("-");
      if (figures.length === 2) {
        const runs = parseInt(figures[1]) || 0;
        totalRuns += runs;
        totalOvers += 1; // Assuming each spell is 1 over for calculation
      }
    });

    if (totalOvers === 0) return 0;
    return Math.round((totalRuns / totalOvers) * 10) / 10;
  };

  // Calculate total wickets
  const calculateWickets = (player: any): number => {
    if (!player.recentForm?.bowling?.length) return 0;

    return player.recentForm.bowling.reduce((total, b) => {
      const wickets = parseInt(b.score.split("-")[0]) || 0;
      return total + wickets;
    }, 0);
  };

  // Get top batsman with detailed stats
  const getTopBatsman = (players: any[], teamName: string) => {
    if (!players.length) {
      return {
        name: "N/A",
        recentScore: "No data",
        average: 0,
        strikeRate: 0,
      };
    }

    // Filter batsmen and all-rounders
    const batsmen = players.filter(
      (p) =>
        p.role === "Batter" ||
        p.role === "All Rounder" ||
        p.role === "WicketKeeper Batter",
    );

    if (!batsmen.length) {
      return {
        name: players[0]?.shortName || "N/A",
        recentScore: players[0]?.recentForm?.batting?.[0]?.score || "No data",
        average: calculateBattingAverage(players[0]),
        strikeRate: calculateStrikeRate(players[0]),
      };
    }

    // Score players based on recent form, average, and rankings
    const scoredBatsmen = batsmen.map((player) => {
      const recentScore = player.recentForm?.batting?.[0]?.score || "0 (0)";
      const recentRuns = parseInt(recentScore.split(" ")[0]) || 0;
      const average = calculateBattingAverage(player);
      const strikeRate = calculateStrikeRate(player);

      // Calculate score (weighted)
      let score = recentRuns * 2; // Recent form weight
      score += average * 1.5; // Average weight
      score += strikeRate * 0.5; // Strike rate weight

      // Ranking bonus
      if (player.rank) {
        const battingRanks = player.rank.filter((r) => r.includes("Batter"));
        if (battingRanks.length > 0) {
          const rankValue = parseInt(
            battingRanks[0].match(/\d+/)?.[0] || "100",
          );
          score += (100 - rankValue) * 0.5;
        }
      }

      return {
        player,
        score,
        recentScore,
        average,
        strikeRate,
      };
    });

    const top = scoredBatsmen.sort((a, b) => b.score - a.score)[0];

    return {
      name: top.player.shortName || top.player.name,
      recentScore: top.recentScore,
      average: top.average,
      strikeRate: top.strikeRate,
    };
  };

  // Get top bowler with detailed stats
  const getTopBowler = (players: any[], teamName: string) => {
    if (!players.length) {
      return {
        name: "N/A",
        recentFigures: "No data",
        economy: 0,
        wickets: 0,
      };
    }

    // Filter bowlers and all-rounders
    const bowlers = players.filter(
      (p) => p.role === "Bowler" || p.role === "All Rounder",
    );

    if (!bowlers.length) {
      return {
        name: players[0]?.shortName || "N/A",
        recentFigures: players[0]?.recentForm?.bowling?.[0]?.score || "No data",
        economy: calculateEconomy(players[0]),
        wickets: calculateWickets(players[0]),
      };
    }

    // Score bowlers based on recent form and wickets
    const scoredBowlers = bowlers.map((player) => {
      const recentFigures = player.recentForm?.bowling?.[0]?.score || "0-0";
      const recentWickets = parseInt(recentFigures.split("-")[0]) || 0;
      const totalWickets = calculateWickets(player);
      const economy = calculateEconomy(player);

      // Calculate score (weighted)
      let score = recentWickets * 5; // Recent wickets weight
      score += totalWickets * 2; // Total wickets weight
      score += (10 - economy) * 2; // Better economy = higher score

      // Ranking bonus
      if (player.rank) {
        const bowlerRanks = player.rank.filter((r) => r.includes("Bowler"));
        if (bowlerRanks.length > 0) {
          const rankValue = parseInt(bowlerRanks[0].match(/\d+/)?.[0] || "100");
          score += 100 - rankValue;
        }
      }

      return {
        player,
        score,
        recentFigures,
        economy,
        wickets: totalWickets,
      };
    });

    const top = scoredBowlers.sort((a, b) => b.score - a.score)[0];

    return {
      name: top.player.shortName || top.player.name,
      recentFigures: top.recentFigures,
      economy: top.economy,
      wickets: top.wickets,
    };
  };

  // Calculate winning percentage with dynamic factors
  const calculateWinningPercentage = (team: string) => {
    const comparison = matchData.comparision?.comparison;
    if (!comparison) return 50;

    const overall = comparison.overall;
    const venue = comparison.venue;

    // Get win percentages
    const slWinOverall = parseInt(
      overall.find((c: any) => c.metric === "Win")?.team1 || "0",
    );
    const nzWinOverall = parseInt(
      overall.find((c: any) => c.metric === "Win")?.team2 || "0",
    );

    // Get venue stats
    const slVenueWin = parseInt(
      venue.find((c: any) => c.metric === "Win")?.team1 || "0",
    );
    const nzVenueWin = parseInt(
      venue.find((c: any) => c.metric === "Win")?.team2 || "0",
    );

    // Get recent form
    const slForm =
      matchData.teamForm?.find((t) => t.teamId === "SL")?.last5 || [];
    const nzForm =
      matchData.teamForm?.find((t) => t.teamId === "NZ")?.last5 || [];

    const slFormWins = slForm.filter((r) => r === "W").length;
    const nzFormWins = nzForm.filter((r) => r === "W").length;

    const slFormPercentage = (slFormWins / Math.max(slForm.length, 1)) * 100;
    const nzFormPercentage = (nzFormWins / Math.max(nzForm.length, 1)) * 100;

    // Calculate team strengths based on player rankings
    const slTeamStrength = calculateTeamStrength(slPlayers);
    const nzTeamStrength = calculateTeamStrength(nzPlayers);

    // Weighted calculation
    const slWeighted =
      slWinOverall * 0.25 +
      slVenueWin * 0.2 +
      slFormPercentage * 0.25 +
      slTeamStrength * 0.3;

    const nzWeighted =
      nzWinOverall * 0.25 +
      nzVenueWin * 0.2 +
      nzFormPercentage * 0.25 +
      nzTeamStrength * 0.3;

    const total = slWeighted + nzWeighted;

    return {
      sl: Math.round((slWeighted / total) * 100) || 50,
      nz: Math.round((nzWeighted / total) * 100) || 50,
    };
  };

  // Calculate team strength based on player rankings
  const calculateTeamStrength = (players: any[]): number => {
    if (!players.length) return 50;

    let totalScore = 0;
    players.forEach((player) => {
      let playerScore = 70; // Base score

      if (player.rank) {
        player.rank.forEach((rank) => {
          const rankMatch = rank.match(/#(\d+)/);
          if (rankMatch) {
            const rankNum = parseInt(rankMatch[1]);
            playerScore += Math.max(0, (100 - rankNum) * 0.5);
          }
        });
      }

      // Add recent form bonus
      if (player.recentForm?.batting?.length > 0) {
        const lastScore = player.recentForm.batting[0].score;
        const runs = parseInt(lastScore.split(" ")[0]) || 0;
        playerScore += runs * 0.5;
      }

      if (player.recentForm?.bowling?.length > 0) {
        const lastFigures = player.recentForm.bowling[0].score;
        const wickets = parseInt(lastFigures.split("-")[0]) || 0;
        playerScore += wickets * 5;
      }

      totalScore += playerScore;
    });

    return totalScore / players.length;
  };

  // Get first innings score prediction
  const getFirstInningsScore = (team: string): number => {
    const comparison = matchData.comparision?.comparison;
    if (!comparison) return team === "SL" ? 160 : 170;

    const overall = comparison.overall;
    const venue = comparison.venue;

    const avgScoreOverall =
      team === "SL"
        ? parseInt(
            overall.find((c) => c.metric === "Avg Score")?.team1 || "155",
          )
        : parseInt(
            overall.find((c) => c.metric === "Avg Score")?.team2 || "188",
          );

    const avgScoreVenue =
      team === "SL"
        ? parseInt(venue.find((c) => c.metric === "Avg Score")?.team1 || "135")
        : parseInt(venue.find((c) => c.metric === "Avg Score")?.team2 || "159");

    const highestScore =
      team === "SL"
        ? parseInt(
            overall.find((c) => c.metric === "Highest Score")?.team1 || "225",
          )
        : parseInt(
            overall.find((c) => c.metric === "Highest Score")?.team2 || "225",
          );

    // Weighted average (60% overall, 40% venue)
    const predicted = Math.round(avgScoreOverall * 0.6 + avgScoreVenue * 0.4);

    // Adjust based on recent form
    const recentForm =
      matchData.teamForm?.find(
        (t) => t.teamId === (team === "SL" ? "SL" : "NZ"),
      )?.last5 || [];

    const recentWins = recentForm.filter((r) => r === "W").length;
    const formBonus = recentWins * 2; // Add 2 runs per recent win

    return Math.min(predicted + formBonus, highestScore);
  };

  // Calculate head to head stats
  const getHeadToHead = (team: string) => {
    const comparison = matchData.comparision?.comparison;
    if (!comparison) {
      return {
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        winPercentage: 0,
      };
    }

    const overall = comparison.overall;
    const matchesPlayed = parseInt(
      overall.find((c) => c.metric === "Matches Played")?.team1 || "0",
    );
    const winPercentage =
      team === "SL"
        ? parseInt(overall.find((c) => c.metric === "Win")?.team1 || "0")
        : parseInt(overall.find((c) => c.metric === "Win")?.team2 || "0");

    const wins = Math.round((winPercentage / 100) * matchesPlayed);

    return {
      matchesPlayed,
      wins,
      losses: matchesPlayed - wins,
      winPercentage,
    };
  };

  // Generate key battles
  const generateKeyBattles = () => {
    const slTopBowler = getTopBowler(slPlayers, "SL");
    const nzTopBowler = getTopBowler(nzPlayers, "NZ");
    const slTopBatsman = getTopBatsman(slPlayers, "SL");
    const nzTopBatsman = getTopBatsman(nzPlayers, "NZ");

    const battles = [
      {
        batsman: nzTopBatsman.name,
        bowler: slTopBowler.name,
        advantage: slTopBowler.wickets > 5 ? "Bowler" : "Batsman",
      },
      {
        batsman: slTopBatsman.name,
        bowler: nzTopBowler.name,
        advantage: nzTopBowler.wickets > 5 ? "Bowler" : "Batsman",
      },
    ];

    return battles;
  };

  // Main calculation
  const winningPercentage = calculateWinningPercentage("SL");
  const slTopBatsman = getTopBatsman(slPlayers, "SL");
  const nzTopBatsman = getTopBatsman(nzPlayers, "NZ");
  const slTopBowler = getTopBowler(slPlayers, "SL");
  const nzTopBowler = getTopBowler(nzPlayers, "NZ");
  const slHeadToHead = getHeadToHead("SL");
  const nzHeadToHead = getHeadToHead("NZ");

  // Get venue from match info or default
  const venue = matchData.matchInfo?.matchDescription?.includes("Super 8")
    ? "Super 8 Ground"
    : "International Stadium";

  return {
    matchInfo: {
      name: matchData.matchInfo?.matchName || "Match Prediction",
      format: matchData.matchInfo?.format || "T20",
      venue: venue,
    },
    teams: {
      SL: {
        name: "Sri Lanka",
        shortName: "SL",
        logo: matchData.comparision?.teams?.team1?.logo || "",
        winningPercentage: winningPercentage.sl,
        predictedFirstInningsScore: getFirstInningsScore("SL"),
        topBatsman: slTopBatsman,
        topBowler: slTopBowler,
        recentForm:
          matchData.teamForm?.find((t) => t.teamId === "SL")?.last5 || [],
        headToHead: slHeadToHead,
      },
      NZ: {
        name: "New Zealand",
        shortName: "NZ",
        logo: matchData.comparision?.teams?.team2?.logo || "",
        winningPercentage: winningPercentage.nz,
        predictedFirstInningsScore: getFirstInningsScore("NZ"),
        topBatsman: nzTopBatsman,
        topBowler: nzTopBowler,
        recentForm:
          matchData.teamForm?.find((t) => t.teamId === "NZ")?.last5 || [],
        headToHead: nzHeadToHead,
      },
    },
    matchPrediction: {
      tossAdvantage:
        winningPercentage.sl > winningPercentage.nz
          ? "Batting first"
          : "Chasing",
      chasingWins: 60, // These would come from actual stats if available
      defendingWins: 40,
      averageFirstInnings: Math.round(
        (getFirstInningsScore("SL") + getFirstInningsScore("NZ")) / 2,
      ),
      averageSecondInnings: Math.round(
        ((getFirstInningsScore("SL") + getFirstInningsScore("NZ")) / 2) * 0.9,
      ), // 10% lower for 2nd innings
    },
    keyBattles: generateKeyBattles(),
  };
};
