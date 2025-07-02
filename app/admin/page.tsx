"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setUsers,
  setOrders,
  setTickets,
  setFinanceStats,
} from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShoppingCart,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const { users, orders, tickets, financeStats } = useSelector(
    (state: RootState) => state.admin
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Mock data for admin dashboard
    const mockUsers = [
      {
        id: "1",
        username: "cricket_fan",
        email: "user1@example.com",
        mobile: "+91 9876543210",
        credits: 25,
        subscriptionPlan: "Pro",
        subscriptionExpiry: "2025-02-15",
        status: "active" as const,
        joinedDate: "2024-12-01",
        lastLogin: "2025-01-15T10:30:00Z",
      },
      {
        id: "2",
        username: "sports_lover",
        email: "user2@example.com",
        mobile: "+91 9876543211",
        credits: 5,
        subscriptionPlan: "Free",
        subscriptionExpiry: "2025-01-20",
        status: "active" as const,
        joinedDate: "2024-11-15",
        lastLogin: "2025-01-14T15:20:00Z",
      },
      {
        id: "3",
        username: "dream11_pro",
        email: "user3@example.com",
        mobile: "+91 9876543212",
        credits: 75,
        subscriptionPlan: "Elite",
        subscriptionExpiry: "2025-03-01",
        status: "suspended" as const,
        joinedDate: "2024-10-20",
        lastLogin: "2025-01-10T09:15:00Z",
      },
    ];

    const mockOrders = [
      {
        id: "ORD-001",
        userId: "1",
        userName: "cricket_fan",
        plan: "Pro",
        amount: 299,
        date: "2025-01-10",
        status: "completed" as const,
        paymentMethod: "UPI",
      },
      {
        id: "ORD-002",
        userId: "3",
        userName: "dream11_pro",
        plan: "Elite",
        amount: 599,
        date: "2025-01-12",
        status: "pending" as const,
        paymentMethod: "Credit Card",
      },
      {
        id: "ORD-003",
        userId: "2",
        userName: "sports_lover",
        plan: "Pro",
        amount: 299,
        date: "2025-01-08",
        status: "failed" as const,
        paymentMethod: "Net Banking",
      },
    ];

    const mockTickets = [
      {
        id: "TKT-001",
        userId: "1",
        userName: "cricket_fan",
        subject: "Payment not processed",
        description: "My payment was deducted but subscription not activated",
        status: "in-progress" as const,
        priority: "high" as const,
        createdAt: "2025-01-10T10:30:00Z",
        updatedAt: "2025-01-11T14:20:00Z",
        assignedTo: "Admin",
      },
      {
        id: "TKT-002",
        userId: "2",
        userName: "sports_lover",
        subject: "Prediction accuracy issue",
        description: "The AI prediction was completely wrong",
        status: "open" as const,
        priority: "medium" as const,
        createdAt: "2025-01-12T08:20:00Z",
        updatedAt: "2025-01-12T08:20:00Z",
      },
    ];

    const mockFinanceStats = {
      totalRevenue: 125000,
      monthlyRevenue: 15000,
      totalOrders: 450,
      pendingPayments: 5,
      refunds: 2,
      averageOrderValue: 350,
    };

    dispatch(setUsers(mockUsers));
    dispatch(setOrders(mockOrders));
    dispatch(setTickets(mockTickets));
    dispatch(setFinanceStats(mockFinanceStats));
  }, [dispatch]);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "in-progress"
  ).length;

  const dashboardStats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Revenue",
      value: `₹${financeStats.totalRevenue.toLocaleString()}`,
      change: "+8%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: financeStats.totalOrders.toString(),
      change: "+15%",
      changeType: "positive",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Open Tickets",
      value: openTickets.toString(),
      change: "-5%",
      changeType: "negative",
      icon: Ticket,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your SportPredict platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon =
              stat.changeType === "positive" ? TrendingUp : TrendingDown;

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
                      <div
                        className={`flex items-center mt-2 text-sm ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <TrendIcon className="h-4 w-4 mr-1" />
                        <span>{stat.change}</span>
                      </div>
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

        {/* Quick Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Recent Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "suspended"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {user.subscriptionPlan}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                <span>Recent Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {order.userName} - {order.plan}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{order.amount}</p>
                      <Badge
                        className={
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">System Status</p>
                  <p className="text-sm text-green-600">
                    All systems operational
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pending Actions</p>
                  <p className="text-sm text-yellow-600">
                    {pendingOrders + openTickets} items need attention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Active Users</p>
                  <p className="text-sm text-blue-600">
                    {activeUsers} users online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
