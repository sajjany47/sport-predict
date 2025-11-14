"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setMatches, setSelectedMatch } from "@/store/slices/matchSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Trophy, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/ui/CustomLoader";
import { DatePicker } from "@/components/ui/date-picker";
import { useQuery } from "@tanstack/react-query";
import { FetchMatchList } from "./MatchService";
import MatchCard from "./MatchCard";

const MatchesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["match-list", selectedDate],
    queryFn: async () => {
      const response = await FetchMatchList(selectedDate);
      return response.data; // extract only the array part
    },
    enabled: !!selectedDate,
  });

  const handleMatchClick = (match: any) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/matches/${match.matchId}`);
    dispatch(setSelectedMatch(match));
  };

  const filteredMatches = matches.filter((match: any) => {
    const matchesSearch =
      match.teams[0].teamName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      match.teams[1].teamName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      match.teams[0].teamShortName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      match.teams[1].teamShortName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      match.tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = false;
    switch (activeTab) {
      case "upcoming":
        matchesStatus = match.status === "NOT_STARTED";
        break;
      case "live":
        matchesStatus = match.status === "LIVE";
        break;
      case "completed":
        matchesStatus =
          match.status === "COMPLETED" || match.status === "ABANDONED";
        break;
      default:
        matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  const upcomingCount = matches.filter(
    (m: any) => m.status === "NOT_STARTED"
  ).length;
  const liveCount = matches.filter((m: any) => m.status === "LIVE").length;
  const completedCount = matches.filter(
    (m: any) => m.status === "COMPLETED"
  ).length;

  return (
    <>
      {isLoading ? (
        <CustomLoader message="Loading match list" />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Cricket Matches
              </h1>
              <p className="text-xl text-gray-600">
                Get AI-powered predictions for all cricket matches
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search matches, teams, venues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <DatePicker
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                    placeholder="Select a date"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedDate(new Date())}
                    // title="Reset to Today-Tomorrow"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Match Tabs */}
            <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="sm:grid sm:grid-cols-3 mb-8">
                  <TabsTrigger
                    value="upcoming"
                    className="flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Upcoming ({upcomingCount})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="live"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Live ({liveCount})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="flex items-center space-x-2"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Completed ({completedCount})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMatches.map((match: any) => (
                        <MatchCard
                          key={match.matchId}
                          match={match}
                          showPredictButton
                          onClick={() => handleMatchClick(match)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No upcoming matches found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="live" className="space-y-6">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMatches.map((match: any) => (
                        <MatchCard
                          key={match.matchId}
                          match={match}
                          onClick={() => handleMatchClick(match)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No live matches
                      </h3>
                      <p className="text-gray-600">
                        Check back later for live cricket action
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-6">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMatches.map((match: any) => (
                        <MatchCard
                          key={match.matchId}
                          match={match}
                          onClick={() => handleMatchClick(match)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No completed matches found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchesPage;
