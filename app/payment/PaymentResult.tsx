/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Coins,
  ExternalLink,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Mail,
  Home,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { setOrderHistory, setPlans } from "@/store/slices/subscriptionSlice";
import { UserOrderCredit } from "@/app/MainService";

interface PaymentResultProps {
  isPayemntVerified: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

const PaymentResult = ({
  isPayemntVerified,
  errorMessage,
  onRetry,
}: PaymentResultProps) => {
  const dispatch = useDispatch();
  const { orderHistory, plans } = useSelector(
    (state: RootState) => state.subscription
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(true);

  // Get transaction details
  const transactionId = orderHistory?.order_id || "N/A";
  const amount = orderHistory?.order_amount || "N/A";
  const tokens = plans?.credits || "N/A";
  const packageName = plans?.name || "N/A";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isPayemntVerified) {
      // Only process successful payments
      let payload = {
        ordertype: "purchase",
        userId: user!.id,
        credits: plans?.credits || 0,
        status: "completed",
        price: Number(orderHistory?.order_amount) || 0,
        paymentIntentId: orderHistory?.order_id,
      };

      UserOrderCredit(payload)
        .then((res) => {
          const prepareUser: any = user
            ? { ...user, credits: user.credits + (plans?.credits || 0) }
            : null;

          dispatch(loginSuccess({ ...prepareUser }));
          dispatch(setPlans(null));
          dispatch(setOrderHistory(null));
        })
        .catch((error) => {
          toast.error(
            error.message || "Error submitting order. Please try again."
          );
        });
    } else {
      // For failed payments, clear the stored plans and order history
      dispatch(setPlans(null));
      dispatch(setOrderHistory(null));
    }

    // Countdown timer for automatic redirect
    if (isRedirecting) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPayemntVerified, isRedirecting]);

  const handleRedirect = () => {
    setIsRedirecting(false);
    router.push("/matches");
  };

  const handleRetryPayment = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.push("/subscription");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleBackToMatches = () => {
    router.push("/matches");
  };

  // SUCCESS PAGE
  if (isPayemntVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 animate-fade-in">
          {/* Success Icon */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Your tokens have been added to your account
            </p>
          </div>

          {/* Transaction Details Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Coins className="h-6 w-6 text-yellow-500" />
                <span>Transaction Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Package:</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {packageName}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Tokens Added:</span>
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-gray-900">+{tokens}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">Amount Paid:</span>
                <span className="font-bold text-gray-900">₹{amount}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Transaction ID:
                </span>
                <span className="font-mono text-sm text-gray-600 truncate max-w-[150px]">
                  {transactionId}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-700 font-medium">Status:</span>
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Completed</span>
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-medium">Date & Time:</span>
                <span className="text-sm text-gray-600">
                  {orderHistory?.created_at
                    ? new Date(orderHistory.created_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Countdown & Redirect Info */}
          <Card className="shadow-lg border-0 bg-blue-50/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Redirecting to matches in {countdown} second
                  {countdown !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                You will be automatically redirected to start using your tokens
              </p>

              <Button
                onClick={handleRedirect}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Matches Now
              </Button>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="mailto:sportpredict247@gmail.com"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // FAILED PAYMENT PAGE
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* Failure Icon */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <XCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <span>Transaction Failed</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Payment Verification Failed
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {errorMessage ||
                      "Your payment could not be verified. No charges were made to your account."}
                  </p>
                </div>
              </div>
            </div>

            {transactionId !== "N/A" && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Transaction ID:
                </span>
                <span className="font-mono text-sm text-gray-600 truncate max-w-[150px]">
                  {transactionId}
                </span>
              </div>
            )}

            {amount !== "N/A" && (
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-medium">Amount:</span>
                <span className="font-bold text-gray-900">₹{amount}</span>
              </div>
            )}

            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700 font-medium">Status:</span>
              <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center space-x-1">
                <XCircle className="h-3 w-3" />
                <span>Failed</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isRedirecting && (
            <Card className="shadow-lg border-0 bg-yellow-50/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 font-medium">
                    Redirecting to matches in {countdown} second
                    {countdown !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleRetryPayment}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Payment
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleBackToMatches}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Matches
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>

        {/* Support Section */}
        <Card className="shadow-lg border-0 bg-gray-50/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                If you were charged but received this error, please contact
                support with your transaction ID.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a
                  href="mailto:sportpredict247@gmail.com"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  sportpredict247@gmail.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResult;
