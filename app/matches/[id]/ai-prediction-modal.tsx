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
  X,
  Cloud,
  CloudRain,
  Sun,
  MapPin,
  Droplets,
  Wind,
  BarChart4,
  PieChart,
  History,
  Thermometer,
  Gauge,
  TrendingDown,
  Flame,
  Users2,
  TargetIcon,
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
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UserOrderCredit } from "@/app/MainService";
import { GetNewAnalysis } from "./GetNewAnanlysis";

interface TopPlayer {
  name: string;
  shortName: string;
  role: string;
  image: string;
  playerUrl: string;
  impactRuns: number;
  strikeRate: number;
  avgBalls: number;
  impactWickets: number;
  avgRunsConced: number;
}

interface TeamData {
  name: string;
  shortName: string;
  flag: string;
  firstInnings: {
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
  topBatsman: TopPlayer;
  topBowler: TopPlayer;
}

interface VenueRecord {
  vs: string;
  score: string;
}

interface PredictionData {
  team1: TeamData;
  team2: TeamData;
  recentMatchOnVenue: Array<{
    team1: string;
    team1Score: string;
    team1Overs: string;
    team2: string;
    team2Score: string;
    team2Overs: string;
    result: string;
    series: string;
    url: string;
  }>;
  venueStats: {
    matches: string;
    winBatFirst: string;
    winBowlFirst: string;
    avg1stInns: string;
    avg2ndInns: string;
  };
  venueRecords: {
    "Highest Total": VenueRecord;
    "Lowest Total": VenueRecord;
    "Highest Chased": VenueRecord;
    "Lowest Defended": VenueRecord;
  };
  venuePaceVsSpin: {
    paceWickets: string;
    spinWickets: string;
    pacePercent: string;
    spinPercent: string;
  };
  venueWeather: {
    temperature: string;
    condition: string;
    humidity: string;
    rainChance: string;
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
    (state: RootState) => state.auth,
  );
  const { selectedMatch } = useSelector((state: RootState) => state.matches);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null,
  );

  const handleGetPrediction = async () => {
    try {
      setIsLoading(true);

      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (!user || user.credits < 1) {
        toast.error("Insufficient credits. Please purchase more credits.");
        return;
      }

      if (!selectedMatch?._id) {
        toast.error("Match not selected");
        return;
      }

      const payload = {
        ordertype: "prediction",
        userId: user.id,
        credits: 1,
        status: "completed",
        paymentStatus: true,
        paymentMode: "DEDUCTION",
        paymentDate: new Date(),
        matchId: selectedMatch._id, // MUST be string
      };

      // 1️⃣ create order + deduct credit
      const res = await UserOrderCredit(payload);

      dispatch(updateCredits(user.credits - (res?.credits ?? 1)));

      // 2️⃣ small delay (backend consistency)
      await new Promise((r) => setTimeout(r, 300));

      // 3️⃣ generate prediction
      const data: any = await GetNewAnalysis(selectedMatch);

      setPredictionData(data);

      toast.success("AI Prediction generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (!role) return <Users className="h-4 w-4" />;
    if (role === "Batter") {
      return <TargetIcon className="h-4 w-4" />;
    } else if (role === "Bowler") {
      return <Zap className="h-4 w-4" />;
    } else if (role === "All Rounder") {
      return <Star className="h-4 w-4" />;
    } else {
      return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    if (!role) return "bg-gray-100 text-gray-800 border-gray-300";
    if (role === "Batter") {
      return "bg-blue-100 text-blue-800";
    } else if (role === "Bowler") {
      return "bg-red-100 text-red-800";
    } else if (role === "All Rounder") {
      return "bg-purple-100 text-purple-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
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

  const getWeatherIcon = (condition: string) => {
    if (!condition) return <Cloud className="h-5 w-5 text-blue-500" />;
    if (
      condition.toLowerCase().includes("rain") ||
      condition.toLowerCase().includes("thunder")
    )
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    if (
      condition.toLowerCase().includes("sun") ||
      condition.toLowerCase().includes("clear") ||
      condition.toLowerCase().includes("sunny")
    )
      return <Sun className="h-5 w-5 text-yellow-500" />;
    if (condition.toLowerCase().includes("cloud"))
      return <Cloud className="h-5 w-5 text-gray-500" />;
    return <Cloud className="h-5 w-5 text-blue-500" />;
  };

  const formatStrikeRate = (strikeRate: number) => {
    return strikeRate ? strikeRate.toFixed(0) : "0";
  };

  const formatImpactWickets = (impactWickets: number) => {
    return impactWickets ? impactWickets.toFixed(2) : "0.00";
  };

  const formatImpactRuns = (impactRuns: number) => {
    return impactRuns ? impactRuns.toFixed(0) : "0";
  };

  const checkSquad =
    match?.squadList?.[0]?.benchPlayer?.length === 0 &&
    match?.squadList?.[0]?.playingPlayer?.length === 0 &&
    match?.squadList?.[1]?.benchPlayer?.length === 0 &&
    match?.squadList?.[1]?.playingPlayer?.length === 0;

  if (!predictionData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={`
            w-full
            h-full
            p-4
            md:mx-auto md:my-6 md:w-[95%] md:max-w-2xl md:h-auto
            bg-white
            md:rounded-2xl
            md:shadow-xl
            overflow-hidden
            flex
            flex-col
          `}
          aria-label="AI Match Prediction Modal"
        >
          <DialogHeader className="sticky top-0 z-20 bg-white border-b px-2 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-2 text-base md:text-xl">
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Brain className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <span>AI Match Prediction</span>
              </DialogTitle>
              <DialogClose className="ml-3 inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100">
                <span className="sr-only">Close</span>
                <X className="h-5 w-5 text-gray-600" />
              </DialogClose>
            </div>
          </DialogHeader>

          <div
            className={`
              flex-1
              overflow-y-auto
              -mx-4 md:mx-0
              px-4 md:px-6
              py-4 md:py-6
            `}
            style={{
              maxHeight: "calc(100vh - 96px)",
            }}
          >
            {/* LEGAL WARNING */}
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-800 mb-2">
                    ⚖️ LEGAL DISCLAIMER
                  </h3>
                  <p className="text-xs text-red-700">
                    <strong>Betting is illegal in India.</strong> This website
                    provides AI-powered cricket analysis and predictions for
                    informational and entertainment purposes only. We do NOT
                    promote, encourage, or facilitate any form of gambling,
                    betting, or illegal activities. All predictions are based on
                    statistical analysis and should be treated as speculative
                    information only.
                  </p>
                  <div className="mt-2 text-xs text-gray-600">
                    <strong>Remember:</strong> Enjoy cricket as a sport, not as
                    a betting opportunity.
                  </div>
                </div>
              </div>
            </div>

            {checkSquad ? (
              <div className="text-center py-6 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Brain className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Team Squads Not Available Yet
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto px-4">
                  ⏳ Both team squads haven't been announced yet. Please check
                  back later when the teams are finalized to get accurate AI
                  predictions.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <InfoIcon className="h-5 w-5" />
                    <span className="text-xs md:text-sm font-medium">
                      Predictions will be available after squad announcements
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Brain className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Get AI-Powered Match Prediction
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto px-4">
                  Our advanced AI analyzes 50+ factors including player form,
                  pitch conditions, weather, and historical data to provide
                  accurate predictions for informational purposes.
                </p>
                <Button
                  onClick={handleGetPrediction}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 text-white rounded-md"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
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
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          w-full
          h-full
          p-0
          md:mx-auto md:my-6 md:w-[95%] md:max-w-7xl md:h-auto
          bg-white
          md:rounded-2xl
          md:shadow-xl
          overflow-hidden
          flex
          flex-col
        `}
        aria-label="AI Match Prediction Modal"
      >
        {/* Header (sticky) */}
        <DialogHeader className="sticky top-0 z-20 bg-white border-b px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center">
                <Brain className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base md:text-xl lg:text-2xl font-semibold">
                  AI Match Prediction
                </DialogTitle>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={predictionData?.team1?.flag}
                      alt={predictionData?.team1?.shortName || "Team 1"}
                      className="w-5 h-5 md:w-6 md:h-6 rounded object-cover"
                    />
                    <span className="font-medium truncate max-w-[90px] md:max-w-[140px]">
                      {predictionData?.team1?.shortName || "Team 1"}
                    </span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={predictionData?.team2?.flag}
                      alt={predictionData?.team2?.shortName || "Team 2"}
                      className="w-5 h-5 md:w-6 md:h-6 rounded object-cover"
                    />
                    <span className="font-medium truncate max-w-[90px] md:max-w-[140px]">
                      {predictionData?.team2?.shortName || "Team 2"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogClose className="ml-3 inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100">
              <span className="sr-only">Close</span>
              <X className="h-5 w-5 text-gray-600" />
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Content area */}
        <div
          className={`
            flex-1
            overflow-y-auto
            px-4 md:px-6
            py-4 md:py-6
          `}
          style={{
            maxHeight: "calc(100vh - 96px)",
          }}
        >
          {/* LEGAL WARNING */}
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800 mb-2">
                  ⚖️ IMPORTANT LEGAL NOTICE
                </h3>
                <p className="text-xs text-red-700 mb-2">
                  <strong>WARNING:</strong> Betting and gambling are strictly
                  illegal in India under the Public Gambling Act, 1867. This
                  website provides AI-powered cricket analysis and predictions{" "}
                  <strong>FOR INFORMATIONAL PURPOSES ONLY</strong>. We do NOT
                  promote, encourage, or facilitate any form of gambling,
                  betting, or illegal activities. All content is purely for
                  entertainment and educational purposes.
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Disclaimer:</strong> Cricket predictions are based on
                  statistical analysis and AI algorithms. Cricket is an
                  unpredictable sport and actual results may vary. We are not
                  responsible for any decisions made based on this information.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Winner Prediction Card */}
            <Card className="border-0 shadow-sm md:shadow-md">
              <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                  <span>Winner Prediction</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  {/* Team 1 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(
                      1,
                    )} bg-gradient-to-br ${getTeamBgColor(1)} text-center`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start md:space-x-4">
                      <img
                        src={predictionData?.team1?.flag}
                        alt={predictionData?.team1?.shortName || "Team 1"}
                        className="w-9 h-9 md:w-12 md:h-12 rounded-lg shadow-sm mx-auto md:mx-0 object-cover"
                      />
                      <div className="mt-2 md:mt-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                          {predictionData?.team1?.shortName || "Team 1"}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 truncate max-w-[180px]">
                          {predictionData?.team1?.name || "Full Team Name"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 text-2xl md:text-3xl font-extrabold ${getTeamTextColor(
                        1,
                      )}`}
                    >
                      {predictionData?.team1?.winnerPrediction?.probability?.toFixed(
                        2,
                      ) || "0.00"}
                      %
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mt-3">
                      <div
                        className={`h-2 md:h-3 rounded-full bg-gradient-to-r ${getTeamColor(
                          1,
                        )} transition-all duration-500`}
                        style={{
                          width: `${predictionData?.team1?.winnerPrediction?.probability || 0}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-center">
                      <Badge
                        variant="outline"
                        className={`${getConfidenceClass(
                          predictionData?.team1?.winnerPrediction?.confidence ||
                            "",
                        )} text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 flex items-center space-x-2`}
                      >
                        {getConfidenceIcon(
                          predictionData?.team1?.winnerPrediction?.confidence ||
                            "",
                        )}
                        <span className="truncate">
                          {predictionData?.team1?.winnerPrediction
                            ?.confidence || "Unknown"}
                        </span>
                      </Badge>
                    </div>

                    <div
                      className={`mt-3 md:mt-4 text-xs md:text-sm p-2 md:p-3 rounded-lg border ${
                        predictionData?.team1?.winnerPrediction?.hint?.color ||
                        "border-gray-200"
                      }`}
                    >
                      {predictionData?.team1?.winnerPrediction?.hint
                        ?.hintMessage || "No prediction hint available"}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(
                      2,
                    )} bg-gradient-to-br ${getTeamBgColor(2)} text-center`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start md:space-x-4">
                      <img
                        src={predictionData?.team2?.flag}
                        alt={predictionData?.team2?.shortName || "Team 2"}
                        className="w-9 h-9 md:w-12 md:h-12 rounded-lg shadow-sm mx-auto md:mx-0 object-cover"
                      />
                      <div className="mt-2 md:mt-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                          {predictionData?.team2?.shortName || "Team 2"}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 truncate max-w-[180px]">
                          {predictionData?.team2?.name || "Full Team Name"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 text-2xl md:text-3xl font-extrabold ${getTeamTextColor(
                        2,
                      )}`}
                    >
                      {predictionData?.team2?.winnerPrediction?.probability?.toFixed(
                        2,
                      ) || "0.00"}
                      %
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mt-3">
                      <div
                        className={`h-2 md:h-3 rounded-full bg-gradient-to-r ${getTeamColor(
                          2,
                        )} transition-all duration-500`}
                        style={{
                          width: `${predictionData?.team2?.winnerPrediction?.probability || 0}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-center">
                      <Badge
                        variant="outline"
                        className={`${getConfidenceClass(
                          predictionData?.team2?.winnerPrediction?.confidence ||
                            "",
                        )} text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 flex items-center space-x-2`}
                      >
                        {getConfidenceIcon(
                          predictionData?.team2?.winnerPrediction?.confidence ||
                            "",
                        )}
                        <span className="truncate">
                          {predictionData?.team2?.winnerPrediction
                            ?.confidence || "Unknown"}
                        </span>
                      </Badge>
                    </div>

                    <div
                      className={`mt-3 md:mt-4 text-xs md:text-sm p-2 md:p-3 rounded-lg border ${
                        predictionData?.team2?.winnerPrediction?.hint?.color ||
                        "border-gray-200"
                      }`}
                    >
                      {predictionData?.team2?.winnerPrediction?.hint
                        ?.hintMessage || "No prediction hint available"}
                    </div>
                  </div>
                </div>

                {/* Informational Note */}
                <div className="mt-4 p-3 rounded-lg border bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3 text-xs md:text-sm text-blue-800">
                    <InfoIcon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                    <div>
                      <strong className="font-semibold">Note:</strong> This
                      prediction is based on AI analysis of multiple factors
                      including player form, venue history, and weather
                      conditions. It is provided for informational purposes
                      only.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* First Innings Score Prediction */}
            <Card className="border-0 shadow-sm md:shadow-md">
              <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  <span>First Innings Score Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  {/* Team 1 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(
                      1,
                    )} bg-gradient-to-br ${getTeamBgColor(1)} text-center`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={predictionData?.team1?.flag}
                          alt={predictionData?.team1?.shortName || "Team 1"}
                          className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                        />
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {predictionData?.team1?.shortName || "Team 1"}
                        </h3>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-4">
                        {predictionData?.team1?.name || "Full Team Name"}
                      </p>

                      <div
                        className={`text-2xl md:text-3xl font-bold ${getTeamTextColor(
                          1,
                        )} mb-3`}
                      >
                        {predictionData?.team1?.firstInnings?.predicted || 0}
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border mb-2 w-full">
                        Range:{" "}
                        <span className="font-semibold">
                          {predictionData?.team1?.firstInnings?.min || 0} -{" "}
                          {predictionData?.team1?.firstInnings?.max || 0}
                        </span>
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border w-full">
                        Predicted Wickets:{" "}
                        <span className="font-semibold text-red-600">
                          {predictionData?.team1?.firstInnings?.wickets || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(
                      2,
                    )} bg-gradient-to-br ${getTeamBgColor(2)} text-center`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={predictionData?.team2?.flag}
                          alt={predictionData?.team2?.shortName || "Team 2"}
                          className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                        />
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {predictionData?.team2?.shortName || "Team 2"}
                        </h3>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-4">
                        {predictionData?.team2?.name || "Full Team Name"}
                      </p>

                      <div
                        className={`text-2xl md:text-3xl font-bold ${getTeamTextColor(
                          2,
                        )} mb-3`}
                      >
                        {predictionData?.team2?.firstInnings?.predicted || 0}
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border mb-2 w-full">
                        Range:{" "}
                        <span className="font-semibold">
                          {predictionData?.team2?.firstInnings?.min || 0} -{" "}
                          {predictionData?.team2?.firstInnings?.max || 0}
                        </span>
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border w-full">
                        Predicted Wickets:{" "}
                        <span className="font-semibold text-red-600">
                          {predictionData?.team2?.firstInnings?.wickets || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Top Batsmen */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <Target className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                    <span>Top Batsmen Prediction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  <div className="space-y-4 md:space-y-6">
                    {/* Team 1 Batsman */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(
                        1,
                      )} bg-gradient-to-r ${getTeamBgColor(1)}`}
                    >
                      <img
                        src={
                          predictionData?.team1?.topBatsman?.image ||
                          "/placeholder-player.png"
                        }
                        alt={
                          predictionData?.team1?.topBatsman?.name || "Player"
                        }
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData?.team1?.topBatsman?.name ||
                                "Unknown Player"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(
                              predictionData?.team1?.topBatsman?.role || "",
                            )} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData?.team1?.topBatsman?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData?.team1?.topBatsman?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData?.team1?.name || "Team 1"}
                        </div>

                        {/* Batting Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Runs
                            </div>
                            <div className="text-sm font-bold text-green-600">
                              {formatImpactRuns(
                                predictionData?.team1?.topBatsman?.impactRuns ||
                                  0,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Strike Rate
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {formatStrikeRate(
                                predictionData?.team1?.topBatsman?.strikeRate ||
                                  0,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Avg Balls
                            </div>
                            <div className="text-sm font-bold text-purple-600">
                              {predictionData?.team1?.topBatsman?.avgBalls?.toFixed(
                                1,
                              ) || "0.0"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team 2 Batsman */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(
                        2,
                      )} bg-gradient-to-r ${getTeamBgColor(2)}`}
                    >
                      <img
                        src={
                          predictionData?.team2?.topBatsman?.image ||
                          "/placeholder-player.png"
                        }
                        alt={
                          predictionData?.team2?.topBatsman?.name || "Player"
                        }
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData?.team2?.topBatsman?.name ||
                                "Unknown Player"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(
                              predictionData?.team2?.topBatsman?.role || "",
                            )} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData?.team2?.topBatsman?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData?.team2?.topBatsman?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData?.team2?.name || "Team 2"}
                        </div>

                        {/* Batting Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Runs
                            </div>
                            <div className="text-sm font-bold text-green-600">
                              {formatImpactRuns(
                                predictionData?.team2?.topBatsman?.impactRuns ||
                                  0,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Strike Rate
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {formatStrikeRate(
                                predictionData?.team2?.topBatsman?.strikeRate ||
                                  0,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Avg Balls
                            </div>
                            <div className="text-sm font-bold text-purple-600">
                              {predictionData?.team2?.topBatsman?.avgBalls?.toFixed(
                                1,
                              ) || "0.0"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Bowlers */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span>Top Bowlers Prediction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  <div className="space-y-4 md:space-y-6">
                    {/* Team 1 Bowler */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(
                        1,
                      )} bg-gradient-to-r ${getTeamBgColor(1)}`}
                    >
                      <img
                        src={
                          predictionData?.team1?.topBowler?.image ||
                          "/placeholder-player.png"
                        }
                        alt={predictionData?.team1?.topBowler?.name || "Player"}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData?.team1?.topBowler?.name ||
                                "Unknown Player"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(
                              predictionData?.team1?.topBowler?.role || "",
                            )} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData?.team1?.topBowler?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData?.team1?.topBowler?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData?.team1?.name || "Team 1"}
                        </div>

                        {/* Bowling Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Wickets
                            </div>
                            <div className="text-sm font-bold text-purple-600">
                              {formatImpactWickets(
                                predictionData?.team1?.topBowler
                                  ?.impactWickets || 0,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Runs Conceded
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {predictionData?.team1?.topBowler?.avgRunsConced?.toFixed(
                                1,
                              ) || "0.0"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team 2 Bowler */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(
                        2,
                      )} bg-gradient-to-r ${getTeamBgColor(2)}`}
                    >
                      <img
                        src={
                          predictionData?.team2?.topBowler?.image ||
                          "/placeholder-player.png"
                        }
                        alt={predictionData?.team2?.topBowler?.name || "Player"}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData?.team2?.topBowler?.name ||
                                "Unknown Player"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(
                              predictionData?.team2?.topBowler?.role || "",
                            )} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData?.team2?.topBowler?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData?.team2?.topBowler?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData?.team2?.name || "Team 2"}
                        </div>

                        {/* Bowling Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Wickets
                            </div>
                            <div className="text-sm font-bold text-purple-600">
                              {formatImpactWickets(
                                predictionData?.team2?.topBowler
                                  ?.impactWickets || 0,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Runs Conceded
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {predictionData?.team2?.topBowler?.avgRunsConced?.toFixed(
                                1,
                              ) || "0.0"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Match Conditions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Recent Matches at Venue */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <History className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                    <span>Recent Matches at Venue</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  {predictionData?.recentMatchOnVenue &&
                  predictionData.recentMatchOnVenue.length > 0 ? (
                    <div className="space-y-3">
                      {predictionData.recentMatchOnVenue
                        .slice(0, 5)
                        .map((match, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                  {match.series}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-medium">
                                    {match.team1}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    vs
                                  </span>
                                  <span className="text-sm font-medium">
                                    {match.team2}
                                  </span>
                                </div>
                              </div>
                              <Badge
                                className={`text-xs ${
                                  match.result.includes("Won")
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {match.result}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="font-medium">{match.team1}</div>
                                <div className="font-bold text-blue-600">
                                  {match.team1Score}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  ({match.team1Overs})
                                </div>
                              </div>
                              <div className="text-center p-2 bg-red-50 rounded">
                                <div className="font-medium">{match.team2}</div>
                                <div className="font-bold text-red-600">
                                  {match.team2Score}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  ({match.team2Overs})
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Venue match history data not available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weather Conditions */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <Cloud className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span>Weather Conditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  {predictionData?.venueWeather ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Temperature
                          </span>
                        </div>
                        <div className="text-lg font-bold">
                          {predictionData.venueWeather.temperature}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <div className="flex justify-center mb-2">
                            {getWeatherIcon(
                              predictionData.venueWeather.condition,
                            )}
                          </div>
                          <div className="text-xs text-gray-500">Condition</div>
                          <div className="text-sm font-medium">
                            {predictionData.venueWeather.condition}
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <Droplets className="h-5 w-5 text-green-500 mx-auto mb-2" />
                          <div className="text-xs text-gray-500">Humidity</div>
                          <div className="text-sm font-medium">
                            {predictionData.venueWeather.humidity}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CloudRain className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">
                            Rain Chance
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={parseInt(
                              predictionData.venueWeather.rainChance.split(
                                " ",
                              )[0],
                            )}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm font-bold">
                            {predictionData.venueWeather.rainChance}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Cloud className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Weather data not available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Venue Statistics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Venue Stats */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <BarChart4 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    <span>Venue Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  {predictionData?.venueStats ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {predictionData.venueStats.matches}
                          </div>
                          <div className="text-xs text-gray-600">
                            Total Matches
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {predictionData.venueStats.avg1stInns}
                          </div>
                          <div className="text-xs text-gray-600">
                            Avg 1st Innings
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Batting First Wins
                            </span>
                            <span className="font-medium">
                              {predictionData.venueStats.winBatFirst}
                            </span>
                          </div>
                          <Progress
                            value={parseInt(
                              predictionData.venueStats.winBatFirst,
                            )}
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Bowling First Wins
                            </span>
                            <span className="font-medium">
                              {predictionData.venueStats.winBowlFirst}
                            </span>
                          </div>
                          <Progress
                            value={parseInt(
                              predictionData.venueStats.winBowlFirst,
                            )}
                            className="h-2"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Average 2nd Innings Score
                        </div>
                        <div className="text-lg font-bold text-purple-600">
                          {predictionData.venueStats.avg2ndInns} runs
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart4 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Venue statistics not available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pace vs Spin */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <PieChart className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                    <span>Pace vs Spin Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  {predictionData?.venuePaceVsSpin ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg text-center">
                          <Zap className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <div className="text-xl font-bold text-blue-600">
                            {predictionData.venuePaceVsSpin.paceWickets}
                          </div>
                          <div className="text-xs text-gray-600">
                            Pace Wickets
                          </div>
                          <div className="text-xs text-blue-500 font-medium mt-1">
                            {predictionData.venuePaceVsSpin.pacePercent}
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg text-center">
                          <Gauge className="h-6 w-6 text-red-500 mx-auto mb-2" />
                          <div className="text-xl font-bold text-red-600">
                            {predictionData.venuePaceVsSpin.spinWickets}
                          </div>
                          <div className="text-xs text-gray-600">
                            Spin Wickets
                          </div>
                          <div className="text-xs text-red-500 font-medium mt-1">
                            {predictionData.venuePaceVsSpin.spinPercent}
                          </div>
                        </div>
                      </div>

                      <div className="relative pt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Pace Bowling</span>
                          <span>Spin Bowling</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-red-500 h-3 rounded-full"
                            style={{
                              width: `${parseInt(predictionData.venuePaceVsSpin.spinPercent) || 50}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Dominant</span>
                          <span>Supportive</span>
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-xs text-yellow-800">
                          <strong>Analysis:</strong>{" "}
                          {parseInt(
                            predictionData.venuePaceVsSpin.spinPercent,
                          ) > 50
                            ? "Spin bowling has been more effective at this venue."
                            : "Pace bowling plays a crucial role at this venue."}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Pace vs Spin analysis not available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Venue Records */}
            <Card className="border-0 shadow-sm md:shadow-md">
              <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                  <span>Venue Records</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                {predictionData?.venueRecords ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="text-xs text-gray-500 mb-1">
                        Highest Total
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        {predictionData?.venueRecords?.["Highest Total"]
                          ?.score || "N/A"}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {predictionData?.venueRecords?.["Highest Total"]?.vs ||
                          "N/A"}
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200">
                      <div className="text-xs text-gray-500 mb-1">
                        Lowest Total
                      </div>
                      <div className="text-lg font-bold text-red-700">
                        {predictionData?.venueRecords?.["Lowest Total"]
                          ?.score || "N/A"}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {predictionData?.venueRecords?.["Lowest Total"]?.vs ||
                          "N/A"}
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-gray-500 mb-1">
                        Highest Chased
                      </div>
                      <div className="text-lg font-bold text-blue-700">
                        {predictionData?.venueRecords?.["Highest Chased"]
                          ?.score || "N/A"}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {predictionData?.venueRecords?.["Highest Chased"]?.vs ||
                          "N/A"}
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <div className="text-xs text-gray-500 mb-1">
                        Lowest Defended
                      </div>
                      <div className="text-lg font-bold text-purple-700">
                        {predictionData?.venueRecords?.["Lowest Defended"]
                          ?.score || "N/A"}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {predictionData?.venueRecords?.["Lowest Defended"]
                          ?.vs || "N/A"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Venue records not available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Final Disclaimer */}
            <div className="mt-4 p-4 rounded-lg border border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 mb-2">
                    ⚖️ LEGAL DISCLAIMER & IMPORTANT NOTICE
                  </h4>
                  <div className="text-xs text-red-700 space-y-2">
                    <p>
                      <strong>WARNING:</strong> Gambling and betting are
                      strictly prohibited by law in India. The Public Gambling
                      Act of 1867 makes operating or visiting a gambling house
                      illegal.
                    </p>
                    <p>
                      <strong>PURPOSE:</strong> This website provides AI-powered
                      cricket analysis and predictions
                      <strong>
                        {" "}
                        FOR INFORMATIONAL AND ENTERTAINMENT PURPOSES ONLY
                      </strong>
                      . We do NOT promote, encourage, or facilitate any form of
                      gambling, betting, or illegal activities.
                    </p>
                    <p>
                      <strong>DISCLAIMER:</strong> All predictions are based on
                      statistical analysis and AI algorithms. Cricket is an
                      unpredictable sport and actual results may vary. We are
                      not responsible for any decisions made based on this
                      information.
                    </p>
                    <div className="mt-2 p-2 bg-white rounded border border-red-200">
                      <p className="text-xs text-gray-600">
                        <strong>Remember:</strong> Enjoy cricket as a sport.
                        Respect the game, respect the law.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPredictionModal;
