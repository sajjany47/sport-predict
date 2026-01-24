/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  Users,
  Award,
  Flame,
  Home,
  Shield,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  TargetIcon,
} from "lucide-react";

interface OverviewTabProps {
  matchData: {
    teamForm: Array<{
      teamId: string;
      teamName: string;
      teamFlag: string;
      last5: string[];
      matches: Array<{
        matchName: string;
        series: string;
        result: string;
        teams: Array<{
          name: string;
          score: string;
          overs: string;
          flag: string;
        }>;
        matchUrl: string;
      }>;
    }>;
    h2h: {
      team1: {
        name: string;
        logo: string;
        wins: number;
      };
      team2: {
        name: string;
        logo: string;
        wins: number;
      };
      matches: Array<{
        team1: string;
        team1Score: string;
        team1Overs: string;
        team2: string;
        team2Score: string;
        team2Overs: string;
        result: string;
        series: string;
        url: string;
      }>;
    };
    pointsTable: Array<{
      team: string;
      logo: string | null;
      played: string | null;
      wins: number | null;
      losses: number;
      nrr: string;
      points: number;
    }>;
    comparision: {
      teams: {
        team1: {
          name: string;
          logo: string;
        };
        team2: {
          name: string;
          logo: string;
        };
      };
      comparision: {
        overall: Array<{
          team1: string;
          metric: string;
          team2: string;
        }>;
        venue: Array<{
          team1: string;
          metric: string;
          team2: string;
        }>;
      };
    };
    venueDetails: {
      name: string;
      weather: {
        temperature: string;
        condition: string;
        humidity: string;
        rainChance: string;
      };
      stats: {
        matches: string;
        winBatFirst: string;
        winBowlFirst: string;
        avg1stInns: string;
        avg2ndInns: string;
      };
      records: {
        "Highest Total": {
          vs: string;
          score: string;
        };
        "Lowest Total": {
          vs: string;
          score: string;
        };
        "Highest Chased": {
          vs: string;
          score: string;
        };
        "Lowest Defended": {
          vs: string;
          score: string;
        };
      };
      paceVsSpin: {
        paceWickets: string;
        spinWickets: string;
        pacePercent: string;
        spinPercent: string;
      };
      recentMatches: Array<{
        team1: string;
        team1Score: string;
        team1Overs: string;
        team2: string;
        team2Score: string;
        team2Overs: string;
        result: string;
        series: string;
        url: string;
      }>;
    };
  };
}

// Reusable Components
const EmptyState = ({ icon: Icon, title, subtitle }: any) => (
  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
    <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

const TeamCard = ({ team, color = "blue", isMobile = false }: any) => {
  const colorClasses: any = {
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      light: "bg-blue-50",
      border: "border-blue-200",
      gradient: "from-blue-50 to-white",
    },
    red: {
      bg: "bg-red-600",
      text: "text-red-600",
      light: "bg-red-50",
      border: "border-red-200",
      gradient: "from-red-50 to-white",
    },
  };

  const colors = colorClasses[color];

  if (isMobile) {
    return (
      <div className="flex flex-col items-center text-center flex-1">
        <div className="relative mb-2">
          <div
            className={`w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-gradient-to-br ${colors.gradient}`}
          >
            <img
              src={team.teamFlag}
              alt={team.teamName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <Badge className={`${colors.bg} text-[10px] px-1 py-0.5`}>
              {team.teamId}
            </Badge>
          </div>
        </div>
        <h3 className="text-xs font-bold text-gray-900 truncate max-w-[80px]">
          {team.teamName}
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-3 flex-1">
      <div className="relative">
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br ${colors.gradient}`}
        >
          <img
            src={team.teamFlag}
            alt={team.teamName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <Badge className={`${colors.bg} text-xs px-2 py-1`}>
            {team.teamId}
          </Badge>
        </div>
      </div>
      <h2 className="text-lg md:text-xl font-bold">{team.teamName}</h2>
    </div>
  );
};

const FormIndicator = ({ results }: { results: string[] }) => (
  <div className="flex gap-2 mb-3">
    {results.map((result, index) => (
      <div
        key={index}
        className={`flex-1 h-10 rounded-lg flex items-center justify-center text-base font-bold ${
          result === "W"
            ? "bg-green-500 text-white"
            : result === "L"
              ? "bg-red-500 text-white"
              : result === "*"
                ? "bg-yellow-500 text-white"
                : "bg-gray-400 text-white"
        }`}
      >
        {result === "*" ? "*" : result}
      </div>
    ))}
  </div>
);

const ComparisonRow = ({
  item,
  team1Color = "blue",
  team2Color = "red",
}: any) => {
  const metricsConfig = [
    { key: "Matches Played", icon: Users, color: "text-blue-500" },
    { key: "Win", icon: Trophy, color: "text-green-500" },
    { key: "Avg Score", icon: TrendingUp, color: "text-orange-500" },
    { key: "Highest Score", icon: Target, color: "text-purple-500" },
    { key: "Lowest Score", icon: BarChart3, color: "text-red-500" },
  ];

  const metric = metricsConfig.find((m) => m.key === item.metric);
  const Icon = metric?.icon || BarChart3;
  const isWinMetric = item.metric === "Win";

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="w-1/3 text-right pr-4">
        <div
          className={`text-2xl font-bold ${team1Color === "blue" ? "text-blue-600" : "text-red-600"}`}
        >
          {item.team1}
        </div>
        {isWinMetric && <div className="text-xs text-gray-500">Win %</div>}
      </div>

      <div className="w-1/3 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-5 h-5 ${metric?.color}`} />
          <span className="font-medium text-gray-700">{item.metric}</span>
        </div>
        {isWinMetric && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${parseInt(item.team1)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">vs</span>
            <div className="w-16 h-1 bg-red-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${parseInt(item.team2)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="w-1/3 text-left pl-4">
        <div
          className={`text-2xl font-bold ${team2Color === "red" ? "text-red-600" : "text-blue-600"}`}
        >
          {item.team2}
        </div>
        {isWinMetric && <div className="text-xs text-gray-500">Win %</div>}
      </div>
    </div>
  );
};

const MatchCard = ({ match, teamId, color = "blue" }: any) => {
  const colorClasses: any = {
    blue: {
      border: "border-blue-200",
      bg: "bg-gradient-to-r from-blue-50 to-white",
      badge: "bg-blue-100 text-blue-800",
    },
    red: {
      border: "border-red-200",
      bg: "bg-gradient-to-r from-red-50 to-white",
      badge: "bg-red-100 text-red-800",
    },
    green: {
      border: "border-green-200",
      bg: "bg-gradient-to-r from-green-50 to-white",
      badge: "bg-green-100 text-green-800",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`p-3 rounded-lg border ${colors.border} ${colors.bg}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium text-sm">{match.matchName}</p>
          <p className="text-xs text-gray-500">{match.series}</p>
        </div>
        <Badge className={`text-xs ${colors.badge}`}>
          {match.result === "W" ? "WIN" : "LOSS"}
        </Badge>
      </div>
      <div className="space-y-2">
        {match.teams?.map((team: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <img
                src={team.flag}
                alt={team.name}
                className="w-4 h-4 rounded-full"
              />
              <span className={team.name === teamId ? "font-medium" : ""}>
                {team.name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-medium">{team.score}</span>
              <span className="text-xs text-gray-500 ml-2">({team.overs})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const H2HMatchCard = ({ match, team1Id, team2Id }: any) => (
  <div className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-l-4 border-purple-500 shadow-sm">
    <p className="text-xs text-gray-500 mb-1">{match.series}</p>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-bold ${match.result.includes(team1Id) ? "text-blue-600" : "text-gray-700"}`}
        >
          {match.team1}
        </span>
        <span className="text-sm font-medium">{match.team1Score}</span>
      </div>
      <div className="text-xs font-bold text-gray-400">VS</div>
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-bold ${match.result.includes(team2Id) ? "text-red-600" : "text-gray-700"}`}
        >
          {match.team2}
        </span>
        <span className="text-sm font-medium">{match.team2Score}</span>
      </div>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <Badge
        className={`text-xs ${
          match.result.includes(team1Id)
            ? "bg-blue-100 text-blue-800"
            : match.result.includes(team2Id)
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
        }`}
      >
        {match.result}
      </Badge>
      <span className="text-xs text-gray-500">{match.team1Overs}</span>
    </div>
  </div>
);

const CrexOverviewTab = ({ matchData }: OverviewTabProps) => {
  if (!matchData?.teamForm?.length) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No Overview Data Available"
        subtitle="Detailed statistics and analysis will be available soon."
      />
    );
  }

  const team1 = matchData.teamForm[0];
  const team2 = matchData.teamForm[1];
  const h2h = matchData.h2h;
  const comparison: any = matchData.comparision;
  const venueDetails = matchData.venueDetails;

  // Calculate stats
  const calculateWinsInLast5 = (team: any) =>
    team.last5.filter((r: string) => r === "W").length;
  const calculateWinPercentage = (team: any) =>
    Math.round((calculateWinsInLast5(team) / team.last5.length) * 100);
  const getTeamPoints = (teamId: string) =>
    matchData.pointsTable.find((pt: any) => pt.team === teamId);

  const team1Wins = calculateWinsInLast5(team1);
  const team2Wins = calculateWinsInLast5(team2);
  const team1WinPct = calculateWinPercentage(team1);
  const team2WinPct = calculateWinPercentage(team2);
  const team1Points = getTeamPoints(team1.teamId);
  const team2Points = getTeamPoints(team2.teamId);
  const h2hStats = {
    team1Wins: h2h?.team1?.wins || 0,
    team2Wins: h2h?.team2?.wins || 0,
    draws:
      (h2h?.matches?.length || 0) -
      ((h2h?.team1?.wins || 0) + (h2h?.team2?.wins || 0)),
  };

  // Weather icons configuration
  const weatherMetrics = [
    {
      key: "temperature",
      icon: Thermometer,
      label: "Temperature",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      key: "condition",
      icon: Cloud,
      label: "Condition",
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      key: "humidity",
      icon: Droplets,
      label: "Humidity",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      key: "rainChance",
      icon: Wind,
      label: "Rain Chance",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  // Stats icons configuration
  const statsMetrics = [
    { key: "matches", label: "Matches", icon: BarChart3 },
    { key: "winBatFirst", label: "Win Batting First", icon: Target },
    { key: "winBowlFirst", label: "Win Bowling First", icon: TargetIcon },
    { key: "avg1stInns", label: "Avg 1st Innings", icon: TrendingUp },
    { key: "avg2ndInns", label: "Avg 2nd Innings", icon: TrendingUp },
  ];

  // Records configuration
  const records = [
    { key: "Highest Total", icon: Award, color: "text-green-600" },
    { key: "Lowest Total", icon: BarChart3, color: "text-red-600" },
    { key: "Highest Chased", icon: Trophy, color: "text-blue-600" },
    { key: "Lowest Defended", icon: Shield, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Teams */}
      <Card>
        <CardContent className="p-4 md:p-6">
          {/* Desktop View */}
          <div className="hidden md:flex flex-col md:flex-row justify-between items-center gap-6">
            <TeamCard team={team1} color="blue" />

            {/* VS Section */}
            <div className="flex flex-col items-center space-y-2">
              <Badge className="px-4 py-2 text-base md:text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500">
                VS
              </Badge>
              <p className="text-sm text-gray-500">Head to Head</p>
              <div className="flex gap-3 md:gap-4">
                <span className="text-xl md:text-2xl font-bold text-blue-600">
                  {h2hStats.team1Wins}
                </span>
                <span className="text-xl md:text-2xl font-bold text-gray-400">
                  -
                </span>
                <span className="text-xl md:text-2xl font-bold text-red-600">
                  {h2hStats.team2Wins}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Last {h2h?.matches?.length || 0} meetings
              </p>
            </div>

            <TeamCard team={team2} color="red" />
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <TeamCard team={team1} color="blue" isMobile />

              <div className="flex flex-col items-center mx-2">
                <Badge className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-red-500 to-orange-500 mb-1">
                  VS
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-blue-600">
                    {h2hStats.team1Wins}
                  </span>
                  <span className="text-sm font-bold text-gray-400">-</span>
                  <span className="text-sm font-bold text-red-600">
                    {h2hStats.team2Wins}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">H2H</p>
              </div>

              <TeamCard team={team2} color="red" isMobile />
            </div>

            {/* Points for mobile */}
            {team1Points && team2Points && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500">Points</p>
                  <p className="text-sm font-bold text-blue-600">
                    {team1Points.points}
                  </p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-500">Points</p>
                  <p className="text-sm font-bold text-red-600">
                    {team2Points.points}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Current Form (Last 5 Matches)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[team1, team2].map((team, index) => {
              const isTeam1 = index === 0;
              const wins = calculateWinsInLast5(team);

              return (
                <div key={team.teamId}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={team.teamFlag}
                        alt={team.teamName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <span className="font-semibold text-base">
                          {team.teamName}
                        </span>
                        <p className="text-sm text-gray-500">{team.teamId}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Win Rate: {calculateWinPercentage(team)}%
                    </Badge>
                  </div>

                  <FormIndicator results={team.last5} />

                  <div
                    className={`p-3 rounded-lg border ${isTeam1 ? "border-blue-100 bg-blue-50" : "border-red-100 bg-red-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy
                          className={`w-4 h-4 ${isTeam1 ? "text-blue-600" : "text-red-600"}`}
                        />
                        <span className="font-medium text-gray-700">
                          Last 5 Matches
                        </span>
                      </div>
                      <span
                        className={`font-bold text-lg ${isTeam1 ? "text-blue-700" : "text-red-700"}`}
                      >
                        {wins} Wins
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {wins} wins, {5 - wins} losses in last 5 matches
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Comparison */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col items-center gap-1">
              <img
                src={team1.teamFlag}
                alt={team1.teamName}
                className="w-10 h-10 rounded-full"
              />
              <div className="font-bold text-lg text-blue-600">
                {team1.teamId}
              </div>
              <div className="text-xs text-gray-500">vs all teams</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                Team Comparison
              </div>
              <div className="text-sm text-gray-400">Overall Performance</div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <img
                src={team2.teamFlag}
                alt={team2.teamName}
                className="w-10 h-10 rounded-full"
              />
              <div className="font-bold text-lg text-red-600">
                {team2.teamId}
              </div>
              <div className="text-xs text-gray-500">vs all teams</div>
            </div>
          </div>

          <div className="space-y-6">
            {(comparison?.comparison?.overall || []).map(
              (item: any, index: number) => (
                <ComparisonRow key={index} item={item} />
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Venue & Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-500" />
            {venueDetails?.name || "Venue Details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Weather */}
            {venueDetails?.weather && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weatherMetrics.map((metric) => (
                  <div
                    key={metric.key}
                    className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white"
                  >
                    <metric.icon className={`h-8 w-8 ${metric.color} mb-2`} />
                    <span className="text-xl font-bold">
                      {
                        venueDetails.weather[
                          metric.key as keyof typeof venueDetails.weather
                        ]
                      }
                    </span>
                    <span className="text-sm text-gray-600">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Stadium Stats */}
            {venueDetails?.stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statsMetrics.map((stat) => (
                  <div
                    key={stat.key}
                    className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border"
                  >
                    <div className="text-xl font-bold text-gray-900">
                      {
                        venueDetails.stats[
                          stat.key as keyof typeof venueDetails.stats
                        ]
                      }
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Records */}
            {venueDetails?.records && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {records.map((record) => (
                  <div
                    key={record.key}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <record.icon className={`h-5 w-5 ${record.color}`} />
                      <span className="font-medium text-gray-700">
                        {record.key}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {
                        venueDetails.records[
                          record.key as keyof typeof venueDetails.records
                        ]?.score
                      }
                    </div>
                    <div className="text-sm text-gray-600">
                      {
                        venueDetails.records[
                          record.key as keyof typeof venueDetails.records
                        ]?.vs
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Head to Head & Recent Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Head to Head */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Head to Head History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {h2hStats.team1Wins}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {team1.teamId} Wins
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-600">
                    {h2hStats.draws}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Draws</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {h2hStats.team2Wins}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {team2.teamId} Wins
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-sm text-gray-700">
                  Recent Head to Head:
                </p>
                {(h2h?.matches || []).slice(0, 3).map((match, index) => (
                  <H2HMatchCard
                    key={index}
                    match={match}
                    team1Id={team1.teamId}
                    team2Id={team2.teamId}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Recent Matches Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              {[team1, team2].map((team, index) => {
                const isTeam1 = index === 0;
                const wins = calculateWinsInLast5(team);

                return (
                  <div key={team.teamId}>
                    <div
                      className={`flex items-center gap-3 mb-4 p-3 rounded-lg bg-gradient-to-r ${isTeam1 ? "from-blue-50 to-white" : "from-red-50 to-white"}`}
                    >
                      <img
                        src={team.teamFlag}
                        alt={team.teamName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold">{team.teamName}</h3>
                        <p className="text-xs text-gray-500">
                          Last 5 matches performance
                        </p>
                      </div>
                      <Badge
                        className={`ml-auto ${isTeam1 ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                      >
                        {wins}W - {5 - wins}L
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {team.matches.slice(0, 3).map((match, matchIndex) => (
                        <MatchCard
                          key={matchIndex}
                          match={match}
                          teamId={team.teamId}
                          color={isTeam1 ? "blue" : "red"}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrexOverviewTab;
