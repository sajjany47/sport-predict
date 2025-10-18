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
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import SquadDialoge from "./SquadDialoge";
import CustomLoader from "@/components/ui/CustomLoader";
import AIPredictionModal from "./ai-prediction-modal";
import { FindWinner, ParseScore } from "@/lib/utils";

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

  useEffect(() => {
    const fetchDetails = async () => {
      if (params.id) {
        const details = await axios.post(
          "/api/match-details",
          {
            matchId: Number(params.id),
            venue: selectedMatch?.venue,
            team: selectedMatch?.teams.map((item) => ({
              name: item.teamName,
              shortName: item.teamShortName,
              flagUrl: item.teamFlagUrl,
            })),
          },
          { headers: { "Content-Type": "application/json" } }
        );

        setMatchData({
          ...details.data.data,
          matchInfo: {
            ...selectedMatch,
          },
        });
      } else {
        setMatchData(null);
      }
    };
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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

  const calculateH2HStats = (
    h2hMatches: any[],
    team1Name: string,
    team2Name: string
  ) => {
    if (!h2hMatches || h2hMatches.length === 0) {
      return [
        { label: team1Name, wins: 0 },
        { label: team2Name, wins: 0 },
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

  const analyzeTeamMatches = (matches: any[], teamName: string) => {
    if (!matches) return 0;
    const prepareData = FindWinner(matches, selectedMatch, teamName);
    const wins = prepareData.filter(
      (item: any) => item.winner === "W" && item.teamName === teamName
    );
    const losses = prepareData.filter(
      (item: any) => item.winner === "L" && item.teamName === teamName
    );
    const noResult = prepareData.filter(
      (item: any) => item.winner === "A" && item.teamName === teamName
    );
    const battingFirstWins = wins.filter(
      (item: any) => item.winnerType === "batting"
    );
    const bowlingFirstWins = wins.filter(
      (item: any) => item.winnerType === "bowling"
    );
    return {
      wins: wins.length || 0,
      losses: losses.length || 0,
      noResult: noResult.length || 0,
      battingFirstWins: battingFirstWins.length || 0,
      bowlingFirstWins: bowlingFirstWins.length || 0,
    };
  };

  const getRecentMatchesWithScores = (team: any, teamName: string) => {
    if (!team?.matches) return [];
    const prepareData = FindWinner(team.matches, selectedMatch, teamName);

    return prepareData;
  };

  const getRecentH2HMatches = (h2hMatches: any[]) => {
    if (!h2hMatches) return [];
    const team1 = selectedMatch?.teams.find(
      (item: any) =>
        item.teamShortName.toLowerCase() ===
        h2hMatches[0]?.team1?.name.toLowerCase()
    )?.teamName;
    const team2 = selectedMatch?.teams.find(
      (item: any) =>
        item.teamShortName.toLowerCase() ===
        h2hMatches[0]?.team2?.name.toLowerCase()
    )?.teamName;
    const prepareData = h2hMatches.map((match: any) => {
      if (match.result.toLowerCase().includes("abandoned")) {
        return { ...match, winner: "Abandoned" };
      }
      const t1 = ParseScore(match.team1.score);
      const t2 = ParseScore(match.team2.score);

      if (!t1 || !t2) {
        return { ...match, winner: "Abandoned" };
      }

      if (t1.runs > t2.runs) {
        return {
          ...match,
          winner: team1,
        };
      } else if (t2.runs > t1.runs) {
        return {
          ...match,
          winner: team2,
        };
      } else {
        // If runs equal, compare wickets (fewer wickets wins)
        if (t1.wickets < t2.wickets) {
          return {
            ...match,
            winner: team1,
          };
        } else if (t2.wickets < t1.wickets) {
          return {
            ...match,
            winner: team2,
          };
        }
      }
    });
    return prepareData;
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
                  {matchData?.matchInfo?.teams?.map((team: any, index: any) => (
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
            <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="sm:grid sm:grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="squads">Squads</TabsTrigger>
                  <TabsTrigger value="stadium">Stadium Stats</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    <div className="md:col-span-7">
                      {/* Form Summary */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center space-x-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span>Current Form</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                            {/* Team 1 Section */}
                            <div className="text-center w-full md:w-auto">
                              <div className="flex justify-center flex-wrap gap-1 mb-2">
                                {getRecentMatchesWithScores(
                                  matchData.overview.fullStats.team1,
                                  matchData.overview.fullStats.team1.teamName
                                )
                                  .slice(0, 10)
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

                            {/* Divider (visible only on mobile) */}
                            <div className="w-full h-px bg-gray-300 md:hidden"></div>

                            {/* Team 2 Section */}
                            <div className="text-center w-full md:w-auto">
                              <div className="flex justify-center flex-wrap gap-1 mb-2">
                                {getRecentMatchesWithScores(
                                  matchData.overview.fullStats.team2,
                                  matchData.overview.fullStats.team2.teamName
                                )
                                  .slice(0, 10)
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
                    </div>
                    <div className="md:col-span-5">
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
                              matchData.overview.fullStats.h2h,
                              matchData.overview.fullStats.team1.teamName,
                              matchData.overview.fullStats.team2.teamName
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
                    </div>
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
                        ].map((team) => {
                          const {
                            wins,
                            losses,
                            noResult,
                            battingFirstWins,
                            bowlingFirstWins,
                          }: any = analyzeTeamMatches(
                            team.matches?.slice(0, 10),
                            team.teamName
                          );

                          const totalMatches = wins + losses + noResult;
                          const winRate = totalMatches
                            ? ((wins / totalMatches) * 100).toFixed(0)
                            : 0;

                          return (
                            <div key={team.teamName} className="space-y-5">
                              {/* Team Header */}
                              <div className="flex items-center space-x-3">
                                <img
                                  src={team.flagUrl}
                                  alt={team.teamName}
                                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                                />
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {team.teamName}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Last 10 Matches
                                  </p>
                                </div>
                              </div>

                              {/* Win Rate Bar */}
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600">
                                    Win Rate
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    {winRate}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-700"
                                    style={{ width: `${winRate}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Stats Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
                                <div className="p-3 rounded-lg bg-blue-50">
                                  <p className="text-xl font-bold text-blue-600">
                                    {wins}
                                  </p>
                                  <p className="text-xs text-gray-600">Wins</p>
                                </div>
                                <div className="p-3 rounded-lg bg-red-50">
                                  <p className="text-xl font-bold text-red-600">
                                    {losses}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Losses
                                  </p>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50">
                                  <p className="text-xl font-bold text-gray-600">
                                    {noResult}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    No Result
                                  </p>
                                </div>
                              </div>

                              {/* Batting vs Bowling Wins */}
                              <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                  <p className="text-lg font-bold text-emerald-600">
                                    {battingFirstWins}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Batting 1st Wins
                                  </p>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-lg">
                                  <p className="text-lg font-bold text-indigo-600">
                                    {bowlingFirstWins}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Bowling 1st Wins
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                              {getRecentMatchesWithScores(
                                team,
                                team.teamName
                              ).map((match: any, index: any) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-50 rounded-lg border-l-4"
                                  style={{
                                    borderLeftColor:
                                      match.winner === "W"
                                        ? "#10B981"
                                        : match.winner === "A"
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
                                        match.winner === "W"
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : match.winner === "A"
                                          ? "bg-gray-50 text-gray-700 border-gray-200"
                                          : "bg-red-50 text-red-700 border-red-200"
                                      }`}
                                    >
                                      {match.winner}
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
                              ))}
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
                          matchData?.overview?.fullStats?.h2h
                        ).map((match, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg border-l-4"
                            style={{
                              borderLeftColor:
                                match?.winner === "Abandoned"
                                  ? "#6B7280"
                                  : "#3B82F6",
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {match?.match}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {match?.format}
                              </Badge>
                            </div>

                            <p className="text-sm font-medium text-gray-900 mb-2">
                              {match?.result}
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">
                                  {match?.team1?.name}:{" "}
                                </span>
                                <span className="font-medium">
                                  {match?.team1?.score}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  {match?.team2?.name}:{" "}
                                </span>
                                <span className="font-medium">
                                  {match?.team2?.score}
                                </span>
                              </div>
                            </div>

                            {match?.winner !== "Abandoned" && (
                              <div className="mt-2">
                                <Badge
                                  className={`text-xs ${
                                    match?.winner === match?.team1?.name
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  Winner: {match?.winner}
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
                  {matchData?.squadList?.map((squad: any) => (
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
                          {matchData?.stadiumStats?.map(
                            (match: any, index: any) => (
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
                            )
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
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
