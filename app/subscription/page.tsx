"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Zap,
  Shield,
  Users,
  Trophy,
  Play,
  Coins,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setPlans } from "@/store/slices/subscriptionSlice";

const SubscriptionPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [customTokens, setCustomTokens] = useState(1);

  const tokenPackages = [
    {
      id: "free",
      name: "Free Token",
      price: 0,
      tokens: 1,
      description: "Watch ad to get 1 free token daily",
      popular: false,
      features: [
        "1 Token Daily",
        "Watch Ad Required",
        "Basic Predictions",
        "Lifetime Validity",
      ],
      icon: Play,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: 299,
      tokens: 5,
      description: "Perfect for casual players",
      popular: true,
      features: [
        "5 Tokens",
        "No Ads Required",
        "All Predictions",
        "Lifetime Validity",
      ],
      icon: Coins,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: 599,
      tokens: 12,
      description: "Best value for regular players",
      popular: false,
      features: [
        "12 Tokens",
        "Save 50₹ per token",
        "Priority Support",
        "Lifetime Validity",
      ],
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    },
    {
      id: "custom",
      name: "Custom Pack",
      price: customTokens * 100,
      tokens: customTokens,
      description: "Buy exactly what you need",
      popular: false,
      features: [
        "Flexible Tokens",
        "₹100 per token",
        "All Features",
        "Lifetime Validity",
      ],
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      borderColor: "border-orange-200",
    },
  ];

  const handleTokenChange = (value: string) => {
    const tokens = parseInt(value) || 1;
    setCustomTokens(Math.min(Math.max(tokens, 1), 1000)); // Limit between 1-1000
  };

  const handlePurchase = async (
    packageId: string,
    tokens: number,
    price: number
  ) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (packageId === "free") {
      // Handle free token with ad watch
      toast.success("Watch ad to claim your free token!");
      // Here you would integrate with your ad service
      return;
    }

    if (packageId === "custom") {
      if (customTokens < 1) {
        toast.error("Please select at least 1 token");
        return;
      }
    }

    // For paid packages, redirect to payment
    const packageData = tokenPackages.find((pkg) => pkg.id === packageId);
    if (packageData) {
      dispatch(setPlans(packageData));
      router.push(
        `/payment?package=${packageId}&tokens=${tokens}&amount=${price}`
      );
    }
  };

  const calculateSavings = (packageId: string) => {
    if (packageId === "basic") {
      return "Save ₹201";
    } else if (packageId === "pro") {
      return "Save ₹601";
    }
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Buy Prediction Tokens
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Unlock AI Predictions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              1 Token = 1 Prediction. Choose your perfect token package and
              start winning!
            </p>

            {/* Current Token Balance */}
            {user && (
              <div className="inline-flex items-center space-x-4 bg-white rounded-2xl px-6 py-4 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">
                    {user.credits || 0} Tokens Available
                  </span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  Each prediction costs 1 token
                </div>
              </div>
            )}
          </div>

          {/* Token Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
            {tokenPackages.map((pkg, index) => {
              const IconComponent = pkg.icon;
              const savings = calculateSavings(pkg.id);

              return (
                <Card
                  key={pkg.id}
                  className={`relative group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    pkg.bgColor
                  } border-2 ${pkg.borderColor} ${
                    pkg.popular ? "ring-2 ring-blue-500 shadow-xl" : "shadow-lg"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {savings && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-500 text-white">
                        {savings}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 text-center">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${pkg.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    {/* Package Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pkg.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">
                      {pkg.description}
                    </p>

                    {/* Custom Token Input */}
                    {pkg.id === "custom" && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Number of Tokens
                        </label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleTokenChange(String(customTokens - 1))
                            }
                            disabled={customTokens <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={customTokens}
                            onChange={(e) => handleTokenChange(e.target.value)}
                            className="text-center w-20"
                            min="1"
                            max="1000"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleTokenChange(String(customTokens + 1))
                            }
                            disabled={customTokens >= 1000}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {pkg.price === 0 ? (
                        <div className="text-3xl font-bold text-green-600">
                          FREE
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-gray-900">
                            ₹{pkg.price}
                          </div>
                          {pkg.id !== "custom" && (
                            <div className="text-sm text-gray-600">
                              ₹{Math.round(pkg.price / pkg.tokens)} per token
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Tokens */}
                    <div className="mb-6">
                      <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                        {pkg.tokens}
                      </div>
                      <div className="text-gray-600 font-medium">
                        PREDICTION TOKENS
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center justify-center text-sm text-gray-600"
                        >
                          <Zap className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <Button
                      className={`w-full ${
                        pkg.price === 0
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          : pkg.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          : "bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
                      } text-white font-semibold py-3`}
                      onClick={() =>
                        handlePurchase(pkg.id, pkg.tokens, pkg.price)
                      }
                    >
                      {pkg.price === 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Watch Ad & Get Token
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Why Use Prediction Tokens?
                </CardTitle>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Get AI-powered insights that give you the winning edge
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      95% Accuracy
                    </h3>
                    <p className="text-gray-600">
                      Proven prediction success rate across thousands of matches
                    </p>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      Instant Access
                    </h3>
                    <p className="text-gray-600">
                      Get predictions immediately after token purchase
                    </p>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      Lifetime Tokens
                    </h3>
                    <p className="text-gray-600">
                      Purchased tokens never expire, use them anytime
                    </p>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      50K+ Winners
                    </h3>
                    <p className="text-gray-600">
                      Join our community of successful fantasy players
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    How do tokens work?
                  </h3>
                  <p className="text-gray-600">
                    Each prediction costs 1 token. Buy tokens in packages and
                    use them for AI-powered match predictions, winner forecasts,
                    and Dream11 team suggestions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    Do tokens expire?
                  </h3>
                  <p className="text-gray-600">
                    No! All purchased tokens are valid forever. Only free daily
                    tokens expire after 24 hours if not used.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    Can I get free tokens?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Watch one ad daily to get 1 free token. Perfect for
                    trying out our predictions before purchasing.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    What payment methods?
                  </h3>
                  <p className="text-gray-600">
                    We accept UPI, credit/debit cards, net banking, and all
                    major digital wallets. 100% secure payments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
                        Round-the-clock support for all your queries and
                        concerns.
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
                        Get help from our cricket prediction experts and
                        technical team.
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
                        <span className="font-semibold text-blue-600">
                          24×7
                        </span>
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
    </>
  );
};

export default SubscriptionPage;
