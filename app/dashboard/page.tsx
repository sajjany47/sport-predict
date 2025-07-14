/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { setMatches, setSelectedMatch } from "@/store/slices/matchSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchCard from "@/components/ui/match-card";
import {
  Trophy,
  Target,
  Calendar,
  CreditCard,
  TrendingUp,
  Users,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const DashboardPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [matches, setMatches] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.post(
          "/api/schedule",
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        setMatches(response.data.data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  const handleMatchClick = (match: any) => {
    router.push(`/matches/${match.matchId}`);
    dispatch(setSelectedMatch(match));
  };

  // Mock data for dashboard stats
  const dashboardStats = [
    {
      title: "Total Predictions",
      value: "24",
      change: "+12%",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Win Rate",
      value: "87%",
      change: "+5%",
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Credits Used",
      value: "18",
      change: "This month",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Fantasy Points",
      value: "1,247",
      change: "+23%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentPredictions = [
    {
      id: "1",
      match: "India vs Australia",
      prediction: "India to win",
      result: "Won",
      points: 85,
      date: "2025-01-10",
      status: "completed",
    },
    {
      id: "2",
      match: "England vs Pakistan",
      prediction: "England to win",
      result: "Lost",
      points: 0,
      date: "2025-01-09",
      status: "completed",
    },
    {
      id: "3",
      match: "SA vs NZ",
      prediction: "South Africa to win",
      result: "Pending",
      points: 0,
      date: "2025-01-17",
      status: "pending",
    },
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.username}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Ready to make some winning predictions today?
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user.credits}
                </div>
                <div className="text-sm text-gray-600">Credits Left</div>
              </div>
              <Button asChild>
                <Link href="/subscription">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Buy Credits
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Matches */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Matches */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Today's Matches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.slice(0, 3).map((match: any) => (
                    <MatchCard
                      key={match.matchId}
                      match={match}
                      showPredictButton
                      onClick={() => handleMatchClick(match)}
                    />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/matches">View All Matches</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Predictions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Recent Predictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPredictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            prediction.status === "completed"
                              ? prediction.result === "Won"
                                ? "bg-green-100"
                                : "bg-red-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          {prediction.status === "completed" ? (
                            prediction.result === "Won" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {prediction.match}
                          </p>
                          <p className="text-sm text-gray-600">
                            {prediction.prediction}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            prediction.status === "completed"
                              ? prediction.result === "Won"
                                ? "default"
                                : "destructive"
                              : "secondary"
                          }
                        >
                          {prediction.result}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {prediction.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/matches">
                    <Calendar className="h-4 w-4 mr-2" />
                    Browse Matches
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/subscription">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/profile">
                    <Users className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                    {user.subscriptionPlan}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {user.credits}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Credits Remaining
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Expires:{" "}
                    {new Date(user.subscriptionExpiry).toLocaleDateString()}
                  </p>
                  {user.subscriptionPlan === "Free" && (
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/subscription">Upgrade Now</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Pro Tip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Check player form and head-to-head records before making
                  predictions. Our AI considers 50+ factors for accurate
                  predictions!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
