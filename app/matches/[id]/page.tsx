'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateCredits } from '@/store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trophy, 
  Target, 
  Calendar, 
  MapPin, 
  Users, 
  Star,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  Zap,
  Shield,
  Crown,
  ArrowLeft,
  Eye,
  Thermometer,
  Wind,
  Droplets,
  Sun
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Generate static params for static export
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

interface Player {
  id: number;
  name: string;
  shortName: string;
  batStyle: string;
  bowlStyle: string;
  imageUrl: { src: string };
  type: string;
  fantasyPoints: Array<{
    date: string;
    match: string;
    bat: string;
    bowl: string;
    field: string;
    total: string;
  }>;
  battingForm: Array<{
    date: string;
    match: string;
    bo: string;
    run: string;
    fours_sixes: string;
    sr: string;
    out: string;
  }>;
  bowlingForm: Array<{
    date: string;
    match: string;
    o: string;
    r: string;
    w: string;
    m: string;
    eco: string;
  }>;
  battingStats: Array<{
    year: string;
    mode: string;
    matches: string;
    innings: string;
    runs: string;
    balls: string;
    notOut: string;
    average: string;
    strikeRate: string;
    highScore: string;
    fifty: string;
    hundred: string;
    fours: string;
    sixes: string;
  }>;
  bowlingStats: Array<{
    year: string;
    mode: string;
    matches: string;
    innings: string;
    balls: string;
    runs: string;
    wicket: string;
    strikeRate: string;
    twoWicket: string;
    threeWicket: string;
    fiveWicket: string;
    economy: string;
    average: string;
  }>;
  overallStats: any;
  stadiumStats: any;
  againstTeamsStats: any;
}

interface Squad {
  flag: string;
  color: string;
  shortName: string;
  playingPlayer: Player[];
  benchPlayer: Player[];
}

interface MatchData {
  squadList: Squad[];
  stadiumStats: Array<{
    date: string;
    matchTitle: string;
    matchUrl: string;
    inn1Score: string;
    inn2Score: string;
  }>;
  matchInfo: {
    matchId: number;
    matchName: string;
    matchDescription: string;
    startTime: string;
    status: string;
    venue: string;
    tour: {
      id: number;
      name: string;
    };
    format: string;
    sport: string;
    teams: Array<{
      squadId: number;
      teamName: string;
      teamShortName: string;
      teamFlagUrl: string;
      isWinner: boolean | null;
      color: string;
      cricketScore: any[];
      squadNo: number | null;
    }>;
  };
  GroundWheather: any;
}

const MatchDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock match data based on the provided structure
  useEffect(() => {
    const mockMatchData: MatchData = {
      squadList: [
        {
          flag: "https://d13ir53smqqeyp.cloudfront.net/flags/cr-flags/FC-WIN@2x.png",
          color: "#7B0041",
          shortName: "WI",
          playingPlayer: [
            {
              id: 2022,
              name: "Brandon King",
              shortName: "B King",
              batStyle: "Right Handed",
              bowlStyle: "",
              imageUrl: { src: "https://d13ir53smqqeyp.cloudfront.net/fc-player-images/2022.png" },
              type: "BAT",
              fantasyPoints: [
                {
                  date: "03/06/25",
                  match: "ENG vs WI",
                  bat: "18",
                  bowl: "0",
                  field: "0",
                  total: "22"
                },
                {
                  date: "01/06/25",
                  match: "WI vs AUS",
                  bat: "45",
                  bowl: "0",
                  field: "8",
                  total: "53"
                }
              ],
              battingForm: [
                {
                  date: "03/06/25",
                  match: "WI vs ENG",
                  bo: "1",
                  run: "16 (20)",
                  fours_sixes: "2/0",
                  sr: "80",
                  out: "catch"
                },
                {
                  date: "01/06/25",
                  match: "WI vs AUS",
                  bo: "1",
                  run: "67 (45)",
                  fours_sixes: "8/2",
                  sr: "148.9",
                  out: "not out"
                }
              ],
              bowlingForm: [
                {
                  date: "03/06/25",
                  match: "WI vs ENG",
                  o: "DNB",
                  r: "DNB",
                  w: "DNB",
                  m: "DNB",
                  eco: "DNB"
                }
              ],
              battingStats: [
                {
                  year: "All",
                  mode: "ODI",
                  matches: "51",
                  innings: "51",
                  runs: "1458",
                  balls: "1737",
                  notOut: "2",
                  average: "28.58",
                  strikeRate: "83.9",
                  highScore: "112",
                  fifty: "8",
                  hundred: "3",
                  fours: "177",
                  sixes: "29"
                },
                {
                  year: "All",
                  mode: "T20",
                  matches: "62",
                  innings: "61",
                  runs: "1499",
                  balls: "1118",
                  notOut: "5",
                  average: "24.17",
                  strikeRate: "134",
                  highScore: "85",
                  fifty: "11",
                  hundred: "0",
                  fours: "165",
                  sixes: "62"
                }
              ],
              bowlingStats: [
                {
                  year: "All",
                  mode: "ODI",
                  matches: "51",
                  innings: "0",
                  balls: "0",
                  runs: "0",
                  wicket: "0",
                  strikeRate: "",
                  twoWicket: "0",
                  threeWicket: "0",
                  fiveWicket: "0",
                  economy: "",
                  average: "0"
                }
              ],
              overallStats: {},
              stadiumStats: {},
              againstTeamsStats: {}
            }
          ],
          benchPlayer: [
            {
              id: 2023,
              name: "Shai Hope",
              shortName: "S Hope",
              batStyle: "Right Handed",
              bowlStyle: "",
              imageUrl: { src: "https://d13ir53smqqeyp.cloudfront.net/fc-player-images/2023.png" },
              type: "WK-BAT",
              fantasyPoints: [
                {
                  date: "03/06/25",
                  match: "ENG vs WI",
                  bat: "32",
                  bowl: "0",
                  field: "12",
                  total: "44"
                }
              ],
              battingForm: [
                {
                  date: "03/06/25",
                  match: "WI vs ENG",
                  bo: "1",
                  run: "43 (38)",
                  fours_sixes: "4/1",
                  sr: "113.2",
                  out: "bowled"
                }
              ],
              bowlingForm: [
                {
                  date: "03/06/25",
                  match: "WI vs ENG",
                  o: "DNB",
                  r: "DNB",
                  w: "DNB",
                  m: "DNB",
                  eco: "DNB"
                }
              ],
              battingStats: [
                {
                  year: "All",
                  mode: "ODI",
                  matches: "89",
                  innings: "85",
                  runs: "3289",
                  balls: "3876",
                  notOut: "12",
                  average: "45.05",
                  strikeRate: "84.9",
                  highScore: "170",
                  fifty: "19",
                  hundred: "9",
                  fours: "312",
                  sixes: "45"
                }
              ],
              bowlingStats: [
                {
                  year: "All",
                  mode: "ODI",
                  matches: "89",
                  innings: "0",
                  balls: "0",
                  runs: "0",
                  wicket: "0",
                  strikeRate: "",
                  twoWicket: "0",
                  threeWicket: "0",
                  fiveWicket: "0",
                  economy: "",
                  average: "0"
                }
              ],
              overallStats: {},
              stadiumStats: {},
              againstTeamsStats: {}
            }
          ]
        },
        {
          flag: "https://d13ir53smqqeyp.cloudfront.net/flags/cr-flags/FC-AUS@2x.png",
          color: "#002695",
          shortName: "AUS",
          playingPlayer: [
            {
              id: 3001,
              name: "David Warner",
              shortName: "D Warner",
              batStyle: "Left Handed",
              bowlStyle: "Right-arm leg-break",
              imageUrl: { src: "https://d13ir53smqqeyp.cloudfront.net/fc-player-images/3001.png" },
              type: "BAT",
              fantasyPoints: [
                {
                  date: "05/06/25",
                  match: "AUS vs WI",
                  bat: "56",
                  bowl: "0",
                  field: "4",
                  total: "60"
                }
              ],
              battingForm: [
                {
                  date: "05/06/25",
                  match: "AUS vs WI",
                  bo: "1",
                  run: "89 (67)",
                  fours_sixes: "11/3",
                  sr: "132.8",
                  out: "lbw"
                }
              ],
              bowlingForm: [
                {
                  date: "05/06/25",
                  match: "AUS vs WI",
                  o: "DNB",
                  r: "DNB",
                  w: "DNB",
                  m: "DNB",
                  eco: "DNB"
                }
              ],
              battingStats: [
                {
                  year: "All",
                  mode: "ODI",
                  matches: "128",
                  innings: "124",
                  runs: "5455",
                  balls: "5691",
                  notOut: "9",
                  average: "47.4",
                  strikeRate: "95.8",
                  highScore: "179",
                  fifty: "33",
                  hundred: "18",
                  fours: "571",
                  sixes: "123"
                }
              ],
              bowlingStats: [
                {
                  year: "All",
                  mode: "ODI",
                  matches: "128",
                  innings: "2",
                  balls: "12",
                  runs: "15",
                  wicket: "0",
                  strikeRate: "",
                  twoWicket: "0",
                  threeWicket: "0",
                  fiveWicket: "0",
                  economy: "7.5",
                  average: "0"
                }
              ],
              overallStats: {},
              stadiumStats: {},
              againstTeamsStats: {}
            }
          ],
          benchPlayer: []
        }
      ],
      stadiumStats: [
        {
          date: "10/11/24",
          matchTitle: "WI vs ENG (2nd T20I) ENG TO WI 2024 Stats",
          matchUrl: "https://advancecricket.com/score/wi-vs-eng-2nd-t20i-eng-to-wi-2024/23376630",
          inn1Score: "WI - 158-8 (20.0)",
          inn2Score: "ENG - 161-3 (14.5)"
        },
        {
          date: "09/11/24",
          matchTitle: "WI vs ENG (1st T20I) ENG TO WI 2024 Stats",
          matchUrl: "https://advancecricket.com/score/wi-vs-eng-1st-t20i-eng-to-wi-2024/67307201",
          inn1Score: "WI - 182-9 (20.0)",
          inn2Score: "ENG - 183-2 (16.5)"
        }
      ],
      matchInfo: {
        matchId: 127550,
        matchName: "West Indies vs Australia",
        matchDescription: "1st Test",
        startTime: "2025-06-25T14:00:00.000Z",
        status: "NOT_STARTED",
        venue: "Kensington Oval, Bridgetown",
        tour: {
          id: 5258,
          name: "Australia Tour of West Indies, 2025"
        },
        format: "TEST",
        sport: "cricket",
        teams: [
          {
            squadId: 260,
            teamName: "West Indies",
            teamShortName: "WI",
            teamFlagUrl: "https://d13ir53smqqeyp.cloudfront.net/flags/cr-flags/FC-WIN@2x.png",
            isWinner: null,
            color: "#7B0041",
            cricketScore: [],
            squadNo: null
          },
          {
            squadId: 13,
            teamName: "Australia",
            teamShortName: "AUS",
            teamFlagUrl: "https://d13ir53smqqeyp.cloudfront.net/flags/cr-flags/FC-AUS@2x.png",
            isWinner: null,
            color: "#002695",
            cricketScore: [],
            squadNo: null
          }
        ]
      },
      GroundWheather: {
        temperature: "28°C",
        humidity: "65%",
        windSpeed: "12 km/h",
        conditions: "Partly Cloudy"
      }
    };

    setMatchData(mockMatchData);
  }, [params.id]);

  const handleGetPrediction = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!user || user.credits < 1) {
      toast.error('Insufficient credits. Please purchase more credits.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch(updateCredits(user.credits - 1));
      setShowPrediction(true);
      toast.success('AI Prediction generated successfully!');
    } catch (error) {
      toast.error('Failed to generate prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlayerTypeColor = (type: string) => {
    switch (type) {
      case 'BAT': return 'bg-blue-100 text-blue-800';
      case 'BOWL': return 'bg-green-100 text-green-800';
      case 'ALL': return 'bg-purple-100 text-purple-800';
      case 'WK': case 'WK-BAT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!matchData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Matches
          </Button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <Badge className="mb-2">{matchData.matchInfo.format}</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {matchData.matchInfo.matchName}
                </h1>
                <p className="text-gray-600">{matchData.matchInfo.matchDescription}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  onClick={handleGetPrediction}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Get AI Prediction
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              {matchData.matchInfo.teams.map((team, index) => (
                <div key={team.squadId} className="text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-4" style={{ borderColor: team.color }}>
                    <img src={team.teamFlagUrl} alt={team.teamName} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
                  <p className="text-sm text-gray-600">{team.teamShortName}</p>
                </div>
              ))}
            </div>

            {/* Match Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {new Date(matchData.matchInfo.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {new Date(matchData.matchInfo.startTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{matchData.matchInfo.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Prediction Results */}
        {showPrediction && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-600" />
                <span>AI Prediction Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Match Winner</h3>
                    <p className="text-lg font-bold text-blue-600">West Indies</p>
                    <p className="text-sm text-gray-600">72% Win Probability</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <Crown className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Dream11 Captain</h3>
                    <p className="text-lg font-bold text-purple-600">Brandon King</p>
                    <p className="text-sm text-gray-600">Expected: 65+ points</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Vice Captain</h3>
                    <p className="text-lg font-bold text-orange-600">David Warner</p>
                    <p className="text-sm text-gray-600">Expected: 55+ points</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="squads">Squads</TabsTrigger>
            <TabsTrigger value="stadium">Stadium Stats</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Team Form (Last 5 Matches)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchData.matchInfo.teams.map((team) => (
                    <div key={team.squadId} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img src={team.teamFlagUrl} alt={team.teamName} className="w-8 h-8 rounded-full" />
                        <h3 className="font-semibold">{team.teamName}</h3>
                      </div>
                      <div className="flex space-x-2">
                        {['W', 'L', 'W', 'W', 'L'].map((result, index) => (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              result === 'W' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {result}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Players */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Key Players to Watch</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchData.squadList.map((squad) => (
                    <div key={squad.shortName} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <img src={squad.flag} alt={squad.shortName} className="w-8 h-8 rounded-full" />
                        <h3 className="font-semibold">{squad.shortName}</h3>
                      </div>
                      <div className="space-y-3">
                        {[...squad.playingPlayer, ...squad.benchPlayer].slice(0, 3).map((player) => (
                          <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={player.imageUrl.src} alt={player.name} />
                                <AvatarFallback>{player.shortName}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{player.name}</p>
                                <Badge className={getPlayerTypeColor(player.type)} variant="secondary">
                                  {player.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">
                                Avg: {player.fantasyPoints[0]?.total || 'N/A'} pts
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="squads" className="space-y-6">
            {matchData.squadList.map((squad) => (
              <Card key={squad.shortName}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <img src={squad.flag} alt={squad.shortName} className="w-8 h-8 rounded-full" />
                    <span>{squad.shortName} Squad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="playing" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="playing">Playing XI ({squad.playingPlayer.length})</TabsTrigger>
                      <TabsTrigger value="bench">Bench ({squad.benchPlayer.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="playing" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {squad.playingPlayer.map((player) => (
                          <Dialog key={player.id}>
                            <DialogTrigger asChild>
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={player.imageUrl.src} alt={player.name} />
                                    <AvatarFallback>{player.shortName}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{player.name}</p>
                                    <Badge className={getPlayerTypeColor(player.type)} variant="secondary">
                                      {player.type}
                                    </Badge>
                                    <p className="text-sm text-gray-600 mt-1">{player.batStyle}</p>
                                  </div>
                                  <Eye className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={player.imageUrl.src} alt={player.name} />
                                    <AvatarFallback>{player.shortName}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-xl font-bold">{player.name}</p>
                                    <Badge className={getPlayerTypeColor(player.type)}>
                                      {player.type}
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
                                        {player.battingStats.map((stat, index) => (
                                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                              <Badge variant="outline">{stat.mode}</Badge>
                                              <span className="text-sm text-gray-600">{stat.matches} matches</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>Runs: <span className="font-medium">{stat.runs}</span></div>
                                              <div>Avg: <span className="font-medium">{stat.average}</span></div>
                                              <div>SR: <span className="font-medium">{stat.strikeRate}</span></div>
                                              <div>HS: <span className="font-medium">{stat.highScore}</span></div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-semibold mb-3">Bowling Stats</h3>
                                      <div className="space-y-2">
                                        {player.bowlingStats.map((stat, index) => (
                                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                              <Badge variant="outline">{stat.mode}</Badge>
                                              <span className="text-sm text-gray-600">{stat.matches} matches</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>Wickets: <span className="font-medium">{stat.wicket}</span></div>
                                              <div>Avg: <span className="font-medium">{stat.average || 'N/A'}</span></div>
                                              <div>Econ: <span className="font-medium">{stat.economy || 'N/A'}</span></div>
                                              <div>SR: <span className="font-medium">{stat.strikeRate || 'N/A'}</span></div>
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
                                        {player.battingForm.map((form, index) => (
                                          <div key={index} className="p-3 bg-blue-50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="font-medium text-sm">{form.match}</span>
                                              <span className="text-xs text-gray-600">{form.date}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>Runs: <span className="font-medium">{form.run}</span></div>
                                              <div>SR: <span className="font-medium">{form.sr}</span></div>
                                              <div>4s/6s: <span className="font-medium">{form.fours_sixes}</span></div>
                                              <div>Out: <span className="font-medium">{form.out}</span></div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-semibold mb-3">Recent Bowling Form</h3>
                                      <div className="space-y-2">
                                        {player.bowlingForm.map((form, index) => (
                                          <div key={index} className="p-3 bg-green-50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="font-medium text-sm">{form.match}</span>
                                              <span className="text-xs text-gray-600">{form.date}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>Overs: <span className="font-medium">{form.o}</span></div>
                                              <div>Runs: <span className="font-medium">{form.r}</span></div>
                                              <div>Wickets: <span className="font-medium">{form.w}</span></div>
                                              <div>Econ: <span className="font-medium">{form.eco}</span></div>
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
                                    {player.fantasyPoints.map((fantasy, index) => (
                                      <div key={index} className="p-4 bg-purple-50 rounded-lg">
                                        <div className="flex justify-between items-center mb-3">
                                          <span className="font-medium">{fantasy.match}</span>
                                          <span className="text-sm text-gray-600">{fantasy.date}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 text-center">
                                          <div>
                                            <p className="text-xs text-gray-600">Batting</p>
                                            <p className="font-bold text-blue-600">{fantasy.bat}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-600">Bowling</p>
                                            <p className="font-bold text-green-600">{fantasy.bowl}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-600">Fielding</p>
                                            <p className="font-bold text-orange-600">{fantasy.field}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-600">Total</p>
                                            <p className="font-bold text-purple-600">{fantasy.total}</p>
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
                                          <span className="font-medium">{player.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Role:</span>
                                          <Badge className={getPlayerTypeColor(player.type)}>
                                            {player.type}
                                          </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Batting Style:</span>
                                          <span className="font-medium">{player.batStyle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Bowling Style:</span>
                                          <span className="font-medium">{player.bowlStyle || 'N/A'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="bench" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {squad.benchPlayer.map((player) => (
                          <Dialog key={player.id}>
                            <DialogTrigger asChild>
                              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={player.imageUrl.src} alt={player.name} />
                                    <AvatarFallback>{player.shortName}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{player.name}</p>
                                    <Badge className={getPlayerTypeColor(player.type)} variant="secondary">
                                      {player.type}
                                    </Badge>
                                    <p className="text-sm text-gray-600 mt-1">{player.batStyle}</p>
                                  </div>
                                  <Eye className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              {/* Same player details dialog content as above */}
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={player.imageUrl.src} alt={player.name} />
                                    <AvatarFallback>{player.shortName}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-xl font-bold">{player.name}</p>
                                    <Badge className={getPlayerTypeColor(player.type)}>
                                      {player.type}
                                    </Badge>
                                  </div>
                                </DialogTitle>
                              </DialogHeader>
                              {/* Same tabs content as playing players */}
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="stadium" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Stadium: {matchData.matchInfo.venue}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Last 10 Matches at this Venue</h3>
                  <div className="space-y-3">
                    {matchData.stadiumStats.map((match, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{match.matchTitle}</p>
                            <p className="text-sm text-gray-600">{match.date}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{match.inn1Score}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>{match.inn2Score}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <span>Weather Conditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Thermometer className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-xl font-bold text-gray-900">{matchData.GroundWheather.temperature}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="text-xl font-bold text-gray-900">{matchData.GroundWheather.humidity}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Wind className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="text-xl font-bold text-gray-900">{matchData.GroundWheather.windSpeed}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Conditions</p>
                    <p className="text-xl font-bold text-gray-900">{matchData.GroundWheather.conditions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchDetailsPage;