/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Mail,
  Phone,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
  Coins,
  Calendar,
  IndianRupee,
  MoreVertical,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditUser from "./EditUser";
import { fetchUserDetails } from "@/app/admin/AdminService";
import toast from "react-hot-toast";
import CustomLoader from "./ui/CustomLoader";
import ResetPassword from "@/app/dashboard/ResetPassword";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";

export const UserDetails = ({ userId }: { userId: any }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    GetUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOpen]);

  const GetUserDetails = () => {
    setLoading(true);
    fetchUserDetails({ userId: userId })
      .then((res) => {
        setLoading(false);

        setUserData(res.data[0]);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to fetch users. Please try again.");
      });
  };

  // Helper functions
  const getOrderTypeIcon = (ordertype: string) => {
    switch (ordertype) {
      case "purchase":
        return <Coins className="h-5 w-5 text-purple-600" />;
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
      case "purchase":
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

  const getPaymentModeIcon = (paymentMode: string | null) => {
    if (!paymentMode) return <DollarSign className="h-4 w-4 text-gray-600" />;

    switch (paymentMode.toUpperCase()) {
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
  const orderDetails =
    userData?.orderDetails?.sort(
      (a: any, b: any) =>
        moment(b.paymentDate).valueOf() - moment(a.paymentDate).valueOf()
    ) || [];
  const totalOrders = orderDetails.length;
  const completedOrders = orderDetails.filter(
    (o: any) => o.status === "completed"
  ).length;
  const totalSpent = orderDetails
    .filter((o: any) => o.status === "completed" && o.price)
    .reduce((sum: any, order: any) => sum + (order.price || 0), 0);

  const creditsEarned = orderDetails
    .filter((o: any) => o.status === "completed" && o.credits > 0)
    .reduce((sum: any, order: any) => sum + (order.credits || 0), 0);

  const purchaseOrders = orderDetails.filter(
    (o: any) => o.ordertype === "purchase"
  ).length;
  const predictionOrders = orderDetails.filter(
    (o: any) => o.ordertype === "prediction"
  ).length;
  const creditOrders = orderDetails.filter(
    (o: any) => o.ordertype === "credit"
  ).length;

  const dashboardStats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: `${completedOrders} completed`,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Current Credits",
      value: (userData?.credits || 0).toLocaleString(),
      change: "Available balance",
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      change: `${purchaseOrders} purchases`,
      icon: IndianRupee,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Predictions Made",
      value: predictionOrders.toString(),
      change: `${creditsEarned} credits earned`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {loading && <CustomLoader message="Details Loading" />}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-3 sm:px-4 py-6">
          {/* Header with back button - Mobile optimized */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1 sm:gap-2 px-2 sm:px-3"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            {/* Mobile dropdown menu */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Change Password
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2">
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
              {/* User Profile Header - Mobile optimized */}
              <div className="flex flex-col gap-4 mb-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-md">
                        <AvatarImage
                          src={userData.avatar}
                          alt={userData.name}
                        />
                        <AvatarFallback className="bg-blue-600 text-white text-lg sm:text-xl">
                          {userData.name
                            ?.split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {userData.name}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2 truncate">
                          {userData.email}
                        </p>

                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                          <Badge
                            className={`text-xs ${getUserStatusColor(
                              userData.status
                            )}`}
                          >
                            <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            {userData?.status?.charAt(0).toUpperCase() +
                              userData.status.slice(1)}
                          </Badge>
                          <Badge
                            className={`text-xs ${getRoleColor(userData.role)}`}
                          >
                            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            {userData.role.charAt(0).toUpperCase() +
                              userData.role.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                          <div className="text-center sm:text-left">
                            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {(userData.credits || 0).toLocaleString()}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              Credits
                            </div>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            className="gap-2 w-full sm:w-auto"
                          >
                            <Link href="/subscription">
                              <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
                              Buy Credits
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Grid - Mobile optimized */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {dashboardStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card
                        key={index}
                        className="border-0 shadow-lg bg-white dark:bg-gray-800"
                      >
                        <CardContent className="p-3 sm:p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {stat.title}
                              </p>
                              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 truncate">
                                {stat.change}
                              </p>
                            </div>
                            <div
                              className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}
                            >
                              <Icon
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Tabs Navigation - Mobile optimized */}
              <div className="mb-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 sm:w-auto bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto">
                    <TabsTrigger
                      value="overview"
                      className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
                    >
                      <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
                    >
                      <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Activity</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="credits"
                      className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
                    >
                      <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Credits</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
                    >
                      <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Profile</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent
                    value="overview"
                    className="space-y-4 sm:space-y-6 mt-4"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                      {/* Order Summary */}
                      <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            Order Summary
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Distribution of your order types
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                  <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm sm:text-base">
                                    Credit Purchases
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    Buying credits
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs"
                              >
                                {purchaseOrders} orders
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm sm:text-base">
                                    Predictions
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    Match forecasts
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs"
                              >
                                {predictionOrders} orders
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm sm:text-base">
                                    Free Credits
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    Promotional credits
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs"
                              >
                                {creditOrders} orders
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Stats */}
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                            Achievement
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Your performance summary
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Success Rate
                              </span>
                              <span className="text-base sm:text-lg font-bold text-green-600">
                                {totalOrders > 0
                                  ? Math.round(
                                      (completedOrders / totalOrders) * 100
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                totalOrders > 0
                                  ? (completedOrders / totalOrders) * 100
                                  : 0
                              }
                              className="h-1.5 sm:h-2"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Completion
                              </span>
                              <span className="text-base sm:text-lg font-bold text-blue-600">
                                {completedOrders}/{totalOrders}
                              </span>
                            </div>
                            <Progress
                              value={
                                totalOrders > 0
                                  ? (completedOrders / totalOrders) * 100
                                  : 0
                              }
                              className="h-1.5 sm:h-2"
                            />
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-sm font-medium">
                              Member Since
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-purple-600">
                              {formatDate(userData.createdAt).split(",")[0]}
                            </span>
                          </div>

                          <Button className="w-full mt-2 sm:mt-4 gap-2 text-sm">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            View All Achievements
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity Preview */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            Recent Activity
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Your most recent transactions
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("activity")}
                          className="w-full sm:w-auto"
                        >
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          {orderDetails.slice(0, 3).map((order: any) => (
                            <div
                              key={order._id}
                              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3 sm:gap-4"
                            >
                              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <div className="p-1.5 sm:p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm flex-shrink-0">
                                  {getOrderTypeIcon(order.ordertype)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                      {order.ordertype === "purchase"
                                        ? "Credit Purchase"
                                        : order.ordertype === "prediction"
                                        ? `Match Prediction`
                                        : "Free Credit"}
                                    </p>
                                    <Badge
                                      className={`text-xs ${getOrderTypeColor(
                                        order.ordertype
                                      )}`}
                                    >
                                      {order.ordertype}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <span className="truncate">
                                      #{order.orderNumber}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {getPaymentModeIcon(order.paymentMode)}
                                      <span className="truncate">
                                        {order.paymentMode || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto">
                                <div className="flex items-center gap-2 mb-1 sm:justify-end">
                                  <Badge
                                    className={`text-xs ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(order.status)}
                                      <span>{order.status}</span>
                                    </div>
                                  </Badge>
                                </div>
                                <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                                  {order.price
                                    ? `₹${order.price}`
                                    : `${order.credits} credits`}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(order.paymentDate)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="mt-4">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          All Activity
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                          Your complete order history
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          {orderDetails.length > 0 ? (
                            orderDetails.map((order: any) => (
                              <div
                                key={order._id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3 sm:gap-4"
                              >
                                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                  <div className="p-1.5 sm:p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm flex-shrink-0">
                                    {getOrderTypeIcon(order.ordertype)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                        {order.ordertype === "purchase"
                                          ? "Credit Purchase"
                                          : order.ordertype === "prediction"
                                          ? `Match Prediction`
                                          : "Free Credit"}
                                      </p>
                                      <Badge
                                        className={`text-xs ${getOrderTypeColor(
                                          order.ordertype
                                        )}`}
                                      >
                                        {order.ordertype}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                      <span className="truncate">
                                        #{order.orderNumber}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {getPaymentModeIcon(order.paymentMode)}
                                        <span className="truncate">
                                          {order.paymentMode || "N/A"}
                                        </span>
                                      </div>
                                      {order.matchId && (
                                        <span className="truncate">
                                          Match: {order.matchId}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-left sm:text-right w-full sm:w-auto">
                                  <div className="flex items-center gap-2 mb-1 sm:justify-end">
                                    <Badge
                                      className={`text-xs ${getStatusColor(
                                        order.status
                                      )}`}
                                    >
                                      <div className="flex items-center gap-1">
                                        {getStatusIcon(order.status)}
                                        <span>{order.status}</span>
                                      </div>
                                    </Badge>
                                  </div>
                                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                                    {order.price
                                      ? `₹${order.price}`
                                      : `${order.credits} credits`}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(order.paymentDate)}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                              No activity found
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Credits Tab */}
                  <TabsContent value="credits" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                      <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                            Credit History
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Your credit transactions and balance
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                            <div className="flex-1 space-y-4 sm:space-y-6">
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                  Current Balance
                                </h3>
                                <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                                  {userData.credits?.toLocaleString()} credits
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                  Last updated: {formatDate(userData.updatedAt)}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Total Credits Earned
                                  </span>
                                  <span className="text-xs sm:text-sm font-medium">
                                    {creditsEarned} credits
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    userData.credits > 0
                                      ? Math.min(
                                          (userData.credits / creditsEarned) *
                                            100,
                                          100
                                        )
                                      : 0
                                  }
                                  className="h-1.5 sm:h-2"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Last Credit Purchase
                                  </span>
                                  <span className="text-xs sm:text-sm font-medium">
                                    {purchaseOrders > 0
                                      ? formatDate(
                                          orderDetails.find(
                                            (o: any) =>
                                              o.ordertype === "purchase"
                                          )?.paymentDate || userData.createdAt
                                        ).split(",")[0]
                                      : "Never"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-1/3 flex flex-col justify-between">
                              <div className="text-center p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                  {purchaseOrders}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                  Credit Purchases
                                </p>
                              </div>

                              <Button
                                asChild
                                className="w-full mt-3 sm:mt-4 gap-2 text-sm"
                              >
                                <Link href="/subscription">
                                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                                  Buy More Credits
                                </Link>
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                              Recent Credit Transactions
                            </h4>
                            <div className="space-y-2 sm:space-y-3">
                              {orderDetails
                                .filter((o: any) => o.credits && o.credits > 0)
                                .slice(0, 3)
                                .map((order: any) => (
                                  <div
                                    key={order._id}
                                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                      {getOrderTypeIcon(order.ordertype)}
                                      <div className="min-w-0">
                                        <p className="font-medium text-xs sm:text-sm truncate">
                                          {order.ordertype === "purchase"
                                            ? "Credit Purchase"
                                            : order.ordertype === "credit"
                                            ? "Free Credit"
                                            : "Prediction"}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatDate(order.paymentDate)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p
                                        className={`font-medium text-xs sm:text-sm ${
                                          order.ordertype === "prediction"
                                            ? "text-red-600"
                                            : "text-green-600"
                                        }`}
                                      >
                                        {order.ordertype === "prediction"
                                          ? "-"
                                          : "+"}
                                        {order.credits} credits
                                      </p>
                                      <Badge
                                        className={`text-xs ${getStatusColor(
                                          order.status
                                        )}`}
                                      >
                                        {order.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            Purchase History
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Your credit purchases
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          <div className="space-y-3 sm:space-y-4">
                            {orderDetails
                              .filter((o: any) => o.ordertype === "purchase")
                              .slice(0, 3)
                              .map((order: any) => (
                                <div
                                  key={order._id}
                                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base truncate">
                                      {order.credits} Credits
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                      {formatDate(order.paymentDate)}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-medium text-sm sm:text-base">
                                      ₹{order.price}
                                    </p>
                                    <Badge
                                      className={`text-xs ${getStatusColor(
                                        order.status
                                      )}`}
                                    >
                                      {order.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            {purchaseOrders === 0 && (
                              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No purchase history
                              </div>
                            )}
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full mt-3 sm:mt-4 text-sm"
                          >
                            <Link href="/subscription">View All Purchases</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                      <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            Personal Information
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Your account details and preferences
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                              </label>
                              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                {userData.name}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username
                              </label>
                              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                {userData.username}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                              </label>
                              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2 truncate">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                {userData.email}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number
                              </label>
                              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                {userData.mobileNumber}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Account Status
                              </label>
                              <div className="mt-1">
                                <Badge
                                  className={`text-xs ${getUserStatusColor(
                                    userData.status
                                  )}`}
                                >
                                  {userData.status.charAt(0).toUpperCase() +
                                    userData.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                User Role
                              </label>
                              <div className="mt-1">
                                <Badge
                                  className={`text-xs ${getRoleColor(
                                    userData.role
                                  )}`}
                                >
                                  {userData.role.charAt(0).toUpperCase() +
                                    userData.role.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Member Since
                              </label>
                              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2 truncate">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                {formatDate(userData.createdAt)}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Last Updated
                              </label>
                              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2 truncate">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                {formatDate(userData.updatedAt)}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Terms Agreement
                            </label>
                            <p className="mt-1">
                              {userData.agreeToTerms ? (
                                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                  Agreed
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-red-600"
                                >
                                  Not Agreed
                                </Badge>
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-4 sm:space-y-6">
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                              Quick Actions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                            <Button
                              variant="outline"
                              className="w-full justify-between text-sm"
                              onClick={() => setEditOpen(true)}
                            >
                              Edit Profile
                              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-sm"
                              onClick={() => setIsOpen(true)}
                            >
                              Change Password
                              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
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
      {isOpen && (
        <ResetPassword
          modalOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          username={userData.username}
        />
      )}
      {editOpen && (
        <EditUser
          data={{
            username: userData.username || "",
            name: userData.name || "",
            email: userData.email || "",
            mobileNumber: userData.mobileNumber || "",
            isActive: userData.isActive,
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
