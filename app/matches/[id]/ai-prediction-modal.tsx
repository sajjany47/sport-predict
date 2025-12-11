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
  InfoIcon,
  Shield,
  Target,
  Wifi,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
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
import { GetNewAnalysis } from "./GetNewAnanlysis";

interface TeamData {
  name: string;
  shortName: string;
  flag: string;
  firstInningScore: {
    min: number;
    max: number;
    predicted: number;
    wickets: number;
  };
  winnerPrediction: {
    probability: number;
    confidence: string;
    hint: {
      hintMessage: string;
      badgeColor: string;
      color: string;
    };
  };
  topBatsman: {
    name: string;
    image: string;
    role: string;
    batting: {
      totalRuns: number;
      totalAvgStrikeRate: number;
      totalAvgBallFaced: number;
    };
  };
  topBowler: {
    name: string;
    image: string;
    role: string;
    bowling: {
      totalAvgEconomy: number;
      totalAvgOvers: number;
      totalAvgWickets: number;
      totalAvgRunsConceded: number;
    };
  };
}

interface PredictionData {
  team1: TeamData;
  team2: TeamData;
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

    try {
      const data: any = await GetNewAnalysis(match);

      setPredictionData(data);
    } catch (error) {
      toast.error("Failed to generate prediction data.");
      setIsLoading(false);
      return;
    }

    let payload = {
      ordertype: "prediction",
      userId: user!.id,
      credits: 1,
      status: "completed",
      paymentStatus: true,
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

  const getRoleIcon = (role: string) => {
    if (!role) return <Users className="h-4 w-4" />;
    if (role.includes("WK")) return <Award className="h-4 w-4" />;
    if (role.includes("Batter")) return <Target className="h-4 w-4" />;
    if (role.includes("Bowler")) return <Zap className="h-4 w-4" />;
    if (role.includes("Allrounder")) return <Star className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const getRoleColor = (role: string) => {
    if (!role) return "bg-gray-100 text-gray-800";
    if (role.includes("WK")) return "bg-green-100 text-green-800";
    if (role.includes("Batter")) return "bg-blue-100 text-blue-800";
    if (role.includes("Bowler")) return "bg-red-100 text-red-800";
    if (role.includes("Allrounder")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const getConfidenceClass = (confidence: string) => {
    if (!confidence) return "bg-gray-100 text-gray-800 border-gray-300";
    switch (confidence) {
      case "High":
        return "bg-green-100 text-green-800 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    if (!confidence) return <Wifi className="h-4 w-4 text-gray-600" />;
    switch (confidence) {
      case "High":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Medium":
        return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case "Low":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTeamColor = (teamNumber: number) => {
    return teamNumber === 1
      ? "from-blue-600 to-indigo-600"
      : "from-purple-600 to-pink-600";
  };

  const getTeamBgColor = (teamNumber: number) => {
    return teamNumber === 1
      ? "from-blue-50 to-indigo-50"
      : "from-purple-50 to-pink-50";
  };

  const getTeamBorderColor = (teamNumber: number) => {
    return teamNumber === 1 ? "border-blue-200" : "border-purple-200";
  };

  const getTeamTextColor = (teamNumber: number) => {
    return teamNumber === 1 ? "text-blue-600" : "text-purple-600";
  };

  const getBattingPrediction = (runs: number) => {
    const predictedMin = Math.round((runs || 0) * 0.8);
    const predictedMax = Math.round((runs || 0) * 1.2);
    return `${predictedMin}-${predictedMax} runs`;
  };

  const getBowlingPrediction = (wickets: number) => {
    const predictedMin = Math.max(1, Math.round((wickets || 0) * 0.8));
    const predictedMax = Math.round((wickets || 0) * 1.2);
    return `${predictedMin}-${predictedMax} wickets`;
  };

  const checkSquad =
    match?.squadList?.[0]?.benchPlayer?.length === 0 &&
    match?.squadList?.[0]?.playingPlayer?.length === 0 &&
    match?.squadList?.[1]?.benchPlayer?.length === 0 &&
    match?.squadList?.[1]?.playingPlayer?.length === 0;

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
                src={predictionData?.team1?.flag}
                alt={predictionData?.team1?.shortName || "Team 1"}
                className="w-6 h-6 rounded"
              />
              <span className="font-medium">
                {predictionData?.team1?.shortName || "Team 1"}
              </span>
            </div>
            <span className="text-gray-400">vs</span>
            <div className="flex items-center space-x-2">
              <img
                src={predictionData?.team2?.flag}
                alt={predictionData?.team2?.shortName || "Team 2"}
                className="w-6 h-6 rounded"
              />
              <span className="font-medium">
                {predictionData?.team2?.shortName || "Team 2"}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pb-6">
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
                <div
                  className={`text-center p-6 bg-gradient-to-br ${getTeamBgColor(
                    1
                  )} rounded-xl border ${getTeamBorderColor(1)}`}
                >
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <img
                      src={predictionData?.team1?.flag}
                      alt={predictionData?.team1?.shortName || "Team 1"}
                      className="w-10 h-10 rounded-lg shadow-sm"
                    />
                    <div className="flex flex-col items-start">
                      <h3 className="text-xl font-bold text-gray-900">
                        {predictionData?.team1?.shortName || "Team 1"}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {predictionData?.team1?.name || "Full Team Name"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`text-4xl font-bold ${getTeamTextColor(1)} mb-3`}
                  >
                    {predictionData?.team1?.winnerPrediction?.probability?.toFixed?.(
                      2
                    ) || "0.00"}
                    %
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${getTeamColor(
                        1
                      )}`}
                      style={{
                        width: `${
                          predictionData?.team1?.winnerPrediction
                            ?.probability || 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`${getConfidenceClass(
                      predictionData?.team1?.winnerPrediction?.confidence || ""
                    )} text-sm px-3 py-1 mb-3 flex items-center space-x-2 mx-auto`}
                  >
                    {getConfidenceIcon(
                      predictionData?.team1?.winnerPrediction?.confidence || ""
                    )}
                    <span>
                      {predictionData?.team1?.winnerPrediction?.confidence ||
                        "Unknown"}{" "}
                      Confidence
                    </span>
                  </Badge>

                  <div
                    className={`mt-4 p-3 ${
                      predictionData?.team1?.winnerPrediction?.hint?.color ||
                      "text-gray-600 bg-gray-50 border-gray-200"
                    } rounded-lg border text-sm`}
                  >
                    {predictionData?.team1?.winnerPrediction?.hint
                      ?.hintMessage || "No betting hint available"}
                  </div>
                </div>

                {/* Team 2 */}
                <div
                  className={`text-center p-6 bg-gradient-to-br ${getTeamBgColor(
                    2
                  )} rounded-xl border ${getTeamBorderColor(2)}`}
                >
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <img
                      src={predictionData?.team2?.flag}
                      alt={predictionData?.team2?.shortName || "Team 2"}
                      className="w-10 h-10 rounded-lg shadow-sm"
                    />
                    <div className="flex flex-col items-start">
                      <h3 className="text-xl font-bold text-gray-900">
                        {predictionData?.team2?.shortName || "Team 2"}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {predictionData?.team2?.name || "Full Team Name"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`text-4xl font-bold ${getTeamTextColor(2)} mb-3`}
                  >
                    {predictionData?.team2?.winnerPrediction?.probability?.toFixed?.(
                      2
                    ) || "0.00"}
                    %
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${getTeamColor(
                        2
                      )}`}
                      style={{
                        width: `${
                          predictionData?.team2?.winnerPrediction
                            ?.probability || 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`${getConfidenceClass(
                      predictionData?.team2?.winnerPrediction?.confidence || ""
                    )} text-sm px-3 py-1 mb-3 flex items-center space-x-2 mx-auto`}
                  >
                    {getConfidenceIcon(
                      predictionData?.team2?.winnerPrediction?.confidence || ""
                    )}
                    <span>
                      {predictionData?.team2?.winnerPrediction?.confidence ||
                        "Unknown"}{" "}
                      Confidence
                    </span>
                  </Badge>

                  <div
                    className={`mt-4 p-3 ${
                      predictionData?.team2?.winnerPrediction?.hint?.color ||
                      "text-gray-600 bg-gray-50 border-gray-200"
                    } rounded-lg border text-sm`}
                  >
                    {predictionData?.team2?.winnerPrediction?.hint
                      ?.hintMessage || "No betting hint available"}
                  </div>
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
                {/* Team 1 */}
                <div
                  className={`text-center p-6 bg-gradient-to-br ${getTeamBgColor(
                    1
                  )} rounded-xl border ${getTeamBorderColor(1)}`}
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={predictionData?.team1?.flag}
                        alt={predictionData?.team1?.shortName || "Team 1"}
                        className="w-8 h-8 rounded"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {predictionData?.team1?.shortName || "Team 1"}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {predictionData?.team1?.name || "Full Team Name"}
                    </p>
                  </div>

                  <div
                    className={`text-3xl font-bold ${getTeamTextColor(1)} mb-2`}
                  >
                    {predictionData?.team1?.firstInningScore?.predicted || 0}
                  </div>

                  <div className="text-sm text-gray-600 bg-white py-2 px-4 rounded-lg border mb-2">
                    Range:{" "}
                    <span className="font-semibold">
                      {predictionData?.team1?.firstInningScore?.min || 0} -{" "}
                      {predictionData?.team1?.firstInningScore?.max || 0}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 bg-white py-2 px-4 rounded-lg border">
                    Predicted Wickets:{" "}
                    <span className="font-semibold text-red-600">
                      {predictionData?.team1?.firstInningScore?.wickets || 0}
                    </span>
                  </div>
                </div>

                {/* Team 2 */}
                <div
                  className={`text-center p-6 bg-gradient-to-br ${getTeamBgColor(
                    2
                  )} rounded-xl border ${getTeamBorderColor(2)}`}
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={predictionData?.team2?.flag}
                        alt={predictionData?.team2?.shortName || "Team 2"}
                        className="w-8 h-8 rounded"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {predictionData?.team2?.shortName || "Team 2"}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {predictionData?.team2?.name || "Full Team Name"}
                    </p>
                  </div>

                  <div
                    className={`text-3xl font-bold ${getTeamTextColor(2)} mb-2`}
                  >
                    {predictionData?.team2?.firstInningScore?.predicted || 0}
                  </div>

                  <div className="text-sm text-gray-600 bg-white py-2 px-4 rounded-lg border mb-2">
                    Range:{" "}
                    <span className="font-semibold">
                      {predictionData?.team2?.firstInningScore?.min || 0} -{" "}
                      {predictionData?.team2?.firstInningScore?.max || 0}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 bg-white py-2 px-4 rounded-lg border">
                    Predicted Wickets:{" "}
                    <span className="font-semibold text-red-600">
                      {predictionData?.team2?.firstInningScore?.wickets || 0}
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
                  <div
                    className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${getTeamBgColor(
                      1
                    )} rounded-lg border ${getTeamBorderColor(1)}`}
                  >
                    <img
                      src={
                        predictionData?.team1?.topBatsman?.image ||
                        "/placeholder-player.png"
                      }
                      alt={predictionData?.team1?.topBatsman?.name || "Player"}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {predictionData?.team1?.topBatsman?.name ||
                            "Unknown Player"}
                        </h3>
                        <Badge
                          className={getRoleColor(
                            predictionData?.team1?.topBatsman?.role || ""
                          )}
                        >
                          {getRoleIcon(
                            predictionData?.team1?.topBatsman?.role || ""
                          )}
                          <span className="ml-1">
                            {predictionData?.team1?.topBatsman?.role?.split(
                              " "
                            )[0] || "Player"}
                          </span>
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {predictionData?.team1?.name || "Team 1"}
                      </div>

                      {/* Batting Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Total Runs
                          </div>
                          <div className="text-sm font-bold text-green-600">
                            {predictionData?.team1?.topBatsman?.batting
                              ?.totalRuns || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Strike Rate
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            {predictionData?.team1?.topBatsman?.batting?.totalAvgStrikeRate?.toFixed?.(
                              2
                            ) || "0.00"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Balls</div>
                          <div className="text-sm font-bold text-purple-600">
                            {predictionData?.team1?.topBatsman?.batting
                              ?.totalAvgBallFaced || 0}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Score */}
                      <div className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-green-800">
                            Predicted Score:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {getBattingPrediction(
                              predictionData?.team1?.topBatsman?.batting
                                ?.totalRuns || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 Batsman */}
                  <div
                    className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${getTeamBgColor(
                      2
                    )} rounded-lg border ${getTeamBorderColor(2)}`}
                  >
                    <img
                      src={
                        predictionData?.team2?.topBatsman?.image ||
                        "/placeholder-player.png"
                      }
                      alt={predictionData?.team2?.topBatsman?.name || "Player"}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {predictionData?.team2?.topBatsman?.name ||
                            "Unknown Player"}
                        </h3>
                        <Badge
                          className={getRoleColor(
                            predictionData?.team2?.topBatsman?.role || ""
                          )}
                        >
                          {getRoleIcon(
                            predictionData?.team2?.topBatsman?.role || ""
                          )}
                          <span className="ml-1">
                            {predictionData?.team2?.topBatsman?.role?.split(
                              " "
                            )[0] || "Player"}
                          </span>
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {predictionData?.team2?.name || "Team 2"}
                      </div>

                      {/* Batting Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Total Runs
                          </div>
                          <div className="text-sm font-bold text-green-600">
                            {predictionData?.team2?.topBatsman?.batting
                              ?.totalRuns || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Strike Rate
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            {predictionData?.team2?.topBatsman?.batting?.totalAvgStrikeRate?.toFixed?.(
                              2
                            ) || "0.00"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Balls</div>
                          <div className="text-sm font-bold text-purple-600">
                            {predictionData?.team2?.topBatsman?.batting
                              ?.totalAvgBallFaced || 0}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Score */}
                      <div className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-green-800">
                            Predicted Score:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {getBattingPrediction(
                              predictionData?.team2?.topBatsman?.batting
                                ?.totalRuns || 0
                            )}
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
                  <div
                    className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${getTeamBgColor(
                      1
                    )} rounded-lg border ${getTeamBorderColor(1)}`}
                  >
                    <img
                      src={
                        predictionData?.team1?.topBowler?.image ||
                        "/placeholder-player.png"
                      }
                      alt={predictionData?.team1?.topBowler?.name || "Player"}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {predictionData?.team1?.topBowler?.name ||
                            "Unknown Player"}
                        </h3>
                        <Badge
                          className={getRoleColor(
                            predictionData?.team1?.topBowler?.role || ""
                          )}
                        >
                          {getRoleIcon(
                            predictionData?.team1?.topBowler?.role || ""
                          )}
                          <span className="ml-1">
                            {predictionData?.team1?.topBowler?.role?.split(
                              " "
                            )[0] || "Player"}
                          </span>
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {predictionData?.team1?.name || "Team 1"}
                      </div>

                      {/* Bowling Stats */}
                      <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Overs</div>
                          <div className="text-sm font-bold text-orange-600">
                            {predictionData?.team1?.topBowler?.bowling
                              ?.totalAvgOvers || 0}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Avg Wickets
                          </div>
                          <div className="text-sm font-bold text-purple-600">
                            {predictionData?.team1?.topBowler?.bowling
                              ?.totalAvgWickets || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Runs</div>
                          <div className="text-sm font-bold text-blue-600">
                            {predictionData?.team1?.topBowler?.bowling
                              ?.totalAvgRunsConceded || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Economy</div>
                          <div className="text-sm font-bold text-red-600">
                            {predictionData?.team1?.topBowler?.bowling?.totalAvgEconomy?.toFixed?.(
                              2
                            ) || "0.00"}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Wickets */}
                      <div className="p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-red-800">
                            Predicted Wickets:
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {
                              predictionData?.team1?.topBowler?.bowling
                                ?.totalAvgWickets
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 Bowler */}
                  <div
                    className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${getTeamBgColor(
                      2
                    )} rounded-lg border ${getTeamBorderColor(2)}`}
                  >
                    <img
                      src={
                        predictionData?.team2?.topBowler?.image ||
                        "/placeholder-player.png"
                      }
                      alt={predictionData?.team2?.topBowler?.name || "Player"}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {predictionData?.team2?.topBowler?.name ||
                            "Unknown Player"}
                        </h3>
                        <Badge
                          className={getRoleColor(
                            predictionData?.team2?.topBowler?.role || ""
                          )}
                        >
                          {getRoleIcon(
                            predictionData?.team2?.topBowler?.role || ""
                          )}
                          <span className="ml-1">
                            {predictionData?.team2?.topBowler?.role?.split(
                              " "
                            )[0] || "Player"}
                          </span>
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {predictionData?.team2?.name || "Team 2"}
                      </div>

                      {/* Bowling Stats */}
                      <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-white rounded-lg border">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Overs</div>
                          <div className="text-sm font-bold text-orange-600">
                            {predictionData?.team2?.topBowler?.bowling
                              ?.totalAvgOvers || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            Avg Wickets
                          </div>
                          <div className="text-sm font-bold text-purple-600">
                            {predictionData?.team2?.topBowler?.bowling
                              ?.totalAvgWickets || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg Runs</div>
                          <div className="text-sm font-bold text-blue-600">
                            {predictionData?.team2?.topBowler?.bowling
                              ?.totalAvgRunsConceded || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Economy</div>
                          <div className="text-sm font-bold text-red-600">
                            {predictionData?.team2?.topBowler?.bowling?.totalAvgEconomy?.toFixed?.(
                              2
                            ) || "0.00"}
                          </div>
                        </div>
                      </div>

                      {/* Predicted Wickets */}
                      <div className="p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-red-800">
                            Predicted Wickets:
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {
                              predictionData?.team2?.topBowler?.bowling
                                ?.totalAvgWickets
                            }
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
