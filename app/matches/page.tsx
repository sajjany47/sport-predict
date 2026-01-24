"use client";

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setMatches, setSelectedMatch } from "@/store/slices/matchSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Trophy, RotateCcw, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/ui/CustomLoader";
import { DatePicker } from "@/components/ui/date-picker";
import { useQuery } from "@tanstack/react-query";
import { FetchMatchList } from "./MatchService";
import MatchCard from "./MatchCard";
import clsx from "clsx";

// Tab configuration
const TAB_CONFIG = [
  {
    id: "upcoming",
    label: "Upcoming",
    icon: Calendar,
    statusFilter: (match: any) => match.status === "UPCOMING",
    emptyState: {
      title: "No upcoming matches",
      subtitle: "Try changing the filters",
      icon: <Calendar className="h-14 w-14 text-gray-400" />,
    },
    buttonClass: "bg-blue-600 data-[state=active]:bg-blue-600",
  },
  {
    id: "live",
    label: "Live",
    icon: Flame,
    statusFilter: (match: any) => match.status === "LIVE",
    emptyState: {
      title: "No live matches",
      subtitle: "Check again soon!",
      icon: (
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-red-500 rounded-full animate-ping"></div>
        </div>
      ),
    },
    buttonClass: "bg-red-600 data-[state=active]:bg-red-600",
  },
  {
    id: "completed",
    label: "Completed",
    icon: Trophy,
    statusFilter: (match: any) =>
      match.status === "COMPLETED" || match.status === "ABANDONED",
    emptyState: {
      title: "No completed matches",
      subtitle: "Try searching something else",
      icon: <Trophy className="h-14 w-14 text-gray-400" />,
    },
    buttonClass: "bg-green-600 data-[state=active]:bg-green-600",
  },
];

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
      return response.data;
    },
    enabled: !!selectedDate,
  });

  // Calculate match counts for each tab
  const matchCounts = useMemo(() => {
    return TAB_CONFIG.reduce(
      (acc, tab) => {
        acc[tab.id] = matches.filter(tab.statusFilter).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [matches]);

  // Handle match click
  const handleMatchClick = (match: any) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/matches/${match._id}`);
    dispatch(setSelectedMatch(match));
  };

  // Filter matches based on active tab and search
  const filteredMatches = useMemo(() => {
    const activeTabConfig = TAB_CONFIG.find((tab) => tab.id === activeTab);

    return matches.filter((match: any) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        match.teams.some(
          (team: any) =>
            team.teamName.toLowerCase().includes(searchLower) ||
            team.teamShortName.toLowerCase().includes(searchLower),
        ) ||
        match.matchDescription?.toLowerCase().includes(searchLower) ||
        match.matchName?.toLowerCase().includes(searchLower);

      // Tab status filter
      const matchesStatus = activeTabConfig?.statusFilter(match);

      return matchesSearch && matchesStatus;
    });
  }, [matches, activeTab, searchTerm]);

  // Empty state component
  const EmptyState = ({ icon, title, subtitle }: any) => (
    <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );

  // Render tab content
  const renderTabContent = (tabId: string) => {
    if (filteredMatches.length === 0) {
      const tabConfig = TAB_CONFIG.find((tab) => tab.id === tabId);
      return <EmptyState {...tabConfig?.emptyState} />;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((match: any) => (
          <MatchCard
            key={match._id}
            match={match}
            showPredictButton={tabId === "upcoming" || tabId === "live"}
            onClick={() => handleMatchClick(match)}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <CustomLoader message="Loading match list" />;
  }

  return (
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
                placeholder="Search teams, tournaments..."
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-white p-1 rounded-xl shadow-sm">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={clsx(
                    "flex items-center justify-center gap-2 py-3 text-sm rounded-xl",
                    tab.buttonClass,
                    "text-white transition-all duration-200",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label} ({matchCounts[tab.id] || 0})
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Contents */}
          {TAB_CONFIG.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {renderTabContent(tab.id)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MatchesPage;
