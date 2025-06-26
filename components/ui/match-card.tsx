"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Clock, Zap, Play } from "lucide-react";

interface CricketScore {
  runs: number;
  overs: string;
  balls: string;
  status: "COMPLETED" | "IN_PROGRESS";
  wickets: number;
}

interface Team {
  squadId: number;
  teamName: string;
  teamShortName: string;
  teamFlagUrl: string;
  isWinner: boolean | null;
  color: string;
  cricketScore: CricketScore[];
  squadNo: number | null;
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
  venue: string;
  tour: Tour;
  format: string;
  sport: string;
  teams: Team[];
}

interface MatchCardProps {
  match: Match;
  showPredictButton?: boolean;
  onClick?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  showPredictButton = false,
  onClick,
}) => {
  const team1 = match?.teams[0];
  const team2 = match?.teams[1];

  const formatScore = (team: Team) => {
    if (!team.cricketScore || team.cricketScore.length === 0) {
      return "Yet to bat";
    }
    const formattedScores = team.cricketScore.map((score: CricketScore) => {
      const runs = score.runs ?? 0;
      const wickets = score.wickets ?? 0;
      const overs = score.overs ? ` (${score.overs})` : "";
      return `${runs}/${wickets}${overs}`;
    });

    // Join innings with ' & '
    return formattedScores.join(" & ");
  };

  // Calculate required runs if team1 has completed their innings
  const getMatchStatusText = () => {
    const t1Innings = team1.cricketScore || [];
    const t2Innings = team2.cricketScore || [];

    const lastT1 = t1Innings[t1Innings.length - 1];
    const lastT2 = t2Innings[t2Innings.length - 1];

    // If both teams have completed 1 inning, and match has more to go
    if (
      t1Innings.length > 0 &&
      lastT1?.status === "COMPLETED" &&
      t2Innings.length === 0
    ) {
      return `${team1.teamShortName} innings completed`;
    }

    // If second team is batting, and game is in progress
    if (
      t1Innings.length > 0 &&
      t2Innings.length > 0 &&
      lastT2?.status === "IN_PROGRESS"
    ) {
      const target = t1Innings.reduce(
        (sum: number, score: CricketScore) => sum + (score.runs || 0),
        0
      );
      const current = t2Innings.reduce(
        (sum: number, score: CricketScore) => sum + (score.runs || 0),
        0
      );
      const runsNeeded = target - current + 1;
      const ballsBowled = parseInt(lastT2.balls || "0", 10);
      const totalBalls =
        match.format === "T20I" ? 120 : match.format === "ODI" ? 300 : 540; // T20, ODI, Test
      const ballsLeft = totalBalls - ballsBowled;

      if (runsNeeded <= 0) {
        return `${team2.teamShortName} won by ${
          10 - (lastT2.wickets || 0)
        } wickets`;
      }

      return `${team2.teamShortName} need ${runsNeeded} runs in ${ballsLeft} balls`;
    }

    // Match fully done (e.g., both innings completed or both teams all out)
    if (match.status === "COMPLETED") {
      const t1Total = t1Innings.reduce(
        (sum: number, score: CricketScore) => sum + (score.runs || 0),
        0
      );
      const t2Total = t2Innings.reduce(
        (sum: number, score: CricketScore) => sum + (score.runs || 0),
        0
      );

      if (team1.isWinner) {
        const runDifference = t1Total - t2Total;
        return `${team1.teamShortName} won by ${runDifference} runs`;
      } else if (team2.isWinner) {
        const wicketsLeft = 10 - (lastT2?.wickets || 0);
        return `${team2.teamShortName} won by ${wicketsLeft} wickets`;
      } else {
        return `Match drawn or tied`;
      }
    }

    if (match.status === "ABANDONED") {
      return "Match abandoned";
    }

    return "Match in progress";
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case "LIVE":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
            LIVE
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Trophy className="h-3 w-3 mr-1" />
            COMPLETED
          </Badge>
        );
      case "ABANDONED":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            ABANDONED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            UPCOMING
          </Badge>
        );
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const { date, time } = formatDateTime(match.startTime);

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer ${
        match.status === "LIVE" ? "ring-2 ring-red-200" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {match.format}
            </Badge>
            {getStatusBadge()}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{date}</p>
            <p className="text-xs text-gray-600">{time}</p>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-4 mb-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={team1.teamFlagUrl}
                  alt={team1.teamName}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="${team1.color}"/><text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${team1.teamShortName}</text></svg>`;
                  }}
                />
                {team1.isWinner && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Trophy className="h-2 w-2 text-yellow-800" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {team1.teamShortName}
                </p>
                <p className="text-xs text-gray-600">{team1.teamName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-gray-900">
                {formatScore(team1)}
              </p>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={team2.teamFlagUrl}
                  alt={team2.teamName}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="${team2.color}"/><text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${team2.teamShortName}</text></svg>`;
                  }}
                />
                {team2.isWinner && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Trophy className="h-2 w-2 text-yellow-800" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {team2.teamShortName}
                </p>
                <p className="text-xs text-gray-600">{team2.teamName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-gray-900">
                {formatScore(team2)}
              </p>
            </div>
          </div>
        </div>

        {/* Match Status */}
        {(match.status === "LIVE" || match.status === "COMPLETED") && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-center text-gray-800">
              {getMatchStatusText()}
            </p>
          </div>
        )}

        {/* Match Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {match.matchDescription} • {match.tour.name}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{match.venue}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {match.status === "LIVE" && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            >
              <Play className="h-4 w-4 mr-2" />
              Watch Live
            </Button>
          )}

          {showPredictButton && match.status === "NOT_STARTED" && (
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Get AI Prediction
            </Button>
          )}

          {match.status === "COMPLETED" && (
            <Button variant="outline" size="sm" className="flex-1">
              View Scorecard
            </Button>
          )}

          {match.status === "NOT_STARTED" && !showPredictButton && (
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
