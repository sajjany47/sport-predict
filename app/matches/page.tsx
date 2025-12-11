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
import clsx from "clsx";

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

  const EmptyState = ({ icon, title, subtitle }: any) => (
    <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );

  const TabTriggerStyled = ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <TabsTrigger
      value={value}
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all outline-none",
        // base: subtle border & hover
        "data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-transparent hover:bg-gray-50",
        // active: solid background + shadow
        "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md"
      )}
    >
      {children}
    </TabsTrigger>
  );

  return (
    <>
      {isLoading ? (
        <CustomLoader message="Loading match list" />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Cricket Matches
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Get AI-powered predictions & live match insights
              </p>
            </div>

            {/* Search + Date Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-10">
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Search */}
                <div className="flex-1 relative w-full">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search teams, venues, tours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 py-3 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date Picker */}
                <div className="flex items-center gap-2">
                  <DatePicker
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                    placeholder="Select date"
                  />

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-gray-300 hover:bg-gray-100"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="w-full">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 bg-white p-1 rounded-xl shadow-sm">
                  <TabsTrigger
                    value="upcoming"
                    className="flex items-center justify-center gap-2 py-3 text-sm rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Calendar className="h-4 w-4" />
                    Upcoming ({upcomingCount})
                  </TabsTrigger>

                  <TabsTrigger
                    value="live"
                    className="flex items-center justify-center gap-2 py-3 text-sm rounded-xl data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Live ({liveCount})
                  </TabsTrigger>

                  <TabsTrigger
                    value="completed"
                    className="flex items-center justify-center gap-2 py-3 text-sm rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    <Trophy className="h-4 w-4" />
                    Completed ({completedCount})
                  </TabsTrigger>
                </TabsList>

                {/* UPCOMING TAB */}
                <TabsContent value="upcoming" className="mt-6">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <EmptyState
                      icon={<Calendar className="h-14 w-14 text-gray-400" />}
                      title="No upcoming matches"
                      subtitle="Try changing the filters"
                    />
                  )}
                </TabsContent>

                {/* LIVE TAB */}
                <TabsContent value="live" className="mt-6">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMatches.map((match: any) => (
                        <MatchCard
                          key={match.matchId}
                          match={match}
                          onClick={() => handleMatchClick(match)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                      }
                      title="No live matches"
                      subtitle="Check again soon!"
                    />
                  )}
                </TabsContent>

                {/* COMPLETED TAB */}
                <TabsContent value="completed" className="mt-6">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMatches.map((match: any) => (
                        <MatchCard
                          key={match.matchId}
                          match={match}
                          onClick={() => handleMatchClick(match)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Trophy className="h-14 w-14 text-gray-400" />}
                      title="No completed matches"
                      subtitle="Try searching something else"
                    />
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
