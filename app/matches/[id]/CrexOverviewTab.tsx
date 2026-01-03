/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

interface Team {
  teamId: string;
  teamName: string;
  teamFlag: string;
  recent5: Match[];
}

interface Match {
  matchName: string;
  series: string;
  result: string;
  teams: {
    team: string;
    score: string;
    overs: string;
    flag: string;
  }[];
  url: string;
}

interface H2HMatch {
  team1: {
    name: string;
    score: string;
    overs: string;
  };
  team2: {
    name: string;
    score: string;
    overs: string;
  };
  result: string;
  series: string;
  url: string;
}

interface PointsTable {
  team: string;
  flag: string;
  played: string;
  won: string;
  lost: string;
  nrr: string;
  points: string;
}

interface TeamComparison {
  team1: string;
  metric: string;
  team2: string;
}

interface OverviewTabProps {
  matchData: {
    teams: Team[];
    h2h: H2HMatch[];
    pointsTable: PointsTable[];
    teamComparison: TeamComparison[];
    venueRecentMatches?: any[];
  };
}

const CrexOverviewTab = ({ matchData }: OverviewTabProps) => {
  const team1 = matchData.teams[0];
  const team2 = matchData.teams[1];

  // Calculate form from recent5 matches
  const calculateForm = (team: Team) => {
    return team.recent5.map((match) => {
      const result = match.result;
      if (result === "W") return "win";
      if (result === "L") return "loss";
      return "draw";
    });
  };

  // Calculate H2H stats
  const calculateH2HStats = () => {
    let team1Wins = 0;
    let team2Wins = 0;
    let draws = 0;

    matchData.h2h.forEach((match) => {
      if (match.result.includes(team1.teamId)) team1Wins++;
      else if (match.result.includes(team2.teamId)) team2Wins++;
      else draws++;
    });

    return { team1Wins, team2Wins, draws };
  };

  // Get points table data
  const getPointsTableData = (teamId: string) => {
    return matchData.pointsTable.find((pt) => pt.team === teamId);
  };

  const team1Form = calculateForm(team1);
  const team2Form = calculateForm(team2);
  const h2hStats = calculateH2HStats();
  const team1Points = getPointsTableData(team1.teamId);
  const team2Points = getPointsTableData(team2.teamId);

  // Calculate win percentages for comparison
  const calculateWinPercentage = (team: Team) => {
    const wins = team.recent5.filter((m) => m.result === "W").length;
    return Math.round((wins / team.recent5.length) * 100);
  };

  // Calculate wins in last 5 matches
  const calculateWinsInLast5 = (team: Team) => {
    return team.recent5.filter((m) => m.result === "W").length;
  };

  const getNumericValue = (value: string): number => {
    if (value.includes("%")) {
      return parseInt(value);
    }
    return 0;
  };

  // Define metrics with icons and colors
  const metrics = [
    {
      key: "Matches Played",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      key: "Win",
      icon: Trophy,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      key: "Avg Score",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      key: "Highest Score",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      key: "Lowest Score",
      icon: BarChart3,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Teams and Basic Info */}
      <Card>
        <CardContent className="">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Team 1 */}
            <div className="flex flex-col items-center text-center space-y-3 flex-1">
              <div className="relative">
                <img
                  src={team1.teamFlag}
                  alt={team1.teamName}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-xs px-2 py-1">
                    {team1.teamId}
                  </Badge>
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold">{team1.teamName}</h2>
              {team1Points && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-sm md:text-base">
                      {team1Points.points} Points
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    NRR: {team1Points.nrr}
                  </Badge>
                </div>
              )}
            </div>

            {/* VS Badge */}
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
              <p className="text-xs text-gray-400">Last 5 meetings</p>
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center text-center space-y-3 flex-1">
              <div className="relative">
                <img
                  src={team2.teamFlag}
                  alt={team2.teamName}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-red-600 text-xs px-2 py-1">
                    {team2.teamId}
                  </Badge>
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold">{team2.teamName}</h2>
              {team2Points && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-sm md:text-base">
                      {team2Points.points} Points
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    NRR: {team2Points.nrr}
                  </Badge>
                </div>
              )}
            </div>
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
            {/* Team 1 Form */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={team1.teamFlag}
                    alt={team1.teamName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <span className="font-semibold text-base">
                      {team1.teamName}
                    </span>
                    <p className="text-sm text-gray-500">{team1.teamId}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Win Rate: {calculateWinPercentage(team1)}%
                </Badge>
              </div>

              {/* Form indicators - Medium size */}
              <div className="flex gap-2 mb-3">
                {team1Form.map((form, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-10 rounded-lg flex items-center justify-center text-base font-bold ${
                      form === "win"
                        ? "bg-green-500 text-white"
                        : form === "loss"
                        ? "bg-red-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {form === "win" ? "W" : form === "loss" ? "L" : "D"}
                  </div>
                ))}
              </div>

              {/* Wins in last 5 - Highlighted */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">
                      Last 5 Matches Performance
                    </span>
                  </div>
                  <span className="font-bold text-lg text-blue-700">
                    {calculateWinsInLast5(team1)} Wins
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateWinsInLast5(team1)} wins,{" "}
                  {5 - calculateWinsInLast5(team1)} losses in last 5 matches
                </p>
              </div>
            </div>

            {/* Team 2 Form */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={team2.teamFlag}
                    alt={team2.teamName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <span className="font-semibold text-base">
                      {team2.teamName}
                    </span>
                    <p className="text-sm text-gray-500">{team2.teamId}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Win Rate: {calculateWinPercentage(team2)}%
                </Badge>
              </div>

              {/* Form indicators - Medium size */}
              <div className="flex gap-2 mb-3">
                {team2Form.map((form, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-10 rounded-lg flex items-center justify-center text-base font-bold ${
                      form === "win"
                        ? "bg-green-500 text-white"
                        : form === "loss"
                        ? "bg-red-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {form === "win" ? "W" : form === "loss" ? "L" : "D"}
                  </div>
                ))}
              </div>

              {/* Wins in last 5 - Highlighted */}
              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-gray-700">
                      Last 5 Matches Performance
                    </span>
                  </div>
                  <span className="font-bold text-lg text-red-700">
                    {calculateWinsInLast5(team2)} Wins
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateWinsInLast5(team2)} wins,{" "}
                  {5 - calculateWinsInLast5(team2)} losses in last 5 matches
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Comparison - Perfect Layout */}
      <Card>
        <CardContent className="p-6">
          {/* Header */}
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
              <div className="text-sm text-gray-400">Last 10 Matches</div>
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

          {/* Comparison Metrics - Simple Table */}
          <div className="space-y-6">
            {matchData.teamComparison.map((item, index) => {
              const metric = metrics.find((m) => m.key === item.metric);
              if (!metric) return null;

              const Icon = metric.icon;
              const isWinMetric = item.metric === "Win";

              return (
                <div key={index} className="flex items-center justify-between">
                  {/* Team 1 Value */}
                  <div className="w-1/3 text-right pr-4">
                    <div
                      className={`text-2xl font-bold ${
                        isWinMetric ? "text-blue-600" : "text-blue-700"
                      }`}
                    >
                      {item.team1}
                    </div>
                    {isWinMetric && (
                      <div className="text-xs text-gray-500">Win %</div>
                    )}
                  </div>

                  {/* Metric with Icon */}
                  <div className="w-1/3 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                      <span className="font-medium text-gray-700">
                        {item.metric}
                      </span>
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

                  {/* Team 2 Value */}
                  <div className="w-1/3 text-left pl-4">
                    <div
                      className={`text-2xl font-bold ${
                        isWinMetric ? "text-red-600" : "text-red-700"
                      }`}
                    >
                      {item.team2}
                    </div>
                    {isWinMetric && (
                      <div className="text-xs text-gray-500">Win %</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Points Table & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Points Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Points Table Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matchData.pointsTable.map((team, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    team.team === team1.teamId
                      ? "border-blue-200 bg-gradient-to-r from-blue-50 to-white"
                      : team.team === team2.teamId
                      ? "border-red-200 bg-gradient-to-r from-red-50 to-white"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={team.flag}
                          alt={team.team}
                          className="w-10 h-10"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            team.team === team1.teamId
                              ? "bg-blue-500 text-white"
                              : team.team === team2.teamId
                              ? "bg-red-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{team.team}</p>
                        <p className="text-sm text-gray-500">
                          {team.won}W - {team.lost}L ({team.played} played)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{team.points}</p>
                      <p className="text-sm text-gray-500">Points</p>
                      <div className="mt-1">
                        <Badge
                          className={`text-xs ${
                            parseFloat(team.nrr) > 0
                              ? "bg-green-100 text-green-800"
                              : parseFloat(team.nrr) < 0
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          NRR: {team.nrr}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Head to Head History */}
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
                  Recent Head to Head Matches:
                </p>
                {matchData.h2h.slice(0, 3).map((match, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-l-4 border-purple-500 shadow-sm"
                  >
                    <p className="text-xs text-gray-500 mb-1">{match.series}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            match.result.includes(team1.teamId)
                              ? "text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {match.team1.name}
                        </span>
                        <span className="text-sm font-medium">
                          {match.team1.score}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-400">VS</div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            match.result.includes(team2.teamId)
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {match.team2.name}
                        </span>
                        <span className="text-sm font-medium">
                          {match.team2.score}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge
                        className={`text-xs ${
                          match.result.includes(team1.teamId)
                            ? "bg-blue-100 text-blue-800"
                            : match.result.includes(team2.teamId)
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {match.result}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {match.team1.overs}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Recent Matches Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 Recent Matches */}
            <div>
              <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg">
                <img
                  src={team1.teamFlag}
                  alt={team1.teamName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{team1.teamName}</h3>
                  <p className="text-xs text-gray-500">
                    Last 5 matches performance
                  </p>
                </div>
                <Badge className="ml-auto bg-blue-100 text-blue-800">
                  {calculateWinsInLast5(team1)}W -{" "}
                  {5 - calculateWinsInLast5(team1)}L
                </Badge>
              </div>
              <div className="space-y-3">
                {team1.recent5.map((match, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      match.result === "W"
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
                        : "border-red-200 bg-gradient-to-r from-red-50 to-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{match.matchName}</p>
                        <p className="text-xs text-gray-500">{match.series}</p>
                      </div>
                      <Badge
                        className={
                          match.result === "W"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {match.result === "W" ? "WIN" : "LOSS"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      {match.teams.map((team, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={team.flag}
                              alt={team.team}
                              className="w-4 h-4"
                            />
                            <span
                              className={
                                team.team === team1.teamId ? "font-medium" : ""
                              }
                            >
                              {team.team}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{team.score}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({team.overs})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team 2 Recent Matches */}
            <div>
              <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-red-50 to-white rounded-lg">
                <img
                  src={team2.teamFlag}
                  alt={team2.teamName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{team2.teamName}</h3>
                  <p className="text-xs text-gray-500">
                    Last 5 matches performance
                  </p>
                </div>
                <Badge className="ml-auto bg-red-100 text-red-800">
                  {calculateWinsInLast5(team2)}W -{" "}
                  {5 - calculateWinsInLast5(team2)}L
                </Badge>
              </div>
              <div className="space-y-3">
                {team2.recent5.map((match, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      match.result === "W"
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
                        : "border-red-200 bg-gradient-to-r from-red-50 to-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{match.matchName}</p>
                        <p className="text-xs text-gray-500">{match.series}</p>
                      </div>
                      <Badge
                        className={
                          match.result === "W"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {match.result === "W" ? "WIN" : "LOSS"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      {match.teams.map((team, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={team.flag}
                              alt={team.team}
                              className="w-4 h-4"
                            />
                            <span
                              className={
                                team.team === team2.teamId ? "font-medium" : ""
                              }
                            >
                              {team.team}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{team.score}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({team.overs})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrexOverviewTab;
