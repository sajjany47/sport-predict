"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Crown,
  Zap,
  BarChart3,
  Receipt,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  User,
  DollarSign,
  Activity,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CustomLoader from "@/components/ui/CustomLoader";
import AdminLayout from "@/components/admin/AdminLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const UserDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.admin);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (params.id) {
      const findData = (users ?? []).find(
        (item: any) => item._id === params.id
      );
      setUser(findData);
    } else {
      setUser({});
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case "subscription":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700";
      case "prediction":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      case "credit":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case "subscription":
        return "Subscription";
      case "prediction":
        return "Prediction";
      case "credit":
        return "Credit Purchase";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "suspended":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "banned":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "banned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return <Crown className="h-4 w-4 text-purple-600" />;
      case "credit":
        return <Zap className="h-4 w-4 text-blue-600" />;
      case "prediction":
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getPaymentModeColor = (mode: string) => {
    switch (mode) {
      case "UPI":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "NETBANKING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "QRCODE":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "PROMOTION":
        return "bg-green-100 text-green-800 border-green-200";
      case "DEDUCTION":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleBackToList = () => {
    router.push("/admin/users");
  };

  // Calculate subscription progress if active
  const calculateSubscriptionProgress = () => {
    if (!user.subscription || !user.subscription.isActive) return 0;

    const purchaseDate = new Date(user.subscription.purchaseDate);
    const expiryDate = new Date(user.subscription.expiryDate);
    const today = new Date();

    const totalDuration = expiryDate.getTime() - purchaseDate.getTime();
    const elapsed = today.getTime() - purchaseDate.getTime();

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Back button and header */}
        {loading && <CustomLoader message="Details Loading" />}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Details
          </h1>
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>

        {Object.keys(user).length > 0 && (
          <>
            {/* User Profile Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"></div>

              <CardContent className="p-6 relative">
                <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-lg">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {user.role === "admin" && (
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-purple-600 p-1 shadow-md">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          @{user.username}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-2">
                        <Badge
                          className={`${getStatusColor(user.status)} border`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </Badge>
                        {user.role === "admin" && (
                          <Badge
                            variant="outline"
                            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-700"
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {user.mobileNumber}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <CreditCard className="h-4 w-4 text-amber-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {user.credits} Credits Available
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            {user.subscription && user.subscriptionDetails && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="flex items-center">
                    <Crown className="mr-2 h-5 w-5 text-purple-600" />
                    Subscription Information
                  </CardTitle>
                  <CardDescription>
                    Current plan details and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {user.subscriptionDetails.name} Plan
                        </h3>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-purple-600">
                            ₹{user.subscriptionDetails.price}
                          </span>
                          <span className="text-gray-500 ml-2">/month</span>
                        </div>
                        <Badge
                          className={
                            user.subscription.isActive
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {user.subscription.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Purchased:
                          </span>
                          <span className="font-medium">
                            {formatDate(user.subscription.purchaseDate)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Expires:
                          </span>
                          <span className="font-medium">
                            {formatDate(user.subscription.expiryDate)}
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Subscription Progress</span>
                            <span>
                              {Math.round(calculateSubscriptionProgress())}%
                            </span>
                          </div>
                          <Progress
                            value={calculateSubscriptionProgress()}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Plan Features:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.subscriptionDetails.features.map(
                          (feature: any, index: any) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs for Orders and Activity */}
            <Card className="border-0 shadow-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="bg-muted p-1 rounded-lg">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="orders"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Order History ({user.orderDetails?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Orders
                              </p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {user.orderDetails?.length || 0}
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40">
                              <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Credits Spent
                              </p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {user.orderDetails?.reduce(
                                  (total: any, order: any) =>
                                    total + (order.credits || 0),
                                  0
                                ) || 0}
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/40">
                              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Spend
                              </p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹
                                {user.orderDetails
                                  ?.filter((order: any) => order.price)
                                  .reduce(
                                    (total: any, order: any) =>
                                      total + (order.price || 0),
                                    0
                                  ) || 0}
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40">
                              <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {user.orderDetails?.slice(0, 3).map((order: any) => (
                            <div
                              key={order._id}
                              className="flex items-center p-3 rounded-lg border"
                            >
                              <div className="flex-shrink-0 p-2 rounded-full bg-blue-100 dark:bg-blue-900/40 mr-3">
                                {getOrderTypeIcon(order.ordertype)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  Order #{order.orderNumber}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                  <Badge
                                    className={getOrderTypeColor(
                                      order.ordertype
                                    )}
                                  >
                                    {getOrderTypeText(order.ordertype)}
                                  </Badge>{" "}
                                  •{" "}
                                  {formatDate(
                                    order.paymentDate || order.createdAt
                                  )}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge
                                  className={getPaymentStatusColor(
                                    order.paymentStatus
                                  )}
                                >
                                  {order.paymentStatus ? "Paid" : "Pending"}
                                </Badge>
                                <p className="text-sm font-medium mt-1">
                                  {order.price ? `₹${order.price}` : "Free"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="orders">
                    {user.orderDetails && user.orderDetails.length > 0 ? (
                      <div className="space-y-4">
                        {user.orderDetails.map((order: any) => (
                          <Card
                            key={order._id}
                            className="overflow-hidden transition-all hover:shadow-md"
                          >
                            <CardContent className="p-0">
                              <div className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40">
                                      {getOrderTypeIcon(order.ordertype)}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        Order #{order.orderNumber}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                        <Badge
                                          className={getOrderTypeColor(
                                            order.ordertype
                                          )}
                                        >
                                          {getOrderTypeText(order.ordertype)}
                                        </Badge>{" "}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    className={getPaymentModeColor(
                                      order.paymentMode
                                    )}
                                  >
                                    {order.paymentMode}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Date
                                    </span>
                                    <span className="font-medium">
                                      {formatDate(
                                        order.paymentDate || order.createdAt
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Credits
                                    </span>
                                    <span className="font-medium">
                                      {order.credits || 0}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Price
                                    </span>
                                    <span className="font-medium">
                                      {order.price ? `₹${order.price}` : "Free"}
                                    </span>
                                  </div>
                                </div>
                                {order.paymentMode && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Payment Method:{" "}
                                      <span className="font-medium">
                                        {order.paymentMode}
                                      </span>
                                    </p>
                                  </div>
                                )}
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Status:{" "}
                                    <span className="font-medium capitalize">
                                      {order.status}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No orders found
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="activity">
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Activity Tracking
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        User activity tracking coming soon...
                      </p>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserDetailsPage;
