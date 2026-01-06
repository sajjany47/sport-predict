"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Loader2,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Coins,
  Calendar,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserOrderCredit } from "@/app/MainService";
import { loginSuccess } from "@/store/slices/authSlice";
import { setOrderHistory, setPlans } from "@/store/slices/subscriptionSlice";

export default function PaymentCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orderHistory, plans } = useSelector(
    (state: RootState) => state.subscription
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [paymentStatus, setPaymentStatus] = useState<{
    isVerified: boolean | null;
    message: string;
  }>({
    isVerified: null,
    message: "Verifying your payment...",
  });

  const [showResult, setShowResult] = useState(false);

  // Get transaction details from Redux store
  const transactionId = orderHistory?.order_id || "N/A";
  const amount = orderHistory?.order_amount || "N/A";
  const tokens = plans?.credits || "N/A";
  const packageName = plans?.name || "N/A";

  useEffect(() => {
    const orderId = orderHistory?.order_id;

    if (!orderId) {
      setPaymentStatus({
        isVerified: false,
        message: "No order information found. Please try your payment again.",
      });
      setShowResult(true);
      return;
    }
    Promise.all([userPaymentUpadte(), verifyPayment(orderId)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderHistory?.order_id]);

  const userPaymentUpadte = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
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
        dispatch(setPlans(null));
        dispatch(setOrderHistory(null));
      })
      .catch((error) => {
        setPaymentStatus({
          isVerified: false,
          message: "Payment verification failed. Please try again.",
        });
        setShowResult(true);
        // toast.error(error.message || "Error submit order. Please try again.");
      });
  };

  const verifyPayment = async (orderId: string) => {
    const res = await axios.get(`/api/payment-verify?order_id=${orderId}`);

    if (res.data.status === "SUCCESS") {
      const prepareUser: any = user
        ? { ...user, credits: user.credits + (plans?.credits || 0) }
        : null;

      dispatch(loginSuccess({ ...prepareUser }));
      setPaymentStatus({
        isVerified: true,
        message:
          "Payment verified successfully! Your tokens have been added to your account.",
      });
      setShowResult(true);
    } else {
      setPaymentStatus({
        isVerified: false,
        message: "Payment verification failed. Please try again.",
      });
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    router.push("/subscription");
  };

  const handleGoToMatches = () => {
    router.push("/matches");
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  // Loading state
  if (!showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verifying Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 mb-2 text-lg">
                {paymentStatus.message}
              </p>

              {transactionId !== "N/A" && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-mono text-gray-700 truncate">
                    {transactionId}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Processing Payment</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transaction Details Card Component (used in both success and failed states)
  const TransactionDetailsCard = ({
    status,
  }: {
    status: "success" | "failed";
  }) => (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Coins className="h-6 w-6 text-yellow-500" />
          <span>Transaction Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package Info */}
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-gray-700 font-medium">Package:</span>
          <Badge
            className={`${
              status === "success"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {packageName}
          </Badge>
        </div>

        {/* Tokens Added */}
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-gray-700 font-medium">Tokens Added:</span>
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-gray-900">+{tokens}</span>
          </div>
        </div>

        {/* Amount Paid */}
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-gray-700 font-medium">Amount Paid:</span>
          <span className="font-bold text-gray-900">₹{amount}</span>
        </div>

        {/* Transaction ID */}
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-medium">Transaction ID:</span>
          <span className="font-mono text-sm text-gray-600 truncate max-w-[150px]">
            {transactionId}
          </span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
          <span className="text-gray-700 font-medium">Status:</span>
          <Badge
            className={`${
              status === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } flex items-center space-x-1`}
          >
            {status === "success" ? (
              <>
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                <span>Failed</span>
              </>
            )}
          </Badge>
        </div>

        {/* Date & Time */}
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
  );

  // Success Result
  if (paymentStatus.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Success Icon */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">{paymentStatus.message}</p>
          </div>

          {/* Transaction Details Card */}
          <TransactionDetailsCard status="success" />

          {/* Action Buttons */}
          <Card className="shadow-lg border-0 bg-blue-50/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={handleGoToMatches}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Matches
              </Button>

              <Button
                onClick={handleGoToHome}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href={`mailto:${
                  process.env.NEXT_PUBLIC_EMAIL || "sportpredict247@gmail.com"
                }`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failed Result
  if (paymentStatus.isVerified === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Failure Icon */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <XCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600">{paymentStatus.message}</p>
          </div>

          {/* Transaction Details Card */}
          <TransactionDetailsCard status="failed" />

          {/* Action Buttons */}
          <Card className="shadow-lg border-0 bg-yellow-50/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-gray-600 mb-2 text-center">
                No charges were made to your account. You can try the payment
                again.
              </p>

              <Button
                onClick={handleTryAgain}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                Try Payment Again
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleGoToMatches}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  Back to Matches
                </Button>

                <Button
                  onClick={handleGoToHome}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              If you were charged but received this error, please contact
              support with your transaction ID.
              <br />
              <a
                href={`mailto:${
                  process.env.NEXT_PUBLIC_EMAIL || "sportpredict247@gmail.com"
                }`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {process.env.NEXT_PUBLIC_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
