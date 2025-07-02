"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUsers, updateUserStatus } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const AdminUsersPage = () => {
  const { users } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Mock users data
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
      {
        id: "4",
        username: "fantasy_king",
        email: "user4@example.com",
        mobile: "+91 9876543213",
        credits: 0,
        subscriptionPlan: "Free",
        subscriptionExpiry: "2025-01-18",
        status: "banned" as const,
        joinedDate: "2024-09-10",
        lastLogin: "2025-01-05T12:45:00Z",
      },
      {
        id: "5",
        username: "cricket_master",
        email: "user5@example.com",
        mobile: "+91 9876543214",
        credits: 45,
        subscriptionPlan: "Pro",
        subscriptionExpiry: "2025-02-28",
        status: "active" as const,
        joinedDate: "2024-08-15",
        lastLogin: "2025-01-16T08:30:00Z",
      },
    ];

    dispatch(setUsers(mockUsers));
  }, [dispatch]);

  const handleStatusChange = (userId: string, newStatus: string) => {
    dispatch(updateUserStatus({ id: userId, status: newStatus }));
    toast.success(`User status updated to ${newStatus}`);
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm);

    const matchesStatus = activeTab === "all" || user.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  const bannedUsers = users.filter((u) => u.status === "banned").length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all registered users and their accounts
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Export Users
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeUsers}
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
                    Suspended
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {suspendedUsers}
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
                    Banned
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bannedUsers}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
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
                  placeholder="Search by username, email, or mobile..."
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

        {/* Users Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>All Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All ({users.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeUsers})</TabsTrigger>
                <TabsTrigger value="suspended">
                  Suspended ({suspendedUsers})
                </TabsTrigger>
                <TabsTrigger value="banned">Banned ({bannedUsers})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredUsers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {user.username}
                                </h3>
                                <Badge className={getStatusColor(user.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(user.status)}
                                    <span className="capitalize">
                                      {user.status}
                                    </span>
                                  </div>
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{user.mobile}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="h-4 w-4" />
                                  <span>{user.credits} Credits</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    Joined{" "}
                                    {new Date(
                                      user.joinedDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Plan:</span>{" "}
                                {user.subscriptionPlan} |
                                <span className="font-medium">
                                  {" "}
                                  Last Login:
                                </span>{" "}
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    console.log("Edit user", user.id)
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                {user.status === "active" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(user.id, "suspended")
                                    }
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                )}
                                {user.status === "suspended" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(user.id, "active")
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                                {user.status !== "banned" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(user.id, "banned")
                                    }
                                    className="text-red-600"
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Ban User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No users found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "No users match the selected filter"}
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

export default AdminUsersPage;
