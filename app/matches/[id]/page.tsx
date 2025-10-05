/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Calendar,
  MapPin,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
  ArrowLeft,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Shield,
  Gauge,
  CloudRain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import axios from "axios";
import SquadDialoge from "./SquadDialoge";
import CustomLoader from "@/components/ui/CustomLoader";
import AIPredictionModal from "./ai-prediction-modal";
import { MatchData } from "@/types/ui";
import { DummyData } from "@/lib/DummyData";
import { ParseScore } from "@/lib/utils";

const MatchDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { selectedMatch } = useSelector((state: RootState) => state.matches);
  // const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [matchData, setMatchData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     if (params.id) {
  //       const details = await axios.post(
  //         "/api/match-details",
  //         {
  //           matchId: Number(params.id),
  //           venue: selectedMatch?.venue,
  //           team: selectedMatch?.teams.map((item) => ({
  //             name: item.teamName,
  //             shortName: item.teamShortName,
  //             flagUrl: item.teamFlagUrl,
  //           })),
  //         },
  //         { headers: { "Content-Type": "application/json" } }
  //       );

  //       setMatchData({
  //         ...details.data.data,
  //         matchInfo: {
  //           ...selectedMatch,
  //         },
  //       });
  //     } else {
  //       setMatchData(null);
  //     }
  //   };
  //   fetchDetails();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params.id]);

  useEffect(() => {
    setMatchData({
      ...DummyData,
      matchInfo: {
        ...selectedMatch,
      },
    });
  }, []);

  const handleGetPrediction = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (!user || user.credits < 1) {
      router.push("/subscription");
      return;
    }
    setIsPredictionModalOpen(true);
  };

  const getFormIcon = (result: string) => {
    if (result.includes("won") || result.includes("beat")) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getFormColor = (result: string, teamName: string) => {
    if (
      result.includes(teamName + " beat") ||
      result.includes(teamName + " won")
    ) {
      return "bg-green-500";
    } else {
      return "bg-red-500";
    }
  };

  const formatScore = (scores: any) => {
    return scores
      .map((score: any) => `${score.runs}/${score.wickets} (${score.overs})`)
      .join(" & ");
  };

  const calculateH2HStats = (h2hMatches: any[]) => {
    if (!h2hMatches || h2hMatches.length === 0) {
      return [
        { label: "Team A", wins: 0 },
        { label: "Team B", wins: 0 },
        { label: "Total", wins: 0 },
        { label: "No Result", wins: 0 },
      ];
    }

    const findTeam1Name = selectedMatch?.teams.find(
      (item: any) =>
        item.teamShortName.toLowerCase() ===
        h2hMatches[0]?.team1?.name.toLowerCase()
    );
    const findTeam2Name = selectedMatch?.teams.find(
      (item: any) =>
        item.teamShortName.toLowerCase() ===
        h2hMatches[0]?.team2?.name.toLowerCase()
    );
    const team1 = findTeam1Name?.teamName;
    const team2 = findTeam2Name?.teamName;

    let team1Wins = 0;
    let team2Wins = 0;
    let noResult = 0;

    for (const match of h2hMatches) {
      if (match.result.toLowerCase().includes("abandoned")) {
        noResult++;
        continue;
      }

      const t1 = ParseScore(match.team1.score);
      const t2 = ParseScore(match.team2.score);

      if (!t1 || !t2) {
        noResult++;
        continue;
      }

      if (t1.runs > t2.runs) team1Wins++;
      else if (t2.runs > t1.runs) team2Wins++;
      else {
        // If runs equal, compare wickets (fewer wickets wins)
        if (t1.wickets < t2.wickets) team1Wins++;
        else if (t2.wickets < t1.wickets) team2Wins++;
      }
    }

    return [
      { label: team1, wins: team1Wins },
      { label: team2, wins: team2Wins },
      { label: "Total", wins: h2hMatches.length },
      { label: "No Result", wins: noResult },
    ];
  };

  const calculateWinRate = (matches: any[], teamName: string) => {
    if (!matches || matches.length === 0) return 0;

    const validMatches = matches.filter(
      (match) =>
        !match.result.includes("Abandoned") &&
        !match.result.includes("Match Abandoned")
    );

    if (validMatches.length === 0) return 0;

    const wins = validMatches.filter(
      (match) =>
        match.result.includes(teamName) &&
        (match.result.includes("beat") || match.result.includes("won"))
    ).length;

    return Math.round((wins / validMatches.length) * 100);
  };

  const calculateRecentWins = (matches: any[], teamName: string) => {
    if (!matches) return 0;
    return matches
      .slice(0, 10)
      .filter(
        (match) =>
          match.result.includes(teamName) &&
          (match.result.includes("beat") || match.result.includes("won")) &&
          !match.result.includes("Abandoned")
      ).length;
  };

  const getDominantTeam = (h2hMatches: any[]) => {
    const stats = calculateH2HStats(h2hMatches);
    return stats[0].wins > stats[1].wins ? stats[0].team : stats[1].team;
  };

  const getPitchAdvantage = (pitchType: string) => {
    switch (pitchType?.toLowerCase()) {
      case "batting":
        return "batsmen";
      case "bowling":
        return "bowlers";
      default:
        return "both teams";
    }
  };

  const getRecentMatchesWithScores = (team: any, teamName: string) => {
    if (!team?.matches) return [];

    const prepareData = team.matches.map((match: any) => {
      const findTeamShortName = selectedMatch?.teams.find(
        (item: any) => item.teamName === teamName
      )?.teamShortName;
      const team1Score = ParseScore(match.team1?.score);
      const team2Score = ParseScore(match.team2?.score);
      if (match.result.toLowerCase().includes("abandoned")) {
        return { ...match, winner: "A" };
      }
      if (!team1Score || !team2Score) {
        return { ...match, winner: "A" };
      }
      if (team1Score.runs > team2Score.runs) {
        return {
          ...match,
          winner:
            match.team1?.name.toLowerCase() ===
            findTeamShortName?.toLocaleLowerCase()
              ? "W"
              : "L",
        };
      } else if (team2Score.runs > team1Score.runs) {
        return {
          ...match,
          winner:
            match.team2?.name.toLowerCase() ===
            findTeamShortName?.toLocaleLowerCase()
              ? "W"
              : "L",
        };
      } else {
        // If runs equal, compare wickets (fewer wickets wins)
        if (team1Score.wickets < team2Score.wickets) {
          return {
            ...match,
            winner:
              match.team1?.name.toLowerCase() ===
              findTeamShortName?.toLocaleLowerCase()
                ? "W"
                : "L",
          };
        } else if (team2Score.wickets < team1Score.wickets) {
          return {
            ...match,
            winner:
              match.team2?.name.toLowerCase() ===
              findTeamShortName?.toLocaleLowerCase()
                ? "W"
                : "L",
          };
        }
      }
    });
    console.log(prepareData);

    return prepareData;

    // return team.matches.slice(0, 10).map((match) => ({
    //   ...match,
    //   teamScore:
    //     match.team1?.name === team.teamName
    //       ? match.team1?.score
    //       : match.team2?.score,
    //   opponentScore:
    //     match.team1?.name === team.teamName
    //       ? match.team2?.score
    //       : match.team1?.score,
    //   isWin:
    //     match.result.includes(team.teamName) &&
    //     (match.result.includes("beat") || match.result.includes("won")),
    //   isAbandoned: match.result.includes("Abandoned"),
    // }));
  };

  const getRecentH2HMatches = (h2hMatches: any[]) => {
    if (!h2hMatches) return [];
    return h2hMatches.slice(0, 5).map((match) => ({
      ...match,
      winner: match.result.includes("Abandoned")
        ? "Abandoned"
        : match.result.includes(match.team1.name)
        ? match.team1.name
        : match.result.includes(match.team2.name)
        ? match.team2.name
        : "Unknown",
    }));
  };

  return (
    <>
      {matchData ? (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Matches
              </Button>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <Badge className="mb-2">{matchData.matchInfo.format}</Badge>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {matchData.matchInfo.matchName}
                    </h1>
                    <p className="text-gray-600">
                      {matchData.matchInfo.matchDescription}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button
                      onClick={handleGetPrediction}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Get AI Prediction
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-center space-x-8 mb-6">
                  {matchData?.matchInfo?.teams?.map((team, index) => (
                    <div key={team.squadId} className="text-center">
                      <div
                        className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-4"
                        style={{ borderColor: team.color }}
                      >
                        <img
                          src={team.teamFlagUrl}
                          alt={team.teamName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {team.teamShortName}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Match Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      {new Date(
                        matchData.matchInfo.startTime
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      {new Date(
                        matchData.matchInfo.startTime
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      {matchData.matchInfo.venue}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="squads">Squads</TabsTrigger>
                <TabsTrigger value="stadium">Stadium Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Form Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>Current Form</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="flex space-x-1 mb-2">
                            {getRecentMatchesWithScores(
                              matchData.overview.fullStats.team1,
                              matchData.overview.fullStats.team1.teamName
                            )
                              .slice(0, 7)
                              .map((match: any, index: any) => (
                                <div
                                  key={index}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                    match.winner === "W"
                                      ? "bg-green-500"
                                      : match.winner === "A"
                                      ? "bg-gray-400"
                                      : "bg-red-500"
                                  }`}
                                >
                                  {match.winner}
                                </div>
                              ))}
                          </div>
                          <p className="text-xs text-gray-600">
                            {matchData.overview.fullStats.team1.teamName}
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex space-x-1 mb-2">
                            {getRecentMatchesWithScores(
                              matchData.overview.fullStats.team2,
                              matchData.overview.fullStats.team2.teamName
                            )
                              .slice(0, 7)
                              .map((match: any, index: any) => (
                                <div
                                  key={index}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                    match.winner === "W"
                                      ? "bg-green-500"
                                      : match.winner === "A"
                                      ? "bg-gray-400"
                                      : "bg-red-500"
                                  }`}
                                >
                                  {match.winner}
                                </div>
                              ))}
                          </div>
                          <p className="text-xs text-gray-600">
                            {matchData.overview.fullStats.team2.teamName}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* H2H Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>Head to Head</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        {calculateH2HStats(
                          matchData.overview.fullStats.h2h
                        ).map((stat, index) => (
                          <div key={index} className="text-center">
                            <div
                              className={`text-lg font-bold ${
                                stat.label === "No Result"
                                  ? "text-yellow-500"
                                  : stat.label === "Total"
                                  ? "text-gray-700"
                                  : "text-blue-600"
                              }`}
                            >
                              {stat.wins}
                            </div>
                            <div className="text-xs text-gray-600">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Venue Stats */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>Venue Insight</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            Pitch Type
                          </span>
                          <span className="text-sm font-semibold">
                            {matchData?.overview.groundAndWheather?.pitchType ||
                              "Balanced"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            Avg. Score
                          </span>
                          <span className="text-sm font-semibold">
                            {matchData?.overview.groundAndWheather?.avgScore ||
                              "160-180"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            Conditions
                          </span>
                          <span className="text-sm font-semibold">
                            {matchData?.overview.groundAndWheather
                              ?.wheatherType || "Clear"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Team Performance Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      <span>Team Performance Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        matchData.overview.fullStats.team1,
                        matchData.overview.fullStats.team2,
                      ].map((team, index) => (
                        <div key={team.teamName} className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={team.flagUrl}
                              alt={team.teamName}
                              className="w-10 h-10 rounded-full border-2 border-gray-200"
                            />
                            <div>
                              <h3 className="font-semibold">{team.teamName}</h3>
                              <p className="text-sm text-gray-600">
                                Last 10 Matches
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">
                                  Win Rate
                                </span>
                                <span className="font-semibold text-green-600">
                                  {calculateWinRate(
                                    team.matches?.slice(0, 10),
                                    team.teamName
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${calculateWinRate(
                                      team.matches?.slice(0, 10),
                                      team.teamName
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">
                                  {calculateRecentWins(
                                    team.matches,
                                    team.teamName
                                  )}
                                </p>
                                <p className="text-xs text-gray-600">Wins</p>
                              </div>
                              <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">
                                  {10 -
                                    calculateRecentWins(
                                      team.matches,
                                      team.teamName
                                    )}
                                </p>
                                <p className="text-xs text-gray-600">Losses</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Matches for Both Teams */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span>Recent Matches</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        matchData.overview.fullStats.team1,
                        matchData.overview.fullStats.team2,
                      ].map((team, index) => (
                        <div key={team.teamName} className="space-y-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <img
                              src={team.flagUrl}
                              alt={team.teamName}
                              className="w-8 h-8 rounded-full"
                            />
                            <h3 className="font-semibold text-lg">
                              {team.teamName}
                            </h3>
                          </div>

                          <div className="space-y-3">
                            {getRecentMatchesWithScores(team).map(
                              (match, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-50 rounded-lg border-l-4"
                                  style={{
                                    borderLeftColor: match.isWin
                                      ? "#10B981"
                                      : match.isAbandoned
                                      ? "#6B7280"
                                      : "#EF4444",
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm text-gray-900">
                                        {match.match}
                                      </p>
                                      <p className="text-xs text-gray-600 mt-1">
                                        {match.result}
                                      </p>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        match.isWin
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : match.isAbandoned
                                          ? "bg-gray-50 text-gray-700 border-gray-200"
                                          : "bg-red-50 text-red-700 border-red-200"
                                      }`}
                                    >
                                      {match.isWin
                                        ? "W"
                                        : match.isAbandoned
                                        ? "A"
                                        : "L"}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-gray-600">
                                        {match.team1.name}:{" "}
                                      </span>
                                      <span className="font-medium">
                                        {match.team1.score}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        {match.team2.name}:{" "}
                                      </span>
                                      <span className="font-medium">
                                        {match.team2.score}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent H2H Matches */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span>Recent Head to Head Matches</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getRecentH2HMatches(
                        matchData.overview.fullStats.h2h
                      ).map((match, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border-l-4"
                          style={{
                            borderLeftColor:
                              match.winner === "Abandoned"
                                ? "#6B7280"
                                : "#3B82F6",
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {match.match}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {match.date} • {match.location}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {match.format}
                            </Badge>
                          </div>

                          <p className="text-sm font-medium text-gray-900 mb-2">
                            {match.result}
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">
                                {match.team1.name}:{" "}
                              </span>
                              <span className="font-medium">
                                {match.team1.score}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                {match.team2.name}:{" "}
                              </span>
                              <span className="font-medium">
                                {match.team2.score}
                              </span>
                            </div>
                          </div>

                          {match.winner !== "Abandoned" && (
                            <div className="mt-2">
                              <Badge
                                className={`text-xs ${
                                  match.winner === match.team1.name
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                Winner: {match.winner}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rest of your existing TabsContent for squads and stadium */}
              <TabsContent value="squads" className="space-y-6">
                {matchData?.squadList?.map((squad) => (
                  <Card key={squad.shortName}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <img
                          src={squad.flag}
                          alt={squad.shortName}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{squad.shortName} Squad</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="playing" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="playing">
                            Playing XI ({squad.playingPlayer.length})
                          </TabsTrigger>
                          <TabsTrigger value="bench">
                            Bench ({squad.benchPlayer.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="playing" className="mt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <SquadDialoge data={squad?.playingPlayer} />
                          </div>
                        </TabsContent>

                        <TabsContent value="bench" className="mt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <SquadDialoge data={squad?.benchPlayer} />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="stadium" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <span>Stadium: {matchData.matchInfo.venue}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold">
                        Last 10 Matches at this Venue
                      </h3>
                      <div className="space-y-3">
                        {matchData?.stadiumStats?.map((match, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {match.matchTitle}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {match.date}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>{match.inn1Score}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>{match.inn2Score}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          {/* AI Prediction Modal */}
          <AIPredictionModal
            isOpen={isPredictionModalOpen}
            onClose={() => setIsPredictionModalOpen(false)}
            match={{ ...matchData, matchInfo: selectedMatch }}
          />
        </div>
      ) : (
        <CustomLoader message="Loading match details" />
      )}
    </>
  );
};

export default MatchDetailsPage;
