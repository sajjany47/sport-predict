"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateCredits, updateSubscription } from "@/store/slices/authSlice";
import { addOrder } from "@/store/slices/subscriptionSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Check,
  Star,
  CreditCard,
  Zap,
  Shield,
  Users,
  Crown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { plans } = useSelector((state: RootState) => state.subscription);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    if (plan.price === 0) {
      toast.success("You are already on the Free plan!");
      return;
    }

    // Navigate to payment page with plan ID
    router.push(`/payment?plan=${planId}`);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return Trophy;
      case "pro":
        return Zap;
      case "elite":
        return Crown;
      default:
        return Star;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return "from-gray-500 to-gray-600";
      case "pro":
        return "from-blue-500 to-blue-600";
      case "elite":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Subscription Plans
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the power of AI-driven cricket predictions and build winning
            Dream11 teams
          </p>
        </div>

        {/* Current Plan Info */}
        {isAuthenticated && user && (
          <div className="max-w-md mx-auto mb-12">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                <p className="text-2xl font-bold">{user.subscriptionPlan}</p>
                <p className="text-green-100 text-sm">
                  {user.credits} Credits Available
                </p>
                {user.subscriptionExpiry && (
                  <p className="text-green-100 text-sm">
                    Expires:{" "}
                    {new Date(user.subscriptionExpiry).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.name);
            const colorClass = getPlanColor(plan.name);
            const isCurrentPlan = user?.subscriptionPlan === plan.name;

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? "ring-2 ring-blue-500 shadow-2xl scale-105"
                    : "shadow-xl"
                } border-0 overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className={`h-2 bg-gradient-to-r ${colorClass}`}></div>

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600">
                      {plan.credits}
                    </div>
                    <div className="text-gray-600">
                      Credits {plan.price === 0 ? "Daily" : "Monthly"}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading === plan.id || isCurrentPlan}
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : isCurrentPlan
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    } ${isCurrentPlan ? "cursor-not-allowed" : ""}`}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.price === 0 ? (
                      "Get Started"
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-900">
                Why Choose SportPredict?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    AI-Powered
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Advanced algorithms for accurate predictions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                  <p className="text-gray-600 text-sm">
                    Bank-grade security for all transactions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Community
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Join 50K+ successful fantasy players
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Proven Results
                  </h3>
                  <p className="text-gray-600 text-sm">
                    95%+ prediction accuracy rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  How do credits work?
                </h3>
                <p className="text-gray-600">
                  Each match prediction and Dream11 team suggestion costs 1
                  credit. Free users get 2 daily credits, while paid plans offer
                  monthly credit allowances.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel anytime. Your subscription will remain
                  active until the end of the current billing period.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit/debit cards, UPI, net banking, and
                  digital wallets for secure payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
