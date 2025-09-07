"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag,
  FileText,
  Download,
  Paperclip,
  ThumbsUp,
  Sparkles,
  X,
  ChevronDown,
  Star,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import { FormikTextArea } from "@/components/CustomField";
import * as Yup from "yup";
import CustomLoader from "@/components/ui/CustomLoader";
import { TicketList, TicketUpdate } from "@/app/MainService";

const validationSchema = Yup.object().shape({
  message: Yup.string()
    .required("Message is required")
    .min(3, "Message must be at least 3 characters"),
});

const SupportUserChat = ({ data }: any) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchTicketDetails = () => {
    setIsLoading(true);
    TicketList({ ticketId: data.ticketId })
      .then((res) => {
        let a = res.data[0];
        setTicket({
          _id: a._id,
          category: a.category,
          subject: a.subject,
          description: a.description,
          ticketNumber: a.ticketNumber,
          status: a.status,
          priority: a.priority || "medium",
          user: a.user,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          assignedTo: {
            _id: "6873af102d01bea623cac54e",
            name: "Sarah Johnson",
            email: "support@sportpredict.com",
            username: "sportpredict_support",
            avatar: "SJ",
          },
        });
        setMessages(a.message ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "technical":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "account":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "prediction":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFormSubmit = (values: any, { resetForm }: any) => {
    setIsSubmitting(true);

    TicketUpdate({
      ticketId: ticket._id,
      status: ticket.status,
      ticketStatus: ticket.status,
      text: values.message,
    })
      .then((res) => {
        // let a = res.data[0];
        setTicket({
          ...res.data,
          assignedTo: {
            _id: "6873af102d01bea623cac54e",
            name: "Sarah Johnson",
            email: "support@sportpredict.com",
            username: "sportpredict_support",
            avatar: "SJ",
          },
        });
        setMessages(res.data.message ?? []);
        setIsSubmitting(false);
      })
      .catch((err) => {
        setIsSubmitting(false);
        toast.error(
          err.message || "Failed to update ticket. Please try again."
        );
      });
  };

  const markAsResolved = () => {
    setIsLoading(true);
    TicketUpdate({
      ticketId: ticket._id,
      status: "resolved",
      ticketStatus: "resolved",
    })
      .then((res) => {
        // let a = res.data[0];
        setTicket({
          ...res.data,
          assignedTo: {
            _id: "6873af102d01bea623cac54e",
            name: "Sarah Johnson",
            email: "support@sportpredict.com",
            username: "sportpredict_support",
            avatar: "SJ",
          },
        });
        setMessages(res.data.message ?? []);

        toast.success("Ticket marked as resolved");
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          err.message || "Failed to update ticket. Please try again."
        );
      });
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (isLoading) {
    return <CustomLoader message="Loading conversation" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 md:py-8">
      <div className="container mx-auto px-2 md:px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 p-3 bg-white rounded-xl shadow-sm">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-2 md:mr-4"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back to Tickets</span>
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Support Ticket
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="md:hidden flex items-center"
          >
            {showSidebar ? (
              <X className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="ml-2">Details</span>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Ticket Info Sidebar */}
          {showSidebar && (
            <div className="lg:w-80 space-y-4 md:space-y-6">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Ticket Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Status
                    </p>
                    <Badge className={getStatusColor(ticket.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize">
                          {ticket.status.replace("-", " ")}
                        </span>
                      </div>
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Priority
                    </p>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span className="capitalize">{ticket.priority}</span>
                      </div>
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Category
                    </p>
                    <Badge className={getCategoryColor(ticket.category)}>
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span className="capitalize">{ticket.category}</span>
                      </div>
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Ticket Number
                    </p>
                    <p className="text-gray-900 font-mono bg-gray-100 p-2 rounded-lg">
                      #{ticket.ticketNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Created
                    </p>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Last Updated
                    </p>
                    <p className="text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>

                  {ticket.assignedTo && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Assigned To
                      </p>
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {ticket.assignedTo.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {ticket.assignedTo.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Support Specialist
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {ticket.status !== "resolved" && (
                    <Button
                      onClick={markAsResolved}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl"
                  >
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Request Callback
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl"
                  >
                    <Download className="h-4 w-4 mr-2 text-green-600" />
                    Export Conversation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl"
                  >
                    <Paperclip className="h-4 w-4 mr-2 text-purple-600" />
                    Attach Files
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Main Content */}
          <div className="flex-1">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm h-full flex flex-col rounded-2xl">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg md:text-xl">
                        {ticket.subject}
                      </CardTitle>
                      <Badge
                        className={
                          getStatusColor(ticket.status) + " hidden md:flex"
                        }
                      >
                        {ticket.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 p-3 md:p-4 overflow-y-auto max-h-96 md:max-h-[500px] bg-gray-50">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.replyBy.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 relative ${
                            message.replyBy.role === "user"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md"
                              : "bg-white text-gray-900 rounded-bl-none shadow-md border border-gray-100"
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            {message.replyBy.role === "support" ? (
                              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                {message.replyBy.avatar}
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                <User className="h-3 w-3" />
                              </div>
                            )}
                            <span className="text-sm font-medium">
                              {message.replyBy.role === "support"
                                ? message.replyBy.name
                                : "You"}
                            </span>
                            <span className="text-xs opacity-80 ml-2">
                              {formatTime(message.replyAt)}
                            </span>
                          </div>
                          <p className="text-sm">{message.text}</p>

                          {/* Message status indicator for user messages */}
                          {message.replyBy.role === "user" && (
                            <div className="absolute bottom-1 right-2">
                              <CheckCircle className="h-3 w-3 text-blue-200" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-md border border-gray-100">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                              {ticket.assignedTo.avatar}
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Reply Form */}
                <div className="p-3 md:p-4 border-t bg-white rounded-b-2xl">
                  {ticket.status === "resolved" ? (
                    <div className="text-center py-6 bg-green-50 rounded-xl border border-green-200">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Ticket Resolved Successfully
                      </h3>
                      <p className="text-green-700">
                        This chat will now be closed. If you have further
                        issues, please create a new ticket.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Formik
                        initialValues={{ message: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                      >
                        {({ handleSubmit, values }) => (
                          <Form onSubmit={handleSubmit}>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <div className="space-y-4">
                                <Field
                                  name="message"
                                  component={FormikTextArea}
                                  placeholder="Type your message here..."
                                  rows={2}
                                  className="resize-none rounded-2xl pr-12 bg-gray-50 border-gray-200"
                                />
                                <div className="flex items-center justify-between">
                                  <p></p>
                                  <Button
                                    type="submit"
                                    disabled={
                                      isSubmitting || !values.message.trim()
                                    }
                                  >
                                    {isSubmitting ? (
                                      <Clock className="h-5 w-5" />
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Reply
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>

                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
                          <span>Support typically replies within 2 hours</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>Please be respectful</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Rating prompt for resolved tickets */}
            {ticket.status === "resolved" && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 mt-4 md:mt-6 rounded-2xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Star className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          How was your support experience?
                        </h3>
                        <p className="text-sm text-gray-600">
                          Rate your interaction with our support team
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white border-gray-300 hover:bg-amber-100 hover:text-amber-500"
                        >
                          <Star className="h-5 w-5" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportUserChat;
