import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

const SquadDialoge = (data: any) => {
  console.log(data);
  const getPlayerTypeColor = (type: string) => {
    switch (type) {
      case "BAT":
        return "bg-blue-100 text-blue-800";
      case "BOWL":
        return "bg-green-100 text-green-800";
      case "ALL":
        return "bg-purple-100 text-purple-800";
      case "WK":
      case "WK-BAT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <>
      {data?.data?.map((player: any) => (
        <Dialog key={player?.id}>
          <DialogTrigger asChild>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={player?.imageUrl?.src} alt={player?.name} />
                  <AvatarFallback>{player?.shortName}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{player?.name}</p>
                  <Badge
                    className={getPlayerTypeColor(player?.type)}
                    variant="secondary"
                  >
                    {player?.type}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {player?.batStyle}
                  </p>
                </div>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={player?.imageUrl?.src} alt={player?.name} />
                  <AvatarFallback>{player?.shortName}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-bold">{player?.name}</p>
                  <Badge className={getPlayerTypeColor(player?.type)}>
                    {player?.type}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="form">Recent Form</TabsTrigger>
                <TabsTrigger value="fantasy">Fantasy Points</TabsTrigger>
                <TabsTrigger value="info">Basic Info</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Batting Stats</h3>
                    <div className="space-y-2">
                      {player?.battingStats?.map((stat: any, index: any) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline">{stat.mode}</Badge>
                            <span className="text-sm text-gray-600">
                              {stat.matches} matches
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              Runs:{" "}
                              <span className="font-medium">{stat.runs}</span>
                            </div>
                            <div>
                              Avg:{" "}
                              <span className="font-medium">
                                {stat.average}
                              </span>
                            </div>
                            <div>
                              SR:{" "}
                              <span className="font-medium">
                                {stat.strikeRate}
                              </span>
                            </div>
                            <div>
                              HS:{" "}
                              <span className="font-medium">
                                {stat.highScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Bowling Stats</h3>
                    <div className="space-y-2">
                      {player?.bowlingStats?.map((stat: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline">{stat.mode}</Badge>
                            <span className="text-sm text-gray-600">
                              {stat.matches} matches
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              Wickets:{" "}
                              <span className="font-medium">{stat.wicket}</span>
                            </div>
                            <div>
                              Avg:{" "}
                              <span className="font-medium">
                                {stat.average || "N/A"}
                              </span>
                            </div>
                            <div>
                              Econ:{" "}
                              <span className="font-medium">
                                {stat.economy || "N/A"}
                              </span>
                            </div>
                            <div>
                              SR:{" "}
                              <span className="font-medium">
                                {stat.strikeRate || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="form" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Recent Batting Form</h3>
                    <div className="space-y-2">
                      {player?.battingForm?.map((form: any, index: number) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">
                              {form.match}
                            </span>
                            <span className="text-xs text-gray-600">
                              {form.date}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              Runs:{" "}
                              <span className="font-medium">{form.run}</span>
                            </div>
                            <div>
                              SR: <span className="font-medium">{form.sr}</span>
                            </div>
                            <div>
                              4s/6s:{" "}
                              <span className="font-medium">
                                {form.fours_sixes}
                              </span>
                            </div>
                            <div>
                              Out:{" "}
                              <span className="font-medium">{form.out}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Recent Bowling Form</h3>
                    <div className="space-y-2">
                      {player?.bowlingForm?.map((form: any, index: number) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">
                              {form.match}
                            </span>
                            <span className="text-xs text-gray-600">
                              {form.date}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              Overs:{" "}
                              <span className="font-medium">{form.o}</span>
                            </div>
                            <div>
                              Runs:{" "}
                              <span className="font-medium">{form.r}</span>
                            </div>
                            <div>
                              Wickets:{" "}
                              <span className="font-medium">{form.w}</span>
                            </div>
                            <div>
                              Econ:{" "}
                              <span className="font-medium">{form.eco}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fantasy" className="space-y-4">
                <h3 className="font-semibold mb-3">Recent Fantasy Points</h3>
                <div className="space-y-2">
                  {player?.fantasyPoints?.map((fantasy: any, index: number) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">{fantasy.match}</span>
                        <span className="text-sm text-gray-600">
                          {fantasy.date}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-600">Batting</p>
                          <p className="font-bold text-blue-600">
                            {fantasy.bat}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Bowling</p>
                          <p className="font-bold text-green-600">
                            {fantasy.bowl}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Fielding</p>
                          <p className="font-bold text-orange-600">
                            {fantasy.field}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total</p>
                          <p className="font-bold text-purple-600">
                            {fantasy.total}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{player?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <Badge className={getPlayerTypeColor(player?.type)}>
                          {player?.type}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Batting Style:</span>
                        <span className="font-medium">{player?.batStyle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bowling Style:</span>
                        <span className="font-medium">
                          {player?.bowlStyle || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
};

export default SquadDialoge;
