/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateOrderStatus } from "@/store/slices/adminSlice";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.admin);

  const orderId = params.id as string;
  const order = orders.find((o) => o.id === orderId);

  const [activeTab, setActiveTab] = useState("details");

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    }
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

  // Mock additional order data
  const orderDetails = {
    customer: {
      name: order?.userName || "Unknown User",
      email: `${order?.userName}@example.com`,
      phone: "+91 9876543210",
      address: "Mumbai, Maharashtra, India",
      joinDate: "2024-12-01",
      totalOrders: 5,
      lifetimeValue: 1495,
    },
    payment: {
      method: order?.paymentMethod || "UPI",
      transactionId: `TXN${order?.id}${Date.now()}`,
      gateway: "Razorpay",
      fees: order ? Math.round(order.amount * 0.02) : 0,
      netAmount: order ? order.amount - Math.round(order.amount * 0.02) : 0,
    },
    timeline: [
      {
        status: "Order Placed",
        timestamp: order?.date
          ? new Date(order.date).toISOString()
          : new Date().toISOString(),
        description: "Customer placed the order",
        icon: ShoppingCart,
        color: "text-blue-600",
      },
      {
        status: "Payment Processing",
        timestamp: order?.date
          ? new Date(new Date(order.date).getTime() + 2 * 60000).toISOString()
          : new Date().toISOString(),
        description: "Payment is being processed",
        icon: CreditCard,
        color: "text-yellow-600",
      },
      {
        status:
          order?.status === "completed"
            ? "Payment Confirmed"
            : order?.status === "failed"
            ? "Payment Failed"
            : "Processing",
        timestamp: order?.date
          ? new Date(new Date(order.date).getTime() + 5 * 60000).toISOString()
          : new Date().toISOString(),
        description:
          order?.status === "completed"
            ? "Payment confirmed and subscription activated"
            : order?.status === "failed"
            ? "Payment failed - please retry"
            : "Currently processing",
        icon:
          order?.status === "completed"
            ? CheckCircle
            : order?.status === "failed"
            ? XCircle
            : Clock,
        color:
          order?.status === "completed"
            ? "text-green-600"
            : order?.status === "failed"
            ? "text-red-600"
            : "text-yellow-600",
      },
    ],
  };

  if (!order) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">Order #{order.id}</p>
            </div>
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

        {/* Order Summary Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(order.status)}
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Order Status</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{order.amount}
                </div>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {order.plan} Plan
                </div>
                <p className="text-sm text-gray-600">Subscription</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(order.date).toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-600">Order Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">
                      {order.plan} Subscription
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{order.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date(order.date).toLocaleDateString()}
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
                    <span className="font-medium">{order.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">1 Month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits:</span>
                    <span className="font-medium">
                      {order.plan === "Pro"
                        ? "50"
                        : order.plan === "Elite"
                        ? "150"
                        : "2"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto Renewal:</span>
                    <span className="font-medium">Disabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activation:</span>
                    <span className="font-medium">
                      {order.status === "completed" ? "Activated" : "Pending"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                        <span>{orderDetails.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{orderDetails.customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{orderDetails.customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{orderDetails.customer.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Customer Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">
                          {new Date(
                            orderDetails.customer.joinDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Orders:</span>
                        <span className="font-medium">
                          {orderDetails.customer.totalOrders}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lifetime Value:</span>
                        <span className="font-medium">
                          ₹{orderDetails.customer.lifetimeValue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer Type:</span>
                        <Badge variant="secondary">Regular</Badge>
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
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium">
                          {orderDetails.payment.transactionId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">
                          {orderDetails.payment.method}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Gateway:</span>
                        <span className="font-medium">
                          {orderDetails.payment.gateway}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Amount Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{order.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Fees:</span>
                        <span className="font-medium">
                          ₹{orderDetails.payment.fees}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes:</span>
                        <span className="font-medium">₹0</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>₹{order.amount}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Net Amount:</span>
                        <span className="font-medium">
                          ₹{orderDetails.payment.netAmount}
                        </span>
                      </div>
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
                  {orderDetails.timeline.map((event, index) => {
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
                              {new Date(event.timestamp).toLocaleString()}
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
    </AdminLayout>
  );
};

export default OrderDetailsPage;
