"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CustomLoader from "@/components/ui/CustomLoader";
import AdminLayout from "@/components/admin/AdminLayout";

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
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const handleBackToList = () => {
    router.push("/admin/users");
  };
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back button and header */}
        {loading && <CustomLoader message="Details Loading" />}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        </div>

        {Object.keys(user).length > 0 && (
          <>
            {/* User Profile Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {user.name}
                        </h2>
                        <p className="text-gray-600">@{user.username}</p>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-2">
                        <Badge className={getStatusColor(user.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </Badge>
                        {user.role === "admin" && (
                          <Badge
                            variant="outline"
                            className="bg-purple-100 text-purple-800"
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{user.mobileNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span>{user.credits} Credits Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Subscription Information</CardTitle>
              </CardHeader>
              <CardContent>
                {user.subscription && user.subscriptionDetails ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.subscriptionDetails.name} Plan
                        </h3>
                        <p className="text-gray-600">
                          ₹{user.subscriptionDetails.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          {user.subscription.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              Inactive
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Purchased:</span>{" "}
                          {formatDate(user.subscription.purchaseDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Expires:</span>{" "}
                          {formatDate(user.subscription.expiryDate)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Features:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {user.subscriptionDetails.features.map(
                          (feature: any, index: any) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No active subscription</p>
                )}
              </CardContent>
            </Card>

            {/* Tabs for Orders and Activity */}
            <Card className="border-0 shadow-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">
                      Order History ({user.orderDetails.length})
                    </TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Total Orders
                              </p>
                              <p className="text-2xl font-bold">
                                {user.orderDetails.length}
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100">
                              <Receipt className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Credits Spent
                              </p>
                              <p className="text-2xl font-bold">
                                {user.orderDetails.reduce(
                                  (total: any, order: any) =>
                                    total + order.credits,
                                  0
                                )}
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100">
                              <Zap className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Total Spend
                              </p>
                              <p className="text-2xl font-bold">
                                ₹
                                {user.orderDetails
                                  .filter((order: any) => order.price)
                                  .reduce(
                                    (total: any, order: any) =>
                                      total + (order.price || 0),
                                    0
                                  )}
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100">
                              <CreditCard className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders">
                    {user.orderDetails.length > 0 ? (
                      <div className="space-y-4">
                        {user.orderDetails.map((order: any) => (
                          <div
                            key={order._id}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getOrderTypeIcon(order.ordertype)}
                                <div>
                                  <p className="font-medium">
                                    Order #{order.orderNumber}
                                  </p>
                                  <p className="text-sm text-gray-600 capitalize">
                                    {order.ordertype}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={getPaymentStatusColor(
                                  order.paymentStatus
                                )}
                              >
                                {order.paymentStatus ? "Paid" : "Pending"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-sm">
                              <div>
                                <p className="text-gray-600">
                                  Date: {formatDate(order.paymentDate)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  Credits: {order.credits}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  Price:{" "}
                                  {order.price ? `₹${order.price}` : "Free"}
                                </p>
                              </div>
                            </div>
                            {order.paymentMode && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  Payment Method: {order.paymentMode}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No orders found</p>
                    )}
                  </TabsContent>

                  <TabsContent value="activity">
                    <p className="text-gray-600">
                      User activity tracking coming soon...
                    </p>
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
