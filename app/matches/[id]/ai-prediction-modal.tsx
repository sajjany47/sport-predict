/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

import {
  Trophy,
  Users,
  Star,
  Zap,
  BarChart3,
  Award,
  Sparkles,
  Brain,
  X,
  InfoIcon,
  Shield,
  Target,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { GetAIPrediction } from "./GetAIPrediction";
import { updateCredits } from "@/store/slices/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserOrderCredit } from "@/app/MainService";

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
  const { selectedMatch } = useSelector((state: RootState) => state.matches);
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

    const data: any = GetAIPrediction(match);

    setPredictionData(data);

    let payload = {
      ordertype: "prediction",
      userId: user!.id,
      credits: 1,
      status: "completed",
      paymentMode: "DEDUCTION",
      paymentDate: new Date(),
      matchId: selectedMatch?.matchId,
    };

    await UserOrderCredit(payload)
      .then((res) => {
        dispatch(updateCredits(user.credits - (res.credits ?? 1)));
        toast.success("AI Prediction generated successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to generate prediction. Please try again.");
        setIsLoading(false);
      });
  };

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

  const getConfidenceClass = (confidence: any) => {
    switch (confidence) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-red-100 text-red-800";
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
        <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="sm:grid sm:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
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
                  {/* User Highlights Section */}
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                      <InfoIcon className="h-4 w-4 mr-2" />
                      Important Points to Focus
                    </h4>
                    <ul className="space-y-2 text-sm text-yellow-700">
                      <li className="flex items-start">
                        <Shield className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                        <span>
                          <strong>Loss cut mandatory</strong> - Be safe, Earn
                          More
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Target className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                        <span>
                          <strong>Medium Confidence:</strong> Both teams have
                          chance to win (70% chance odds above 2.6) - Take
                          Chance Both Team
                        </span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-red-600" />
                        <span>
                          <strong>High Confidence:</strong> Less than 20% chance
                          odds go both team - Never Take Chance
                        </span>
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                        <span>
                          <strong>Jackpot Match:</strong> Only 2 in 30 matches
                          are jackpot - Never loss 28 matches for 2 jackpot
                          matches
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team 1 */}
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
                          className="bg-green-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${predictionData.winnerPrediction.team1.probability}%`,
                          }}
                        ></div>
                      </div>

                      <Badge
                        className={getConfidenceClass(
                          predictionData.winnerPrediction.team1.confidence
                        )}
                      >
                        {predictionData.winnerPrediction.team1.confidence}{" "}
                        Confidence
                      </Badge>

                      {/* Confidence based advice */}
                      {predictionData.winnerPrediction.team1.confidence ===
                        "Medium" && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                          Both teams have chance - Consider odds above 2.6
                        </div>
                      )}
                      {predictionData.winnerPrediction.team1.confidence ===
                        "High" && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          Low chance for both team odds - Avoid taking chance
                        </div>
                      )}
                    </div>

                    {/* Team 2 */}
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
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${predictionData.winnerPrediction.team2.probability}%`,
                          }}
                        ></div>
                      </div>

                      <Badge
                        className={getConfidenceClass(
                          predictionData.winnerPrediction.team2.confidence
                        )}
                      >
                        {predictionData.winnerPrediction.team2.confidence}{" "}
                        Confidence
                      </Badge>

                      {/* Confidence based advice */}
                      {predictionData.winnerPrediction.team2.confidence ===
                        "Medium" && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                          Both teams have chance - Consider odds above 2.6
                        </div>
                      )}
                      {predictionData.winnerPrediction.team2.confidence ===
                        "High" && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          Low chance for both team odds - Avoid taking chance
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Safety Note */}
                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-700 text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>
                        <strong>Remember:</strong> Always set loss cut limits.
                        Safety first for long-term earnings.
                      </span>
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
                          {
                            predictionData.topBatsman.team1.battingAvg
                              .averageRuns
                          }{" "}
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
                        <span className="text-gray-600">
                          Balls per Innings:
                        </span>
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
                          {
                            predictionData.topBatsman.team2.battingAvg
                              .averageRuns
                          }{" "}
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
                        <span className="text-gray-600">
                          Balls per Innings:
                        </span>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPredictionModal;
