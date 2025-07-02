"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { setTickets, updateTicketStatus } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Ticket,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Flag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const AdminTicketsPage = () => {
  const { tickets } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Mock tickets data
    const mockTickets = [
      {
        id: "TKT-001",
        userId: "1",
        userName: "cricket_fan",
        subject: "Payment not processed",
        description:
          "My payment for Pro plan was deducted but subscription not activated. Please help resolve this issue.",
        status: "in-progress" as const,
        priority: "high" as const,
        createdAt: "2025-01-10T10:30:00Z",
        updatedAt: "2025-01-11T14:20:00Z",
        assignedTo: "Admin Support",
      },
      {
        id: "TKT-002",
        userId: "2",
        userName: "sports_lover",
        subject: "Prediction accuracy issue",
        description:
          "The AI prediction for match IND vs AUS was completely wrong. I lost my fantasy contest because of this.",
        status: "open" as const,
        priority: "medium" as const,
        createdAt: "2025-01-12T08:20:00Z",
        updatedAt: "2025-01-12T08:20:00Z",
      },
      {
        id: "TKT-003",
        userId: "3",
        userName: "dream11_pro",
        subject: "Credits not deducted properly",
        description:
          "Used prediction but credits were deducted twice from my account.",
        status: "resolved" as const,
        priority: "low" as const,
        createdAt: "2025-01-08T16:45:00Z",
        updatedAt: "2025-01-09T09:15:00Z",
        assignedTo: "Technical Team",
      },
      {
        id: "TKT-004",
        userId: "4",
        userName: "fantasy_king",
        subject: "Account suspended without reason",
        description:
          "My account was suspended suddenly without any notification or reason. Please review and reactivate.",
        status: "open" as const,
        priority: "urgent" as const,
        createdAt: "2025-01-13T12:15:00Z",
        updatedAt: "2025-01-13T12:15:00Z",
      },
      {
        id: "TKT-005",
        userId: "5",
        userName: "cricket_master",
        subject: "Dream11 team suggestion not working",
        description:
          "The Dream11 team builder is showing error when I try to generate team for today's matches.",
        status: "in-progress" as const,
        priority: "medium" as const,
        createdAt: "2025-01-14T09:30:00Z",
        updatedAt: "2025-01-14T15:45:00Z",
        assignedTo: "Development Team",
      },
      {
        id: "TKT-006",
        userId: "1",
        userName: "cricket_fan",
        subject: "Refund request",
        description:
          "I want to cancel my Elite subscription and get a refund as I am not satisfied with the service.",
        status: "closed" as const,
        priority: "low" as const,
        createdAt: "2025-01-05T14:20:00Z",
        updatedAt: "2025-01-07T11:30:00Z",
        assignedTo: "Finance Team",
      },
    ];

    dispatch(setTickets(mockTickets));
  }, [dispatch]);

  const handleStatusChange = (
    ticketId: string,
    newStatus: string,
    assignedTo?: string
  ) => {
    dispatch(
      updateTicketStatus({ id: ticketId, status: newStatus, assignedTo })
    );
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleViewTicket = (ticketId: string) => {
    router.push(`/admin/tickets/${ticketId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === "all" || ticket.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "in-progress"
  ).length;
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ticket Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer support tickets and issues
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Create Ticket
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
                    Total Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Ticket className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Open</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {openTickets}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inProgressTickets}
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
                    Resolved
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {resolvedTickets}
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
                    Closed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {closedTickets}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <XCircle className="h-6 w-6 text-gray-600" />
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
                  placeholder="Search by ticket ID, user, or subject..."
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

        {/* Tickets Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              <span>All Tickets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
                <TabsTrigger value="open">Open ({openTickets})</TabsTrigger>
                <TabsTrigger value="in-progress">
                  In Progress ({inProgressTickets})
                </TabsTrigger>
                <TabsTrigger value="resolved">
                  Resolved ({resolvedTickets})
                </TabsTrigger>
                <TabsTrigger value="closed">
                  Closed ({closedTickets})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredTickets.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <MessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {ticket.subject}
                                </h3>
                                <Badge
                                  className={getStatusColor(ticket.status)}
                                >
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(ticket.status)}
                                    <span className="capitalize">
                                      {ticket.status.replace("-", " ")}
                                    </span>
                                  </div>
                                </Badge>
                                <Badge
                                  className={getPriorityColor(ticket.priority)}
                                >
                                  <div className="flex items-center space-x-1">
                                    <Flag className="h-3 w-3" />
                                    <span className="capitalize">
                                      {ticket.priority}
                                    </span>
                                  </div>
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-3 line-clamp-2">
                                {ticket.description}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Ticket className="h-4 w-4" />
                                  <span>{ticket.id}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4" />
                                  <span>{ticket.userName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(
                                      ticket.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4" />
                                  <span>
                                    {ticket.assignedTo || "Unassigned"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTicket(ticket.id)}
                            >
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
                                {ticket.status === "open" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        ticket.id,
                                        "in-progress",
                                        "Admin Support"
                                      )
                                    }
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Start Working
                                  </DropdownMenuItem>
                                )}
                                {ticket.status === "in-progress" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(ticket.id, "resolved")
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Resolved
                                  </DropdownMenuItem>
                                )}
                                {ticket.status === "resolved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(ticket.id, "closed")
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Close Ticket
                                  </DropdownMenuItem>
                                )}
                                {ticket.status !== "closed" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(ticket.id, "open")
                                    }
                                  >
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Reopen Ticket
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Add Comment
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
                    <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No tickets found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "No tickets match the selected filter"}
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

export default AdminTicketsPage;
