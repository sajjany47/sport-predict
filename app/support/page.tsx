/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Clock, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const SupportPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 md:px-8">
      {/* Customer Support Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                24×7 Customer Support
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're here to help you 24 hours a day, 7 days a week
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Support Info */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      Quick Response
                    </h3>
                    <p className="text-gray-600">
                      Get response within 30 minutes. Query resolved same day.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      24×7 Availability
                    </h3>
                    <p className="text-gray-600">
                      Round-the-clock support for all your queries and concerns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      Expert Assistance
                    </h3>
                    <p className="text-gray-600">
                      Get help from our cricket prediction experts and technical
                      team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <Card className="bg-white border-2 border-blue-300 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Contact Support
                    </h3>
                    <p className="text-gray-600">
                      Send us an email and we'll get back to you quickly
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-semibold text-blue-900">
                          Support Email
                        </span>
                      </div>
                      <a
                        href={`mailto:sportpredict247@gmail.com?subject=Support Request - Username: ${
                          user?.username || "YourUsername"
                        }&body=Hello SportPredict Support,%0D%0A%0D%0A[Please describe your issue or question in detail here]%0D%0A%0D%0AUsername: ${
                          user?.username || "YourUsername"
                        }%0D%0A%0D%0AThank you!`}
                        className="text-lg font-bold text-blue-600 hover:text-blue-700 break-all"
                      >
                        sportpredict247@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Response Time:</span>
                      <span className="font-semibold text-green-600">
                        Within 30 mins
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Resolution Time:</span>
                      <span className="font-semibold text-green-600">
                        Same Day
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Availability:</span>
                      <span className="font-semibold text-blue-600">24×7</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => {
                      const subject = `Support Request - Username: ${
                        user?.username || "YourUsername"
                      }`;
                      const body = `Hello SportPredict Support,%0D%0A%0D%0A[Please describe your issue or question in detail here]%0D%0A%0D%0AUsername: ${
                        user?.username || "YourUsername"
                      }%0D%0A%0D%0AThank you!`;
                      window.location.href = `mailto:sportpredict247@gmail.com?subject=${encodeURIComponent(
                        subject
                      )}&body=${encodeURIComponent(body)}`;
                    }}
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Email Now
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Email Template Tips */}
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                For Quick Resolution:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>Include your username in the subject line</li>
                <li>Describe your issue clearly and in detail</li>
                <li>
                  Mention if it's related to tokens, predictions, or payments
                </li>
                <li>Attach screenshots if applicable</li>
                <li>We promise same-day resolution for all queries</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
