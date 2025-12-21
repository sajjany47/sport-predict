/* eslint-disable react/no-unescaped-entities */
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
  Coins,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { fetchUserDetails, UserSendCredit } from "../AdminService";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/ui/CustomLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserUpdate } from "@/app/MainService";

// Dummy API functions - Replace these with your actual API calls
const dummyAPIs = {
  // Send free credits/tokens to user
  sendFreeCredits: async (userId: string, credits: number, reason: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Sending ${credits} credits to user ${userId} with reason: ${reason}`
        );
        resolve({
          success: true,
          message: `Successfully added ${credits} credits to user account`,
        });
      }, 1000);
    });
  },

  // Suspend user
  suspendUser: async (userId: string, reason: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Suspending user ${userId} with reason: ${reason}`);
        resolve({ success: true, message: "User suspended successfully" });
      }, 1000);
    });
  },

  // Ban user
  banUser: async (userId: string, reason: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Banning user ${userId} with reason: ${reason}`);
        resolve({ success: true, message: "User banned successfully" });
      }, 1000);
    });
  },

  // Activate user
  activateUser: async (userId: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Activating user ${userId}`);
        resolve({ success: true, message: "User activated successfully" });
      }, 1000);
    });
  },
};

const AdminUsersPage = () => {
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [sendingCredits, setSendingCredits] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [creditsAmount, setCreditsAmount] = useState<number>(5);
  const [suspendReason, setSuspendReason] = useState<string>("");
  const [banReason, setBanReason] = useState<string>("");

  // Dialog open states
  const [sendCreditsOpen, setSendCreditsOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);

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

  const UserUpadteStatus = async (values: any) => {
    let reqData: any = { userId: values._id };

    if (user?.role === "admin") {
      reqData.isActive = JSON.parse(values.isActive);

      reqData.status = values.status;

      reqData.remarks = values.remarks;
    }
    await UserUpdate(reqData)
      .then((res) => {
        return { message: res.message, isSuccess: true };
        // toast.success(res.message);
      })
      .catch((err) => {
        return {
          message: err.message || "Failed to save details. Please try again.",
          isSuccess: false,
        };
        // toast.error(err.message || "Failed to save details. Please try again.");
      });
  };

  const handleSendCredits = async (userId: string) => {
    if (!creditsAmount || creditsAmount <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    setSendingCredits(true);

    UserSendCredit({ userId, credits: creditsAmount })
      .then((res) => {
        setSendingCredits(false);
        toast.success(
          `Successfully added ${creditsAmount} credits to user account`
        );

        // Refresh user data
        GetUserDetails();
        setSendCreditsOpen(false);
        setCreditsAmount(5);
      })
      .catch((error) => {
        setSendingCredits(false);
        toast.error(error.message || "Failed to send credits");
      });
  };

  const handleSuspendUser = async (userId: string) => {
    if (!suspendReason.trim()) {
      toast.error("Please provide a reason for suspension");
      return;
    }

    setActionLoading(`suspend-${userId}`);

    const result: any = await UserUpadteStatus({
      _id: userId,
      isActive: false,
      status: "suspended",
      remarks: suspendReason,
    });
    if (result.isSuccess) {
      toast.success("User suspended successfully");
      dispatch(updateUserStatus({ id: userId, status: "suspended" }));
      setSuspendDialogOpen(false);
      setSuspendReason("");
      setActionLoading(null);
    } else {
      setActionLoading(null);
      toast.error(result.message || "Failed to suspend user");
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!banReason.trim()) {
      toast.error("Please provide a reason for ban");
      return;
    }

    setActionLoading(`ban-${userId}`);
    const result: any = await UserUpadteStatus({
      _id: userId,
      isActive: false,
      status: "banned",
      remarks: banReason,
    });
    if (result.isSuccess) {
      toast.success("User banned successfully");
      dispatch(updateUserStatus({ id: userId, status: "banned" }));
      setBanDialogOpen(false);
      setBanReason("");
      setActionLoading(null);
    } else {
      setActionLoading(null);
      toast.error(result.message || "Failed to banned user");
    }
  };

  const handleActivateUser = async (userId: string) => {
    setActionLoading(`activate-${userId}`);

    const result: any = await UserUpadteStatus({
      _id: userId,
      isActive: true,
      status: "active",
      remarks: "Issue resolved, reactivating account.",
    });
    if (result.isSuccess) {
      toast.success("User activated successfully");
      dispatch(updateUserStatus({ id: userId, status: "active" }));

      setActionLoading(null);
    } else {
      setActionLoading(null);
      toast.error(result.message || "Failed to activate user");
    }
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

  // Send Credits Dialog
  const SendCreditsDialog = () => (
    <Dialog open={sendCreditsOpen} onOpenChange={setSendCreditsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            Send Free Credits
          </DialogTitle>
          <DialogDescription>
            Add free credits to user's account. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Info */}
          <div className="space-y-2">
            <Label>User Information</Label>
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">
                  {selectedUser?.name || selectedUser?.username || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium">{selectedUser?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Credits
                </p>
                <p className="font-medium">{selectedUser?.credits || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <Badge
                  className={getStatusColor(selectedUser?.status || "active")}
                >
                  {selectedUser?.status || "active"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Credits Amount */}
          <div className="space-y-2">
            <Label htmlFor="credits">Credits Amount *</Label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="credits"
                type="number"
                min="1"
                max="100000"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(Number(e.target.value))}
                className="pl-10"
                placeholder="Enter credits amount"
              />
            </div>
            <div className="flex gap-2">
              {[5, 10, 15, 20, 30].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreditsAmount(amount)}
                  className={
                    creditsAmount === amount ? "bg-blue-50 border-blue-200" : ""
                  }
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSendCreditsOpen(false);
              setCreditsAmount(100);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSendCredits(selectedUser?._id)}
            disabled={sendingCredits || !creditsAmount}
            className="bg-green-600 hover:bg-green-700"
          >
            {sendingCredits ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Credits
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Suspend User Dialog
  const SuspendUserDialog = () => (
    <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <Clock className="h-5 w-5" />
            Suspend User
          </DialogTitle>
          <DialogDescription>
            This will temporarily suspend the user's account. They won't be able
            to login or use the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>User Information</Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="font-medium">
                {selectedUser?.name || selectedUser?.username || "N/A"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUser?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspendReason">Reason for Suspension *</Label>
            <Textarea
              id="suspendReason"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Enter reason for suspension"
              rows={3}
              required
            />
            <p className="text-sm text-gray-500">
              This reason will be logged and may be shown to the user.
            </p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ The user will be notified about this suspension. They can
              contact support for more information.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSuspendUser(selectedUser?._id)}
            disabled={
              !suspendReason.trim() ||
              actionLoading === `suspend-${selectedUser?._id}`
            }
            variant="destructive"
          >
            {actionLoading === `suspend-${selectedUser?._id}` ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Suspending...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Suspend User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Ban User Dialog
  const BanUserDialog = () => (
    <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Ban className="h-5 w-5" />
            Ban User Permanently
          </DialogTitle>
          <DialogDescription>
            This will permanently ban the user's account. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>User Information</Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="font-medium">
                {selectedUser?.name || selectedUser?.username || "N/A"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUser?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banReason">Reason for Ban *</Label>
            <Textarea
              id="banReason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter reason for permanent ban"
              rows={3}
              required
            />
            <p className="text-sm text-gray-500">
              This reason will be logged for audit purposes.
            </p>
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-300">
              ⚠️ Warning: This action is permanent and cannot be undone. The
              user will be permanently blocked from the platform.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleBanUser(selectedUser?._id)}
            disabled={
              !banReason.trim() || actionLoading === `ban-${selectedUser?._id}`
            }
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            {actionLoading === `ban-${selectedUser?._id}` ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Banning...
              </>
            ) : (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Ban User Permanently
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

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

          {/* Stats Cards */}
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

          {/* Search and Filters */}
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

          {/* Users Table */}
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

                                  {/* User Info */}
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

                                  {/* Additional Info */}
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
                                    className="w-48"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => handleViewUser(user)}
                                    >
                                      <Eye className="h-3 w-3 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setTimeout(() => {
                                          setSelectedUser(user);
                                          setSendCreditsOpen(true);
                                        }, 50);
                                      }}
                                    >
                                      <Coins className="h-3 w-3 mr-2" />
                                      Send Free Credits
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-3 w-3 mr-2" />
                                      Edit User
                                    </DropdownMenuItem>

                                    {user.status === "active" && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setTimeout(() => {
                                            setSelectedUser(user);
                                            setSuspendDialogOpen(true);
                                          }, 50);
                                        }}
                                      >
                                        <Clock className="h-3 w-3 mr-2" />
                                        Suspend User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status === "suspended" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleActivateUser(user._id)
                                        }
                                      >
                                        <CheckCircle className="h-3 w-3 mr-2" />
                                        Activate User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "banned" && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setTimeout(() => {
                                            setSelectedUser(user);
                                            setBanDialogOpen(true);
                                          }, 50);
                                        }}
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

                                {/* Send Credits Button - Desktop */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setSendCreditsOpen(true);
                                  }}
                                  className="gap-1 sm:gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                                >
                                  <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span>Send Credits</span>
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
                                        onClick={() => {
                                          setTimeout(() => {
                                            setSelectedUser(user);
                                            setSuspendDialogOpen(true);
                                          }, 50);
                                        }}
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Suspend User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status === "suspended" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleActivateUser(user._id)
                                        }
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Activate User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "banned" && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setTimeout(() => {
                                            setSelectedUser(user);
                                            setBanDialogOpen(true);
                                          }, 50);
                                        }}
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
                                  View
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

        {/* Dialogs */}
        <SendCreditsDialog />
        <SuspendUserDialog />
        <BanUserDialog />
      </AdminLayout>
    </>
  );
};

export default AdminUsersPage;
