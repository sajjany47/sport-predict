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
  Home,
} from "lucide-react";

interface TeamFormData {
  teamId: string;
  teamName: string;
  teamFlag: string;
  last5: string[];
  matches: Match[];
}

interface Match {
  matchName: string;
  series: string;
  result: string;
  teams: {
    name: string;
    score: string;
    overs: string;
    flag: string;
  }[];
  matchUrl: string;
}

interface H2HData {
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
  matches: H2HMatch[];
}

interface H2HMatch {
  matchUrl: string;
  team1: string;
  team1Score: string;
  team1Overs: string;
  team2: string;
  team2Score: string;
  team2Overs: string;
  result: string;
  series: string;
}

interface PointsTableData {
  team: string;
  logo: string | null;
  played: number | null;
  wins: number | null;
  losses: number | null;
  nrr: string;
  points: number;
}

interface ComparisonData {
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
  comparison: {
    overall: TeamComparison[];
    venue: TeamComparison[];
  };
}

interface TeamComparison {
  team1: string;
  metric: string;
  team2: string;
}

interface VenueDetails {
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
  recentMatches: VenueMatch[];
}

interface VenueMatch {
  team1: string;
  team1Score: string;
  team1Overs: string;
  team2: string;
  team2Score: string;
  team2Overs: string;
  result: string;
  series: string;
  url: string;
}

interface OverviewTabProps {
  matchData: {
    teamForm: TeamFormData[];
    h2h: H2HData;
    pointsTable: PointsTableData[];
    comparision: ComparisonData;
    venueDetails: VenueDetails;
  };
}

const CrexOverviewTab = ({ matchData }: OverviewTabProps) => {
  // Safe destructuring with fallbacks
  const team1Data = matchData?.teamForm?.[0] ?? {
    teamId: "",
    teamName: "",
    teamFlag: "",
    last5: [],
    matches: [],
  };
  const team2Data = matchData?.teamForm?.[1] ?? {
    teamId: "",
    teamName: "",
    teamFlag: "",
    last5: [],
    matches: [],
  };

  // Calculate form from last5 matches
  const calculateForm = (team: TeamFormData) => {
    const last5 = team?.last5 ?? [];
    return last5.slice(1).map((result) => {
      if (result === "W") return "win";
      if (result === "L") return "loss";
      return "draw";
    });
  };

  // Get H2H stats
  const getH2HStats = () => {
    return {
      team1Wins: matchData?.h2h?.team1?.wins ?? 0,
      team2Wins: matchData?.h2h?.team2?.wins ?? 0,
      draws: 0, // Assuming no draws in the provided data
    };
  };

  // Get points table data
  const getPointsTableData = (teamId: string) => {
    if (!teamId) return null;
    return (matchData?.pointsTable ?? []).find((pt) => pt?.team === teamId);
  };

  const team1Form = calculateForm(team1Data);
  const team2Form = calculateForm(team2Data);
  const h2hStats = getH2HStats();
  const team1Points = getPointsTableData(team1Data?.teamId);
  const team2Points = getPointsTableData(team2Data?.teamId);

  // Calculate win percentages for comparison
  const calculateWinPercentage = (team: TeamFormData) => {
    const last5 = team?.last5 ?? [];
    const wins = last5.slice(1).filter((m) => m === "W").length;
    const totalMatches = last5.length - 1 || 1; // Avoid division by zero
    return Math.round((wins / totalMatches) * 100);
  };

  // Calculate wins in last 5 matches
  const calculateWinsInLast5 = (team: TeamFormData) => {
    const last5 = team?.last5 ?? [];
    return last5.slice(1).filter((m) => m === "W").length;
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

  // Safe comparison data
  const comparisonOverall = matchData?.comparision?.comparison?.overall ?? [];

  // Safe H2H matches
  const h2hMatches = matchData?.h2h?.matches ?? [];

  // Safe points table
  const pointsTable = matchData?.pointsTable ?? [];

  return (
    <div className="space-y-6">
      {/* Header with Teams and Basic Info */}
      <Card>
        <CardContent className="p-4 md:p-6">
          {/* Desktop View (3 columns) */}
          <div className="hidden md:flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Team 1 */}
            <div className="flex flex-col items-center text-center space-y-3 flex-1">
              <div className="relative">
                <img
                  src={team1Data.teamFlag || ""}
                  alt={team1Data.teamName || "Team"}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-xs px-2 py-1">
                    {team1Data.teamId || "T1"}
                  </Badge>
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold">
                {team1Data.teamName || "Team 1"}
              </h2>
              {team1Points && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-sm md:text-base">
                      {team1Points.points ?? 0} Points
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    NRR: {team1Points.nrr ?? "0.00"}
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
              <p className="text-xs text-gray-400">
                Last {h2hMatches.length} meetings
              </p>
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center text-center space-y-3 flex-1">
              <div className="relative">
                <img
                  src={team2Data?.teamFlag || ""}
                  alt={team2Data?.teamName || "Team"}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-red-600 text-xs px-2 py-1">
                    {team2Data?.teamId || "T2"}
                  </Badge>
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold">
                {team2Data?.teamName || "Team 2"}
              </h2>
              {team2Points && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-sm md:text-base">
                      {team2Points?.points ?? 0} Points
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    NRR: {team2Points?.nrr ?? "0.00"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Mobile View (Single line) */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              {/* Team 1 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="relative mb-2">
                  <img
                    src={team1Data.teamFlag || ""}
                    alt={team1Data.teamName || "Team"}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-[10px] px-1 py-0.5">
                      {team1Data.teamId || "T1"}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-gray-900 truncate max-w-[80px]">
                  {team1Data.teamName || "Team 1"}
                </h3>
                {team1Points && (
                  <div className="mt-1">
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-semibold">
                        {team1Points.points ?? 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* VS and H2H */}
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

              {/* Team 2 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="relative mb-2">
                  <img
                    src={team2Data?.teamFlag || ""}
                    alt={team2Data?.teamName || "Team"}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-red-600 text-[10px] px-1 py-0.5">
                      {team2Data?.teamId || "T2"}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-gray-900 truncate max-w-[80px]">
                  {team2Data?.teamName || "Team 2"}
                </h3>
                {team2Points && (
                  <div className="mt-1">
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-semibold">
                        {team2Points?.points ?? 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional info for mobile */}
            {team1Points && team2Points && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500">NRR</p>
                  <p className="text-sm font-bold text-blue-600">
                    {team1Points.nrr ?? "0.00"}
                  </p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-500">NRR</p>
                  <p className="text-sm font-bold text-red-600">
                    {team2Points.nrr ?? "0.00"}
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
            {/* Team 1 Form */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={team1Data.teamFlag || ""}
                    alt={team1Data.teamName || "Team"}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                  <div>
                    <span className="font-semibold text-base">
                      {team1Data.teamName || "Team 1"}
                    </span>
                    <p className="text-sm text-gray-500">
                      {team1Data.teamId || "T1"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Win Rate: {calculateWinPercentage(team1Data)}%
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
                    {calculateWinsInLast5(team1Data)} Wins
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateWinsInLast5(team1Data)} wins,{" "}
                  {5 - calculateWinsInLast5(team1Data)} losses in last 5 matches
                </p>
              </div>
            </div>

            {/* Team 2 Form */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={team2Data?.teamFlag || ""}
                    alt={team2Data?.teamName || "Team"}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                  <div>
                    <span className="font-semibold text-base">
                      {team2Data?.teamName || "Team 2"}
                    </span>
                    <p className="text-sm text-gray-500">
                      {team2Data?.teamId || "T2"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Win Rate: {calculateWinPercentage(team2Data)}%
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
                    {calculateWinsInLast5(team2Data)} Wins
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateWinsInLast5(team2Data)} wins,{" "}
                  {5 - calculateWinsInLast5(team2Data)} losses in last 5 matches
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
                src={team1Data.teamFlag || ""}
                alt={team1Data.teamName || "Team"}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "";
                }}
              />
              <div className="font-bold text-lg text-blue-600">
                {team1Data.teamId || "T1"}
              </div>
              <div className="text-xs text-gray-500">vs all teams</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                Team Comparison
              </div>
              <div className="text-sm text-gray-400">Overall Stats</div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <img
                src={team2Data.teamFlag || ""}
                alt={team2Data.teamName || "Team"}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "";
                }}
              />
              <div className="font-bold text-lg text-red-600">
                {team2Data.teamId || "T2"}
              </div>
              <div className="text-xs text-gray-500">vs all teams</div>
            </div>
          </div>

          {/* Comparison Metrics - Simple Table */}
          <div className="space-y-6">
            {comparisonOverall.map((item, index) => {
              const metric = metrics.find((m) => m.key === item?.metric);
              if (!metric || !item) return null;

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
                      {item.team1 ?? "0"}
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
                            style={{ width: `${parseInt(item.team1 ?? "0")}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">vs</span>
                        <div className="w-16 h-1 bg-red-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500"
                            style={{ width: `${parseInt(item.team2 ?? "0")}%` }}
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
                      {item.team2 ?? "0"}
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
              {pointsTable
                .filter(
                  (team) =>
                    team?.team === team1Data.teamId ||
                    team?.team === team2Data.teamId,
                )
                .map((team, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      team?.team === team1Data.teamId
                        ? "border-blue-200 bg-gradient-to-r from-blue-50 to-white"
                        : team?.team === team2Data.teamId
                          ? "border-red-200 bg-gradient-to-r from-red-50 to-white"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {team?.logo ? (
                            <img
                              src={team.logo}
                              alt={team.team || "Team"}
                              className="w-10 h-10"
                              onError={(e) => {
                                e.currentTarget.src = "";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {team?.team?.slice(0, 2) || "T"}
                              </span>
                            </div>
                          )}
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              team?.team === team1Data.teamId
                                ? "bg-blue-500 text-white"
                                : team?.team === team2Data.teamId
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-500 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold">{team?.team || "Team"}</p>
                          {team?.played !== null &&
                            team?.played !== undefined && (
                              <p className="text-sm text-gray-500">
                                {team?.wins ?? 0}W - {team?.losses ?? 0}L (
                                {team?.played ?? 0} played)
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{team?.points ?? 0}</p>
                        <p className="text-sm text-gray-500">Points</p>
                        <div className="mt-1">
                          <Badge
                            className={`text-xs ${
                              team?.nrr && parseFloat(team.nrr) > 0
                                ? "bg-green-100 text-green-800"
                                : team?.nrr && parseFloat(team.nrr) < 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {team?.nrr ? `NRR: ${team.nrr}` : "No NRR"}
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
                    {team1Data.teamId || "T1"} Wins
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
                    {team2Data.teamId || "T2"} Wins
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-sm text-gray-700">
                  Recent Head to Head Matches:
                </p>
                {h2hMatches.slice(0, 3).map((match, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-l-4 border-purple-500 shadow-sm"
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      {match?.series || "Series"}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            match?.result?.includes(team1Data.teamId)
                              ? "text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {match?.team1 || "Team 1"}
                        </span>
                        <span className="text-sm font-medium">
                          {match?.team1Score || "0"}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-400">VS</div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            match?.result?.includes(team2Data.teamId)
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {match?.team2 || "Team 2"}
                        </span>
                        <span className="text-sm font-medium">
                          {match?.team2Score || "0"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge
                        className={`text-xs ${
                          match?.result?.includes(team1Data.teamId)
                            ? "bg-blue-100 text-blue-800"
                            : match?.result?.includes(team2Data.teamId)
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {match?.result || "No result"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {match?.team1Overs || ""}
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
                  src={team1Data.teamFlag || ""}
                  alt={team1Data.teamName || "Team"}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <div>
                  <h3 className="font-bold">
                    {team1Data.teamName || "Team 1"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Last 5 matches performance
                  </p>
                </div>
                <Badge className="ml-auto bg-blue-100 text-blue-800">
                  {calculateWinsInLast5(team1Data)}W -{" "}
                  {5 - calculateWinsInLast5(team1Data)}L
                </Badge>
              </div>
              <div className="space-y-3">
                {(team1Data.matches ?? []).slice(0, 5).map((match, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      match?.result === "W"
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
                        : "border-red-200 bg-gradient-to-r from-red-50 to-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          {match?.matchName || "Match"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {match?.series || "Series"}
                        </p>
                      </div>
                      <Badge
                        className={
                          match?.result === "W"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {match?.result === "W" ? "WIN" : "LOSS"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      {(match?.teams ?? []).map((team, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={team?.flag || ""}
                              alt={team?.name || "Team"}
                              className="w-4 h-4"
                              onError={(e) => {
                                e.currentTarget.src = "";
                              }}
                            />
                            <span
                              className={
                                team?.name === team1Data.teamId
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {team?.name || "Team"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">
                              {team?.score || "0"}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({team?.overs || "0"})
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
                  src={team2Data?.teamFlag || ""}
                  alt={team2Data?.teamName || "Team"}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <div>
                  <h3 className="font-bold">
                    {team2Data?.teamName || "Team 2"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Last 5 matches performance
                  </p>
                </div>
                <Badge className="ml-auto bg-red-100 text-red-800">
                  {calculateWinsInLast5(team2Data)}W -{" "}
                  {5 - calculateWinsInLast5(team2Data)}L
                </Badge>
              </div>
              <div className="space-y-3">
                {(team2Data?.matches ?? []).slice(0, 5).map((match, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      match?.result === "W"
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
                        : "border-red-200 bg-gradient-to-r from-red-50 to-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          {match?.matchName || "Match"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {match?.series || "Series"}
                        </p>
                      </div>
                      <Badge
                        className={
                          match?.result === "W"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {match?.result === "W" ? "WIN" : "LOSS"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      {(match?.teams ?? []).map((team, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={team?.flag || ""}
                              alt={team?.name || "Team"}
                              className="w-4 h-4"
                              onError={(e) => {
                                e.currentTarget.src = "";
                              }}
                            />
                            <span
                              className={
                                team?.name === team2Data?.teamId
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {team?.name || "Team"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">
                              {team?.score || "0"}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({team?.overs || "0"})
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
