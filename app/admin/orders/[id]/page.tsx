/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ShoppingCart,
  User,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Mail,
  Phone,
  MapPin,
  Package,
  Truck,
  FileText,
  AlertCircle,
  Edit,
  MoreHorizontal,
  CalendarDays,
  Receipt,
  Crown,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

// Define types based on the provided data
interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  credits: number;
  isActive: boolean;
  subscription: Array<{
    subscriptionId: string;
    isActive: boolean;
    expiryDate: string;
    purchaseDate: string;
    _id: string;
  }>;
  agreeToTerms: boolean;
  lastAdCreditDate: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  ordertype: string;
  price: number;
  userId: string;
  subscriptionId: string;
  subscriptionExpired: string;
  credits: number;
  paymentStatus: boolean;
  paymentId: string;
  status: string;
  paymentMode: string;
  paymentModeDetails: {
    id: string;
    name: string;
    note: string;
  };
  senderId: string | null;
  receiverId: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  plan: Plan;
}

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const orderId = params.id as string;
  // Mock data based on the provided structure
  const order: Order = {
    _id: "6899b003da6af3079c0595f2",
    orderNumber: "ORD-2025811-85467",
    ordertype: "subscription",
    price: 599,
    userId: "6873af102d01bea623cac54d",
    subscriptionId: "6873cf862d01bea623cac560",
    subscriptionExpired: "2025-09-10T08:51:16.876Z",
    credits: 30,
    paymentStatus: false,
    paymentId: "SDF4354",
    status: "pending",
    paymentMode: "UPI",
    paymentModeDetails: {
      id: "8981374643@naviaxis",
      name: "SAJJAN KUMAR YADAV",
      note: "SportPredict Subscription Payment",
    },
    senderId: null,
    receiverId: "6899b003da6af3079c0595f1",
    paymentDate: "2025-08-11T08:51:16.876Z",
    createdAt: "2025-08-11T08:55:31.882Z",
    updatedAt: "2025-08-11T08:55:31.882Z",
    user: {
      _id: "6873af102d01bea623cac54d",
      name: "Sajjan Kumar Yadav",
      email: "sajjany47@gmail.com",
      mobileNumber: "8981374643",
      username: "sajjany47",
      role: "admin",
      createdAt: "2025-07-13T13:05:20.400Z",
      updatedAt: "2025-08-11T05:28:14.076Z",
      credits: 10001,
      isActive: true,
      subscription: [
        {
          subscriptionId: "6873c7502d01bea623cac559",
          isActive: true,
          expiryDate: "2025-08-09T18:33:23.855Z",
          purchaseDate: "2025-08-09T18:33:23.855Z",
          _id: "68979473ae54b1318218d104",
        },
      ],
      agreeToTerms: true,
      lastAdCreditDate: "2025-08-11T05:28:14.075Z",
    },
    plan: {
      _id: "6873cf862d01bea623cac560",
      name: "Elite",
      price: 599,
      credits: 30,
      features: [
        "30 Monthly Credits",
        "Premium AI Insights",
        "Complete Database",
        "VIP Support",
      ],
      popular: false,
      isActive: true,
      createdAt: "2025-07-13T15:23:50.433Z",
      updatedAt: "2025-07-27T05:56:16.209Z",
    },
  };

  const handleStatusChange = (newStatus: string) => {
    // In a real app, you would dispatch an action to update the status
    toast.success(`Order status updated to ${newStatus}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "refunded":
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
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

  const getPaymentStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
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

  // Mock timeline data
  const timeline = [
    {
      status: "Order Placed",
      timestamp: order.createdAt,
      description: "Customer placed the order",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      status: "Payment Processing",
      timestamp: new Date(
        new Date(order.createdAt).getTime() + 2 * 60000
      ).toISOString(),
      description: "Payment is being processed",
      icon: CreditCard,
      color: "text-yellow-600",
    },
    {
      status: order.paymentStatus ? "Payment Confirmed" : "Payment Pending",
      timestamp: new Date(
        new Date(order.createdAt).getTime() + 5 * 60000
      ).toISOString(),
      description: order.paymentStatus
        ? "Payment confirmed and subscription activated"
        : "Payment pending - awaiting confirmation",
      icon: order.paymentStatus ? CheckCircle : Clock,
      color: order.paymentStatus ? "text-green-600" : "text-yellow-600",
    },
  ];

  return (
    <AdminLayout>
      {orderId ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order Details
                </h1>
                <p className="text-gray-600 mt-1">{order.orderNumber}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {order.status === "pending" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange("completed")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange("failed")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Mark as Failed
                        </DropdownMenuItem>
                      </>
                    )}
                    {order.status === "completed" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("refunded")}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Process Refund
                      </DropdownMenuItem>
                    )}
                    {order.status === "failed" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("pending")}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Retry Payment
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Order
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getStatusIcon(order.status)}
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Order Status</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{order.price}
                  </div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {order.plan.name} Plan
                  </div>
                  <p className="text-sm text-gray-600">Subscription</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatDate(order.createdAt)}
                  </div>
                  <p className="text-sm text-gray-600">Order Date</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
              <TabsTrigger value="payment">Payment Details</TabsTrigger>
              <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <span>Order Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Type:</span>
                      <span className="font-medium capitalize">
                        {order.ordertype}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">
                        {order.plan.name} Subscription
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">₹{order.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium">{order.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span>Subscription Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Type:</span>
                      <span className="font-medium">{order.plan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">1 Month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium">{order.plan.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">₹{order.plan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="font-medium">
                        {formatDate(order.subscriptionExpired)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto Renewal:</span>
                      <span className="font-medium">Disabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activation:</span>
                      <span className="font-medium">
                        {order.paymentStatus ? "Activated" : "Pending"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Plan Features */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span>Plan Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customer" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-purple-600" />
                    <span>Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Contact Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{order.user.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{order.user.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{order.user.mobileNumber}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>India</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Customer Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since:</span>
                          <span className="font-medium">
                            {formatDate(order.user.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Username:</span>
                          <span className="font-medium">
                            {order.user.username}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Current Credits:
                          </span>
                          <span className="font-medium">
                            {order.user.credits}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Active Subscriptions:
                          </span>
                          <span className="font-medium">
                            {order.user.subscription.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Status:</span>
                          <Badge
                            variant={
                              order.user.isActive ? "default" : "secondary"
                            }
                          >
                            {order.user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span>Payment Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">
                        Transaction Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-medium">{order.paymentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">
                            {order.paymentMode}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <Badge
                            className={getPaymentStatusColor(
                              order.paymentStatus
                            )}
                          >
                            {order.paymentStatus ? "Success" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Date:</span>
                          <span className="font-medium">
                            {formatDate(order.paymentDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Payment Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">UPI ID:</span>
                          <span className="font-medium">
                            {order.paymentModeDetails.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Name:</span>
                          <span className="font-medium">
                            {order.paymentModeDetails.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Note:</span>
                          <span className="font-medium">
                            {order.paymentModeDetails.note}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    <span>Amount Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-w-md">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Price:</span>
                      <span className="font-medium">₹{order.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18% GST):</span>
                      <span className="font-medium">
                        ₹{(order.price * 0.18).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">
                        ₹{(order.price * 0.02).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>₹{order.price}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Order Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {timeline.map((event, index) => {
                      const Icon = event.icon;
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div
                            className={`p-2 rounded-full bg-gray-100 ${event.color}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">
                                {event.status}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {formatDate(event.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Order Not Found
              </h3>
              <p className="text-gray-600">
                The order you're looking for doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderDetailsPage;
