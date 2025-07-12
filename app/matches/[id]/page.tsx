/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateCredits } from "@/store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIPredictionModal from "@/components/ui/ai-prediction-modal";

import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Star,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
  Crown,
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
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import SquadDialoge from "./SquadDialoge";
import CustomLoader from "@/components/ui/CustomLoader";
import { useQuery } from "@tanstack/react-query";
import { FetchMatchDetails } from "../MatchService";

interface Player {
  id: number;
  name: string;
  shortName: string;
  batStyle: string;
  bowlStyle: string;
  imageUrl: { src: string };
  type: string;
  fantasyPoints: Array<{
    date: string;
    match: string;
    bat: string;
    bowl: string;
    field: string;
    total: string;
  }>;
  battingForm: Array<{
    date: string;
    match: string;
    bo: string;
    run: string;
    fours_sixes: string;
    sr: string;
    out: string;
  }>;
  bowlingForm: Array<{
    date: string;
    match: string;
    o: string;
    r: string;
    w: string;
    m: string;
    eco: string;
  }>;
  battingStats: Array<{
    year: string;
    mode: string;
    matches: string;
    innings: string;
    runs: string;
    balls: string;
    notOut: string;
    average: string;
    strikeRate: string;
    highScore: string;
    fifty: string;
    hundred: string;
    fours: string;
    sixes: string;
  }>;
  bowlingStats: Array<{
    year: string;
    mode: string;
    matches: string;
    innings: string;
    balls: string;
    runs: string;
    wicket: string;
    strikeRate: string;
    twoWicket: string;
    threeWicket: string;
    fiveWicket: string;
    economy: string;
    average: string;
  }>;
  overallStats: any;
  stadiumStats: any;
  againstTeamsStats: any;
}

interface Squad {
  flag: string;
  color: string;
  shortName: string;
  playingPlayer: Player[];
  benchPlayer: Player[];
}

interface MatchData {
  squadList: Squad[];
  stadiumStats: Array<{
    date: string;
    matchTitle: string;
    matchUrl: string;
    inn1Score: string;
    inn2Score: string;
  }>;
  matchInfo: {
    matchId: number;
    matchName: string;
    matchDescription: string;
    startTime: string;
    status: string;
    venue: string;
    tour: {
      id: number;
      name: string;
    };
    format: string;
    sport: string;
    teams: Array<{
      squadId: number;
      teamName: string;
      teamShortName: string;
      teamFlagUrl: string;
      isWinner: boolean | null;
      color: string;
      cricketScore: any[];
      squadNo: number | null;
    }>;
  };
  GroundWheather: any;
  overview: {
    groundAndWheather: {
      pitchType: string;
      avgScore: string;
      wheatherType: string;
      temprature: string;
    };
    stats: {
      recentMatch: Array<any>;
      h2h: {
        h2hStat: Array<any>;
        recentH2HMatch: Array<any>;
      };
      teamStrength: Array<any>;
    };
  };
}

const MatchDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { selectedMatch } = useSelector((state: RootState) => state.matches);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  // const { data } = useQuery({
  //   queryKey: ["match-details"],
  //   queryFn: () => FetchMatchDetails(params.id, selectedMatch?.venue),
  // });
  // console.log("data", data);
  useEffect(() => {
    const fetchDetails = async () => {
      if (params.id) {
        const details = await axios.post(
          "/api/match-details",
          { matchId: Number(params.id), venue: selectedMatch?.venue },
          { headers: { "Content-Type": "application/json" } }
        );

        setMatchData({
          ...details.data.data,
          matchInfo: {
            ...selectedMatch,
          },
          GroundWheather: {
            temperature: "28°C",
            humidity: "65%",
            windSpeed: "12 km/h",
            conditions: "Partly Cloudy",
          },
        });
        // setData(details.data.data);
        // You can use 'details' here if needed
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="squads">Squads</TabsTrigger>
                <TabsTrigger value="stadium">Stadium Stats</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Ground & Weather */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span>Ground & Weather Conditions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Gauge className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Pitch Type</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData?.overview.groundAndWheather.pitchType}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData.overview.groundAndWheather.avgScore}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <CloudRain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Weather</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData.overview.groundAndWheather.wheatherType}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData.overview.groundAndWheather.temprature}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span>Recent Form (Last 5 Matches)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {matchData.overview.stats.recentMatch.map((teamData) => (
                        <div key={teamData.teamName} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  matchData.matchInfo.teams.find(
                                    (t) => t.teamShortName === teamData.teamName
                                  )?.teamFlagUrl
                                }
                                alt={teamData.teamName}
                                className="w-8 h-8 rounded-full"
                              />
                              <h3 className="font-semibold text-lg">
                                {teamData.teamName}
                              </h3>
                            </div>
                            <div className="flex space-x-1">
                              {teamData.match
                                .slice(0, 5)
                                .map((match: any, index: number) => (
                                  <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getFormColor(
                                      match.result,
                                      teamData.teamName
                                    )}`}
                                  >
                                    {match.winner === teamData.teamName
                                      ? "W"
                                      : "L"}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            {teamData.match
                              .slice(0, 3)
                              .map((match: any, index: any) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      {getFormIcon(match.result)}
                                      <span className="font-medium text-sm">
                                        {match.team1} vs {match.team2}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {match.format}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    {match.date} • {match.location}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {match.result}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                    <div>
                                      <span className="text-gray-600">
                                        {match.team1}:{" "}
                                      </span>
                                      <span className="font-medium">
                                        {formatScore(match.team1Score)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        {match.team2}:{" "}
                                      </span>
                                      <span className="font-medium">
                                        {formatScore(match.team2Score)}
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

                {/* Head to Head */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span>Head to Head Record</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-center justify-center space-x-8">
                        {matchData.overview.stats.h2h.h2hStat.map((stat) => (
                          <div key={stat.team1} className="text-center">
                            <div className="flex items-center space-x-2 mb-2">
                              <img
                                src={
                                  matchData.matchInfo.teams.find(
                                    (t) => t.teamShortName === stat.team1
                                  )?.teamFlagUrl
                                }
                                alt={stat.team1}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="font-semibold">
                                {stat.team1}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {stat.win}
                            </div>
                            <div className="text-sm text-gray-600">Wins</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-gray-600">
                          Total Matches:{" "}
                          {matchData.overview.stats.h2h.h2hStat[0]?.totalPlay ||
                            0}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Recent H2H Matches
                      </h4>
                      {matchData.overview.stats.h2h.recentH2HMatch[0]?.match
                        .slice(0, 3)
                        .map((match: any, index: any) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getFormIcon(match.result)}
                                <span className="font-medium">
                                  {match.team1} vs {match.team2}
                                </span>
                              </div>
                              <Badge variant="outline">{match.format}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {match.date} • {match.location}
                            </p>
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              {match.result}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">
                                  {match.team1}:{" "}
                                </span>
                                <span className="font-medium">
                                  {formatScore(match.team1Score)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  {match.team2}:{" "}
                                </span>
                                <span className="font-medium">
                                  {formatScore(match.team2Score)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span>Team Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {matchData.overview.stats.teamStrength.map((team) => (
                        <div key={team.teamName} className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                matchData.matchInfo.teams.find(
                                  (t) => t.teamShortName === team.teamName
                                )?.teamFlagUrl
                              }
                              alt={team.teamName}
                              className="w-8 h-8 rounded-full"
                            />
                            <h3 className="font-semibold text-lg">
                              {team.teamName}
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">
                                  Batting First Win %
                                </span>
                                <span className="font-semibold">
                                  {team.battingFirstWin}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: team.battingFirstWin }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">
                                  Bowling First Win %
                                </span>
                                <span className="font-semibold">
                                  {team.bowlingFirstWin}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: team.bowlingFirstWin }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

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

              <TabsContent value="weather" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span>Weather Conditions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Thermometer className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData.GroundWheather.temperature}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData.GroundWheather.humidity}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Wind className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Wind Speed</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData.GroundWheather.windSpeed}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Conditions</p>
                        <p className="text-xl font-bold text-gray-900">
                          {matchData.GroundWheather.conditions}
                        </p>
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
