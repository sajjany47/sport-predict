/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Clock, Mail, Phone, MapPin } from "lucide-react";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 md:px-8">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Customer Support
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're here to help you with any questions or issues you may have.
          Choose the best way to get in touch with our support team.
        </p>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
          <div className="text-gray-600">Satisfaction Rate</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">15m</div>
          <div className="text-gray-600">Avg. Response Time</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div className="text-gray-600">Availability</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">10k+</div>
          <div className="text-gray-600">Issues Resolved</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-gray-600">
                  {process.env.NEXT_PUBLIC_EMAIL || "support@sportpredict.com"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-gray-600">
                  {process.env.NEXT_PUBLIC_MOBILE || "+1 (555) 123-4567"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Office Address</p>
                <p className="text-gray-600">Kolkata, West Bengal, India</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Hours */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <Clock className="h-5 w-5 text-amber-600" />
              <span>Support Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Monday - Friday</span>
                <span className="font-medium text-gray-900">
                  9:00 AM - 6:00 PM
                </span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Saturday</span>
                <span className="font-medium text-gray-900">
                  10:00 AM - 4:00 PM
                </span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Sunday</span>
                <span className="font-medium text-gray-900">Closed</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Urgent issues are handled 24/7 for Pro
                  and Elite users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
