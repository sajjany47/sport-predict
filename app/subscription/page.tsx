"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, CreditCard, Zap, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { SubscriptionList } from "../MainService";
import CustomLoader from "@/components/ui/CustomLoader";

const SubscriptionPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: subscriptionPlans = [], isLoading } = useQuery({
    queryKey: ["subscription-list"],
    queryFn: async () => {
      const response = await SubscriptionList();
      return response.data; // extract only the array part
    },
  });

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const plan = subscriptionPlans.find((p: any) => p._id === planId);
    if (!plan) return;

    if (plan.price === 0) {
      toast.success("You are already on the Free plan!");
      return;
    }

    // Navigate to payment page with plan ID
    router.push(`/payment?plan=${planId}`);
  };

  const currentPlan = subscriptionPlans.find(
    (item: any) => item._id === user?.subscriptionPlan
  );

  return (
    <>
      {isLoading && <CustomLoader message="Subscription plan loading....." />}
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
              Unlock the power of AI-driven cricket predictions and build
              winning Dream11 teams
            </p>
          </div>

          {/* Current Plan Info */}
          {currentPlan && user && (
            <div className="max-w-md mx-auto mb-12">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                  <p className="text-2xl font-bold">{currentPlan.name}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan: any, index: any) => {
              const isCurrentPlan = user?.subscriptionPlan === plan._id;

              return (
                <Card
                  key={index}
                  className={`relative ${
                    plan.popular
                      ? "ring-2 ring-blue-600 shadow-xl scale-105"
                      : "shadow-lg"
                  } ${
                    isCurrentPlan ? "ring-2 ring-green-500" : ""
                  } border-0 transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4 transform">
                      <Badge className="bg-green-500">Current Plan</Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-blue-600">
                        ₹{plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600">/month</span>
                      )}
                    </div>
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-gray-900">
                        {plan.credits}
                      </div>
                      <div className="text-gray-600">
                        Credits {plan.price === 0 ? "Daily" : "Monthly"}
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature: any, featureIndex: any) => (
                        <li
                          key={featureIndex}
                          className="flex items-center justify-center text-gray-600"
                        >
                          <Trophy className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            : "bg-gray-900 hover:bg-gray-800"
                        }`}
                        onClick={() => handleSubscribe(plan._id)}
                      >
                        {plan.price === 0 ? "Get Started" : "Upgrade Plan"}
                      </Button>
                    )}
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
                    credit. Free users get 2 daily credits, while paid plans
                    offer monthly credit allowances.
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
                    We accept all major credit/debit cards, UPI, net banking,
                    and digital wallets for secure payments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
