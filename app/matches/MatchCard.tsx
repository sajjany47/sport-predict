/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Target,
  CalendarCog,
} from "lucide-react";

interface Team {
  squadId: number;
  teamName: string;
  teamShortName: string;
  teamFlagUrl: string;
}

interface Tour {
  id: number;
  name: string;
}

interface Match {
  matchId: number;
  matchName: string;
  matchDescription: string;
  startTime: string;
  status: "NOT_STARTED" | "LIVE" | "COMPLETED" | "ABANDONED";
  venue: {
    ground: string;
    city: string;
    country: string;
    timezone: string;
  };
  tour: Tour;
  format: string;
  sport: string;
  teams: Team[];
  tourName: string;
  score: null | {
    matchName: string;
    score: [
      {
        team: string;
        run: string;
      }
    ];
    result: string;
  };
}

interface MatchCardProps {
  match: Match;
  showPredictButton?: boolean;
  onClick?: () => void;
}

const MatchCard = ({
  match,
  showPredictButton = false,
  onClick,
}: MatchCardProps) => {
  const team1 = match.teams[0];
  const team2 = match.teams[1];

  // Helper function to get total balls from overs for different formats
  const getTotalBalls = (format: string): number => {
    switch (format.toUpperCase()) {
      case "T10":
        return 60; // 10 overs * 6 balls
      case "T20":
      case "T20I":
        return 120; // 20 overs * 6 balls
      case "ODI":
        return 300; // 50 overs * 6 balls
      case "TEST":
        return 0; // No ball limit in Test matches
      default:
        return 120;
    }
  };

  // Helper function to format score display
  const formatScore = (team: Team): string => {
    if (match?.score === null) {
      return "Yet to bat";
    }

    const scores: any = (match.score?.score ?? []).find(
      (item: any) => item.team === team.teamShortName
    );

    return scores.run;
  };

  // Helper function to get match status text
  const getMatchStatusText = (): string => {
    // 🟢 1. Abandoned or Not Started
    if (match.status === "ABANDONED") return "Match Abandoned";

    if (match.status === "NOT_STARTED") {
      return `Starts ${new Date(match.startTime).toLocaleDateString()}`;
    }

    // 🟢 2. Completed match
    if (match.status === "COMPLETED") {
      return match.score !== null ? match.score.result : "Match completed";
    }

    // 🟢 3. LIVE match (detailed test logic)
    if (match.status === "LIVE") {
      return match.score !== null ? match.score.result : "Match in progress";
    }

    // 🟢 Fallback
    return "Match status unknown";
  };

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Match Header */}
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <CalendarCog className="h-3 w-3" />
            {/* <MapPin className="h-3 w-3" /> */}
            <span className="truncate">{match?.tourName}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                match.status === "LIVE"
                  ? "destructive"
                  : match.status === "COMPLETED"
                  ? "default"
                  : "secondary"
              }
            >
              {match.status === "LIVE"
                ? "🔴 LIVE"
                : match.status === "ABANDONED"
                ? "⚠️ ABANDONED"
                : match.status === "NOT_STARTED"
                ? "UPCOMING"
                : match.status}
            </Badge>
            <Badge variant="outline">{match.format}</Badge>
          </div>
          <div className="text-sm text-gray-500">{match.matchDescription}</div>
        </div>

        {/* Teams and Scores */}
        <div className="space-y-4 mb-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={team1.teamFlagUrl}
                alt={team1.teamName}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {team1.teamShortName}
                </h3>
                <p className="text-xs text-gray-500">{team1.teamName}</p>
              </div>
              {match.status === "COMPLETED" && (
                <Trophy className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">
                {formatScore(team1)}
              </div>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={team2.teamFlagUrl}
                alt={team2.teamName}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {team2.teamShortName}
                </h3>
                <p className="text-xs text-gray-500">{team2.teamName}</p>
              </div>
              {match.status === "COMPLETED" && (
                <Trophy className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">
                {formatScore(team2)}
              </div>
            </div>
          </div>
        </div>

        {/* Match Status */}
        <div className="text-center py-3 px-4 bg-gray-50 rounded-lg mb-4">
          <p className="text-sm font-medium text-gray-700">
            {getMatchStatusText()}
          </p>
        </div>

        {/* Match Info */}
        <div className="space-y-2 text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{`${match.venue.ground}, ${match.venue.city}, ${match.venue.country}`}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(match.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>{new Date(match.startTime).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Action Button */}
        {showPredictButton && match.status !== "ABANDONED" && (
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Target className="h-4 w-4 mr-2" />
            {match.status === "COMPLETED" ? "View Analysis" : "Get Prediction"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
