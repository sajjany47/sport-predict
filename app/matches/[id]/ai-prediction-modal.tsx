/* eslint-disable react/no-unescaped-entities */
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
      hint: {
        hintMessage: string;
        badgeColor: string;
        color: string;
      };
    };
    team2: {
      probability: string;
      confidence: string;
      hint: {
        hintMessage: string;
        badgeColor: string;
        color: string;
      };
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

  const checkSquad =
    match.squadList[0].benchPlayer.length === 0 ||
    match.squadList[0].playingPlayer.length === 0 ||
    match.squadList[1].benchPlayer.length === 0 ||
    match.squadList[1].playingPlayer.length === 0;

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
          {checkSquad ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Team Squads Not Available Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                ⏳ Both team squads haven't been announced yet. Please check
                back later when the teams are finalized to get accurate AI
                predictions.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <InfoIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Predictions will be available after squad announcements
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get AI-Powered Match Prediction
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Our advanced AI analyzes 50+ factors including player form,
                pitch conditions, weather, and historical data to provide
                accurate predictions.
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
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl">AI Match Prediction</span>
            </DialogTitle>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center space-x-2">
              <img
                src={predictionData.team1.flag}
                alt={predictionData.team1.shortName}
                className="w-6 h-6 rounded"
              />
              <span className="font-medium">
                {predictionData.team1.shortName}
              </span>
            </div>
            <span className="text-gray-400">vs</span>
            <div className="flex items-center space-x-2">
              <img
                src={predictionData.team2.flag}
                alt={predictionData.team2.shortName}
                className="w-6 h-6 rounded"
              />
              <span className="font-medium">
                {predictionData.team2.shortName}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pb-6">
          {/* User Highlights Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-yellow-800">
                <InfoIcon className="h-5 w-5" />
                <span>Important Betting Strategy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-700">
                        Loss Cut Mandatory
                      </h4>
                      <p className="text-sm text-gray-700">
                        Be safe, Earn More - Always set stop loss limits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-700">
                        Medium Confidence Strategy
                      </h4>
                      <p className="text-sm text-gray-700">
                        Both teams have chance (70% odds above 2.6) - Take
                        Chance Both Team
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-700">
                        High Confidence Warning
                      </h4>
                      <p className="text-sm text-gray-700">
                        Less than 20% chance odds go both team - Never Take
                        Chance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-purple-700">
                        Jackpot Match Reality
                      </h4>
                      <p className="text-sm text-gray-700">
                        Only 2 in 30 matches are jackpot - Never loss 28 matches
                        for 2 jackpot matches
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Winner Prediction */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Winner Prediction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Team 1 */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <img
                      src={predictionData.team1.flag}
                      alt={predictionData.team1.shortName}
                      className="w-10 h-10 rounded-lg shadow-sm"
                    />
                    <h3 className="text-xl font-bold text-gray-900">
                      {predictionData.team1.shortName}
                    </h3>
                  </div>

                  <div className="text-4xl font-bold text-green-600 mb-3">
                    {predictionData.winnerPrediction.team1.probability}%
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                    <div
                      className="bg-green-600 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${predictionData.winnerPrediction.team1.probability}%`,
                      }}
                    ></div>
                  </div>

                  <Badge
                    className={`${getConfidenceClass(
                      predictionData.winnerPrediction.team1.confidence
                    )} text-sm px-3 py-1 mb-3`}
                  >
                    {predictionData.winnerPrediction.team1.confidence}{" "}
                    Confidence
                  </Badge>

                  {/* Confidence based advice */}
                  {
                    <div
                      className={`mt-4 p-3 ${predictionData.winnerPrediction.team1.hint.color} border border-blue-200 rounded-lg text-sm text-blue-700`}
                    >
                      {predictionData.winnerPrediction.team1.hint.hintMessage}
                    </div>
                  }
                </div>

                {/* Team 2 */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <img
                      src={predictionData.team2.flag}
                      alt={predictionData.team2.shortName}
                      className="w-10 h-10 rounded-lg shadow-sm"
                    />
                    <h3 className="text-xl font-bold text-gray-900">
                      {predictionData.team2.shortName}
                    </h3>
                  </div>

                  <div className="text-4xl font-bold text-blue-600 mb-3">
                    {predictionData.winnerPrediction.team2.probability}%
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${predictionData.winnerPrediction.team2.probability}%`,
                      }}
                    ></div>
                  </div>

                  <Badge
                    className={`${getConfidenceClass(
                      predictionData.winnerPrediction.team2.confidence
                    )} text-sm px-3 py-1 mb-3`}
                  >
                    {predictionData.winnerPrediction.team2.confidence}{" "}
                    Confidence
                  </Badge>

                  {/* Confidence based advice */}
                  {
                    <div
                      className={`mt-4 p-3 ${predictionData.winnerPrediction.team2.hint.color} border border-blue-200 rounded-lg text-sm text-blue-700`}
                    >
                      {predictionData.winnerPrediction.team2.hint.hintMessage}
                    </div>
                  }
                </div>
              </div>

              {/* Additional Safety Note */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-700 text-sm">
                  <Shield className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>
                    <strong>Remember:</strong> Always set loss cut limits.
                    Safety first for long-term earnings. Never risk more than
                    you can afford to lose.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <img
                      src={predictionData.team1.flag}
                      alt={predictionData.team1.shortName}
                      className="w-8 h-8 rounded"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {predictionData.team1.shortName}
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {predictionData.firstInningScore.team1.predicted.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600 bg-white py-2 px-4 rounded-lg border">
                    Range:{" "}
                    <span className="font-semibold">
                      {predictionData.firstInningScore.team1.min.toFixed(0)} -{" "}
                      {predictionData.firstInningScore.team1.max.toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <img
                      src={predictionData.team2.flag}
                      alt={predictionData.team2.shortName}
                      className="w-8 h-8 rounded"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {predictionData.team2.shortName}
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {predictionData.firstInningScore.team2.predicted.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600 bg-white py-2 px-4 rounded-lg border">
                    Range:{" "}
                    <span className="font-semibold">
                      {predictionData.firstInningScore.team2.min.toFixed(0)} -{" "}
                      {predictionData.firstInningScore.team2.max.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Batsmen */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-red-600" />
                  <span>Top Batsmen Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Team 1 Batsman */}
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                    <img
                      src={predictionData.topBatsman.team1.imageUrl}
                      alt={predictionData.topBatsman.team1.shortName}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
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

                      {/* Batting Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Runs</div>
                          <div className="text-sm font-bold text-green-600">
                            {Number(
                              predictionData.topBatsman.team1.battingAvg
                                .averageRuns || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Strike Rate
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            {Number(
                              predictionData.topBatsman.team1.battingAvg
                                .averageSR || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Balls</div>
                          <div className="text-sm font-bold text-purple-600">
                            {Number(
                              predictionData.topBatsman.team1.battingAvg
                                .averageBalls || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Score */}
                      <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-green-800">
                            Predicted Score:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {Math.round(
                              parseFloat(
                                predictionData.topBatsman.team1.battingAvg
                                  .averageRuns
                              ) * 1.2
                            )}
                            -
                            {Math.round(
                              parseFloat(
                                predictionData.topBatsman.team1.battingAvg
                                  .averageRuns
                              ) * 1.5
                            )}{" "}
                            runs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 Batsman */}
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <img
                      src={predictionData.topBatsman.team2.imageUrl}
                      alt={predictionData.topBatsman.team2.shortName}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
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

                      {/* Batting Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Runs</div>
                          <div className="text-sm font-bold text-green-600">
                            {Number(
                              predictionData.topBatsman.team2.battingAvg
                                .averageRuns || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Strike Rate
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            {Number(
                              predictionData.topBatsman.team2.battingAvg
                                .averageSR || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Balls</div>
                          <div className="text-sm font-bold text-purple-600">
                            {Number(
                              predictionData.topBatsman.team2.battingAvg
                                .averageBalls || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Score */}
                      <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-green-800">
                            Predicted Score:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {Math.round(
                              parseFloat(
                                predictionData.topBatsman.team2.battingAvg
                                  .averageRuns
                              ) * 1.2
                            )}
                            -
                            {Math.round(
                              parseFloat(
                                predictionData.topBatsman.team2.battingAvg
                                  .averageRuns
                              ) * 1.5
                            )}{" "}
                            runs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Bowlers */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Top Bowlers Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Team 1 Bowler */}
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <img
                      src={predictionData.topBowler.team1.imageUrl}
                      alt={predictionData.topBowler.team1.shortName}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
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

                      {/* Bowling Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Avg Wickets
                          </div>
                          <div className="text-sm font-bold text-red-600">
                            {Number(
                              predictionData.topBowler.team1.bowlingAvg
                                ?.averageWickets || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Economy</div>
                          <div className="text-sm font-bold text-orange-600">
                            {Number(
                              predictionData.topBowler.team1.bowlingAvg
                                ?.averageEconomy || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Overs</div>
                          <div className="text-sm font-bold text-purple-600">
                            {Number(
                              predictionData.topBowler.team1.bowlingAvg
                                ?.averageOvers || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Wickets */}
                      <div className="mt-3 p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-red-800">
                            Predicted Wickets:
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {predictionData.topBowler.team1.bowlingAvg
                              ?.averageWickets
                              ? `${Math.round(
                                  parseFloat(
                                    predictionData.topBowler.team1.bowlingAvg
                                      .averageWickets
                                  )
                                )}-${Math.round(
                                  parseFloat(
                                    predictionData.topBowler.team1.bowlingAvg
                                      .averageWickets
                                  ) + 1
                                )} wickets`
                              : "2-3 wickets"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 Bowler */}
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <img
                      src={predictionData.topBowler.team2.imageUrl}
                      alt={predictionData.topBowler.team2.shortName}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
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

                      {/* Bowling Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Avg Wickets
                          </div>
                          <div className="text-sm font-bold text-red-600">
                            {Number(
                              predictionData.topBowler.team2.bowlingAvg
                                ?.averageWickets || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Economy</div>
                          <div className="text-sm font-bold text-orange-600">
                            {Number(
                              predictionData.topBowler.team2.bowlingAvg
                                ?.averageEconomy || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Overs</div>
                          <div className="text-sm font-bold text-purple-600">
                            {Number(
                              predictionData.topBowler.team2.bowlingAvg
                                ?.averageOvers || 0
                            ).toFixed(0)}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Wickets */}
                      <div className="mt-3 p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-red-800">
                            Predicted Wickets:
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {predictionData.topBowler.team2.bowlingAvg
                              ?.averageWickets
                              ? `${Math.round(
                                  parseFloat(
                                    predictionData.topBowler.team2.bowlingAvg
                                      .averageWickets
                                  )
                                )}-${Math.round(
                                  parseFloat(
                                    predictionData.topBowler.team2.bowlingAvg
                                      .averageWickets
                                  ) + 1
                                )} wickets`
                              : "2-3 wickets"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPredictionModal;
