/* eslint-disable jsx-a11y/alt-text */
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
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Calendar,
  MapPin,
  BarChart3,
  Clock,
  Zap,
  ArrowLeft,
  Users,
  Activity,
  Radio,
  Home,
  Shield,
  Star,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import CustomLoader from "@/components/ui/CustomLoader";
import AIPredictionModal from "./ai-prediction-modal";
import toast from "react-hot-toast";
import CrexOverviewTab from "./CrexOverviewTab";
import PlayerCard from "./SquadDialoge";
import { DummyData } from "@/lib/DummyData";
import { FetchMatchDetails } from "@/app/MainService";

const MatchDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { selectedMatch } = useSelector((state: RootState) => state.matches);
  const [matchData, setMatchData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(true);
    FetchMatchDetails({
      ...selectedMatch,
    })
      .then((res) => {
        setMatchData({
          ...res.data,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch match details. Re-authenticating...");
        router.push("/auth/login");
        setIsLoading(false);
      });
  }, [params.id, selectedMatch, router, isAuthenticated]);

  const handleGetPrediction = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (!user || user.credits < 1) {
      toast.error("Insufficient Credits. Please Upgrade.");
      router.push("/subscription");
      return;
    }
    setIsPredictionModalOpen(true);
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "LIVE":
        return {
          color: "bg-red-500 text-white",
          label: "LIVE NOW",
          icon: <Radio className="w-3 h-3 animate-pulse" />,
        };
      case "COMPLETED":
        return {
          color: "bg-emerald-600 text-white",
          label: "COMPLETED",
          icon: <Trophy className="w-3 h-3" />,
        };
      case "UPCOMING":
        return {
          color: "bg-indigo-600 text-white",
          label: "UPCOMING",
          icon: <Calendar className="w-3 h-3" />,
        };
      case "ABANDONED":
        return {
          color: "bg-slate-600 text-white",
          label: "ABANDONED",
          icon: <AlertTriangle className="w-3 h-3" />,
        };
      default:
        return {
          color: "bg-gray-600 text-white",
          label: status || "UNKNOWN",
          icon: <Clock className="w-3 h-3" />,
        };
    }
  };

  if (isLoading)
    return <CustomLoader message="Calibrating Match Intelligence..." />;

  if (!matchData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-white rounded-3xl shadow-xl mb-6">
          <Shield className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          Secure Node: Inaccessible
        </h2>
        <p className="text-gray-500 mb-8 max-w-xs font-medium">
          Authentication required or data feed interrupted.
        </p>
        <Button
          onClick={() => router.back()}
          className="rounded-2xl px-8 py-6 font-bold uppercase tracking-widest text-xs"
        >
          Return to Base
        </Button>
      </div>
    );
  }

  const team1 = matchData.matchInfo.teams[0];
  const team2 = matchData.matchInfo.teams[1];
  const matchStatus = matchData.matchInfo.status;
  const statusConfig = getStatusConfig(matchStatus);

  const getPointsTableData = (teamId: string) => {
    if (!teamId) return null;
    return (matchData?.pointsTable ?? []).find(
      (pt: any) => pt?.team === teamId,
    );
  };

  const team1Points = getPointsTableData(matchData?.teamForm?.[0]?.teamId);
  const team2Points = getPointsTableData(matchData?.teamForm?.[1]?.teamId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="container max-w-6xl mx-auto px-4 pt-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group hover:bg-white hover:shadow-sm transition-all duration-200 rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Matches
          </Button>
        </div>

        {/* Elite Match Header Section */}
        <div className="relative mb-8 rounded-[30px] sm:rounded-[40px] overflow-hidden shadow-2xl bg-slate-900 border border-white/5 group">
          {/* Background Ambient Effect */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-purple-600/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

          {/* Tournament Header Info */}
          <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-300" />
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    {matchData.matchInfo.matchDescription}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-3 py-1">
                    {matchData.matchInfo.format}
                  </Badge>
                  <Badge
                    className={`px-3 py-1 font-bold ${statusConfig.color}`}
                  >
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.label}</span>
                  </Badge>
                </div>
              </div>

              <Button
                onClick={handleGetPrediction}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full"
                size="lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                Get AI Prediction
              </Button>
            </div>
          </div>

          <div className="relative z-10 p-6 sm:p-10">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-indigo-950 overflow-hidden relative">
              {/* Abstract decorative background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -translate-y-24 translate-x-24 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/10 rounded-full translate-y-16 -translate-x-12 blur-2xl"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

              <CardContent className="p-4 md:p-6 relative z-10">
                {/* Desktop View (3 columns) */}
                <div className="hidden md:flex flex-row justify-between items-center gap-6">
                  {/* Team 1 */}
                  <div className="flex flex-col items-center text-center space-y-3 flex-1">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-50"></div>
                      <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-500/20 ring-2 ring-white/20">
                        <img
                          src={team1.teamFlagUrl}
                          alt={team1.teamName}
                          className="w-full h-full rounded-full object-cover bg-white"
                          onError={(e) => {
                            e.currentTarget.src = "";
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-xs px-2 py-1 border-white/20 shadow-sm font-black">
                          {team1.teamShortName}
                        </Badge>
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                      {team1.teamName}
                    </h2>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-sm text-blue-100">
                          {team1Points?.points ?? 0} Points
                        </span>
                        <Badge
                          variant="outline"
                          className="font-bold text-sm text-blue-100"
                        >
                          NRR: {team1Points?.nrr ?? "0.00"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* VS Centerpiece */}
                  <div className="flex flex-col items-center mx-4">
                    <div className="relative mb-3">
                      <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 drop-shadow-[0_2px_10px_rgba(234,88,12,0.3)] italic">
                        VS
                      </div>
                      <div className="absolute -inset-2 bg-orange-500/20 blur-md rounded-full -z-10 animate-pulse"></div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 shadow-inner">
                      <span className="text-sm font-black text-blue-400 drop-shadow-sm">
                        H2H
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                        RECORD
                      </span>
                    </div>

                    <div className="flex gap-4 mt-2">
                      <span className="text-xl font-black text-blue-400">
                        {matchData?.h2h?.team1?.wins || 0}
                      </span>
                      <span className="text-xl font-black text-gray-500">
                        -
                      </span>
                      <span className="text-xl font-black text-red-500">
                        {matchData?.h2h?.team2?.wins ?? 0}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-[0.2em]">
                      Battle Ground
                    </p>
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-col items-center text-center space-y-3 flex-1">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-red-600 rounded-full blur opacity-50"></div>
                      <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-red-400 to-rose-600 shadow-lg shadow-red-500/20 ring-2 ring-white/20">
                        <img
                          src={team2.teamFlagUrl}
                          alt={team2.teamName}
                          className="w-full h-full rounded-full object-cover bg-white"
                          onError={(e) => {
                            e.currentTarget.src = "";
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-red-600 text-xs px-2 py-1 border-white/20 shadow-sm font-black">
                          {team2.teamShortName}
                        </Badge>
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                      {team2.teamName}
                    </h2>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-sm text-blue-100">
                          {team2Points?.points ?? 0} Points
                        </span>
                        <Badge
                          variant="outline"
                          className="font-bold text-sm text-blue-100"
                        >
                          NRR: {team2Points?.nrr ?? "0.00"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile View (Premium Layout) */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center text-center flex-1 space-y-2">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-40"></div>
                        <div className="relative w-16 h-16 rounded-full p-1 bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-500/20 ring-2 ring-white/20">
                          <img
                            src={team1.teamFlagUrl}
                            alt={team1.teamName}
                            className="w-full h-full rounded-full object-cover bg-white"
                            onError={(e) => {
                              e.currentTarget.src = "";
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-blue-600 text-[10px] px-1.5 py-0 border-white/20 shadow-sm font-black">
                            {team1.teamShortName}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-white truncate max-w-[90px] drop-shadow-sm uppercase tracking-tight">
                        {team1.teamName}
                      </h3>
                      <div className="flex items-center justify-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-[10px] font-bold text-blue-100 italic">
                          {team1Points?.points ?? 0} Points
                        </span>
                      </div>
                    </div>

                    {/* VS Centerpiece */}
                    <div className="flex flex-col items-center mx-1 px-2 py-2">
                      <div className="relative mb-1">
                        <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 drop-shadow-[0_2px_10px_rgba(234,88,12,0.3)] italic">
                          VS
                        </div>
                        <div className="absolute -inset-1 bg-orange-500/20 blur-md rounded-full -z-10 animate-pulse"></div>
                      </div>

                      <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 shadow-inner">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          H2H
                        </span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm font-black text-blue-400">
                          {matchData?.h2h?.team1?.wins ?? 0}
                        </span>
                        <span className="text-xs font-black text-gray-500">
                          -
                        </span>
                        <span className="text-sm font-black text-red-500">
                          {matchData?.h2h?.team2?.wins ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center text-center flex-1 space-y-2">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-red-600 rounded-full blur opacity-40"></div>
                        <div className="relative w-16 h-16 rounded-full p-1 bg-gradient-to-br from-red-400 to-rose-600 shadow-lg shadow-red-500/20 ring-2 ring-white/20">
                          <img
                            src={team2.teamFlagUrl}
                            alt={team2.teamName}
                            className="w-full h-full rounded-full object-cover bg-white"
                            onError={(e) => {
                              e.currentTarget.src = "";
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-red-600 text-[10px] px-1.5 py-0 border-white/20 shadow-sm font-black">
                            {team2.teamShortName}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-white truncate max-w-[90px] drop-shadow-sm uppercase tracking-tight">
                        {team2.teamName}
                      </h3>
                      <div className="flex items-center justify-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-[10px] font-bold text-blue-100 italic">
                          {team2Points?.points ?? 0} Points
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Info Bar Mobile */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between gap-2 overflow-hidden">
                    <div className="flex-1 flex flex-col items-start min-w-0">
                      <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest pl-1">
                        Match Date
                      </p>
                      <div className="w-full h-6 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center px-2 mt-0.5">
                        <Calendar className="w-3 h-3 text-blue-300 mr-1 flex-shrink-0" />
                        <span className="text-[9px] font-black text-blue-300 truncate">
                          {matchData.matchInfo.matchDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-px h-6 bg-white/10"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-end min-w-0 text-right">
                      <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest pr-1">
                        Start Time
                      </p>
                      <div className="w-full h-6 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-end px-2 mt-0.5">
                        <Clock className="w-3 h-3 text-red-300 mr-1 flex-shrink-0" />
                        <span className="text-[9px] font-black text-red-300 truncate">
                          {matchData.matchInfo.startTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Format Badge - Desktop */}
                <div className="hidden md:flex justify-center mt-6 pt-4 border-t border-white/10">
                  <Badge className="bg-amber-500 text-black border-0 font-black italic tracking-tighter px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] text-xs">
                    {matchData?.matchInfo?.format} •{" "}
                    {matchData?.matchInfo?.matchDescription}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Venue Info Banner */}
          <div className="relative z-10 bg-white/5 backdrop-blur-md border-t border-white/10 p-4">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="h-4 w-4 text-indigo-300" />
              <p className="text-indigo-200 text-xs sm:text-sm font-medium">
                {matchData.venueDetails?.name || "Venue details coming soon"}
              </p>
            </div>
          </div>

          {/* Result Footer Banner */}
          {matchData.matchInfo.score?.result && (
            <div className="bg-indigo-600/30 backdrop-blur-md border-t border-white/10 p-4 text-center">
              <p className="text-indigo-200 text-[10px] sm:text-xs font-black uppercase tracking-tighter italic flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" />
                Result: {matchData.matchInfo.score.result}
              </p>
            </div>
          )}
        </div>

        {/* Content Matrix (Tabs) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
              <Activity className="w-3 h-3" /> Tactical Telemetry
            </h4>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-white/50 backdrop-blur-sm p-1 gap-1 border border-gray-200 rounded-[24px] sm:rounded-[28px] h-12 sm:h-14 w-full sm:w-fit mb-8 flex items-center overflow-x-auto sm:overflow-visible no-scrollbar">
              {[
                {
                  id: "overview",
                  label: "Overview",
                  icon: <BarChart3 className="w-4 h-4" />,
                },
                {
                  id: "squads",
                  label: "Squads",
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  id: "venue",
                  label: "Stadium",
                  icon: <MapPin className="w-4 h-4" />,
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-[20px] sm:rounded-[24px] px-4 sm:px-6 font-black uppercase tracking-tighter text-[9px] sm:text-[10px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all h-full"
                >
                  <span className="mr-1.5 sm:mr-2">{tab.icon}</span>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="min-h-[400px]">
              {/* Overview Tab */}
              <TabsContent
                value="overview"
                className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {matchData ? (
                  <CrexOverviewTab matchData={matchData} />
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      No Overview Data Available
                    </h3>
                    <p className="text-gray-500">
                      Detailed statistics and analysis will be available soon.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Squads Tab */}
              <TabsContent
                value="squads"
                className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {matchData?.squads ? (
                  matchData.squads.map((squad: any) => (
                    <Card
                      key={squad.teamName}
                      className="rounded-[30px] sm:rounded-[40px] border-gray-100 shadow-xl mb-6 overflow-hidden"
                    >
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                        <CardTitle className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={squad.flag}
                              alt={squad.teamName}
                              className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Star className="h-2 w-2 md:h-3 md:w-3 text-white" />
                            </div>
                          </div>
                          <div>
                            <span className="text-lg md:text-xl font-bold">
                              {squad.teamName} Squad
                            </span>
                            <p className="text-xs md:text-sm text-gray-500">
                              {squad.teamName}
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6">
                        <Tabs defaultValue="playing" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 rounded-2xl">
                            <TabsTrigger
                              value="playing"
                              className="text-xs md:text-sm rounded-xl data-[state=active]:bg-indigo-600"
                            >
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3 md:h-4 md:w-4" />
                                <span>
                                  Playing ({squad.playingPlayers?.length || 0})
                                </span>
                              </div>
                            </TabsTrigger>
                            <TabsTrigger
                              value="bench"
                              className="text-xs md:text-sm rounded-xl data-[state=active]:bg-indigo-600"
                            >
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3 md:h-4 md:w-4" />
                                <span>
                                  Bench ({squad.benchPlayers?.length || 0})
                                </span>
                              </div>
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="playing" className="mt-4">
                            {squad.playingPlayers &&
                            squad.playingPlayers.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                                {squad.playingPlayers.map(
                                  (player: any, index: number) => (
                                    <PlayerCard key={index} player={player} />
                                  ),
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <Users className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                  Playing XI not announced yet.
                                </p>
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="bench" className="mt-4">
                            {squad.benchPlayers &&
                            squad.benchPlayers.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                                {squad.benchPlayers.map(
                                  (player: any, index: any) => (
                                    <PlayerCard key={index} player={player} />
                                  ),
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <Users className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                  No bench players announced yet.
                                </p>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Squad Information Not Available
                    </h3>
                    <p className="text-gray-500">
                      Team squads will be updated closer to the match.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Venue/Stadium Tab */}
              <TabsContent
                value="venue"
                className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <Card className="rounded-[30px] sm:rounded-[40px] border-gray-100 shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="text-lg md:text-xl">
                        Stadium Analysis:{" "}
                        <span className="text-indigo-600">
                          {matchData.venueDetails?.name || "Venue Details"}
                        </span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    {matchData?.venueDetails?.recentMatches ? (
                      <div className="space-y-6">
                        <h3 className="font-semibold text-lg">
                          Recent Matches at this Venue
                        </h3>
                        <div className="space-y-3">
                          {matchData.venueDetails.recentMatches
                            .slice(0, 10)
                            .map((match: any, index: number) => (
                              <div
                                key={index}
                                className="p-3 md:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm md:text-base">
                                      {match.series}
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-600">
                                      {match.result}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                                  <div className="p-2 bg-blue-50 rounded">
                                    <div className="font-medium text-blue-700 text-xs md:text-sm">
                                      {match.team1}
                                    </div>
                                    <div className="text-gray-700 text-sm md:text-base">
                                      {match.team1Score} ({match.team1Overs})
                                    </div>
                                  </div>
                                  <div className="p-2 bg-red-50 rounded">
                                    <div className="font-medium text-red-700 text-xs md:text-sm">
                                      {match.team2}
                                    </div>
                                    <div className="text-gray-700 text-sm md:text-base">
                                      {match.team2Score} ({match.team2Overs})
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">
                          Stadium Stats Not Available
                        </h3>
                        <p className="text-gray-500">
                          Detailed stadium statistics will be updated soon.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Persistent AI Trigger (Mobile Fixed) */}
      <div className="fixed bottom-6 right-6 left-6 md:hidden z-50">
        <Button
          onClick={handleGetPrediction}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-black uppercase tracking-widest py-7 rounded-[28px] shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          <Zap className="w-5 h-5 fill-white animate-pulse" />
          <span className="text-sm">Get AI Prediction</span>
        </Button>
      </div>

      {/* AI Prediction Modal */}
      <AIPredictionModal
        isOpen={isPredictionModalOpen}
        onClose={() => setIsPredictionModalOpen(false)}
        match={{
          ...matchData,
          matchInfo: selectedMatch,
          crexOverallStats: matchData.crexOverallStats,
        }}
      />
    </div>
  );
};

export default MatchDetailsPage;
