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
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                  <div>
                    <span className="font-extrabold text-gray-900 text-sm uppercase tracking-tight">
                      {team1Data.teamName || "Team 1"}
                    </span>
                    <p className="text-[10px] font-black text-blue-500 uppercase">
                      {team1Data.teamId || "T1"} •{" "}
                      <span className="text-gray-400">Squad List</span>
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 font-black text-[10px] tracking-widest italic"
                >
                  WR: {calculateWinPercentage(team1Data)}%
                </Badge>
              </div>

              {/* Form indicators - Premium Grid */}
              <div className="flex gap-1.5 mb-4">
                {team1Form.map((form, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-12 rounded-xl flex items-center justify-center text-sm font-black shadow-inner transition-transform active:scale-95 ${
                      form === "win"
                        ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-blue-200 border-b-2 border-blue-700"
                        : form === "loss"
                          ? "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-red-200 border-b-2 border-red-700"
                          : "bg-gradient-to-b from-gray-400 to-gray-500 text-white border-b-2 border-gray-600"
                    }`}
                  >
                    {form === "win" ? "W" : form === "loss" ? "L" : "D"}
                  </div>
                ))}
              </div>

              {/* Wins in last 5 - Highlighted Premium */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/10 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg ring-1 ring-blue-200 shadow-sm">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-black text-xs uppercase tracking-widest text-gray-500 block">
                        Performance
                      </span>
                      <span className="font-bold text-gray-800 text-sm">
                        Last 5 Matches
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-2xl text-blue-600 drop-shadow-sm italic">
                      {calculateWinsInLast5(team1Data)}{" "}
                      <span className="text-xs uppercase tracking-tighter not-italic text-gray-400">
                        Wins
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                    style={{
                      width: `${(calculateWinsInLast5(team1Data) / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Team 2 Form */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={team2Data?.teamFlag || ""}
                    alt={team2Data?.teamName || "Team"}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                  <div>
                    <span className="font-extrabold text-gray-900 text-sm uppercase tracking-tight">
                      {team2Data?.teamName || "Team 2"}
                    </span>
                    <p className="text-[10px] font-black text-red-500 uppercase">
                      {team2Data?.teamId || "T2"} •{" "}
                      <span className="text-gray-400">Squad List</span>
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 font-black text-[10px] tracking-widest italic"
                >
                  WR: {calculateWinPercentage(team2Data)}%
                </Badge>
              </div>

              {/* Form indicators - Premium Grid */}
              <div className="flex gap-1.5 mb-4">
                {team2Form.map((form, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-12 rounded-xl flex items-center justify-center text-sm font-black shadow-inner transition-transform active:scale-95 ${
                      form === "win"
                        ? "bg-gradient-to-b from-green-500 to-green-600 text-white shadow-green-200 border-b-2 border-green-700"
                        : form === "loss"
                          ? "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-red-200 border-b-2 border-red-700"
                          : "bg-gradient-to-b from-gray-400 to-gray-500 text-white border-b-2 border-gray-600"
                    }`}
                  >
                    {form === "win" ? "W" : form === "loss" ? "L" : "D"}
                  </div>
                ))}
              </div>

              {/* Wins in last 5 - Highlighted Premium */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50/10 rounded-xl border border-red-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg ring-1 ring-red-200 shadow-sm">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <span className="font-black text-xs uppercase tracking-widest text-gray-500 block">
                        Performance
                      </span>
                      <span className="font-bold text-gray-800 text-sm">
                        Last 5 Matches
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-2xl text-red-600 drop-shadow-sm italic">
                      {calculateWinsInLast5(team2Data)}{" "}
                      <span className="text-xs uppercase tracking-tighter not-italic text-gray-400">
                        Wins
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-1000"
                    style={{
                      width: `${(calculateWinsInLast5(team2Data) / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Team Comparison - Premium Card */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 p-4 sm:p-6 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12 transform translate-x-16"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Mobile Layout (Stacked) */}
            <div className="md:hidden">
              {/* Top row with both teams */}
              <div className="flex justify-between items-center gap-4 mb-6">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg transform -rotate-3">
                    <img
                      src={team1Data.teamFlag || ""}
                      alt={team1Data.teamName || "Team"}
                      className="w-full h-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-lg tracking-tighter text-blue-200">
                      {team1Data.teamId || "T1"}
                    </div>
                    <p className="text-blue-300/80 text-[10px] font-bold uppercase mt-0.5 truncate max-w-[100px]">
                      {team1Data.teamName}
                    </p>
                  </div>
                </div>

                {/* VS Badge Mobile */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <span className="text-xs font-black text-white/80">VS</span>
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg transform rotate-3">
                    <img
                      src={team2Data.teamFlag || ""}
                      alt={team2Data.teamName || "Team"}
                      className="w-full h-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-lg tracking-tighter text-red-300">
                      {team2Data.teamId || "T2"}
                    </div>
                    <p className="text-red-300/80 text-[10px] font-bold uppercase mt-0.5 truncate max-w-[100px]">
                      {team2Data.teamName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Center Title Mobile */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md mb-2">
                  <BarChart3 className="w-3 h-3 text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                    Live Analytics
                  </span>
                </div>
                <h2 className="text-lg font-black italic tracking-tight drop-shadow-md">
                  TEAM COMPARISON
                </h2>
                <p className="text-blue-200/60 text-[8px] font-bold uppercase tracking-widest mt-1">
                  Overall Statistical Dominance
                </p>
              </div>
            </div>

            {/* Desktop Layout (3 columns) */}
            <div className="hidden md:flex flex-row justify-between items-center gap-4">
              {/* Team 1 - Left */}
              <div className="flex flex-col items-center gap-2 md:w-1/4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1 shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    <img
                      src={team1Data.teamFlag || ""}
                      alt={team1Data.teamName || "Team"}
                      className="w-full h-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-black text-xl tracking-tighter text-blue-200">
                    {team1Data.teamId || "T1"}
                  </div>
                  <p className="text-blue-300/70 text-[10px] font-bold uppercase mt-0.5">
                    {team1Data.teamName}
                  </p>
                </div>
              </div>

              {/* Center Title Desktop */}
              <div className="text-center md:flex-1">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full border border-white/20 backdrop-blur-md mb-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    Live Analytics
                  </span>
                </div>
                <h2 className="text-2xl font-black italic tracking-tight drop-shadow-md">
                  TEAM COMPARISON
                </h2>
                <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Overall Statistical Dominance
                </p>
              </div>

              {/* Team 2 - Right */}
              <div className="flex flex-col items-center gap-2 md:w-1/4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1 shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    <img
                      src={team2Data.teamFlag || ""}
                      alt={team2Data.teamName || "Team"}
                      className="w-full h-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-black text-xl tracking-tighter text-red-300">
                    {team2Data.teamId || "T2"}
                  </div>
                  <p className="text-red-300/70 text-[10px] font-bold uppercase mt-0.5">
                    {team2Data.teamName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {comparisonOverall.map((item, index) => {
              const metric = metrics.find((m) => m.key === item?.metric);
              if (!metric || !item) return null;

              const Icon = metric.icon;
              const isWinMetric = item.metric === "Win";
              const val1 = parseFloat(item.team1 || "0");
              const val2 = parseFloat(item.team2 || "0");
              const isVal1Higher = val1 > val2;

              return (
                <div
                  key={index}
                  className="group hover:bg-blue-50/30 transition-colors duration-300 p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    {/* Team 1 Value */}
                    <div className="flex-1 text-left">
                      <div
                        className={`text-2xl font-black tracking-tighter italic ${isVal1Higher ? "text-blue-600 scale-110" : "text-gray-400"} transition-all`}
                      >
                        {item.team1 ?? "0"}
                        {isWinMetric && "%"}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {team1Data.teamId}
                      </div>
                    </div>

                    {/* Metric Label Center */}
                    <div className="flex flex-col items-center mx-4">
                      <div
                        className={`p-2 rounded-xl scale-90 sm:scale-100 mb-1 ${metric.bgColor} shadow-sm group-hover:rotate-12 transition-transform`}
                      >
                        <Icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <span className="font-black text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest text-center">
                        {item.metric}
                      </span>
                    </div>

                    {/* Team 2 Value */}
                    <div className="flex-1 text-right">
                      <div
                        className={`text-2xl font-black tracking-tighter italic ${!isVal1Higher ? "text-red-600 scale-110" : "text-gray-400"} transition-all`}
                      >
                        {item.team2 ?? "0"}
                        {isWinMetric && "%"}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {team2Data.teamId}
                      </div>
                    </div>
                  </div>

                  {/* Progressive Comparison Bar */}
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${isVal1Higher ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "bg-blue-300"}`}
                      style={{ width: `${(val1 / (val1 + val2 || 1)) * 100}%` }}
                    ></div>
                    <div className="w-px h-full bg-white/20 z-10"></div>
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${!isVal1Higher ? "bg-gradient-to-r from-red-500 to-orange-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-red-300"}`}
                      style={{ width: `${(val2 / (val1 + val2 || 1)) * 100}%` }}
                    ></div>
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
              <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-yellow-50 to-white rounded-lg">
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
