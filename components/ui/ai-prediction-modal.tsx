/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Target,
  Users,
  TrendingUp,
  Star,
  Crown,
  Zap,
  BarChart3,
  Award,
  Activity,
  Sparkles,
  Brain,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { updateCredits } from "@/store/slices/authSlice";
import { GetAIPrediction } from "@/app/matches/[id]/GetAIPrediction";

interface Team {
  flag: string;
  color: string;
  shortName: string;
}

interface Player {
  id: number;
  name: string;
  shortName: string;
  batStyle: string;
  bowlStyle: string;
  imageUrl: string;
  type: string;
  battingAvg: {
    averageRuns: string;
    averageBalls: string;
    averageSR: string;
  };
  bowlingAvg: {
    averageRuns: string;
    averageWickets: string;
    averageOvers: string;
    averageEconomy: string;
  } | null;
  fantasyAvg: {
    averageBatting: string;
    averageBowling: string;
    averageFielding: string;
  };
  teamFlag: string;
  teamShortName: string;
  teamColor: string;
  totalPoint?: number;
  points?: number;
  form?: string;
  impact?: string;
}

interface PredictionData {
  team1: Team;
  team2: Team;
  firstInningScore: {
    team1: {
      min: number;
      max: number;
      predicted: number;
    };
    team2: {
      min: number;
      max: number;
      predicted: number;
    };
  };
  winnerPrediction: {
    team1: {
      probability: string;
      confidence: string;
    };
    team2: {
      probability: string;
      confidence: string;
    };
  };
  dream11Team: {
    captain: Player;
    viceCaptain: Player;
    players: Player[];
  };
  keyPlayers: {
    team1: Player[];
    team2: Player[];
  };
  topBatsman: {
    team1: Player;
    team2: Player;
  };
  topBowler: {
    team1: Player;
    team2: Player;
  };
}

const AIPredictionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  match: any;
}> = ({ isOpen, onClose, match }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null
  );

  const handleGetPrediction = async () => {
    setIsLoading(true);
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!user || user.credits < 1) {
      toast.error("Insufficient credits. Please purchase more credits.");
      return;
    }

    try {
      // Simulate API call with your actual response
      const data: any = GetAIPrediction(match);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPredictionData(data);
      dispatch(updateCredits(user.credits - 1));
      toast.success("AI Prediction generated successfully!");
    } catch (error) {
      toast.error("Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(predictionData);
  const getRoleIcon = (type: string) => {
    switch (type) {
      case "BAT":
        return <Target className="h-4 w-4" />;
      case "BOWL":
        return <Zap className="h-4 w-4" />;
      case "AR":
        return <Star className="h-4 w-4" />;
      case "WK":
        return <Award className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (type: string) => {
    switch (type) {
      case "BAT":
        return "bg-blue-100 text-blue-800";
      case "BOWL":
        return "bg-red-100 text-red-800";
      case "AR":
        return "bg-purple-100 text-purple-800";
      case "WK":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!predictionData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span>AI Match Prediction</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Get AI-Powered Match Prediction
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Our advanced AI analyzes 50+ factors including player form, pitch
              conditions, weather, and historical data to provide accurate
              predictions.
            </p>
            <Button
              onClick={handleGetPrediction}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Match...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Prediction
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span>AI Match Prediction</span>
            </DialogTitle>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <img
                src={predictionData.team1.flag}
                alt={predictionData.team1.shortName}
                className="w-6 h-6 rounded"
              />
              <span>{predictionData.team1.shortName}</span>
            </div>
            <span>vs</span>
            <div className="flex items-center space-x-2">
              <img
                src={predictionData.team2.flag}
                alt={predictionData.team2.shortName}
                className="w-6 h-6 rounded"
              />
              <span>{predictionData.team2.shortName}</span>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dream11">Dream11 Team</TabsTrigger>
            <TabsTrigger value="players">Key Players</TabsTrigger>
            <TabsTrigger value="batsman">Top Batsman</TabsTrigger>
            <TabsTrigger value="bowler">Top Bowler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Winner Prediction */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Winner Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <img
                        src={predictionData.team1.flag}
                        alt={predictionData.team1.shortName}
                        className="w-8 h-8 rounded"
                      />
                      <h3 className="text-xl font-bold">
                        {predictionData.team1.shortName}
                      </h3>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {predictionData.winnerPrediction.team1.probability}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${predictionData.winnerPrediction.team1.probability}%`,
                        }}
                      ></div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {predictionData.winnerPrediction.team1.confidence}{" "}
                      Confidence
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <img
                        src={predictionData.team2.flag}
                        alt={predictionData.team2.shortName}
                        className="w-8 h-8 rounded"
                      />
                      <h3 className="text-xl font-bold">
                        {predictionData.team2.shortName}
                      </h3>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {predictionData.winnerPrediction.team2.probability}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{
                          width: `${predictionData.winnerPrediction.team2.probability}%`,
                        }}
                      ></div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {predictionData.winnerPrediction.team2.confidence}{" "}
                      Confidence
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* First Innings Score Prediction */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>First Innings Score Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <img
                        src={predictionData.team1.flag}
                        alt={predictionData.team1.shortName}
                        className="w-6 h-6 rounded"
                      />
                      <h3 className="font-semibold">
                        {predictionData.team1.shortName}
                      </h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {predictionData.firstInningScore.team1.predicted.toFixed(
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Range:{" "}
                      {predictionData.firstInningScore.team1.min.toFixed(0)} -{" "}
                      {predictionData.firstInningScore.team1.max.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <img
                        src={predictionData.team2.flag}
                        alt={predictionData.team2.shortName}
                        className="w-6 h-6 rounded"
                      />
                      <h3 className="font-semibold">
                        {predictionData.team2.shortName}
                      </h3>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {predictionData.firstInningScore.team2.predicted.toFixed(
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Range:{" "}
                      {predictionData.firstInningScore.team2.min.toFixed(0)} -{" "}
                      {predictionData.firstInningScore.team2.max.toFixed(0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dream11" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span>Recommended Dream11 Team</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Captain & Vice Captain */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Captain Section */}
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300">
                    <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">Captain</h3>
                    <div className="flex flex-col items-center">
                      <img
                        src={predictionData.dream11Team.captain.imageUrl}
                        alt={predictionData.dream11Team.captain.shortName}
                        className="w-16 h-16 rounded-full mb-2 border-2 border-yellow-400"
                      />
                      <div className="text-xl font-bold">
                        {predictionData.dream11Team.captain.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {predictionData.dream11Team.captain.teamShortName}
                      </div>
                      <Badge
                        className={getRoleColor(
                          predictionData.dream11Team.captain.type
                        )}
                      >
                        {getRoleIcon(predictionData.dream11Team.captain.type)}
                        <span className="ml-1">
                          {predictionData.dream11Team.captain.type}
                        </span>
                      </Badge>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Points: </span>
                        <span className="text-green-600 font-bold">
                          {predictionData.dream11Team.captain.points ||
                            predictionData.dream11Team.captain.totalPoint?.toFixed(
                              1
                            )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vice Captain Section */}
                  <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300">
                    <Star className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">Vice Captain</h3>
                    <div className="flex flex-col items-center">
                      <img
                        src={predictionData.dream11Team.viceCaptain.imageUrl}
                        alt={predictionData.dream11Team.viceCaptain.shortName}
                        className="w-16 h-16 rounded-full mb-2 border-2 border-gray-400"
                      />
                      <div className="text-xl font-bold">
                        {predictionData.dream11Team.viceCaptain.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {predictionData.dream11Team.viceCaptain.teamShortName}
                      </div>
                      <Badge
                        className={getRoleColor(
                          predictionData.dream11Team.viceCaptain.type
                        )}
                      >
                        {getRoleIcon(
                          predictionData.dream11Team.viceCaptain.type
                        )}
                        <span className="ml-1">
                          {predictionData.dream11Team.viceCaptain.type}
                        </span>
                      </Badge>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Points: </span>
                        <span className="text-green-600 font-bold">
                          {predictionData.dream11Team.viceCaptain.points ||
                            predictionData.dream11Team.viceCaptain.totalPoint?.toFixed(
                              1
                            )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Players */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Other Players</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {predictionData.dream11Team.players.map((player) => (
                      <div
                        key={player.id}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <img
                            src={player.imageUrl}
                            alt={player.shortName}
                            className="w-10 h-10 rounded"
                          />
                          <div>
                            <div className="font-semibold">{player.name}</div>
                            <div className="text-sm text-gray-600">
                              {player.teamShortName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getRoleColor(player.type)}>
                            {getRoleIcon(player.type)}
                            <span className="ml-1">{player.type}</span>
                          </Badge>
                          <span className="text-sm font-medium text-green-600">
                            {player.points || player.totalPoint?.toFixed(1)} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <img
                      src={predictionData.team1.flag}
                      alt={predictionData.team1.shortName}
                      className="w-6 h-6 rounded"
                    />
                    <span>{predictionData.team1.shortName} Key Players</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {predictionData.keyPlayers.team1.map((player) => (
                    <div key={player.id} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={player.imageUrl}
                          alt={player.shortName}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{player.name}</h3>
                          <div className="text-sm text-gray-600">
                            {player.teamShortName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getRoleColor(player.type)}>
                          {getRoleIcon(player.type)}
                          <span className="ml-1">{player.type}</span>
                        </Badge>
                        <Badge
                          className={
                            player.impact === "High"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {player.impact} Impact
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Batting Avg: </span>
                        <span className="text-gray-700">
                          {player.battingAvg.averageRuns} runs
                        </span>
                      </div>
                      {player.bowlingAvg && (
                        <div className="text-sm">
                          <span className="font-medium">Bowling Avg: </span>
                          <span className="text-gray-700">
                            {player.bowlingAvg.averageWickets} wkts
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <img
                      src={predictionData.team2.flag}
                      alt={predictionData.team2.shortName}
                      className="w-6 h-6 rounded"
                    />
                    <span>{predictionData.team2.shortName} Key Players</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {predictionData.keyPlayers.team2.map((player) => (
                    <div
                      key={player.id}
                      className="p-4 bg-purple-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={player.imageUrl}
                          alt={player.shortName}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{player.name}</h3>
                          <div className="text-sm text-gray-600">
                            {player.teamShortName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getRoleColor(player.type)}>
                          {getRoleIcon(player.type)}
                          <span className="ml-1">{player.type}</span>
                        </Badge>
                        <Badge
                          className={
                            player.impact === "High"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {player.impact} Impact
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Batting Avg: </span>
                        <span className="text-gray-700">
                          {player.battingAvg.averageRuns} runs
                        </span>
                      </div>
                      {player.bowlingAvg && (
                        <div className="text-sm">
                          <span className="font-medium">Bowling Avg: </span>
                          <span className="text-gray-700">
                            {player.bowlingAvg.averageWickets} wkts
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="batsman" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <img
                      src={predictionData.team1.flag}
                      alt={predictionData.team1.shortName}
                      className="w-6 h-6 rounded"
                    />
                    <span>{predictionData.team1.shortName} Top Batsman</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={predictionData.topBatsman.team1.imageUrl}
                      alt={predictionData.topBatsman.team1.shortName}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-blue-600 mb-1">
                        {predictionData.topBatsman.team1.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        {predictionData.topBatsman.team1.batStyle} |{" "}
                        {predictionData.topBatsman.team1.teamShortName}
                      </div>
                      <Badge
                        className={getRoleColor(
                          predictionData.topBatsman.team1.type
                        )}
                      >
                        {getRoleIcon(predictionData.topBatsman.team1.type)}
                        <span className="ml-1">
                          {predictionData.topBatsman.team1.type}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recent Average:</span>
                      <span className="font-semibold">
                        {predictionData.topBatsman.team1.battingAvg.averageRuns}{" "}
                        runs
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strike Rate:</span>
                      <span className="font-semibold">
                        {predictionData.topBatsman.team1.battingAvg.averageSR}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balls per Innings:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBatsman.team1.battingAvg
                            .averageBalls
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <img
                      src={predictionData.team2.flag}
                      alt={predictionData.team2.shortName}
                      className="w-6 h-6 rounded"
                    />
                    <span>{predictionData.team2.shortName} Top Batsman</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={predictionData.topBatsman.team2.imageUrl}
                      alt={predictionData.topBatsman.team2.shortName}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-purple-600 mb-1">
                        {predictionData.topBatsman.team2.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        {predictionData.topBatsman.team2.batStyle} |{" "}
                        {predictionData.topBatsman.team2.teamShortName}
                      </div>
                      <Badge
                        className={getRoleColor(
                          predictionData.topBatsman.team2.type
                        )}
                      >
                        {getRoleIcon(predictionData.topBatsman.team2.type)}
                        <span className="ml-1">
                          {predictionData.topBatsman.team2.type}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recent Average:</span>
                      <span className="font-semibold">
                        {predictionData.topBatsman.team2.battingAvg.averageRuns}{" "}
                        runs
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strike Rate:</span>
                      <span className="font-semibold">
                        {predictionData.topBatsman.team2.battingAvg.averageSR}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balls per Innings:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBatsman.team2.battingAvg
                            .averageBalls
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bowler" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <img
                      src={predictionData.team1.flag}
                      alt={predictionData.team1.shortName}
                      className="w-6 h-6 rounded"
                    />
                    <span>{predictionData.team1.shortName} Top Bowler</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={predictionData.topBowler.team1.imageUrl}
                      alt={predictionData.topBowler.team1.shortName}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-blue-600 mb-1">
                        {predictionData.topBowler.team1.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        {predictionData.topBowler.team1.bowlStyle} |{" "}
                        {predictionData.topBowler.team1.teamShortName}
                      </div>
                      <Badge
                        className={getRoleColor(
                          predictionData.topBowler.team1.type
                        )}
                      >
                        {getRoleIcon(predictionData.topBowler.team1.type)}
                        <span className="ml-1">
                          {predictionData.topBowler.team1.type}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recent Wickets:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBowler.team1.bowlingAvg
                            ?.averageWickets
                        }{" "}
                        per match
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Economy:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBowler.team1.bowlingAvg
                            ?.averageEconomy
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overs per Match:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBowler.team1.bowlingAvg
                            ?.averageOvers
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <img
                      src={predictionData.team2.flag}
                      alt={predictionData.team2.shortName}
                      className="w-6 h-6 rounded"
                    />
                    <span>{predictionData.team2.shortName} Top Bowler</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={predictionData.topBowler.team2.imageUrl}
                      alt={predictionData.topBowler.team2.shortName}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-purple-600 mb-1">
                        {predictionData.topBowler.team2.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        {predictionData.topBowler.team2.bowlStyle} |{" "}
                        {predictionData.topBowler.team2.teamShortName}
                      </div>
                      <Badge
                        className={getRoleColor(
                          predictionData.topBowler.team2.type
                        )}
                      >
                        {getRoleIcon(predictionData.topBowler.team2.type)}
                        <span className="ml-1">
                          {predictionData.topBowler.team2.type}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recent Wickets:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBowler.team2.bowlingAvg
                            ?.averageWickets
                        }{" "}
                        per match
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Economy:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBowler.team2.bowlingAvg
                            ?.averageEconomy
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overs per Match:</span>
                      <span className="font-semibold">
                        {
                          predictionData.topBowler.team2.bowlingAvg
                            ?.averageOvers
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AIPredictionModal;
