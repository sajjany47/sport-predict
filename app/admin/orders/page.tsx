"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setOrders, updateOrderStatus } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Calendar,
  CreditCard,
  User,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
  const { orders } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Mock orders data
    const mockOrders = [
      {
        id: "ORD-001",
        userId: "1",
        userName: "cricket_fan",
        plan: "Pro",
        amount: 299,
        date: "2025-01-15",
        status: "completed" as const,
        paymentMethod: "UPI",
      },
      {
        id: "ORD-002",
        userId: "3",
        userName: "dream11_pro",
        plan: "Elite",
        amount: 599,
        date: "2025-01-14",
        status: "pending" as const,
        paymentMethod: "Credit Card",
      },
      {
        id: "ORD-003",
        userId: "2",
        userName: "sports_lover",
        plan: "Pro",
        amount: 299,
        date: "2025-01-13",
        status: "failed" as const,
        paymentMethod: "Net Banking",
      },
      {
        id: "ORD-004",
        userId: "5",
        userName: "cricket_master",
        plan: "Pro",
        amount: 299,
        date: "2025-01-12",
        status: "completed" as const,
        paymentMethod: "UPI",
      },
      {
        id: "ORD-005",
        userId: "4",
        userName: "fantasy_king",
        plan: "Elite",
        amount: 599,
        date: "2025-01-11",
        status: "refunded" as const,
        paymentMethod: "Credit Card",
      },
      {
        id: "ORD-006",
        userId: "1",
        userName: "cricket_fan",
        plan: "Elite",
        amount: 599,
        date: "2025-01-10",
        status: "completed" as const,
        paymentMethod: "Debit Card",
      },
    ];

    dispatch(setOrders(mockOrders));
  }, [dispatch]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    toast.success(`Order status updated to ${newStatus}`);
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.plan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const failedOrders = orders.filter((o) => o.status === "failed").length;
  const refundedOrders = orders.filter((o) => o.status === "refunded").length;

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all subscription orders
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedOrders}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingOrders}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Failed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {failedOrders}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID, user, or plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span>All Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedOrders})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingOrders})
                </TabsTrigger>
                <TabsTrigger value="failed">
                  Failed ({failedOrders})
                </TabsTrigger>
                <TabsTrigger value="refunded">
                  Refunded ({refundedOrders})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <ShoppingCart className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {order.id}
                                </h3>
                                <Badge className={getStatusColor(order.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">
                                      {order.status}
                                    </span>
                                  </div>
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4" />
                                  <span>{order.userName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="h-4 w-4" />
                                  <span>{order.plan} Plan</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span>₹{order.amount}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(order.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">
                                  Payment Method:
                                </span>{" "}
                                {order.paymentMethod}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {order.status === "pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          order.id,
                                          "completed"
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(order.id, "failed")
                                      }
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Mark as Failed
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {order.status === "completed" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(order.id, "refunded")
                                    }
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Process Refund
                                  </DropdownMenuItem>
                                )}
                                {order.status === "failed" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(order.id, "pending")
                                    }
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Retry Payment
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No orders found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "No orders match the selected filter"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
