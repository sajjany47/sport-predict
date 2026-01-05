"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentResult from "../PaymentResult";

export default function PaymentCallback() {
  const router = useRouter();
  const { orderHistory } = useSelector(
    (state: RootState) => state.subscription
  );

  const [paymentStatus, setPaymentStatus] = useState<{
    isVerified: boolean | null;
    message: string;
    error?: string;
  }>({
    isVerified: null,
    message: "Verifying your payment...",
  });

  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const orderId = orderHistory?.order_id;

    if (!orderId) {
      setPaymentStatus({
        isVerified: false,
        message: "No order information found",
        error: "Order ID is missing",
      });
      return;
    }

    verifyPayment(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderHistory?.order_id]);

  const verifyPayment = async (orderId: string) => {
    try {
      const res = await axios.get(`/api/payment-verify?order_id=${orderId}`);

      if (res.data.status === "SUCCESS") {
        setPaymentStatus({
          isVerified: true,
          message: "Payment verified successfully!",
        });
      } else {
        setPaymentStatus({
          isVerified: false,
          message: "Payment verification failed",
          error: res.data.message || "Payment was not successful",
        });
      }
    } catch (err: any) {
      console.error("Payment verification error:", err);

      // Handle retry logic
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        setPaymentStatus({
          isVerified: null,
          message: `Retrying verification (${retryCount + 1}/${maxRetries})...`,
        });

        // Retry after delay
        setTimeout(() => {
          verifyPayment(orderId);
        }, 2000);
      } else {
        setPaymentStatus({
          isVerified: false,
          message: "Payment verification failed",
          error:
            err.response?.data?.message ||
            err.message ||
            "Network error occurred",
        });
      }
    }
  };

  const handleRetry = () => {
    if (orderHistory?.order_id) {
      setRetryCount(0);
      setPaymentStatus({
        isVerified: null,
        message: "Verifying your payment...",
      });
      verifyPayment(orderHistory.order_id);
    } else {
      router.push("/subscription");
    }
  };

  const handleBackToSubscription = () => {
    router.push("/subscription");
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  // Loading state
  if (paymentStatus.isVerified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-white animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verifying Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 mb-2">{paymentStatus.message}</p>

              {retryCount > 0 && (
                <p className="text-sm text-orange-600">
                  Retry attempt {retryCount} of {maxRetries}
                </p>
              )}

              {orderHistory?.order_id && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-mono text-gray-700 truncate">
                    {orderHistory.order_id}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                  <span className="text-sm font-medium">Processing</span>
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleBackToSubscription}
                  className="w-full border-gray-300"
                  disabled
                >
                  Please wait while we verify your payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If verification is complete (success or failure), render the SuccessFailed component
  return (
    <PaymentResult
      isPayemntVerified={paymentStatus.isVerified}
      errorMessage={paymentStatus.error}
      onRetry={paymentStatus.isVerified === false ? handleRetry : undefined}
    />
  );
}
