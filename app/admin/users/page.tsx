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
  Crown,
  User,
  Download,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { fetchUserDetails } from "../AdminService";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/ui/CustomLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminUsersPage = () => {
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetUserDetails = () => {
    setLoading(true);
    fetchUserDetails({})
      .then((res) => {
        setLoading(false);
        dispatch(setUsers(res.data ?? []));
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to fetch users. Please try again.");
      });
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    dispatch(updateUserStatus({ id: userId, status: newStatus }));
    toast.success(`User status updated to ${newStatus}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />;
      case "suspended":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />;
      case "banned":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
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
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNumber?.includes(searchTerm);

    const matchesStatus = activeTab === "all" || user.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  const bannedUsers = users.filter((u) => u.status === "banned").length;

  const handleViewUser = (user: any) => {
    router.push(`/admin/users/${user._id}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {loading && <CustomLoader message="User details loading" />}
      <AdminLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage all registered users and their accounts
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base px-3 sm:px-4">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export Users</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Users
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {users.length}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Active
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {activeUsers}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Suspended
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {suspendedUsers}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Banned
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {bannedUsers}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                    <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters - Mobile Optimized */}
          <Card className="border-0 shadow-lg dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-11"
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 sm:h-11 text-sm sm:text-base"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">More Filters</span>
                  <span className="sm:hidden">Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table - Mobile Optimized */}
          <Card className="border-0 shadow-lg dark:bg-gray-800">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>All Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4 sm:mb-6 h-auto p-1">
                  <TabsTrigger value="all" className="py-2 text-xs sm:text-sm">
                    All
                    <span className="ml-1">({users.length})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="py-2 text-xs sm:text-sm"
                  >
                    Active
                    <span className="ml-1">({activeUsers})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="suspended"
                    className="py-2 text-xs sm:text-sm"
                  >
                    Suspended
                    <span className="ml-1">({suspendedUsers})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="banned"
                    className="py-2 text-xs sm:text-sm"
                  >
                    Banned
                    <span className="ml-1">({bannedUsers})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value={activeTab}
                  className="space-y-3 sm:space-y-4"
                >
                  {filteredUsers.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {filteredUsers.map((user: any) => (
                        <div
                          key={user._id}
                          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex flex-col gap-4">
                            {/* User Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 min-w-0">
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0">
                                  <AvatarFallback className="bg-blue-600 text-white text-sm sm:text-base">
                                    {getInitials(user.name || user.username)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
                                      {user.name || user.username}
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                      <Badge
                                        className={`text-xs ${getStatusColor(
                                          user.status
                                        )}`}
                                      >
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(user.status)}
                                          <span className="capitalize">
                                            {user.status}
                                          </span>
                                        </div>
                                      </Badge>
                                      {user.role === "admin" && (
                                        <Badge
                                          className={`text-xs ${getRoleColor(
                                            user.role
                                          )}`}
                                        >
                                          <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                          Admin
                                        </Badge>
                                      )}
                                      {user.role === "employee" && (
                                        <Badge
                                          className={`text-xs ${getRoleColor(
                                            user.role
                                          )}`}
                                        >
                                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                          Employee
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {/* User Info - Grid for desktop, column for mobile */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span className="truncate">
                                        {user.email}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span>{user.mobileNumber || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span>{user.credits || 0} Credits</span>
                                    </div>
                                  </div>

                                  {/* Additional Info - Stack on mobile */}
                                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span>
                                        Joined {formatDate(user.createdAt)}
                                      </span>
                                    </div>
                                    {user.lastAdCreditDate && (
                                      <div className="flex items-center gap-2">
                                        <span>
                                          Last Ad Credit:{" "}
                                          {formatDate(user.lastAdCreditDate)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Mobile Actions Dropdown */}
                              <div className="sm:hidden">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-40"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => handleViewUser(user)}
                                    >
                                      <Eye className="h-3 w-3 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-3 w-3 mr-2" />
                                      Edit
                                    </DropdownMenuItem>

                                    {user.status === "active" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(
                                            user._id,
                                            "suspended"
                                          )
                                        }
                                      >
                                        <Clock className="h-3 w-3 mr-2" />
                                        Suspend
                                      </DropdownMenuItem>
                                    )}
                                    {user.status === "suspended" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(user._id, "active")
                                        }
                                      >
                                        <CheckCircle className="h-3 w-3 mr-2" />
                                        Activate
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "banned" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(user._id, "banned")
                                        }
                                        className="text-red-600"
                                      >
                                        <Ban className="h-3 w-3 mr-2" />
                                        Ban User
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden sm:flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Terms:</span>{" "}
                                {user.agreeToTerms ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                    Agreed
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-red-600 text-xs"
                                  >
                                    Not Agreed
                                  </Badge>
                                )}
                                <span className="mx-2">•</span>
                                <span className="font-medium">
                                  Active:
                                </span>{" "}
                                {user.isActive ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                    Yes
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs">
                                    No
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                  className="gap-1 sm:gap-2"
                                >
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span>View</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit User
                                    </DropdownMenuItem>
                                    {user.status === "active" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(
                                            user._id,
                                            "suspended"
                                          )
                                        }
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Suspend User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status === "suspended" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(user._id, "active")
                                        }
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Activate User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "banned" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(user._id, "banned")
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

                            {/* Mobile Status Info */}
                            <div className="sm:hidden pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">
                                      Terms:
                                    </span>
                                    <span className="ml-1">
                                      {user.agreeToTerms ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                          Agreed
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="text-red-600 text-xs"
                                        >
                                          Not Agreed
                                        </Badge>
                                      )}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">
                                      Active:
                                    </span>
                                    <span className="ml-1">
                                      {user.isActive ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                          Yes
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs">
                                          No
                                        </Badge>
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                  className="gap-1 text-xs"
                                >
                                  <Eye className="h-3 w-3" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        No users found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
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
    </>
  );
};

export default AdminUsersPage;
