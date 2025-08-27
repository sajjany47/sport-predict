/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Link from "next/link";
import CustomLoader from "@/components/ui/CustomLoader";
import AdminLayout from "@/components/admin/AdminLayout";

const DashboardPage = () => {
  const params = useParams();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { users } = useSelector((state: RootState) => state.admin);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setLoading(true);
    if (params.id) {
      const findData = (users ?? []).find(
        (item: any) => item._id === params.id
      );
      setUserData(findData);
    } else {
      setUserData({});
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        return "bg-purple-100 text-purple-800";
      case "prediction":
        return "bg-blue-100 text-blue-800";
      case "credit":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "employee":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      bgColor: "bg-blue-100",
    },
    {
      title: "Current Credits",
      value: userData?.credits?.toLocaleString(),
      change: `${userData?.subscriptionDetails?.name} Plan`,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent?.toLocaleString()}`,
      change: `${subscriptionOrders} subscriptions`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Predictions Made",
      value: predictionOrders?.toString(),
      change: `${creditsEarned} credits earned`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
    <>
      <AdminLayout>
        {Object.keys(userData).length > 0 ? (
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              {/* Welcome Header */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      Welcome back, {userData.name}! 👋
                    </h1>
                    <p className="text-xl text-gray-600">
                      Ready to make some winning predictions today?
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={getUserStatusColor(userData.status)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {userData.status.charAt(0).toUpperCase() +
                          userData.status.slice(1)}
                      </Badge>
                      <Badge className={getRoleColor(userData.role)}>
                        <Users className="h-3 w-3 mr-1" />
                        {userData.role.charAt(0).toUpperCase() +
                          userData.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {userData.credits.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Credits Available
                      </div>
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
                {/* Left Column - Matches & Recent Activity */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Upcoming Matches */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600">
                              Subscriptions
                            </span>
                          </div>
                          <span className="font-bold text-purple-600">
                            {subscriptionOrders}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">
                              Predictions
                            </span>
                          </div>
                          <span className="font-bold text-blue-600">
                            {predictionOrders}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Gift className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">
                              Credit Purchases
                            </span>
                          </div>
                          <span className="font-bold text-green-600">
                            {creditOrders}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Orders */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        <span>Recent Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.orderDetails.slice(0, 5).map((order: any) => (
                          <div
                            key={order._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                {getOrderTypeIcon(order.ordertype)}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-medium text-gray-900">
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
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>#{order.orderNumber}</span>
                                  <div className="flex items-center space-x-1">
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
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge className={getStatusColor(order.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(order.status)}
                                    <span>{order.status}</span>
                                  </div>
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.price
                                  ? `₹${order.price}`
                                  : `${order.credits} credits`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(
                                  order.paymentDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 text-center">
                        <Button variant="outline" asChild>
                          <Link href="/dashboard/orders">View All Orders</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - User Info & Quick Actions */}
                <div className="space-y-6">
                  {/* User Profile Card */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span>Profile</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold text-white">
                            {userData.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {userData.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {userData.email}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {userData.mobileNumber}
                        </p>
                      </div>

                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Username:</span>
                          <span className="font-medium">
                            {userData.username}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <Badge className={getRoleColor(userData.role)}>
                            {userData.role.charAt(0).toUpperCase() +
                              userData.role.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge
                            className={getUserStatusColor(userData.status)}
                          >
                            {userData.status.charAt(0).toUpperCase() +
                              userData.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since:</span>
                          <span className="font-medium">
                            {new Date(userData?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Subscription */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-purple-600" />
                        <span>Current Subscription</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-3">
                          <Crown className="h-3 w-3 mr-1" />
                          {userData.subscriptionDetails.name}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {userData.subscription.credits}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          Monthly Credits
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Expires:{" "}
                          {new Date(
                            userData.subscription.expiryDate
                          ).toLocaleDateString()}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Credits Used</span>
                            <span>
                              {userData.subscription.credits - userData.credits}{" "}
                              / {userData.subscription.credits}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  ((userData.subscription.credits -
                                    userData.credits) /
                                    userData.subscription.credits) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600 mb-4">
                          {userData.subscriptionDetails.features.map(
                            (feature: any, index: any) => (
                              <div key={index} className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                <span>{feature}</span>
                              </div>
                            )
                          )}
                        </div>

                        <Button size="sm" className="w-full" asChild>
                          <Link href="/subscription">
                            <Zap className="h-3 w-3 mr-1" />
                            Manage Plan
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CustomLoader message="Details Loading" />
        )}
      </AdminLayout>
    </>
  );
};

export default DashboardPage;
