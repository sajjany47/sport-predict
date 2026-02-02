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
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  Crown,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

interface Team {
  teamName: string;
  teamShortName: string;
  teamFlagUrl: string;
  cricketScore: null | any;
}

interface Score {
  team: string;
  run: string;
}

interface PredictionTeam {
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
}

interface Prediction {
  team1: PredictionTeam;
  team2: PredictionTeam;
  predictedWinner?: string;
  actualWinner?: string;
  predictionCorrect?: boolean;
}

interface MatchData {
  _id: string;
  url: string;
  format: string;
  formatDate: string;
  matchDate: string;
  matchDescription: string;
  matchId: string;
  matchName: string;
  score: {
    score: Score[];
    result: string;
  };
  sport: string;
  startTime: string;
  status: "LIVE" | "UPCOMING" | "COMPLETED" | "ABANDONED";
  teams: Team[];
  createdAt: string;
  updatedAt: string;
  prediction?: any;
}

interface MatchCardProps {
  match: MatchData;
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
  const [countdown, setCountdown] = useState(() => {
    const ts = new Date(match.formatDate).getTime();
    return getTimeRemaining(ts);
  });

  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Parse date and time from formatDate and startTime
  const getMatchDateTime = () => {
    const date = new Date(match.formatDate);
    const [time, modifier]: any = match?.startTime
      ? match?.startTime?.split(" ")
      : " ";
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  useEffect(() => {
    const targetDate = getMatchDateTime();
    const targetTs = targetDate.getTime();

    setCountdown(getTimeRemaining(targetTs));

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (match.status === "UPCOMING") {
      intervalRef.current = window.setInterval(() => {
        const rem = getTimeRemaining(targetTs);
        setCountdown(rem);

        if (rem.total <= 0 && intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match._id, match.formatDate, match.startTime, match.status]);

  // Determine actual winner from result
  const getActualWinner = () => {
    if (!match.score?.result || match.status !== "COMPLETED") return null;

    const result = match.score.result;
    const winningTeam = match.teams.find(
      (team) =>
        result.toLowerCase().includes(team.teamName.toLowerCase()) ||
        result.toLowerCase().includes(team.teamShortName.toLowerCase()),
    );

    return winningTeam?.teamShortName || null;
  };

  // Determine predicted winner based on higher probability
  const getPredictedWinner = () => {
    if (!match.prediction) return null;

    const { team1, team2 } = match.prediction;
    return team1.winnerPrediction.probability >
      team2.winnerPrediction.probability
      ? team1.shortName
      : team2.shortName;
  };

  // Check if prediction was correct
  const isPredictionCorrect = () => {
    const actualWinner = getActualWinner();
    const predictedWinner = getPredictedWinner();

    if (!actualWinner || !predictedWinner) return null;

    return actualWinner === predictedWinner;
  };

  // Get card background style based on prediction result
  const getCardBackgroundStyle = () => {
    if (match.status !== "COMPLETED" || !match.prediction) return "";

    const correct = isPredictionCorrect();

    if (correct === null) return "";

    return correct
      ? "bg-gradient-to-br from-green-50 via-white to-emerald-50 border-green-200/50 shadow-green-100/50"
      : "bg-gradient-to-br from-red-50 via-white to-rose-50 border-red-200/50 shadow-red-100/50";
  };

  // Get card border style
  const getCardBorderStyle = () => {
    if (match.status !== "COMPLETED" || !match.prediction) return "";

    const correct = isPredictionCorrect();

    if (correct === null) return "";

    return correct
      ? "border-l-4 border-green-500"
      : "border-l-4 border-red-500";
  };

  // Get header badge style
  const getHeaderBadgeStyle = () => {
    if (match.status !== "COMPLETED" || !match.prediction) return "";

    const correct = isPredictionCorrect();

    if (correct === null) return "";

    return correct
      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300"
      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300";
  };

  // Get prediction result icon
  const getPredictionResultIcon = () => {
    if (match.status !== "COMPLETED" || !match.prediction) return null;

    const correct = isPredictionCorrect();

    if (correct === null) return null;

    return correct ? (
      <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
        <ShieldCheck className="h-5 w-5" />
      </div>
    ) : (
      <div className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg">
        <ShieldX className="h-5 w-5" />
      </div>
    );
  };

  // Render prediction result banner
  const renderPredictionResultBanner = () => {
    if (match.status !== "COMPLETED" || !match.prediction) return null;

    const correct = isPredictionCorrect();
    const actualWinner = getActualWinner();
    const predictedWinner = getPredictedWinner();

    if (correct === null) return null;

    return (
      <div
        className={`relative mb-4 p-4 rounded-lg overflow-hidden ${correct ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200" : "bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-200"}`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {correct ? (
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20"></div>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-full ${correct ? "bg-green-100" : "bg-red-100"}`}
              >
                {correct ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <h3
                  className={`font-bold ${correct ? "text-green-700" : "text-red-700"}`}
                >
                  {correct ? "PREDICTION PASSED!" : "PREDICTION FAILED"}
                </h3>
                <p className="text-sm text-gray-600">
                  {correct
                    ? `We correctly predicted ${predictedWinner} would win!`
                    : `We predicted ${predictedWinner}, but ${actualWinner} won.`}
                </p>
              </div>
            </div>

            <div
              className={`px-3 py-1 rounded-full font-bold ${correct ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
              {correct ? "PASS" : "FAIL"}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div
              className={`p-2 rounded-lg ${correct ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp
                  className={`h-4 w-4 ${correct ? "text-green-600" : "text-red-600"}`}
                />
                <span className="text-xs font-medium text-gray-600">
                  Our Prediction
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={
                    match.prediction[
                      predictedWinner === match.prediction.team1.shortName
                        ? "team1"
                        : "team2"
                    ].flag
                  }
                  alt="Predicted"
                  className="w-6 h-6 rounded-full border"
                />
                <span className="font-bold">{predictedWinner}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {Math.max(
                    match.prediction.team1.winnerPrediction.probability,
                    match.prediction.team2.winnerPrediction.probability,
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center space-x-2 mb-1">
                <Crown className="h-4 w-4 text-yellow-600" />
                <span className="text-xs font-medium text-gray-600">
                  Actual Winner
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={
                    match.teams.find((t) => t.teamShortName === actualWinner)
                      ?.teamFlagUrl || ""
                  }
                  alt="Actual"
                  className="w-6 h-6 rounded-full border"
                />
                <span className="font-bold">{actualWinner}</span>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Format score display
  const getTeamScore = (teamShortName: string): string => {
    if (!match.score || !match.score.score.length) {
      return "Yet to bat";
    }

    const teamScore = match.score.score.find(
      (score) => score.team === teamShortName,
    );

    return teamScore ? teamScore.run : "Yet to bat";
  };

  // Get match status text
  const getMatchStatusText = (): string => {
    if (match.status === "ABANDONED") return "Match Abandoned";

    if (match.status === "UPCOMING") {
      if (countdown.total > 0) {
        if (countdown.days > 0) {
          return `Starts in ${countdown.days}d ${pad(countdown.hours)}h`;
        }
        return `Starts in ${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
      }
      return `Starts ${match.matchDate}`;
    }

    const result = match.score?.result || "";

    if (match.status === "COMPLETED") {
      return result || "Match completed";
    }

    if (match.status === "LIVE") {
      return result || "Match in progress";
    }

    return "Match status unknown";
  };

  // Render countdown
  const renderCountdown = () => {
    if (match.status !== "UPCOMING") return null;

    if (countdown.total <= 0) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200">
          <Sparkles className="h-3 w-3" />
          <span className="text-xs font-medium">Starting soon</span>
        </div>
      );
    }

    if (countdown.days > 0) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
          <Calendar className="h-3 w-3" />
          <span className="text-xs font-medium">{`${countdown.days}d ${pad(countdown.hours)}h`}</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
        <Clock className="h-3 w-3" />
        <span className="text-xs font-medium font-mono">{`${pad(countdown.hours)}:${pad(countdown.minutes)}`}</span>
      </div>
    );
  };

  // Render enhanced match status section
  const renderMatchStatusSection = () => {
    const matchDateTime = getMatchDateTime();

    if (match.status === "UPCOMING") {
      return (
        <div className="relative overflow-hidden mb-5 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-indigo-200/30 to-transparent rounded-full translate-x-8 translate-y-8"></div>

          <div className="relative z-10">
            {countdown.total > 0 ? (
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
                  {matchDateTime.toLocaleTimeString("en-US", {
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
                    {matchDateTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {matchDateTime.toLocaleTimeString("en-US", {
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
      // For completed matches, don't show the big status section if we have prediction banner
      if (match.status === "COMPLETED" && match.prediction) {
        return null;
      }

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

  // Render team rows with prediction highlights
  const renderTeams = () => {
    return match.teams.map((team, index) => {
      const isPredictedWinner =
        match.prediction && getPredictedWinner() === team.teamShortName;

      const isActualWinner =
        match.status === "COMPLETED" &&
        getActualWinner() === team.teamShortName;

      const correct =
        match.status === "COMPLETED" && match.prediction
          ? isPredictionCorrect()
          : null;

      return (
        <React.Fragment key={team.teamShortName}>
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              match.status === "UPCOMING"
                ? "bg-gradient-to-r from-blue-50/30 to-transparent hover:from-blue-50/50 hover:to-transparent"
                : isActualWinner && correct !== null
                  ? correct
                    ? "bg-gradient-to-r from-green-50/30 to-emerald-50/10 border border-green-100"
                    : "bg-gradient-to-r from-red-50/30 to-rose-50/10 border border-red-100"
                  : "bg-white/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {match.status === "UPCOMING" && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-sm"></div>
                )}
                <img
                  src={team.teamFlagUrl}
                  alt={team.teamName}
                  className={`relative w-10 h-10 rounded-full object-cover border-2 ${
                    isActualWinner
                      ? correct
                        ? "border-green-300 shadow-green-100"
                        : "border-red-300 shadow-red-100"
                      : "border-white shadow-sm"
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />

                {/* Prediction indicator */}
                {match.status === "COMPLETED" &&
                  match.prediction &&
                  isPredictedWinner && (
                    <div className="absolute -top-1 -right-1">
                      <div
                        className={`p-1 rounded-full ${correct ? "bg-green-500" : "bg-red-500"}`}
                      >
                        <TrendingUp className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {team.teamShortName}
                  </h3>
                  {match.status === "COMPLETED" && isActualWinner && (
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="ml-1 text-xs font-medium text-yellow-700">
                        Winner
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{team.teamName}</p>

                {/* Probability for completed matches with prediction */}
                {match.status === "COMPLETED" && match.prediction && (
                  <div className="mt-1">
                    <div className="flex items-center space-x-1">
                      <span
                        className={`text-xs px-2 py-1 rounded ${isPredictedWinner ? (correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700") : "bg-gray-100 text-gray-700"}`}
                      >
                        {match.prediction[
                          `team${index + 1}` as keyof Prediction
                        ].winnerPrediction.probability.toFixed(1)}
                        % win chance
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 text-xl">
                {getTeamScore(team.teamShortName)}
              </div>
              {match.status === "COMPLETED" &&
                match.prediction &&
                isPredictedWinner && (
                  <div
                    className={`mt-1 text-xs font-medium ${correct ? "text-green-600" : "text-red-600"}`}
                  >
                    Our Pick
                  </div>
                )}
            </div>
          </div>

          {index === 0 && match.status === "UPCOMING" && (
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-100"></div>
              </div>
              <div className="relative px-3 py-1 bg-white text-xs font-bold text-blue-500 rounded-full border border-blue-200 shadow-sm">
                VS
              </div>
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  // Render match info items dynamically
  const matchInfoItems = [
    {
      icon: CalendarCog,
      text: match.matchDescription,
      className: "whitespace-normal break-words flex-1",
    },
    {
      icon: MapPin,
      text: match.matchName || "TBD",
      showIcon: true,
    },
    {
      icon: Calendar,
      text: match.matchDate,
      showIcon: true,
    },
    {
      icon: Clock,
      text: match.startTime,
      showIcon: true,
    },
  ];

  const matchDateTime = getMatchDateTime();

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 border-0 ${
        match.status === "COMPLETED" && match.prediction
          ? `${getCardBackgroundStyle()} ${getCardBorderStyle()} shadow-lg`
          : "bg-white"
      } cursor-pointer relative overflow-hidden`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Corner decoration for prediction results */}
      {match.status === "COMPLETED" && match.prediction && (
        <>
          {getPredictionResultIcon()}
          <div
            className={`absolute top-0 right-0 w-32 h-32 opacity-5 -translate-y-16 translate-x-16 ${
              isPredictionCorrect() ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          ></div>
        </>
      )}

      <CardContent className="p-6">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-2 w-full">
            <CalendarCog className="h-4 w-4 shrink-0" />
            <span className="whitespace-normal break-words flex-1">
              {match.matchDescription}
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
                    ? match.prediction
                      ? "outline"
                      : "default"
                    : "secondary"
              }
              className={
                match.status === "UPCOMING"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
                  : match.status === "COMPLETED" && match.prediction
                    ? getHeaderBadgeStyle()
                    : ""
              }
            >
              {match.status === "LIVE"
                ? "🔴 LIVE"
                : match.status === "ABANDONED"
                  ? "⚠️ ABANDONED"
                  : match.status === "UPCOMING"
                    ? "UPCOMING"
                    : "COMPLETED"}
            </Badge>
            <Badge variant="outline">{match.format}</Badge>
          </div>
          {renderCountdown()}
        </div>

        {/* Prediction Result Banner */}
        {match.status === "COMPLETED" &&
          match.prediction &&
          renderPredictionResultBanner()}

        {/* Teams and Scores */}
        <div className="space-y-4 mb-4">{renderTeams()}</div>

        {/* Enhanced Match Status Section */}
        {renderMatchStatusSection()}

        {/* Match Info */}
        <div className="space-y-2 text-xs text-gray-500 mb-4">
          {matchInfoItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {item.showIcon && <item.icon className="h-3 w-3" />}
              <span className={item.className}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {showPredictButton && match.status !== "ABANDONED" && (
          <Button
            className={`w-full ${
              match.status === "UPCOMING"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                : match.status === "COMPLETED" && match.prediction
                  ? isPredictionCorrect()
                    ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                    : "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            } text-white transition-all duration-300 shadow-md hover:shadow-lg`}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Target className="h-4 w-4 mr-2" />
            {match.status === "COMPLETED"
              ? match.prediction
                ? "View Full Analysis"
                : "View Match Details"
              : "Get Prediction"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
