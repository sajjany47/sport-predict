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
  Sparkles,
  Brain,
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
  Droplets,
  BarChart4,
  Thermometer,
  Users2,
  TargetIcon,
  Activity,
  Home,
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
import { UserOrderCredit } from "@/app/MainService";
import { Prediction } from "@/app/api/order/Prediction";

// Interfaces based on the actual JSON structure
interface Player {
  name: string;
  shortName: string;
  role: string;
  isWK: boolean;
  image: string;
  style: string;
  impactRun: number;
  impactWicket: number;
  impactRunConced: number;
  impactScore: number;
}

interface TeamPrediction {
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
  topBatsman: Player;
  topBowler: Player;
  keyPlayers: Player[];
}

interface Dream11Player extends Player {
  team: string;
  isCaptain: boolean;
  isViceCaptain: boolean;
}

interface RecentMatch {
  team1: string;
  team1Score: string;
  team1Overs: string;
  team2: string;
  team2Score: string;
  team2Overs: string;
  result: string;
  series: string;
  url: string;
}

interface PredictionData {
  team1: TeamPrediction;
  team2: TeamPrediction;
  dream11Team: Dream11Player[];
  venueStats: {
    matches: string;
    winBatFirst: string;
    winBowlFirst: string;
    avg1stInns: string;
    avg2ndInns: string;
    venueName?: string;
    paceVsSpin?: {
      paceWickets: string;
      spinWickets: string;
    };
  };
  venueWeather: {
    temperature: string;
    condition: string;
    humidity: string;
    rainChance: string;
  };
  recentMatchOnVenue?: RecentMatch[];
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
        router.push("/subscription");
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
        matchId: selectedMatch._id,
      };

      const res = await UserOrderCredit(payload);
      dispatch(updateCredits(user.credits - (res?.credits ?? 1)));

      await new Promise((r) => setTimeout(r, 1000));

      const data: any = await Prediction(match);
      setPredictionData(data);
      toast.success("AI Prediction generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string = "") => {
    const r = role.toLowerCase();
    if (r.includes("batsman") || r.includes("batter"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (r.includes("bowler"))
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (r.includes("all-rounder"))
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (r.includes("keeper"))
      return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getRoleIcon = (role: string) => {
    if (!role) return <Users className="h-3 w-3" />;
    if (role.includes("Batter") || role.includes("Batsman")) {
      return <TargetIcon className="h-3 w-3" />;
    } else if (role.includes("Bowler")) {
      return <Zap className="h-3 w-3" />;
    } else if (role.includes("All Rounder")) {
      return <Star className="h-3 w-3" />;
    } else {
      return <Users className="h-3 w-3" />;
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    if (!confidence) return <Wifi className="h-3 w-3 text-gray-600" />;
    switch (confidence) {
      case "High":
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case "Medium":
        return <TrendingUp className="h-3 w-3 text-yellow-600" />;
      case "Low":
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default:
        return <Wifi className="h-3 w-3 text-gray-600" />;
    }
  };

  const formatNumber = (num: number | undefined, decimals: number = 0) => {
    if (num === undefined || num === null) return "0";
    return num.toFixed(decimals);
  };

  const checkSquad =
    match?.squadList?.[0]?.benchPlayer?.length === 0 &&
    match?.squadList?.[0]?.playingPlayer?.length === 0 &&
    match?.squadList?.[1]?.benchPlayer?.length === 0 &&
    match?.squadList?.[1]?.playingPlayer?.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-gray-50 border-0 shadow-2xl rounded-3xl h-[90vh] md:h-auto flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>AI Match Oracle Alpha</DialogTitle>
        </DialogHeader>

        {/* Premium Header */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">
                AI Prediction Oracle
              </h2>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                  Live Neural Analysis
                </span>
              </div>
            </div>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 pb-12 scroll-smooth">
          {!predictionData ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)] animate-pulse"></div>
              <div className="relative mb-8 transform group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20"></div>
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-[32px] shadow-2xl relative z-10 ring-8 ring-indigo-50">
                  <Zap className="h-12 w-12 text-white fill-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tighter">
                Initialize Prediction
              </h3>
              <p className="text-sm text-gray-500 mb-10 max-w-xs text-center font-bold leading-relaxed px-4">
                Unlock high-density probability metrics and player impact scores
                for 1 Credit.
              </p>
              <Button
                onClick={handleGetPrediction}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-8 rounded-3xl shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 group font-black uppercase tracking-widest text-sm relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="italic">Synthesizing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 group-hover:rotate-12 transition-transform" />
                    <span>Generate AI Insight</span>
                  </div>
                )}
              </Button>
            </div>
          ) : (
            <>
              {/* Winner Probability Matrix */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                    <Trophy className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">
                    Dominance Metrics
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      team: predictionData.team1,
                      color: "blue",
                      secondary: "indigo",
                    },
                    {
                      team: predictionData.team2,
                      color: "rose",
                      secondary: "red",
                    },
                  ].map(({ team, color, secondary }, idx) => (
                    <Card
                      key={idx}
                      className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-${color}-50 group hover:shadow-2xl transition-all duration-500 rounded-[32px]`}
                    >
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-${color}-500/10 transition-all duration-700`}
                      ></div>
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-white blur-xl opacity-50"></div>
                              <div
                                className={`relative p-1.5 rounded-[20px] bg-white shadow-xl ring-2 ring-${color}-100 transform group-hover:rotate-6 transition-transform`}
                              >
                                <img
                                  src={team?.flag}
                                  alt={team?.shortName}
                                  className="w-14 h-14 rounded-xl object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 text-xl leading-none uppercase tracking-tighter mb-1">
                                {team?.shortName}
                              </h4>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">
                                Contender Status
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-4xl font-black italic tracking-tighter text-${color}-600 drop-shadow-sm group-hover:scale-110 transition-transform`}
                            >
                              {team?.winnerPrediction?.probability?.toFixed(1)}%
                            </div>
                            <Badge
                              className={`bg-${color}-100 text-${color}-700 border-${color}-200 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 italic mt-1`}
                            >
                              Win Probability
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                            <span className="text-gray-400">
                              Confidence Rating
                            </span>
                            <span
                              className={`text-${color}-600 bg-${color}-50 px-2 py-0.5 rounded-full border border-${color}-100 flex items-center gap-1`}
                            >
                              {getConfidenceIcon(
                                team?.winnerPrediction?.confidence || "",
                              )}
                              {team?.winnerPrediction?.confidence || "Medium"}{" "}
                              Level
                            </span>
                          </div>
                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r from-${color}-500 to-${secondary}-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out relative group-hover:scale-[1.02]`}
                              style={{
                                width: `${team?.winnerPrediction?.probability || 0}%`,
                              }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 mt-4">
                            <p className="text-[11px] text-gray-600 italic font-bold leading-relaxed">
                              "{team?.winnerPrediction?.hint?.hintMessage}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Innings Projection Grid */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">
                    Score Forecasting
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { team: predictionData.team1, color: "blue" },
                    { team: predictionData.team2, color: "rose" },
                  ].map(({ team, color }, idx) => (
                    <Card
                      key={idx}
                      className="border-0 shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white rounded-[32px] ring-1 ring-gray-100"
                    >
                      <CardContent className="p-0">
                        <div
                          className={`h-2 bg-gradient-to-r from-${color}-500 to-transparent w-full`}
                        ></div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img
                                  src={team?.flag}
                                  alt={team?.shortName}
                                  className="w-12 h-12 rounded-full object-cover border-4 border-gray-50 shadow-md group-hover:scale-110 transition-transform"
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-5 h-5 bg-${color}-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg`}
                                >
                                  <TrendingUp className="w-2.5 h-2.5 text-white" />
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                                  Projected Target
                                </p>
                                <h4 className="font-black text-gray-900 uppercase text-lg tracking-tight">
                                  {team?.shortName}
                                </h4>
                              </div>
                            </div>
                            <div
                              className={`text-3xl font-black italic tracking-tighter text-${color}-700 bg-${color}-50/50 px-6 py-3 rounded-[24px] border border-${color}-100 group-hover:scale-105 transition-transform shadow-inner`}
                            >
                              {team?.firstInnings?.predicted}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 shadow-sm">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Expected Range
                              </p>
                              <p className="text-sm font-black text-gray-800 italic">
                                {team?.firstInnings?.min} —{" "}
                                {team?.firstInnings?.max}
                              </p>
                            </div>
                            <div className="bg-red-50/50 rounded-2xl p-3 border border-red-100 shadow-sm">
                              <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">
                                Risk Factor
                              </p>
                              <p className="text-sm font-black text-red-600 italic">
                                ~{team?.firstInnings?.wickets} Wkts
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Top Performers - Both Teams */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">
                    Impact Players
                  </h3>
                </div>

                {/* Top Batsmen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[34px] blur opacity-10 group-hover:opacity-25 transition-opacity duration-500"></div>
                    <Card className="relative bg-white border-0 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 flex justify-between items-center">
                        <Badge className="bg-white/20 text-white border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 italic rounded-full">
                          Primary Striker
                        </Badge>
                        <Target className="w-5 h-5 text-blue-100 opacity-80" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl ring-4 ring-blue-50 bg-gray-100 transform group-hover:rotate-3 transition-transform duration-500">
                              <img
                                src={
                                  predictionData.team1?.topBatsman?.image ||
                                  "/placeholder-player.png"
                                }
                                alt={predictionData.team1?.topBatsman?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-xl uppercase tracking-tighter leading-tight truncate group-hover:text-blue-600 transition-colors">
                              {predictionData.team1?.topBatsman?.name}
                            </h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                {getRoleIcon(
                                  predictionData.team1?.topBatsman?.role || "",
                                )}
                                {predictionData.team1?.topBatsman?.role}
                              </span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                              <span className="text-blue-500">
                                {predictionData.team1?.shortName}
                              </span>
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-6 pt-5 border-t border-gray-50">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                                  Exp. Damage
                                </p>
                                <p className="text-lg font-black text-blue-600 italic">
                                  +{predictionData.team1?.topBatsman?.impactRun}{" "}
                                  Runs
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[34px] blur opacity-10 group-hover:opacity-25 transition-opacity duration-500"></div>
                    <Card className="relative bg-white border-0 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 flex justify-between items-center">
                        <Badge className="bg-white/20 text-white border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 italic rounded-full">
                          Primary Striker
                        </Badge>
                        <Target className="w-5 h-5 text-blue-100 opacity-80" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl ring-4 ring-blue-50 bg-gray-100 transform group-hover:rotate-3 transition-transform duration-500">
                              <img
                                src={
                                  predictionData.team2?.topBatsman?.image ||
                                  "/placeholder-player.png"
                                }
                                alt={predictionData.team2?.topBatsman?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-xl uppercase tracking-tighter leading-tight truncate group-hover:text-blue-600 transition-colors">
                              {predictionData.team2?.topBatsman?.name}
                            </h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                {getRoleIcon(
                                  predictionData.team2?.topBatsman?.role || "",
                                )}
                                {predictionData.team2?.topBatsman?.role}
                              </span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                              <span className="text-rose-500">
                                {predictionData.team2?.shortName}
                              </span>
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-6 pt-5 border-t border-gray-50">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                                  Exp. Damage
                                </p>
                                <p className="text-lg font-black text-blue-600 italic">
                                  +{predictionData.team2?.topBatsman?.impactRun}{" "}
                                  Runs
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Top Bowlers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[34px] blur opacity-10 group-hover:opacity-25 transition-opacity duration-500"></div>
                    <Card className="relative bg-white border-0 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-3 flex justify-between items-center">
                        <Badge className="bg-white/20 text-white border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 italic rounded-full">
                          Death Specialist
                        </Badge>
                        <Zap className="w-5 h-5 text-emerald-100 opacity-80" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl ring-4 ring-emerald-50 bg-gray-100 transform group-hover:-rotate-3 transition-transform duration-500">
                              <img
                                src={
                                  predictionData.team1?.topBowler?.image ||
                                  "/placeholder-player.png"
                                }
                                alt={predictionData.team1?.topBowler?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-xl uppercase tracking-tighter leading-tight truncate group-hover:text-emerald-600 transition-colors">
                              {predictionData.team1?.topBowler?.name}
                            </h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                {getRoleIcon(
                                  predictionData.team1?.topBowler?.role || "",
                                )}
                                {predictionData.team1?.topBowler?.role}
                              </span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                              <span className="text-emerald-500">
                                {predictionData.team1?.shortName}
                              </span>
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-6 pt-5 border-t border-gray-50">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                                  Wicket Prob.
                                </p>
                                <p className="text-lg font-black text-emerald-600 italic">
                                  {
                                    predictionData.team1?.topBowler
                                      ?.impactWicket
                                  }{" "}
                                  Wkt
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[34px] blur opacity-10 group-hover:opacity-25 transition-opacity duration-500"></div>
                    <Card className="relative bg-white border-0 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-3 flex justify-between items-center">
                        <Badge className="bg-white/20 text-white border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 italic rounded-full">
                          Death Specialist
                        </Badge>
                        <Zap className="w-5 h-5 text-emerald-100 opacity-80" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl ring-4 ring-emerald-50 bg-gray-100 transform group-hover:-rotate-3 transition-transform duration-500">
                              <img
                                src={
                                  predictionData.team2?.topBowler?.image ||
                                  "/placeholder-player.png"
                                }
                                alt={predictionData.team2?.topBowler?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-xl uppercase tracking-tighter leading-tight truncate group-hover:text-emerald-600 transition-colors">
                              {predictionData.team2?.topBowler?.name}
                            </h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                {getRoleIcon(
                                  predictionData.team2?.topBowler?.role || "",
                                )}
                                {predictionData.team2?.topBowler?.role}
                              </span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                              <span className="text-rose-500">
                                {predictionData.team2?.shortName}
                              </span>
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-6 pt-5 border-t border-gray-50">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                                  Wicket Prob.
                                </p>
                                <p className="text-lg font-black text-emerald-600 italic">
                                  {
                                    predictionData.team2?.topBowler
                                      ?.impactWicket
                                  }{" "}
                                  Wkt
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Key Players Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-50 rounded-xl border border-yellow-100">
                    <Users className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">
                    Key Players Analysis
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team 1 Key Players */}
                  <Card className="border-0 shadow-xl bg-white rounded-[32px] overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={predictionData.team1?.flag}
                          alt=""
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                        />
                        <h4 className="font-black text-white text-lg uppercase tracking-tighter">
                          {predictionData.team1?.shortName} - Core Assets
                        </h4>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {predictionData.team1?.keyPlayers?.map(
                          (player, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-white rounded-2xl border border-blue-100 hover:shadow-md transition-all group"
                            >
                              <div className="relative shrink-0">
                                <img
                                  src={
                                    player.image || "/placeholder-player.png"
                                  }
                                  alt={player.name}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <Star className="w-2.5 h-2.5 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-tighter truncate">
                                    {player.shortName}
                                  </h5>
                                  <Badge
                                    className={`${getRoleColor(player.role)} text-[9px] px-2 py-0.5`}
                                  >
                                    {player.role}
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-gray-500 font-mono mb-3">
                                  {player.style}
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="text-center p-1.5 bg-white rounded-xl border border-gray-100">
                                    <p className="text-[7px] font-black text-gray-400 uppercase">
                                      Runs
                                    </p>
                                    <p className="text-xs font-black text-blue-600">
                                      {formatNumber(player.impactRun)}
                                    </p>
                                  </div>
                                  <div className="text-center p-1.5 bg-white rounded-xl border border-gray-100">
                                    <p className="text-[7px] font-black text-gray-400 uppercase">
                                      Wkts
                                    </p>
                                    <p className="text-xs font-black text-emerald-600">
                                      {formatNumber(player.impactWicket)}
                                    </p>
                                  </div>
                                  <div className="text-center p-1.5 bg-white rounded-xl border border-gray-100">
                                    <p className="text-[7px] font-black text-gray-400 uppercase">
                                      Pts
                                    </p>
                                    <p className="text-xs font-black text-purple-600">
                                      {formatNumber(player.impactScore)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team 2 Key Players */}
                  <Card className="border-0 shadow-xl bg-white rounded-[32px] overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-600 to-red-700 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={predictionData.team2?.flag}
                          alt=""
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                        />
                        <h4 className="font-black text-white text-lg uppercase tracking-tighter">
                          {predictionData.team2?.shortName} - Core Assets
                        </h4>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {predictionData.team2?.keyPlayers?.map(
                          (player, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50/50 to-white rounded-2xl border border-rose-100 hover:shadow-md transition-all group"
                            >
                              <div className="relative shrink-0">
                                <img
                                  src={
                                    player.image || "/placeholder-player.png"
                                  }
                                  alt={player.name}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <Star className="w-2.5 h-2.5 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-tighter truncate">
                                    {player.shortName}
                                  </h5>
                                  <Badge
                                    className={`${getRoleColor(player.role)} text-[9px] px-2 py-0.5`}
                                  >
                                    {player.role}
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-gray-500 font-mono mb-3">
                                  {player.style}
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="text-center p-1.5 bg-white rounded-xl border border-gray-100">
                                    <p className="text-[7px] font-black text-gray-400 uppercase">
                                      Runs
                                    </p>
                                    <p className="text-xs font-black text-blue-600">
                                      {formatNumber(player.impactRun)}
                                    </p>
                                  </div>
                                  <div className="text-center p-1.5 bg-white rounded-xl border border-gray-100">
                                    <p className="text-[7px] font-black text-gray-400 uppercase">
                                      Wkts
                                    </p>
                                    <p className="text-xs font-black text-emerald-600">
                                      {formatNumber(player.impactWicket)}
                                    </p>
                                  </div>
                                  <div className="text-center p-1.5 bg-white rounded-xl border border-gray-100">
                                    <p className="text-[7px] font-black text-gray-400 uppercase">
                                      Pts
                                    </p>
                                    <p className="text-xs font-black text-purple-600">
                                      {formatNumber(player.impactScore)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Elite XI Selection */}
              {/* Elite XI Selection with Detailed Impact Metrics */}
              {predictionData.dream11Team &&
                predictionData.dream11Team.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <Users2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">
                            AI Elite Selection
                          </h3>
                          <p className="text-[10px] text-gray-500 font-medium mt-1">
                            Algorithm-based optimal XI based on impact metrics
                          </p>
                        </div>
                        <Badge className="bg-emerald-600 text-white border-0 font-black italic tracking-tighter text-[10px] px-3 py-1.5">
                          Recommended XI
                        </Badge>
                      </div>
                    </div>

                    <Card className="border-0 shadow-2xl overflow-hidden bg-white rounded-[40px] ring-1 ring-gray-100">
                      <CardContent className="p-6 md:p-8">
                        {/* Stats Legend */}
                        <div className="mb-6 pb-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                              <span>Impact Runs</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                              <span>Impact Wickets</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                              <span>Impact Points</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-[8px] font-black bg-amber-50 border-amber-200 text-amber-700"
                            >
                              C = Captain (2x Points)
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[8px] font-black bg-indigo-50 border-indigo-200 text-indigo-700"
                            >
                              VC = Vice Captain (1.5x Points)
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                          {predictionData.dream11Team.map((player, index) => {
                            // Calculate selection reason based on highest impact
                            const isBatsman =
                              player.role?.toLowerCase().includes("batsman") ||
                              player.role?.toLowerCase().includes("batter");
                            const isBowler = player.role
                              ?.toLowerCase()
                              .includes("bowler");
                            const isAllRounder = player.role
                              ?.toLowerCase()
                              .includes("all-rounder");

                            let primaryStrength = "";
                            let strengthValue = "";
                            let strengthColor = "";

                            if (
                              isBatsman ||
                              (!isBowler &&
                                player.impactRun > player.impactWicket)
                            ) {
                              primaryStrength = "Batting Anchor";
                              strengthValue = `${formatNumber(player.impactRun)} runs`;
                              strengthColor = "text-blue-600 bg-blue-50";
                            } else if (isBowler) {
                              primaryStrength = "Bowling Attack";
                              strengthValue = `${formatNumber(player.impactWicket)} wickets`;
                              strengthColor = "text-emerald-600 bg-emerald-50";
                            } else if (isAllRounder) {
                              primaryStrength = "Dual Threat";
                              strengthValue = `${formatNumber(player.impactRun)} runs & ${formatNumber(player.impactWicket)} wkts`;
                              strengthColor = "text-purple-600 bg-purple-50";
                            } else {
                              primaryStrength = "Impact Player";
                              strengthValue = `${formatNumber(player.impactScore)} pts`;
                              strengthColor = "text-amber-600 bg-amber-50";
                            }

                            return (
                              <div
                                key={index}
                                className={`relative p-5 rounded-2xl transition-all duration-300 group hover:shadow-xl border-2 ${
                                  player.isCaptain
                                    ? "border-amber-400 bg-gradient-to-br from-amber-50/30 to-white"
                                    : player.isViceCaptain
                                      ? "border-indigo-400 bg-gradient-to-br from-indigo-50/30 to-white"
                                      : "border-gray-100 bg-white hover:border-gray-200"
                                }`}
                              >
                                {/* Captain/VC Badge */}
                                {(player.isCaptain || player.isViceCaptain) && (
                                  <div className="absolute -top-3 -right-3 z-10">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                        player.isCaptain
                                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                          : "bg-gradient-to-r from-indigo-500 to-purple-500"
                                      }`}
                                    >
                                      <span className="text-white text-xs font-black">
                                        {player.isCaptain ? "C" : "VC"}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-start gap-4">
                                  {/* Player Image */}
                                  <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    <img
                                      src={
                                        player.image ||
                                        "/placeholder-player.png"
                                      }
                                      alt={player.name}
                                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Team Indicator */}
                                    <div
                                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white shadow-md ${
                                        player.team ===
                                        predictionData.team1?.shortName
                                          ? "bg-blue-500 text-white"
                                          : "bg-rose-500 text-white"
                                      }`}
                                    >
                                      {player.team ===
                                      predictionData.team1?.shortName
                                        ? "A"
                                        : "B"}
                                    </div>
                                  </div>

                                  {/* Player Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                                      <h5 className="font-black text-gray-900 text-base uppercase tracking-tighter truncate group-hover:text-indigo-600 transition-colors">
                                        {player.shortName}
                                      </h5>
                                      <Badge
                                        className={`${getRoleColor(player.role)} text-[9px] px-2 py-0.5 font-black`}
                                      >
                                        {player.role}
                                      </Badge>
                                    </div>

                                    <p className="text-[9px] text-gray-500 font-mono mb-2">
                                      {player.style ||
                                        (isBatsman
                                          ? "Right-handed batter"
                                          : isBowler
                                            ? "Right-arm fast"
                                            : "All-rounder")}
                                    </p>

                                    {/* Selection Reason */}
                                    <div
                                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${strengthColor} mb-3`}
                                    >
                                      <Star className="w-2.5 h-2.5" />
                                      <span className="text-[8px] font-black uppercase tracking-tighter">
                                        {primaryStrength}: {strengthValue}
                                      </span>
                                    </div>

                                    {/* Impact Stats Grid */}
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                      <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-wider">
                                          Runs
                                        </p>
                                        <p className="text-sm font-black text-blue-600">
                                          {formatNumber(player.impactRun)}
                                        </p>
                                        <div className="w-full bg-blue-100 rounded-full h-1 mt-1">
                                          <div
                                            className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                                            style={{
                                              width: `${Math.min((player.impactRun / 100) * 100, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                      <div className="text-center p-2 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-wider">
                                          Wkts
                                        </p>
                                        <p className="text-sm font-black text-emerald-600">
                                          {formatNumber(player.impactWicket)}
                                        </p>
                                        <div className="w-full bg-emerald-100 rounded-full h-1 mt-1">
                                          <div
                                            className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                                            style={{
                                              width: `${Math.min((player.impactWicket / 5) * 100, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                      <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-wider">
                                          Points
                                        </p>
                                        <p className="text-sm font-black text-purple-600">
                                          {formatNumber(player.impactScore)}
                                        </p>
                                        <div className="w-full bg-purple-100 rounded-full h-1 mt-1">
                                          <div
                                            className="bg-purple-500 h-1 rounded-full transition-all duration-500"
                                            style={{
                                              width: `${Math.min((player.impactScore / 150) * 100, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Multiplier Info for Captain/VC */}
                                    {(player.isCaptain ||
                                      player.isViceCaptain) && (
                                      <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-wider flex items-center justify-between">
                                          <span>Fantasy Impact</span>
                                          <span className="text-amber-600">
                                            {player.isCaptain
                                              ? "2x Points Multiplier"
                                              : "1.5x Points Multiplier"}
                                          </span>
                                        </p>
                                        <p className="text-[8px] font-bold text-gray-700 mt-1">
                                          Projected:{" "}
                                          {(
                                            player.impactScore *
                                            (player.isCaptain
                                              ? 2
                                              : player.isViceCaptain
                                                ? 1.5
                                                : 1)
                                          ).toFixed(0)}{" "}
                                          pts
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Selection Badge */}
                                <div className="absolute bottom-3 right-3">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">
                                      AI Selected
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Team Composition Summary */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6"></div>
                            <div className="text-right">
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider">
                                Total Projected Points
                              </p>
                              <p className="text-xl font-black text-indigo-600 italic">
                                {predictionData.dream11Team
                                  .reduce(
                                    (sum, p) => sum + (p.impactScore || 0),
                                    0,
                                  )
                                  .toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}
              {/* Ground & Weather Metrics */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Venue Statistics */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
                      <BarChart4 className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">
                      Ground Forensics
                    </h3>
                  </div>
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white overflow-hidden group rounded-[40px]">
                    <CardContent className="p-0">
                      <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                          <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none">
                            Status: Live Ground Node
                          </p>
                        </div>
                        <h4 className="text-2xl font-black tracking-tighter leading-tight italic truncate">
                          {predictionData.venueStats?.venueName ||
                            "Tactical Arena"}
                        </h4>
                      </div>

                      {/* Venue Stats Grid */}
                      <div className="grid grid-cols-2 divide-x divide-white/5">
                        <div className="p-6 hover:bg-white/5 transition-all">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            Total Matches
                          </p>
                          <p className="text-2xl font-black italic text-blue-400">
                            {predictionData.venueStats?.matches || "N/A"}
                          </p>
                        </div>
                        <div className="p-6 hover:bg-white/5 transition-all">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            Avg 1st Inns
                          </p>
                          <p className="text-2xl font-black italic text-emerald-400">
                            {predictionData.venueStats?.avg1stInns || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 border-t border-white/5">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">
                          Toss Impact
                        </p>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span>Bat First Win</span>
                              <span>
                                {predictionData.venueStats?.winBatFirst || "0%"}
                              </span>
                            </div>
                            <Progress
                              value={parseInt(
                                predictionData.venueStats?.winBatFirst || "0",
                              )}
                              className="h-1.5 bg-white/10"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span>Bowl First Win</span>
                              <span>
                                {predictionData.venueStats?.winBowlFirst ||
                                  "0%"}
                              </span>
                            </div>
                            <Progress
                              value={parseInt(
                                predictionData.venueStats?.winBowlFirst || "0",
                              )}
                              className="h-1.5 bg-white/10"
                            />
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Avg 2nd Innings
                          </p>
                          <p className="text-xl font-black italic text-amber-400">
                            {predictionData.venueStats?.avg2ndInns || "N/A"}{" "}
                            runs
                          </p>
                        </div>
                      </div>

                      {/* Pace vs Spin if available */}
                      {predictionData.venueStats?.paceVsSpin && (
                        <div className="grid grid-cols-2 divide-x divide-white/5 border-t border-white/5">
                          <div className="p-6 hover:bg-white/5 transition-all group/item">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Zap className="w-3 h-3 text-emerald-400" />
                              Pace Propensity
                            </p>
                            <div className="flex items-end gap-3 mb-4">
                              <span className="text-3xl font-black italic tracking-tighter group-hover/item:text-emerald-400 transition-colors">
                                {predictionData.venueStats.paceVsSpin
                                  .paceWickets || "—"}
                              </span>
                              <span className="text-[8px] font-bold text-gray-500 pb-1 uppercase">
                                Wickets
                              </span>
                            </div>
                            <Progress
                              value={65}
                              className="h-1.5 bg-white/10"
                            />
                          </div>
                          <div className="p-6 hover:bg-white/5 transition-all group/item">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400" />
                              Spin Efficiency
                            </p>
                            <div className="flex items-end gap-3 mb-4">
                              <span className="text-3xl font-black italic tracking-tighter group-hover/item:text-amber-400 transition-colors">
                                {predictionData.venueStats.paceVsSpin
                                  .spinWickets || "—"}
                              </span>
                              <span className="text-[8px] font-bold text-gray-500 pb-1 uppercase">
                                Wickets
                              </span>
                            </div>
                            <Progress
                              value={35}
                              className="h-1.5 bg-white/10"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Weather Conditions */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-xl border border-orange-100">
                      <Sun className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">
                      Atmospheric Matrix
                    </h3>
                  </div>
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white overflow-hidden rounded-[40px] group">
                    <CardContent className="p-8 relative">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full w-fit ring-1 ring-white/30 shadow-lg">
                            <Cloud className="w-4 h-4 text-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {predictionData.venueWeather?.condition ||
                                "Clear"}
                            </span>
                          </div>
                          <div className="text-6xl font-black italic tracking-tighter mt-4 drop-shadow-2xl">
                            {predictionData.venueWeather?.temperature || "28°C"}
                          </div>
                        </div>
                        <Sun className="w-24 h-24 text-white/50 animate-[spin_10s_linear_infinite] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 shadow-xl group-hover:bg-white/15 transition-all">
                          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <CloudRain className="w-3.5 h-3.5" />
                            Precipitation
                          </p>
                          <div className="text-2xl font-black italic tracking-tighter">
                            {predictionData.venueWeather?.rainChance || "0%"}
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 shadow-xl group-hover:bg-white/15 transition-all">
                          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Droplets className="w-3.5 h-3.5" />
                            Humidity
                          </p>
                          <div className="text-2xl font-black italic tracking-tighter">
                            {predictionData.venueWeather?.humidity || "65%"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Bottom Disclaimer */}
              <div className="mt-12 p-8 rounded-[40px] bg-white border border-gray-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
                <div className="flex items-start gap-6 relative z-10">
                  <div className="p-4 bg-red-50 rounded-[28px] ring-1 ring-red-100 shadow-inner">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-black text-gray-900 uppercase tracking-tighter mb-4 flex items-center gap-3">
                      ⚖️ Security & Regulatory Compliance
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[8px] rounded-full animate-pulse">
                        Critical
                      </span>
                    </h4>
                    <div className="text-[12px] font-medium leading-relaxed text-gray-500 space-y-4">
                      <p>
                        <strong className="text-red-700 uppercase tracking-tighter">
                          Prohibited Activity:
                        </strong>{" "}
                        Betting and gambling are strictly illegal under the
                        Public Gambling Act (1867). This interface is an
                        analytical engine provided for{" "}
                        <span className="text-black font-black underline decoration-indigo-500/30 underline-offset-4">
                          Technical Research
                        </span>{" "}
                        and match-logic evaluation only.
                      </p>
                      <p>
                        <strong className="text-gray-900">
                          Alpha Disclosure:
                        </strong>{" "}
                        These insights are generated via advanced AI modeling.
                        Historical performance is not a guarantee of future
                        outcomes. Use this data purely for informational
                        purposes.
                      </p>
                      <p className="text-[10px] text-gray-400 italic">
                        Data refresh interval: Real-time | Confidence threshold:
                        {predictionData.team1?.winnerPrediction?.confidence ===
                        "High"
                          ? " >85%"
                          : predictionData.team1?.winnerPrediction
                                ?.confidence === "Medium"
                            ? " 65-85%"
                            : " <65%"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPredictionModal;
