/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DailyCreditAd } from "@/components/GetDailyCredit";
import { UserOrderCredit } from "../MainService";
import { loginSuccess } from "@/store/slices/authSlice";

const SubscriptionPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [dailyCredit, setDailyCredit] = useState(false);
  const [dailyCreditRes, setDailyCreditRes] = useState<any>({
    message: "",
    isSuccess: null,
  });
  const [loading, setLoading] = useState(false);

  const staticPlans = [
    {
      id: "starter",
      name: "Starter Pack",
      tokens: 1,
      price: 49,
      description: "Perfect for a single winning prediction",
      features: ["1 AI Match Prediction", "Standard Support", "Instant Access"],
      color: "from-blue-400 to-blue-600",
      borderColor: "border-blue-100",
      bgColor: "bg-white",
      popular: false,
    },
    {
      id: "standard",
      name: "Standard Pack",
      tokens: 5,
      price: 199,
      description: "Best for regular weekend matches",
      features: ["5 AI Match Predictions", "Priority Support", "Lifetime Validity", "Save ₹46"],
      color: "from-purple-500 to-purple-700",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50/30",
      popular: true,
      savings: "Save ₹46",
    },
    {
      id: "premium",
      name: "Premium Pack",
      tokens: 15,
      price: 599,
      description: "For the ultimate fantasy player",
      features: ["15 AI Match Predictions", "VIP Support", "Lifetime Validity", "Save ₹136"],
      color: "from-amber-400 to-amber-600",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50/30",
      popular: false,
      savings: "Save ₹136",
    }
  ];

  const handleWhatsAppPayment = (plan: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      router.push("/auth/login");
      return;
    }

    const whatsappNumber = "918981374643";
    const message = `Hello! I would like to purchase the *${plan.name}* (${plan.tokens} Tokens) for *₹${plan.price}*.

*My Details:*
- Name: ${user?.username || 'N/A'}
- Email: ${user?.email || 'N/A'}
- User ID: ${user?.id || 'N/A'}

I am sending this message to confirm my payment. Please add the tokens to my account.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const handleFreeToken = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setDailyCredit(true);
  };

  const handleCreditAdd = () => {
    let payload = {
      ordertype: "credit",
      userId: user!.id,
      credits: 1,
      status: "completed",
      paymentMode: "PROMOTION",
      paymentDate: new Date(),
    };

    UserOrderCredit(payload)
      .then((res) => {
        const prepareUser: any = user
          ? { ...user, credits: user.credits + 1 }
          : null;

        setDailyCreditRes({ message: res.message, isSuccess: true });
        dispatch(loginSuccess({ ...prepareUser }));
        toast.success("Token added successfully!");
      })
      .catch((error) => {
        setDailyCreditRes({ message: error.message, isSuccess: false });
        toast.error(error.message || "Failed to add token");
      });
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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-display">
              Elevate Your Game
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Choose your token package and get instant access to premium AI predictions. 
              Payments are handled securely via WhatsApp.
            </p>

            {/* Current Token Balance */}
            {user && (
              <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-white">
                <div className="flex items-center space-x-2">
                  <Coins className="h-6 w-6 text-yellow-500 animate-pulse" />
                  <span className="text-lg font-bold text-gray-900">
                    {user.credits || 0} Tokens Available
                  </span>
                </div>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="text-sm font-medium text-blue-600">
                  1 token = 1 premium prediction
                </div>
              </div>
            )}
          </div>

          {/* Token Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {staticPlans.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                  pkg.bgColor
                } border-2 ${pkg.borderColor} overflow-hidden ${
                  pkg.popular ? "ring-2 ring-blue-500 shadow-2xl scale-105 z-10" : "shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                )}
                
                {pkg.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 py-1.5 px-3 shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Best Value
                    </Badge>
                  </div>
                )}

                {pkg.savings && !pkg.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white border-0 py-1 px-2.5">
                      {pkg.savings}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8 text-center">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${pkg.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:rotate-6 transition-transform duration-500`}
                  >
                    {pkg.tokens === 1 ? <Zap className="h-10 w-10 text-white" /> : 
                     pkg.tokens <= 5 ? <Coins className="h-10 w-10 text-white" /> : 
                     <Crown className="h-10 w-10 text-white" />}
                  </div>

                  {/* Package Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {pkg.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-6 min-h-[40px]">
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors duration-300">
                    <div className="flex items-center justify-center baseline">
                        <span className="text-4xl font-black text-gray-900">₹{pkg.price}</span>
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mt-1 uppercase tracking-wider">
                      {pkg.tokens} Predicted Match{pkg.tokens > 1 ? 'es' : ''}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 text-left max-w-[200px] mx-auto">
                    {pkg.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-600 group-hover:text-gray-900 transition-colors"
                      >
                        <div className="mt-1 mr-3 p-0.5 bg-green-100 rounded-full">
                          <Zap className="h-3 w-3 text-green-600 fill-current" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Button
                    className={`w-full h-14 text-lg font-bold gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                      pkg.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gray-900 hover:bg-black"
                    } text-white`}
                    onClick={() => handleWhatsAppPayment(pkg)}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Pay via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Free Credit Action Card */}
          <div className="max-w-4xl mx-auto mb-20">
             <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 border-2 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="h-24 w-24 text-green-600" />
                </div>
                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Need a trial token?</h2>
                        <p className="text-gray-600 text-lg">Watch a short advertisement and get 1 free prediction token every day!</p>
                    </div>
                    <Button 
                        size="lg" 
                        variant="default" 
                        className="bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-8 min-w-[200px] shadow-xl hover:shadow-green-200 transition-all rounded-xl"
                        onClick={handleFreeToken}
                    >
                        <Play className="h-5 w-5 mr-3 fill-current" />
                        Get Free Token
                    </Button>
                </CardContent>
             </Card>
          </div>

          {/* Features Comparison */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choice Our AI Predictions?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-3xl bg-white shadow-lg border border-gray-100 hover:border-blue-200 transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">92% Win Rate</h3>
                <p className="text-sm text-gray-500">Consistently high accuracy across all cricket formats.</p>
              </div>
              <div className="text-center p-6 rounded-3xl bg-white shadow-lg border border-gray-100 hover:border-green-200 transition-all">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Real-time Data</h3>
                <p className="text-sm text-gray-500">Analysis based on latest player form and pitch status.</p>
              </div>
              <div className="text-center p-6 rounded-3xl bg-white shadow-lg border border-gray-100 hover:border-purple-200 transition-all">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">100% Secure</h3>
                <p className="text-sm text-gray-500">Manual verification ensures your tokens are safe.</p>
              </div>
              <div className="text-center p-6 rounded-3xl bg-white shadow-lg border border-gray-100 hover:border-orange-200 transition-all">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Expert Team</h3>
                <p className="text-sm text-gray-500">Backed by cricket analysts and AI developers.</p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="max-w-3xl mx-auto text-center p-12 rounded-[2.5rem] bg-gray-900 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">How to Buy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                    <div className="text-blue-400 font-black text-4xl mb-2">01.</div>
                    <h4 className="font-bold mb-1">Select Plan</h4>
                    <p className="text-gray-400 text-sm">Choose the token pack that fits your needs.</p>
                </div>
                <div>
                    <div className="text-blue-400 font-black text-4xl mb-2">02.</div>
                    <h4 className="font-bold mb-1">WhatsApp Us</h4>
                    <p className="text-gray-400 text-sm">Follow the link to our official WhatsApp.</p>
                </div>
                <div>
                    <div className="text-blue-400 font-black text-4xl mb-2">03.</div>
                    <h4 className="font-bold mb-1">Send Proof</h4>
                    <p className="text-gray-400 text-sm">Pay via UPI/QR and send the screenshot.</p>
                </div>
            </div>
            <div className="mt-10 pt-10 border-t border-gray-800">
                <p className="text-gray-400 italic">Tokens will be added to your account within 10-15 minutes of verification.</p>
            </div>
          </div>
        </div>
      </div>
      
      {dailyCredit && (
        <DailyCreditAd
          isOpen={dailyCredit}
          onClose={() => setDailyCredit(false)}
          onCreditAdd={handleCreditAdd}
          dailyCreditRes={dailyCreditRes}
        />
      )}
    </>
  );
};

export default SubscriptionPage;
