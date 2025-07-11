/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MatchCard from "@/components/ui/match-card";
import {
  Star,
  Trophy,
  Target,
  BarChart3,
  Users,
  Shield,
  ChevronRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSelectedMatch } from "@/store/slices/matchSlice";
import { DummyData } from "@/lib/DummyData";

const HomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState([]);

  useEffect(() => {
    //fantasy points calculation based on DummyData//////////////////////////////////
    const fantasyPoints = 0.2;
    const battingForm = 0.4;
    const bowlingForm = 0.5;
    const battingStats = 0.3;
    const bowlingStats = 0.4;
    const stadiumBattingStats = 0.2;
    const stadiumBowlingStats = 0.3;
    const againstTeamBattingStats = 0.1;
    const againstTeamBowlingStats = 0.2;

    const prepareSquad = DummyData.map((item: any) => {
      const squad = item.squad.map((elm: any) => {
        const totalPoint =
          Number(elm.fantasyPoints) * fantasyPoints +
          Number(elm.battingForm.totalRuns) * battingForm +
          Number(elm.bowlingForm.totalWicket) * bowlingForm +
          Number(elm.battingStats.totalRuns) * battingStats +
          Number(elm.bowlingStats.totalWicket) * bowlingStats +
          Number(elm.stadiumBattingStats.totalRuns) * stadiumBattingStats +
          Number(elm.stadiumBowlingStats.totalWicket) * stadiumBowlingStats +
          Number(elm.againstTeamBattingStats.totalRuns) *
            againstTeamBattingStats +
          Number(elm.againstTeamBowlingStats.totalWicket) *
            againstTeamBowlingStats +
          3;
        const battingTotalPoint =
          Number(elm.battingForm.totalRuns) * battingForm +
          Number(elm.battingStats.totalRuns) * battingStats +
          Number(elm.stadiumBattingStats.totalRuns) * stadiumBattingStats +
          Number(elm.againstTeamBattingStats.totalRuns) *
            againstTeamBattingStats +
          7;
        const bowlingTotalPoint =
          Number(elm.bowlingForm.totalWicket) * bowlingForm +
          Number(elm.bowlingStats.totalWicket) * bowlingStats +
          Number(elm.stadiumBowlingStats.totalWicket) * stadiumBowlingStats +
          Number(elm.againstTeamBowlingStats.totalWicket) *
            againstTeamBowlingStats +
          1;

        const venueBowlingPoint =
          Number(elm.bowlingForm.totalWicket) * bowlingForm +
          Number(elm.stadiumBowlingStats.totalWicket) * stadiumBowlingStats +
          Number(elm.againstTeamBowlingStats.totalWicket) *
            againstTeamBowlingStats +
          1;
        const venueBattingPoint =
          Number(elm.battingForm.totalRuns) * battingForm +
          Number(elm.stadiumBattingStats.totalRuns) * stadiumBattingStats +
          Number(elm.againstTeamBattingStats.totalRuns) *
            againstTeamBattingStats +
          7;
        return {
          name: elm.name,
          shortName: elm.shortName,
          batStyle: elm.batStyle,
          bowlStyle: elm.bowlStyle,
          imageUrl: elm.imageUrl,
          type: elm.type,
          totalPoint: totalPoint,
          battingTotalPoint: battingTotalPoint,
          bowlingTotalPoint: bowlingTotalPoint,
          venueBowlingPoint: venueBowlingPoint,
          venueBattingPoint: venueBattingPoint,
        };
      });
      return {
        flag: item.flag,
        color: item.color,
        teamShortName: item.shortName,
        squad: squad.sort((a: any, b: any) => b.totalPoint - a.totalPoint),
      };
    });
    const players = prepareSquad
      .flatMap((team) =>
        team.squad.map((player: any) => ({
          ...player,
          teamFlag: team.flag,
          teamShortName: team.teamShortName,
          teamColor: team.color,
        }))
      )
      .sort((a, b) => b.totalPoint - a.totalPoint);
    const wicketKeeper = players.find((player: any) => player.type === "WK");
    const batsman = players.find((player: any) => player.type === "BAT");
    const bowler = players.find((player: any) => player.type === "BOWL");
    const allrounder = players.find((player: any) => player.type === "AR");
    const filteredPlayers = players
      .filter(
        (player: any) =>
          player.name !== wicketKeeper.name &&
          player.name !== batsman.name &&
          player.name !== bowler.name &&
          player.name !== allrounder.name
      )
      .sort((a, b) => b.totalPoint - a.totalPoint);
    const topplayer = filteredPlayers.slice(0, 7);
    const mergePlayers = [
      ...topplayer,
      wicketKeeper,
      batsman,
      bowler,
      allrounder,
    ].sort((a, b) => b.totalPoint - a.totalPoint);

    const topBatsman = (team: any) => {
      const sortSquad = team.squad.sort(
        (a: any, b: any) => b.battingTotalPoint - a.battingTotalPoint
      );

      const probability = Math.min(
        100,
        Math.round((sortSquad[0].battingTotalPoint / 50) * 100)
      );

      return {
        name: sortSquad[0].name,
        predictedRuns: `${Math.round(
          sortSquad[0].battingTotalPoint - 10
        )}-${Math.round(sortSquad[0].battingTotalPoint + 10)}`,
        probability: `${probability}%`,
        recentAvg: parseFloat(sortSquad[0].battingTotalPoint.toFixed(1)),
        venueAvg: parseFloat(sortSquad[0].venueBattingPoint.toFixed(1)),
      };
    };
    const topBowler = (team: any) => {
      const sortSquad = team.squad.sort(
        (a: any, b: any) => b.bowlingTotalPoint - a.bowlingTotalPoint
      );

      const probability = Math.min(
        100,
        Math.round((sortSquad[0].bowlingTotalPoint / 3) * 100)
      );

      return {
        name: sortSquad[0].name,
        predictedWickets: `${Math.floor(
          sortSquad[0].bowlingTotalPoint
        )}-${Math.ceil(sortSquad[0].bowlingTotalPoint + 1)}`,
        probability: `${probability}%`,
        recentAvg: parseFloat(sortSquad[0].bowlingTotalPoint.toFixed(1)),
        venueAvg: parseFloat(sortSquad[0].venueBowlingPoint.toFixed(1)),
      };
    };

    const CalculateWinnerPrediction = (team: any, opponent: any) => {
      const scoreWeight = 0.4; // scoring power
      const wicketWeight = 0.3; // wicket-taking

      // Normalize by using both teams’ data
      const maxScore = Math.max(team.avgScore, opponent.avgScore);
      const maxWicket = Math.max(team.avgWicket, opponent.avgWicket);

      const score = (team.avgScore / maxScore) * scoreWeight;
      const wickets = (team.avgWicket / maxWicket) * wicketWeight;

      return score + wickets;
    };

    const teamAverageScore = (team: any) => {
      const toatlBattingPoint = team.squad.reduce(
        (acc: number, player: any) => acc + player.battingTotalPoint,
        0
      );
      const totalStadiumBattingStats = team.squad.reduce(
        (acc: number, player: any) => acc + player.venueBattingPoint,
        0
      );

      return (toatlBattingPoint + totalStadiumBattingStats) * 0.4;
    };

    const teamAverageWicket = (team: any) => {
      const toatlBowlingPoint = team.squad.reduce(
        (acc: number, player: any) => acc + player.bowlingTotalPoint,
        0
      );
      const totalStadiumBowlingStats = team.squad.reduce(
        (acc: number, player: any) => acc + player.venueBowlingPoint,
        0
      );

      return (toatlBowlingPoint + totalStadiumBowlingStats) * 0.2;
    };

    const team1AvgScore = teamAverageScore(prepareSquad[0]);
    const team2AvgScore = teamAverageScore(prepareSquad[1]);

    const team1AvgWkt = teamAverageWicket(prepareSquad[0]);
    const team2AvgWkt = teamAverageWicket(prepareSquad[1]);

    const team1WinnerChance = CalculateWinnerPrediction(
      {
        avgScore: team1AvgScore,
        avgWicket: team1AvgWkt,
      },
      { avgScore: team2AvgScore, avgWicket: team2AvgWkt }
    );

    const team2WinnerChance = CalculateWinnerPrediction(
      {
        avgScore: team2AvgScore,
        avgWicket: team2AvgWkt,
      },
      { avgScore: team1AvgScore, avgWicket: team1AvgWkt }
    );

    // Convert to probabilities
    const totalWinningChance = team1WinnerChance + team2WinnerChance;
    const team1Prob = (team1WinnerChance / totalWinningChance) * 100;
    const team2Prob = (team2WinnerChance / totalWinningChance) * 100;

    const result = {
      firstInningScore: {
        team1: {
          min: team1AvgScore - 10,
          max: team1AvgScore + 10,
          predicted: team1AvgScore,
        },
        team2: {
          min: team2AvgScore - 10,
          max: team2AvgScore + 10,
          predicted: team2AvgScore,
        },
      },
      winnerPrediction: {
        team1: {
          probability: team1Prob.toFixed(2),
          confidence: Number(team1Prob) > Number(team2Prob) ? "High" : "Medium",
        },
        team2: {
          probability: team2Prob.toFixed(2),
          confidence: Number(team2Prob) > Number(team1Prob) ? "High" : "Medium",
        },
      },
      dream11Team: {
        captain: {
          name: mergePlayers[0].name,
          team: mergePlayers[0].teamShortName,
          role: mergePlayers[0].type,
          points: parseFloat(mergePlayers[0].totalPoint.toFixed(1)),
          form: "Excellent",
        },
        viceCaptain: {
          name: mergePlayers[1].name,
          team: mergePlayers[1].teamShortName,
          role: mergePlayers[1].type,
          points: parseFloat(mergePlayers[1].totalPoint.toFixed(1)),
          form: "Good",
        },
        players: mergePlayers
          .filter(
            (p) =>
              p.name !== mergePlayers[0].name && p.name !== mergePlayers[1].name
          )
          .map((p, i) => ({
            id: i + 1,
            name: p.name,
            team: p.teamShortName,
            role: p.type,
            points: parseFloat(p.totalPoint.toFixed(1)),
          })),
      },
      keyPlayers: {
        team1: prepareSquad[0].squad.slice(0, 5).map((item: any) => ({
          name: item.name,
          role: item.type,
          impact: item.totalPoint > 40 ? "High" : "Medium",
          recentForm: `${item.totalPoint.toFixed(0)}`,
        })),
        team2: prepareSquad[1].squad.slice(0, 5).map((item: any) => ({
          name: item.name,
          role: item.type,
          impact: item.totalPoint > 40 ? "High" : "Medium",
          recentForm: `${item.totalPoint.toFixed(0)}`,
        })),
      },
      topBatsman: {
        team1: topBatsman(prepareSquad[0]),
        team2: topBatsman(prepareSquad[1]),
      },
      topBowler: {
        team1: topBowler(prepareSquad[0]),
        team2: topBowler(prepareSquad[1]),
      },
    };

    console.log(result);

    //fantasy points calculation based on DummyData//////////////////////////////////

    const fetchMatches = async () => {
      try {
        const response = await axios.post(
          "/api/schedule",
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  const customerReviews = [
    {
      name: "Rahul Sharma",
      rating: 5,
      comment:
        "Amazing predictions! Won multiple Dream11 contests using SportPredict AI insights.",
      avatar: "RS",
    },
    {
      name: "Priya Patel",
      rating: 5,
      comment:
        "The player analytics are incredibly detailed. Best fantasy cricket platform!",
      avatar: "PP",
    },
    {
      name: "Amit Kumar",
      rating: 4,
      comment:
        "Great accuracy in match predictions. The Dream11 team suggestions work perfectly.",
      avatar: "AK",
    },
  ];

  const services = [
    {
      icon: Target,
      title: "AI Match Predictions",
      description:
        "Advanced AI algorithms analyze team performance, player form, and weather conditions for accurate predictions.",
    },
    {
      icon: Trophy,
      title: "Dream11 Team Builder",
      description:
        "Get optimized team combinations with captain and vice-captain suggestions based on recent form.",
    },
    {
      icon: BarChart3,
      title: "Player Analytics",
      description:
        "Comprehensive player statistics including recent form, head-to-head records, and venue performance.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "99.9% uptime with bank-grade security. Your data and payments are completely secure with us.",
    },
  ];

  const subscriptionPlans = [
    {
      name: "Free",
      price: 0,
      credits: 2,
      features: [
        "2 Daily Credits",
        "Basic Predictions",
        "Limited Player Stats",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: 299,
      credits: 50,
      features: [
        "50 Monthly Credits",
        "Advanced AI Predictions",
        "Detailed Analytics",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: 599,
      credits: 150,
      features: [
        "150 Monthly Credits",
        "Premium AI Insights",
        "Complete Database",
        "VIP Support",
      ],
      popular: false,
    },
  ];

  const handleMatchClick = (match: any) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/matches/${match.matchId}`);
    dispatch(setSelectedMatch(match));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Trophy className="h-4 w-4 mr-2" />
              India's #1 Cricket Prediction Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Win Big with
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}
                AI-Powered
              </span>
              <br />
              Cricket Predictions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get accurate match predictions and optimized Dream11 team
              suggestions powered by advanced AI algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
              >
                <Play className="h-5 w-5 mr-2" />
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
                onClick={() => router.push("/matches")}
              >
                View Live Matches
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-400">95%+</div>
                <div className="text-blue-100">Prediction Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-400">50K+</div>
                <div className="text-blue-100">Happy Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-400">1M+</div>
                <div className="text-blue-100">Predictions Made</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Cricket Fans Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who are winning big with our AI
              predictions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {customerReviews.map((review, index) => (
              <Card key={index} className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Premium Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to dominate fantasy cricket leagues
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Upcoming & Live Matches
              </h2>
              <p className="text-xl text-gray-600">
                Get predictions for the hottest cricket matches
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hidden md:flex"
              // onClick={() => router.push("/matches")}
            >
              <Link href="/matches">
                View All Matches
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data
              .filter(
                (item: any) =>
                  item.status === "LIVE" || item.status === "NOT_STARTED"
              )
              .slice(0, 6)
              .map((match: any) => (
                <MatchCard
                  key={match.matchId}
                  match={match}
                  showPredictButton
                  onClick={() => handleMatchClick(match)}
                />
              ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link href="/matches">
                View All Matches
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade as you win more contests
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "ring-2 ring-blue-600 shadow-xl scale-105"
                    : "shadow-lg"
                } border-0`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      {plan.credits}
                    </div>
                    <div className="text-gray-600">
                      Credits {plan.price === 0 ? "Daily" : "Monthly"}
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center justify-center text-gray-600"
                      >
                        <Trophy className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    asChild
                  >
                    <Link href="/subscription">
                      {plan.price === 0 ? "Get Started" : "Choose Plan"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Winning?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of cricket fans who trust SportPredict for their
              fantasy league success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/auth/register">
                  <Users className="h-5 w-5 mr-2" />
                  Sign Up Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-600 hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/matches">View Live Matches</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
