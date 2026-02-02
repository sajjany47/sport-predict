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
  Sparkles,
  AlertCircle,
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

  const [isHovered, setIsHovered] = useState(false);
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
      (item: any) => item.team === team.teamShortName,
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
          countdown.minutes,
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

  // Render countdown UI for header
  const renderCountdown = () => {
    if (match.status !== "NOT_STARTED") return null;
    if (!countdown) return null;

    // If match already started (total <= 0), show starting soon
    if (countdown.total <= 0) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200">
          <Sparkles className="h-3 w-3" />
          <span className="text-xs font-medium">Starting soon</span>
        </div>
      );
    }

    // Display days if present, otherwise HH:MM:SS
    if (countdown.days > 0) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
          <Calendar className="h-3 w-3" />
          <span className="text-xs font-medium">{`${countdown.days}d ${pad(
            countdown.hours,
          )}h`}</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
        <Clock className="h-3 w-3" />
        <span className="text-xs font-medium font-mono">{`${pad(
          countdown.hours,
        )}:${pad(countdown.minutes)}`}</span>
      </div>
    );
  };

  // Render enhanced match status section
  const renderMatchStatusSection = () => {
    if (match.status === "NOT_STARTED") {
      return (
        <div className="relative overflow-hidden mb-5 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-xl">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-indigo-200/30 to-transparent rounded-full translate-x-8 translate-y-8"></div>

          {/* Main content */}
          <div className="relative z-10">
            {/* Status badge */}

            {/* Countdown timer - enhanced */}
            {countdown && countdown.total > 0 ? (
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2 font-medium">
                  Match Begins In
                </p>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  {countdown.days > 0 ? (
                    <>
                      <div className="flex flex-col items-center">
                        <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-blue-100 min-w-[60px]">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            {pad(countdown.days)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">DAYS</span>
                      </div>
                      <div className="text-xl font-bold text-blue-300">:</div>
                      <div className="flex flex-col items-center">
                        <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-blue-100 min-w-[60px]">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            {pad(countdown.hours)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          HOURS
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center">
                        <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-blue-100 min-w-[60px]">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            {pad(countdown.hours)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">HRS</span>
                      </div>
                      <div className="text-xl font-bold text-blue-300">:</div>
                      <div className="flex flex-col items-center">
                        <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-blue-100 min-w-[60px]">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            {pad(countdown.minutes)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">MIN</span>
                      </div>
                      <div className="text-xl font-bold text-blue-300">:</div>
                      <div className="flex flex-col items-center">
                        <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-blue-100 min-w-[60px]">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            {pad(countdown.seconds)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">SEC</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-blue-100 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        countdown.hours > 0
                          ? ((24 - countdown.hours) / 24) * 100
                          : ((60 - countdown.minutes) / 60) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(
                    Number(match.originalStartTime) ||
                      Date.parse(match.startTime),
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-2">
                  <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-gray-800">
                    Scheduled Date
                  </p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-blue-100 shadow-sm mb-2">
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    {new Date(match.startTime).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(match.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="text-xs text-blue-600 flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Starting soon - Stay tuned!
                </p>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // For other statuses (LIVE, COMPLETED, ABANDONED)
      return (
        <div
          className={`text-center py-3 px-4 rounded-lg mb-4 ${
            match.status === "LIVE"
              ? "bg-gradient-to-r from-red-50 to-pink-50 border border-red-100"
              : match.status === "COMPLETED"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
                : "bg-gray-50"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              match.status === "LIVE"
                ? "text-red-700"
                : match.status === "COMPLETED"
                  ? "text-green-700"
                  : "text-gray-700"
            }`}
          >
            {getMatchStatusText()}
          </p>
        </div>
      );
    }
  };

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-2 w-full">
            <CalendarCog className="h-4 w-4 shrink-0" />

            <span className="whitespace-normal break-words flex-1">
              {match?.tourName}
            </span>
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
              className={
                match.status === "NOT_STARTED"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
                  : ""
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
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              match.status === "NOT_STARTED"
                ? "bg-gradient-to-r from-blue-50/30 to-transparent hover:from-blue-50/50 hover:to-transparent"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {match.status === "NOT_STARTED" && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-sm"></div>
                )}
                <img
                  src={team1.teamFlagUrl}
                  alt={team1.teamName}
                  className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {team1.teamShortName}
                </h3>
                <p className="text-xs text-gray-500">{team1.teamName}</p>
              </div>
              {match.status === "COMPLETED" && (
                <Trophy className="h-5 w-5 text-yellow-500 animate-bounce" />
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 text-xl">
                {formatScore(team1)}
              </div>
            </div>
          </div>

          {/* VS Separator */}
          {match.status === "NOT_STARTED" && (
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-100"></div>
              </div>
              <div className="relative px-3 py-1 bg-white text-xs font-bold text-blue-500 rounded-full border border-blue-200 shadow-sm">
                VS
              </div>
            </div>
          )}

          {/* Team 2 */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              match.status === "NOT_STARTED"
                ? "bg-gradient-to-r from-blue-50/30 to-transparent hover:from-blue-50/50 hover:to-transparent"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {match.status === "NOT_STARTED" && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-sm"></div>
                )}
                <img
                  src={team2.teamFlagUrl}
                  alt={team2.teamName}
                  className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {team2.teamShortName}
                </h3>
                <p className="text-xs text-gray-500">{team2.teamName}</p>
              </div>
              {match.status === "COMPLETED" && (
                <Trophy className="h-5 w-5 text-yellow-500 animate-bounce" />
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 text-xl">
                {formatScore(team2)}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Match Status Section */}
        {renderMatchStatusSection()}

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
                Number(match.originalStartTime) || Date.parse(match.startTime),
              ).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(
                Number(match.originalStartTime) || Date.parse(match.startTime),
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {showPredictButton && match.status !== "ABANDONED" && (
          <Button
            className={`w-full ${
              match.status === "NOT_STARTED"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            } text-white transition-all duration-300`}
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
