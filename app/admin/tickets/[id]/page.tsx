/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateTicketStatus } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Flag,
  Send,
  Paperclip,
  Phone,
  Mail,
  MapPin,
  Edit,
  MoreHorizontal,
  FileText,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const TicketDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { tickets } = useSelector((state: RootState) => state.admin);

  const ticketId = params.id as string;
  const ticket = tickets.find((t) => t.id === ticketId);

  const [activeTab, setActiveTab] = useState("details");
  const [newMessage, setNewMessage] = useState("");

  const handleStatusChange = (newStatus: string, assignedTo?: string) => {
    if (ticket) {
      dispatch(
        updateTicketStatus({ id: ticket.id, status: newStatus, assignedTo })
      );
      toast.success(`Ticket status updated to ${newStatus}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "closed":
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
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

  // Mock customer data
  const customerData = {
    name: ticket?.userName || "Unknown User",
    email: `${ticket?.userName}@example.com`,
    phone: "+91 9876543210",
    address: "Mumbai, Maharashtra, India",
    joinDate: "2024-12-01",
    totalTickets: 3,
    resolvedTickets: 1,
    subscriptionPlan: "Pro",
  };

  // Mock conversation history
  const conversationHistory = [
    {
      id: "1",
      sender: "customer",
      message: ticket?.description || "Initial ticket description",
      timestamp: ticket?.createdAt || new Date().toISOString(),
      attachments: [],
    },
    {
      id: "2",
      sender: "admin",
      message:
        "Thank you for contacting us. We have received your ticket and our team is looking into this issue.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      attachments: [],
    },
    {
      id: "3",
      sender: "admin",
      message:
        "We have identified the issue and are working on a solution. We will update you shortly.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      attachments: [],
    },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Here you would typically send the message to your backend
    toast.success("Message sent successfully");
    setNewMessage("");
  };

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ticket Not Found
              </h3>
              <p className="text-gray-600">
                The ticket you're looking for doesn't exist or has been removed.
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
              Back to Tickets
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ticket Details
              </h1>
              <p className="text-gray-600 mt-1">Ticket #{ticket.id}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {ticket.status === "open" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusChange("in-progress", "Admin Support")
                    }
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start Working
                  </DropdownMenuItem>
                )}
                {ticket.status === "in-progress" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("resolved")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </DropdownMenuItem>
                )}
                {ticket.status === "resolved" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("closed")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Close Ticket
                  </DropdownMenuItem>
                )}
                {ticket.status !== "closed" && (
                  <DropdownMenuItem onClick={() => handleStatusChange("open")}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Reopen Ticket
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Ticket
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Ticket Summary Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(ticket.status)}
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.charAt(0).toUpperCase() +
                    ticket.status.slice(1).replace("-", " ")}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Status</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flag className="h-5 w-5 text-orange-600" />
                </div>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority.charAt(0).toUpperCase() +
                    ticket.priority.slice(1)}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Priority</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {ticket.userName}
                </div>
                <p className="text-sm text-gray-600">Customer</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-600">Created</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {ticket.subject}
              </h2>
              <p className="text-gray-700">{ticket.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Ticket Details</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Ticket Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ticket ID:</span>
                    <span className="font-medium">{ticket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">{ticket.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority.charAt(0).toUpperCase() +
                        ticket.priority.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() +
                        ticket.status.slice(1).replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned To:</span>
                    <span className="font-medium">
                      {ticket.assignedTo || "Unassigned"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <span>Issue Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversation" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Conversation History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversationHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender === "admin"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "admin"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach File
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
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
                        <span>{customerData.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{customerData.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{customerData.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{customerData.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Account Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">
                          {new Date(customerData.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subscription:</span>
                        <Badge variant="secondary">
                          {customerData.subscriptionPlan}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Tickets:</span>
                        <span className="font-medium">
                          {customerData.totalTickets}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolved Tickets:</span>
                        <span className="font-medium">
                          {customerData.resolvedTickets}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Activity Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-blue-100">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Ticket Created
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Customer submitted a new support ticket
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-yellow-100">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Status Updated
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(ticket.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Ticket status changed to {ticket.status}
                      </p>
                    </div>
                  </div>

                  {ticket.assignedTo && (
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-purple-100">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            Ticket Assigned
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(ticket.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Assigned to {ticket.assignedTo}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TicketDetailsPage;
