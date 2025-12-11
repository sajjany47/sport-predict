/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
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
  matchName: string | null;
  matchDescription: string;
  originalStartTime?: string; // ms since epoch as string
  startTime: string;
  endTime?: string;
  status: "NOT_STARTED" | "LIVE" | "COMPLETED" | "ABANDONED";
  venue: {
    ground: string;
    city: string;
    country: string;
    timezone?: string;
  };
  tour: Tour | string;
  format: string;
  sport: string;
  teams: Team[];
  tourName?: string;
  score: null | {
    matchName: string;
    score: {
      team: string;
      run: string;
    }[];
    result: string;
  } | null;
}

interface MatchCardProps {
  match: Match;
  showPredictButton?: boolean;
  onClick?: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

const getTimeRemaining = (targetTs: number) => {
  const total = targetTs - Date.now();
  const absTotal = Math.max(0, total);
  const seconds = Math.floor(absTotal / 1000) % 60;
  const minutes = Math.floor(absTotal / 1000 / 60) % 60;
  const hours = Math.floor(absTotal / (1000 * 60 * 60)) % 24;
  const days = Math.floor(absTotal / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

const MatchCard = ({
  match,
  showPredictButton = false,
  onClick,
}: MatchCardProps) => {
  const team1 = match.teams[0];
  const team2 = match.teams[1];

  // Countdown state
  const [countdown, setCountdown] = useState(() => {
    const ts =
      match.originalStartTime && !isNaN(Number(match.originalStartTime))
        ? Number(match.originalStartTime)
        : Date.parse(match.startTime);
    return getTimeRemaining(ts);
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // compute target timestamp (use originalStartTime if present)
    const targetTs =
      match.originalStartTime && !isNaN(Number(match.originalStartTime))
        ? Number(match.originalStartTime)
        : Date.parse(match.startTime);

    // initialize
    setCountdown(getTimeRemaining(targetTs));

    // clear any existing
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // only start interval if match is upcoming / not started
    if (match.status === "NOT_STARTED") {
      intervalRef.current = window.setInterval(() => {
        const rem = getTimeRemaining(targetTs);
        setCountdown(rem);

        // if passed, clear interval
        if (rem.total <= 0 && intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.matchId, match.originalStartTime, match.startTime, match.status]);

  // Helper function to format score display
  const formatScore = (team: Team): string => {
    if (match?.score === null) {
      return "Yet to bat";
    }

    const scores: any = (match.score?.score ?? []).find(
      (item: any) => item.team === team.teamShortName
    );

    return scores ? scores?.run : "Yet to bat";
  };

  // Helper function to get match status text
  const getMatchStatusText = (): string => {
    // Abandoned or Not Started
    if (match.status === "ABANDONED") return "Match Abandoned";

    if (match.status === "NOT_STARTED") {
      // If countdown active, show friendly text
      if (countdown && countdown.total > 0) {
        // show "Starts in X" shorter form
        if (countdown.days > 0) {
          return `Starts in ${countdown.days}d ${pad(countdown.hours)}h`;
        }
        return `Starts in ${pad(countdown.hours)}:${pad(
          countdown.minutes
        )}:${pad(countdown.seconds)}`;
      }
      return `Starts ${new Date(match.startTime).toLocaleDateString()}`;
    }

    const result = match?.score?.result ?? "";
    const hasGarbage = result.includes("{\\") || result.includes('\\"');
    // Completed match
    if (match.status === "COMPLETED") {
      return result !== "" && !hasGarbage ? result : "Match completed";
    }

    // LIVE match
    if (match.status === "LIVE") {
      return result !== "" && !hasGarbage && result !== "Partnership"
        ? result
        : "Match in progress";
    }

    return "Match status unknown";
  };

  // Render countdown UI
  const renderCountdown = () => {
    if (match.status !== "NOT_STARTED") return null;
    if (!countdown) return null;

    // If match already started (total <= 0), show starting soon
    if (countdown.total <= 0) {
      return (
        <div className="inline-block px-3 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
          Starting soon
        </div>
      );
    }

    // Display days if present, otherwise HH:MM:SS
    if (countdown.days > 0) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm">
          <Calendar className="h-3 w-3" />
          <span className="font-medium">{`${countdown.days}d ${pad(
            countdown.hours
          )}h ${pad(countdown.minutes)}m`}</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm">
        <Clock className="h-3 w-3" />
        <span className="font-medium">{`${pad(countdown.hours)}:${pad(
          countdown.minutes
        )}:${pad(countdown.seconds)}`}</span>
      </div>
    );
  };

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <CalendarCog className="h-4 w-4" />
            <span className="truncate">{match?.tourName}</span>
          </div>

          {/* Countdown shown here for upcoming matches */}
          <div>{renderCountdown()}</div>
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
            <span>
              {new Date(
                Number(match.originalStartTime) || Date.parse(match.startTime)
              ).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(
                Number(match.originalStartTime) || Date.parse(match.startTime)
              ).toLocaleTimeString()}
            </span>
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
