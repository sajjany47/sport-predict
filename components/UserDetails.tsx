/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Target,
  CreditCard,
  Users,
  Star,
  Clock,
  CheckCircle,
  Gift,
  Zap,
  Crown,
  Activity,
  DollarSign,
  RefreshCw,
  XCircle,
  Smartphone,
  Building,
  QrCode,
  User,
  Download,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { set } from "mongoose";
import EditUser from "./EditUser";

export const UserDetails = ({ userData }: { userData: any }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Helper functions
  const getOrderTypeIcon = (ordertype: string) => {
    switch (ordertype) {
      case "subscription":
        return <Crown className="h-5 w-5 text-purple-600" />;
      case "prediction":
        return <Target className="h-5 w-5 text-blue-600" />;
      case "credit":
        return <Gift className="h-5 w-5 text-green-600" />;
      default:
        return <Star className="h-5 w-5 text-gray-600" />;
    }
  };

  const getOrderTypeColor = (ordertype: string) => {
    switch (ordertype) {
      case "subscription":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "prediction":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "credit":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "refunded":
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPaymentModeIcon = (paymentMode: string) => {
    switch (paymentMode) {
      case "UPI":
        return <Smartphone className="h-4 w-4 text-blue-600" />;
      case "NETBANKING":
        return <Building className="h-4 w-4 text-green-600" />;
      case "QRCODE":
        return <QrCode className="h-4 w-4 text-purple-600" />;
      case "PROMOTION":
        return <Gift className="h-4 w-4 text-orange-600" />;
      case "DEDUCTION":
        return <CreditCard className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "banned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "employee":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "user":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Calculate dashboard stats from real data
  const totalOrders = userData?.orderDetails?.length;
  const completedOrders = userData?.orderDetails?.filter(
    (o: any) => o.status === "completed"
  ).length;
  const totalSpent = userData?.orderDetails
    ?.filter((o: any) => o.status === "completed" && o.price)
    .reduce((sum: any, order: any) => sum + (order.price || 0), 0);
  const creditsEarned = userData?.orderDetails
    ?.filter((o: any) => o.status === "completed")
    .reduce((sum: any, order: any) => sum + order.credits, 0);

  const subscriptionOrders = userData?.orderDetails?.filter(
    (o: any) => o.ordertype === "subscription"
  ).length;
  const predictionOrders = userData?.orderDetails?.filter(
    (o: any) => o.ordertype === "prediction"
  ).length;
  const creditOrders = userData?.orderDetails?.filter(
    (o: any) => o.ordertype === "credit"
  ).length;

  const dashboardStats = [
    {
      title: "Total Orders",
      value: totalOrders?.toString(),
      change: `${completedOrders} completed`,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Current Credits",
      value: userData?.credits?.toLocaleString(),
      change: `${userData?.subscriptionDetails?.name} Plan`,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent?.toLocaleString()}`,
      change: `${subscriptionOrders} subscriptions`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Predictions Made",
      value: predictionOrders?.toString(),
      change: `${creditsEarned} credits earned`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => {
                  setTimeout(() => setEditOpen(true), 50);
                }}
              >
                <User className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          {Object.keys(userData).length > 0 ? (
            <>
              {/* User Profile Header */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <Card className="w-full md:w-1/3 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4 border-4 border-white shadow-md">
                        <AvatarImage
                          src={userData.avatar}
                          alt={userData.name}
                        />
                        <AvatarFallback className="bg-blue-600 text-white text-xl">
                          {userData.name
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userData.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {userData.email}
                      </p>

                      <div className="flex gap-2 mb-4">
                        <Badge className={getUserStatusColor(userData.status)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {userData?.status?.charAt(0).toUpperCase() +
                            userData.status.slice(1)}
                        </Badge>
                        <Badge className={getRoleColor(userData.role)}>
                          <Users className="h-3 w-3 mr-1" />
                          {userData.role.charAt(0).toUpperCase() +
                            userData.role.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {userData.credits.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Credits
                          </div>
                        </div>
                        <Button asChild size="sm" className="gap-2">
                          <Link href="/subscription">
                            <Coins className="h-4 w-4" />
                            Buy Credits
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="w-full md:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card
                        key={index}
                        className="border-0 shadow-lg bg-white dark:bg-gray-800"
                      >
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                                {stat.change}
                              </p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                              <Icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Tabs Navigation */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-8"
              >
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="subscription"
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    <span className="hidden sm:inline">Subscription</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-2"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          Order Summary
                        </CardTitle>
                        <CardDescription>
                          Distribution of your order types
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="font-medium">Subscriptions</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Premium plans
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="px-3 py-1">
                              {subscriptionOrders} orders
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium">Predictions</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Match forecasts
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="px-3 py-1">
                              {predictionOrders} orders
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium">Credit Purchases</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Extra credits
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="px-3 py-1">
                              {creditOrders} orders
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber-600" />
                          Achievement
                        </CardTitle>
                        <CardDescription>
                          Your performance summary
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Success Rate
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            82%
                          </span>
                        </div>
                        <Progress value={82} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Completion
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {completedOrders}/{totalOrders}
                          </span>
                        </div>
                        <Progress
                          value={(completedOrders / totalOrders) * 100}
                          className="h-2"
                        />

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Monthly Activity
                          </span>
                          <span className="text-lg font-bold text-purple-600">
                            24
                          </span>
                        </div>
                        <Progress value={80} className="h-2" />

                        <Button className="w-full mt-4 gap-2">
                          <Sparkles className="h-4 w-4" />
                          View All Achievements
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity Preview */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-green-600" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription>
                          Your most recent transactions
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/orders">View All</Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.orderDetails.slice(0, 3).map((order: any) => (
                          <div
                            key={order._id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                {getOrderTypeIcon(order.ordertype)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {order.ordertype === "subscription"
                                      ? "Subscription Purchase"
                                      : order.ordertype === "prediction"
                                      ? `Match Prediction`
                                      : "Credit Purchase"}
                                  </p>
                                  <Badge
                                    className={getOrderTypeColor(
                                      order.ordertype
                                    )}
                                  >
                                    {order.ordertype}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span>#{order.orderNumber}</span>
                                  <div className="flex items-center gap-1">
                                    {getPaymentModeIcon(order.paymentMode)}
                                    <span>{order.paymentMode}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1 justify-end">
                                <Badge className={getStatusColor(order.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(order.status)}
                                    <span>{order.status}</span>
                                  </div>
                                </Badge>
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {order.price
                                  ? `₹${order.price}`
                                  : `${order.credits} credits`}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(
                                  order.paymentDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        All Activity
                      </CardTitle>
                      <CardDescription>
                        Your complete order history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.orderDetails.map((order: any) => (
                          <div
                            key={order._id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                {getOrderTypeIcon(order.ordertype)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {order.ordertype === "subscription"
                                      ? "Subscription Purchase"
                                      : order.ordertype === "prediction"
                                      ? `Match Prediction`
                                      : "Credit Purchase"}
                                  </p>
                                  <Badge
                                    className={getOrderTypeColor(
                                      order.ordertype
                                    )}
                                  >
                                    {order.ordertype}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span>#{order.orderNumber}</span>
                                  <div className="flex items-center gap-1">
                                    {getPaymentModeIcon(order.paymentMode)}
                                    <span>{order.paymentMode}</span>
                                  </div>
                                  {order.matchId && (
                                    <span>Match: {order.matchId}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1 justify-end">
                                <Badge className={getStatusColor(order.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(order.status)}
                                    <span>{order.status}</span>
                                  </div>
                                </Badge>
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {order.price
                                  ? `₹${order.price}`
                                  : `${order.credits} credits`}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(
                                  order.paymentDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Subscription Tab */}
                <TabsContent value="subscription">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-purple-600" />
                          Current Subscription
                        </CardTitle>
                        <CardDescription>
                          Your active plan and usage details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {userData.subscriptionDetails.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                {userData.subscriptionDetails.description}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Credits Used
                                </span>
                                <span className="text-sm font-medium">
                                  {userData.subscription.credits -
                                    userData.credits}{" "}
                                  / {userData.subscription.credits}
                                </span>
                              </div>
                              <Progress
                                value={
                                  ((userData.subscription.credits -
                                    userData.credits) /
                                    userData.subscription.credits) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Plan Expiry
                                </span>
                                <span className="text-sm font-medium">
                                  {new Date(
                                    userData.subscription.expiryDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: "65%" }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="md:w-1/3 flex flex-col justify-between">
                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {userData.subscription.credits}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Monthly Credits
                              </p>
                            </div>

                            <Button className="w-full mt-4 gap-2">
                              <Zap className="h-4 w-4" />
                              Upgrade Plan
                            </Button>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            Plan Features
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {userData.subscriptionDetails.features.map(
                              (feature: any, index: any) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          Billing History
                        </CardTitle>
                        <CardDescription>
                          Your subscription payments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userData.orderDetails
                            .filter((o: any) => o.ordertype === "subscription")
                            .slice(0, 3)
                            .map((order: any) => (
                              <div
                                key={order._id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    Subscription Renewal
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(
                                      order.paymentDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">₹{order.price}</p>
                                  <Badge
                                    className={getStatusColor(order.status)}
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          View Full History
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                          Personal Information
                        </CardTitle>
                        <CardDescription>
                          Your account details and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Full Name
                            </label>
                            <p className="mt-1 text-gray-900 dark:text-white">
                              {userData.name}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Username
                            </label>
                            <p className="mt-1 text-gray-900 dark:text-white">
                              {userData.username}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Email Address
                            </label>
                            <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {userData.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Phone Number
                            </label>
                            <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {userData.mobileNumber}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Account Status
                            </label>
                            <div className="mt-1">
                              <Badge
                                className={getUserStatusColor(userData.status)}
                              >
                                {userData.status.charAt(0).toUpperCase() +
                                  userData.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              User Role
                            </label>
                            <div className="mt-1">
                              <Badge className={getRoleColor(userData.role)}>
                                {userData.role.charAt(0).toUpperCase() +
                                  userData.role.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Member Since
                          </label>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {new Date(userData?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-gray-600" />
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Edit Profile
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Change Password
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Notification Settings
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Privacy & Security
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-red-600 hover:text-red-700"
                          >
                            Logout
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle>Security</CardTitle>
                          <CardDescription>
                            Your account security status
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Email Verification</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Verified
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Phone Verification</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Verified
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Two-Factor Auth</span>
                            <Badge
                              variant="outline"
                              className="text-amber-600 border-amber-200"
                            >
                              Inactive
                            </Badge>
                          </div>
                          <Button variant="outline" className="w-full">
                            Enable 2FA
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Loading user data...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {editOpen && (
        <EditUser
          data={{
            username: userData.username || "",
            name: userData.name || "",
            email: userData.email || "",
            mobileNumber: userData.mobileNumber || "",
            isActive: userData.isActive || "",
            status: userData.status || "",
            remarks: userData.remarks || "",
            role: userData.role || "",
            _id: userData._id || "",
          }}
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};
