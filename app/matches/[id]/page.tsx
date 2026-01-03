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
import {
  Trophy,
  Calendar,
  MapPin,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
  ArrowLeft,
} from "lucide-react";

import SquadDialoge from "./SquadDialoge";
import CustomLoader from "@/components/ui/CustomLoader";
import AIPredictionModal from "./ai-prediction-modal";
import { FindWinner, ParseScore } from "@/lib/utils";
import { FetchMatchDetails } from "../MatchService";
import toast from "react-hot-toast";
import OverviewTab from "./OverviewTab";
import CrexOverviewTab from "./CrexOverviewTab";

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
    setIsLoading(true);
    FetchMatchDetails({
      ...selectedMatch,
    })
      .then((res) => {
        setMatchData({
          ...res.data,
          matchInfo: {
            ...selectedMatch,
          },
        });
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch match details.");
        router.push("/matches");
        setIsLoading(false);
      });

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

  return (
    <>
      {/* {isLoading && <CustomLoader message="Fetching match details..." />} */}
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
                      {matchData.matchInfo.tourName}
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
                    <div key={index} className="text-center">
                      <div
                        className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-4"
                        // style={{ borderColor: team.color }}
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
                      {`${matchData.matchInfo.venue.ground}, ${matchData.matchInfo.venue.city}, ${matchData.matchInfo.venue.country}`}
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
                  {matchData.crexOverallStats ? (
                    <CrexOverviewTab matchData={matchData.crexOverallStats} />
                  ) : (
                    <OverviewTab matchData={matchData} />
                  )}
                  {/* <CrexOverviewTab matchData={matchData} />
                  <OverviewTab matchData={matchData} /> */}
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
                        <span>
                          Stadium:{" "}
                          {`${matchData.matchInfo.venue.ground}, ${matchData.matchInfo.venue.city}, ${matchData.matchInfo.venue.country}`}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="font-semibold">
                          Last 10 Matches at this Venue
                        </h3>
                        <div className="space-y-3">
                          {(matchData?.stadiumStats ?? []).map(
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
