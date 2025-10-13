/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateCredits, updateSubscription } from "@/store/slices/authSlice";
import { addOrder } from "@/store/slices/subscriptionSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Copy,
  CreditCard,
  Smartphone,
  Building,
  QrCode,
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { UserOrderCredit } from "../MainService";
import CustomLoader from "@/components/ui/CustomLoader";

const PaymentPage = () => {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { plans } = useSelector((state: RootState) => state.subscription);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState("");

  // Get plan details from URL params
  // const planId = searchParams.get("plan");
  const selectedPlan = plans;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (!selectedPlan) {
      router.push("/subscription");
      return;
    }
  }, [isAuthenticated, selectedPlan, router]);

  // Payment details
  const paymentDetails: any = {
    upi: {
      id: "7003031039@okbizaxis",
      upi: "7003031039@okbizaxis",
      name: "YADAV STORE",
      note: "SportPredict Subscription Payment",
    },
    bank: {
      bankName: "State Bank Of India",
      accountNumber: "33390254386",
      ifscCode: "SBIN0001648",
      accountHolder: "SAJJAN KUMAR YADAV",
      branch: "Rashbehari Branch",
    },
    qrCode: {
      url: "https://res.cloudinary.com/dzezstvvt/image/upload/v1760339025/QR_CROP_kntyy6.png",
      name: "YADAV STORE",
      upiId: "7003031039@okbizaxis",
    },
    // Placeholder QR code
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(""), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!transactionId.trim()) {
      toast.error("Please enter transaction ID");
      return;
    }

    if (!selectedPlan) {
      toast.error("Invalid plan selected");
      return;
    }

    let payload = {
      ordertype: "subscription",
      price: selectedPlan.price,
      userId: user!.id,
      subscriptionId: selectedPlan._id,
      subscriptionExpired: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days from now
      ),
      credits: selectedPlan.credits,
      status: "pending",
      paymentMode: selectedPaymentMethod.toUpperCase(),
      paymentDate: new Date(),
      paymentId: transactionId.trim(),
      paymentModeDetails:
        paymentDetails[
          selectedPaymentMethod === "UPI"
            ? "upi"
            : selectedPaymentMethod === "NETBANKING"
            ? "bank"
            : "qrCode"
        ],
    };

    UserOrderCredit(payload)
      .then((res) => {
        setIsLoading(false);
        toast.success("Payment submitted successfully!");
        router.push("/dashboard");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(
          error.message || "Failed to submit payment. Please try again."
        );
      });
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <CustomLoader message="Processing payment..." />}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subscription
            </Button>

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Your Payment
              </h1>
              <p className="text-xl text-gray-600">
                Choose your preferred payment method to activate your
                subscription
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Methods */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span>Select Payment Method</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger
                          value="UPI"
                          className="flex items-center space-x-2"
                        >
                          <Smartphone className="h-4 w-4" />
                          <span>UPI</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="NETBANKING"
                          className="flex items-center space-x-2"
                        >
                          <Building className="h-4 w-4" />
                          <span>Bank Transfer</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="QRCODE"
                          className="flex items-center space-x-2"
                        >
                          <QrCode className="h-4 w-4" />
                          <span>QR Code</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* UPI Payment */}
                      <TabsContent value="UPI" className="space-y-6 mt-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                            UPI Payment Details
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                              <div>
                                <Label className="text-sm text-gray-600">
                                  UPI ID
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                  {paymentDetails.upi.id}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCopy(paymentDetails.upi.id, "upi")
                                }
                                className={
                                  copied === "upi"
                                    ? "bg-green-100 text-green-700"
                                    : ""
                                }
                              >
                                {copied === "upi" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="p-3 bg-white rounded-lg">
                              <Label className="text-sm text-gray-600">
                                Payee Name
                              </Label>
                              <p className="font-semibold">
                                {paymentDetails.upi.name}
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg">
                              <Label className="text-sm text-gray-600">
                                Amount
                              </Label>
                              <p className="font-semibold text-xl text-green-600">
                                ₹{selectedPlan.price}
                              </p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="flex items-start space-x-2">
                                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Please add "
                                    {paymentDetails.upi.note}" in the payment
                                    description
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Bank Transfer */}
                      <TabsContent
                        value="NETBANKING"
                        className="space-y-6 mt-6"
                      >
                        <div className="bg-green-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <Building className="h-5 w-5 mr-2 text-green-600" />
                            Bank Transfer Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-lg">
                              <Label className="text-sm text-gray-600">
                                Bank Name
                              </Label>
                              <p className="font-semibold">
                                {paymentDetails.bank.bankName}
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg">
                              <Label className="text-sm text-gray-600">
                                Branch
                              </Label>
                              <p className="font-semibold">
                                {paymentDetails.bank.branch}
                              </p>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                              <div>
                                <Label className="text-sm text-gray-600">
                                  Account Number
                                </Label>
                                <p className="font-mono font-semibold">
                                  {paymentDetails.bank.accountNumber}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCopy(
                                    paymentDetails.bank.accountNumber,
                                    "account"
                                  )
                                }
                                className={
                                  copied === "account"
                                    ? "bg-green-100 text-green-700"
                                    : ""
                                }
                              >
                                {copied === "account" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                              <div>
                                <Label className="text-sm text-gray-600">
                                  IFSC Code
                                </Label>
                                <p className="font-mono font-semibold">
                                  {paymentDetails.bank.ifscCode}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCopy(
                                    paymentDetails.bank.ifscCode,
                                    "ifsc"
                                  )
                                }
                                className={
                                  copied === "ifsc"
                                    ? "bg-green-100 text-green-700"
                                    : ""
                                }
                              >
                                {copied === "ifsc" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="md:col-span-2 p-3 bg-white rounded-lg">
                              <Label className="text-sm text-gray-600">
                                Account Holder Name
                              </Label>
                              <p className="font-semibold">
                                {paymentDetails.bank.accountHolder}
                              </p>
                            </div>
                            <div className="md:col-span-2 p-3 bg-white rounded-lg">
                              <Label className="text-sm text-gray-600">
                                Transfer Amount
                              </Label>
                              <p className="font-semibold text-xl text-green-600">
                                ₹{selectedPlan.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* QR Code Payment */}
                      <TabsContent value="QRCODE" className="space-y-6 mt-6">
                        <div className="bg-purple-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <QrCode className="h-5 w-5 mr-2 text-purple-600" />
                            Scan QR Code to Pay
                          </h3>
                          <div className="text-center">
                            <div className="inline-block p-4 bg-white rounded-lg shadow-md mb-4">
                              <div className="w-68 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                <img
                                  src={paymentDetails.qrCode.url}
                                  alt="demo@ybl"
                                  className="w-44 h-44 object-contain"
                                />
                              </div>
                              {/* Name & UPI ID below QR */}
                              <div className="mt-2">
                                <p className="font-semibold text-gray-800">
                                  {paymentDetails.qrCode.name}
                                </p>
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                  <p className="text-sm text-gray-600 mr-4">
                                    UPI ID: {paymentDetails.qrCode.upiId}
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleCopy(
                                        paymentDetails.qrCode.upiId,
                                        "qrCode"
                                      )
                                    }
                                    className={
                                      copied === "qrCode"
                                        ? "bg-green-100 text-green-700"
                                        : ""
                                    }
                                  >
                                    {copied === "qrCode" ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">
                              Scan this QR code with any UPI app
                            </p>
                            <p className="font-semibold text-xl text-purple-600">
                              Amount: ₹{selectedPlan.price}
                            </p>
                            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                              <p className="text-sm text-purple-800">
                                <strong>Supported Apps:</strong> PhonePe, Google
                                Pay, Paytm, BHIM, Amazon Pay
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Transaction ID Input */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">
                          Payment Confirmation
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="transactionId">
                              Transaction ID / Reference Number *
                            </Label>
                            <Input
                              id="transactionId"
                              type="text"
                              placeholder="Enter transaction ID from your payment app"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className="mt-1"
                              required
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Enter the transaction ID you received after making
                              the payment
                            </p>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <div>
                                <p className="text-sm text-yellow-800">
                                  <strong>Important:</strong> Your subscription
                                  will be activated within 24 hours after
                                  payment verification. You will receive a
                                  confirmation email once activated.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                        disabled={isLoading || !transactionId.trim()}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting Payment...</span>
                          </div>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Submit Payment Details
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedPlan.name} Plan
                      </h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        ₹{selectedPlan.price}
                      </p>
                      <p className="text-gray-600">per month</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-semibold">
                          {selectedPlan.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credits:</span>
                        <span className="font-semibold">
                          {selectedPlan.credits} monthly
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold">1 Month</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-blue-600">
                            ₹{selectedPlan.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Plan Features:</h4>
                      <ul className="space-y-2">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <Card className="shadow-lg border-0 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="h-6 w-6 text-green-600" />
                      <h3 className="font-semibold text-green-900">
                        Secure Payment
                      </h3>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Bank-grade security</li>
                      <li>• 256-bit SSL encryption</li>
                      <li>• PCI DSS compliant</li>
                      <li>• 24/7 fraud monitoring</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Contact our support team if you face any issues
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/support">Contact Support</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
