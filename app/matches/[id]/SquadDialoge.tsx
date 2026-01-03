import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  AlertTriangle,
  Check,
  X,
  Target,
  Zap,
  TrendingUp,
  Star,
  Users,
  BarChart3,
  Shield,
  Activity,
  TargetIcon,
  Info,
  X as XIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface PlayerCardProps {
  player: any;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const getPlayerTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case "BAT":
      case "BATTER":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "BOWL":
      case "BOWLER":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "ALL":
      case "ALLROUNDER":
        return "bg-gradient-to-r from-purple-500 to-pink-600 text-white";
      case "WK":
      case "WK-BAT":
        return "bg-gradient-to-r from-orange-500 to-amber-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getPlayerTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "BAT":
      case "BATTER":
        return <Target className="h-3 w-3" />;
      case "BOWL":
      case "BOWLER":
        return <Zap className="h-3 w-3" />;
      case "ALL":
      case "ALLROUNDER":
        return <Star className="h-3 w-3" />;
      case "WK":
      case "WK-BAT":
        return <Shield className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  const getStatsColor = (value: number, type: "batting" | "bowling") => {
    if (type === "batting") {
      if (value >= 150) return "text-green-600 bg-green-50";
      if (value >= 120) return "text-blue-600 bg-blue-50";
      if (value >= 100) return "text-yellow-600 bg-yellow-50";
      return "text-gray-600 bg-gray-50";
    } else {
      if (value <= 6) return "text-green-600 bg-green-50";
      if (value <= 8) return "text-blue-600 bg-blue-50";
      if (value <= 10) return "text-yellow-600 bg-yellow-50";
      return "text-red-600 bg-red-50";
    }
  };

  const calculateDataCompleteness = (player: any) => {
    const fields = [
      { key: "battingStats", weight: 2 },
      { key: "bowlingStats", weight: 2 },
      { key: "battingForm", weight: 1.5 },
      { key: "bowlingForm", weight: 1.5 },
      { key: "overallStats", weight: 2 },
      { key: "stadiumStats", weight: 1 },
      { key: "againstTeamsStats", weight: 1 },
    ];

    let totalWeight = 0;
    let completedWeight = 0;

    fields.forEach((field) => {
      totalWeight += field.weight;
      if (
        player[field.key] &&
        ((Array.isArray(player[field.key]) && player[field.key].length > 0) ||
          (typeof player[field.key] === "object" &&
            Object.keys(player[field.key]).length > 0))
      ) {
        completedWeight += field.weight;
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  };

  const dataCompleteness = calculateDataCompleteness(player);

  return (
    <TooltipProvider>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group cursor-pointer h-full">
            <div className="p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] h-full">
              <div className="flex items-start gap-3">
                {/* Left section with avatar */}
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-4 border-white shadow-lg flex-shrink-0">
                  <AvatarImage src={player?.image} alt={player?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {player?.shortName?.slice(0, 2) || "PL"}
                  </AvatarFallback>
                </Avatar>

                {/* Middle section with player info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                        {player?.name}
                      </h3>
                      <Badge
                        className={`px-2 py-0.5 text-xs font-bold shadow-sm ${getPlayerTypeColor(
                          player?.type || player?.role
                        )} w-fit`}
                      >
                        <span className="flex items-center gap-1">
                          {getPlayerTypeIcon(player?.type || player?.role)}
                          <span className="truncate">
                            {player?.type || player?.role}
                          </span>
                        </span>
                      </Badge>
                    </div>

                    {/* Icons aligned to top right */}
                    <div className="flex items-start gap-2 flex-shrink-0">
                      {dataCompleteness < 100 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              Data completeness: {dataCompleteness}%
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <Eye className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>

                  {/* Data completeness bar below */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Data Completeness</span>
                      <span className="font-medium">{dataCompleteness}%</span>
                    </div>
                    <Progress
                      value={dataCompleteness}
                      className="h-1.5 bg-gray-200"
                    />
                  </div>

                  {/* Player styles */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="text-gray-600 truncate">
                      <span className="font-medium">Bat:</span>{" "}
                      {player?.batStyle || "N/A"}
                    </div>
                    <div className="text-gray-600 truncate">
                      <span className="font-medium">Bowl:</span>{" "}
                      {player?.bowlStyle || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 w-[95vw] sm:w-full">
          <DialogHeader className="relative px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 max-w-[80%]">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-white shadow-lg flex-shrink-0">
                  <AvatarImage src={player?.image} alt={player?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-base sm:text-xl">
                    {player?.shortName?.slice(0, 2) || "PL"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 truncate">
                    {player?.name}
                    <Badge
                      className={`px-2 py-1 text-xs font-bold shadow-sm ${getPlayerTypeColor(
                        player?.type || player?.role
                      )} flex-shrink-0`}
                    >
                      <span className="flex items-center gap-1">
                        {getPlayerTypeIcon(player?.type || player?.role)}
                        <span className="hidden sm:inline">
                          {player?.type || player?.role}
                        </span>
                        <span className="sm:hidden">
                          {(player?.type || player?.role)
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </span>
                      </span>
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="flex flex-wrap items-center gap-1 sm:gap-3 mt-1 sm:mt-2 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <TargetIcon className="h-3 w-3" />
                      {player?.batStyle}
                    </span>
                    {player?.bowlStyle && (
                      <>
                        <span className="text-gray-300 hidden sm:inline">
                          •
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {player?.bowlStyle}
                        </span>
                      </>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto h-[calc(90vh-73px)] px-4 sm:px-6 py-4">
            {/* Data Completeness Banner */}
            {dataCompleteness < 100 && (
              <div className="mb-4 sm:mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm font-medium text-yellow-800 truncate">
                          Data Completeness: {dataCompleteness}%
                        </span>
                        <span className="text-xs text-yellow-600 flex-shrink-0 ml-2">
                          {dataCompleteness >= 80
                            ? "Good"
                            : dataCompleteness >= 60
                            ? "Average"
                            : "Limited"}
                        </span>
                      </div>
                      <Progress
                        value={dataCompleteness}
                        className="h-2 bg-yellow-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 w-full overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Stats</span>
                </TabsTrigger>
                <TabsTrigger
                  value="form"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Form</span>
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Info className="h-4 w-4" />
                  <span>Info</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Batting Stats */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        <span>Batting Statistics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {!player?.battingStats?.length ? (
                        <EmptyState message="Batting statistics data not available" />
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {player.battingStats.map(
                            (stat: any, index: number) => (
                              <div
                                key={index}
                                className="p-3 sm:p-4 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-blue-100"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-fit">
                                    {stat.mode}
                                  </Badge>
                                  <span className="text-xs sm:text-sm text-gray-600">
                                    {stat.matches} matches
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                                  <StatCard
                                    label="Runs"
                                    value={stat.runs}
                                    color="text-blue-600"
                                    bgColor="bg-blue-50"
                                  />
                                  <StatCard
                                    label="Average"
                                    value={stat.average}
                                    color="text-green-600"
                                    bgColor="bg-green-50"
                                  />
                                  <StatCard
                                    label="Strike Rate"
                                    value={stat.strikeRate}
                                    color="text-purple-600"
                                    bgColor="bg-purple-50"
                                  />
                                  <StatCard
                                    label="High Score"
                                    value={stat.highScore}
                                    color="text-orange-600"
                                    bgColor="bg-orange-50"
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Bowling Stats */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span>Bowling Statistics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {!player?.bowlingStats?.length ? (
                        <EmptyState message="Bowling statistics data not available" />
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {player.bowlingStats.map(
                            (stat: any, index: number) => (
                              <div
                                key={index}
                                className="p-3 sm:p-4 bg-gradient-to-r from-white to-green-50 rounded-xl border border-green-100"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-fit">
                                    {stat.mode}
                                  </Badge>
                                  <span className="text-xs sm:text-sm text-gray-600">
                                    {stat.matches} matches
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                                  <StatCard
                                    label="Wickets"
                                    value={stat.wicket}
                                    color="text-green-600"
                                    bgColor="bg-green-50"
                                  />
                                  <StatCard
                                    label="Average"
                                    value={stat.average || "N/A"}
                                    color="text-blue-600"
                                    bgColor="bg-blue-50"
                                  />
                                  <StatCard
                                    label="Economy"
                                    value={stat.economy || "N/A"}
                                    color="text-yellow-600"
                                    bgColor="bg-yellow-50"
                                  />
                                  <StatCard
                                    label="Strike Rate"
                                    value={stat.strikeRate || "N/A"}
                                    color="text-purple-600"
                                    bgColor="bg-purple-50"
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Form Tab */}
              <TabsContent value="form" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Batting Form */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        <span>Recent Batting Form</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {!player?.battingForm?.length ? (
                        <EmptyState message="Batting form data not available" />
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {player.battingForm.map(
                            (form: any, index: number) => (
                              <div
                                key={index}
                                className="p-3 bg-gradient-to-r from-white to-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">
                                      {form.match}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {form.date}
                                    </p>
                                  </div>
                                  <div
                                    className={`px-2 py-1 rounded ${getStatsColor(
                                      parseFloat(form.sr || 0),
                                      "batting"
                                    )}`}
                                  >
                                    <span className="text-xs font-bold">
                                      SR: {form.sr}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-1 sm:gap-2 text-sm">
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      Runs
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.run}
                                    </div>
                                  </div>
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      4s/6s
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.fours_sixes}
                                    </div>
                                  </div>
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      Out
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.out}
                                    </div>
                                  </div>
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      Balls
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.balls}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Bowling Form */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span>Recent Bowling Form</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {!player?.bowlingForm?.length ? (
                        <EmptyState message="Bowling form data not available" />
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {player.bowlingForm.map(
                            (form: any, index: number) => (
                              <div
                                key={index}
                                className="p-3 bg-gradient-to-r from-white to-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">
                                      {form.match}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {form.date}
                                    </p>
                                  </div>
                                  <div
                                    className={`px-2 py-1 rounded ${getStatsColor(
                                      parseFloat(form.eco || 10),
                                      "bowling"
                                    )}`}
                                  >
                                    <span className="text-xs font-bold">
                                      Econ: {form.eco}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-1 sm:gap-2 text-sm">
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      Overs
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.o}
                                    </div>
                                  </div>
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      Wickets
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.w}
                                    </div>
                                  </div>
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      Runs
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.r}
                                    </div>
                                  </div>
                                  <div className="text-center p-1">
                                    <div className="text-xs text-gray-500">
                                      Maidens
                                    </div>
                                    <div className="font-bold text-sm">
                                      {form.maidens || 0}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Player Info */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        <span>Player Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="space-y-3 sm:space-y-4">
                        <InfoRow label="Full Name" value={player?.name} />
                        <InfoRow label="Role" value={player?.role} highlight />
                        <InfoRow
                          label="Batting Style"
                          value={player?.batStyle}
                        />
                        <InfoRow
                          label="Bowling Style"
                          value={player?.bowlStyle || "N/A"}
                        />
                        <InfoRow label="Short Name" value={player?.shortName} />
                        <InfoRow label="Team" value={player?.team} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Availability */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span>Data Availability</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="space-y-2 sm:space-y-3">
                        <DataStatus
                          label="Batting Stats"
                          available={!!player?.battingStats?.length}
                        />
                        <DataStatus
                          label="Bowling Stats"
                          available={!!player?.bowlingStats?.length}
                        />
                        <DataStatus
                          label="Batting Form"
                          available={!!player?.battingForm?.length}
                        />
                        <DataStatus
                          label="Bowling Form"
                          available={!!player?.bowlingForm?.length}
                        />
                        <DataStatus
                          label="Overall Stats"
                          available={
                            !!player?.overallStats &&
                            Object.keys(player.overallStats).length > 0
                          }
                        />
                        <DataStatus
                          label="Stadium Stats"
                          available={
                            !!player?.stadiumStats &&
                            Object.keys(player.stadiumStats).length > 0
                          }
                        />
                        <DataStatus
                          label="Against Teams"
                          available={
                            !!player?.againstTeamsStats &&
                            Object.keys(player.againstTeamsStats).length > 0
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

// Helper Components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3
    className={`text-base sm:text-lg font-semibold text-gray-900 ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`px-4 sm:px-6 pb-4 sm:pb-6 ${className}`}>{children}</div>
);

const StatCard = ({
  label,
  value,
  color,
  bgColor,
}: {
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}) => (
  <div className={`p-1 sm:p-2 ${bgColor} rounded-lg text-center`}>
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className={`text-sm font-bold ${color}`}>{value}</div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-6 sm:py-8">
    <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);

const InfoRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-xs sm:text-sm text-gray-600">{label}</span>
    <span
      className={`text-xs sm:text-sm font-medium ${
        highlight ? "text-blue-600" : "text-gray-900"
      }`}
    >
      {value}
    </span>
  </div>
);

const DataStatus = ({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-xs sm:text-sm text-gray-700 truncate mr-2">
      {label}
    </span>
    {available ? (
      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs py-1 px-2">
        <Check className="h-3 w-3 mr-1" />
        Available
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200 text-xs py-1 px-2">
        <X className="h-3 w-3 mr-1" />
        Missing
      </Badge>
    )}
  </div>
);

export default PlayerCard;
