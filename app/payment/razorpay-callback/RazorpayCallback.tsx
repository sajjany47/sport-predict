"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { loginSuccess } from "@/store/slices/authSlice";

type PaymentState = {
  status: "loading" | "success" | "failed";
  message: string;
  credits?: number;
  orderNumber?: string;
  amount?: number;
  planName?: string;
};

export default function RazorpayCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const verifiedRef = useRef(false);

  const [payment, setPayment] = useState<PaymentState>({
    status: "loading",
    message: "Verifying your payment…",
  });

  useEffect(() => {
    const token = searchParams.get("result");
    if (!token) {
      setPayment({
        status: "failed",
        message: "No payment result was returned. Please try again.",
      });
      return;
    }

    if (verifiedRef.current) return;
    verifiedRef.current = true;

    axios
      .post("/api/external-payment/verify", { result: token })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          if (!data.alreadyProcessed && user) {
            dispatch(
              loginSuccess({
                ...user,
                credits: (user.credits ?? 0) + Number(data.credits ?? 0),
              }),
            );
          }
          setPayment({
            status: "success",
            message: data.alreadyProcessed
              ? "This payment was already credited to your account."
              : "Payment verified! Your credits have been added.",
            credits: data.credits,
            orderNumber: data.orderNumber,
            amount: data.amount,
            planName: data.planName,
          });
        } else {
          setPayment({
            status: "failed",
            message: data.message || "Payment verification failed.",
            orderNumber: data.orderNumber,
            amount: data.amount,
          });
        }
      })
      .catch((error) => {
        setPayment({
          status: "failed",
          message:
            error.response?.data?.message ||
            "We could not verify your payment. Please contact support if you were charged.",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = payment.status === "loading";
  const isSuccess = payment.status === "success";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div
            className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isLoading
                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                : isSuccess
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-rose-500 to-red-600"
            }`}
          >
            {isLoading ? (
              <ShieldCheck className="h-10 w-10 text-white" />
            ) : isSuccess ? (
              <CheckCircle2 className="h-10 w-10 text-white" />
            ) : (
              <XCircle className="h-10 w-10 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLoading
              ? "Verifying Payment"
              : isSuccess
                ? "Payment Successful"
                : "Payment Not Completed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            {isLoading ? (
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-3" />
            ) : null}
            <p className="text-gray-600">{payment.message}</p>
          </div>

          {!isLoading && (payment.planName || payment.orderNumber) && (
            <div className="grid grid-cols-2 gap-3">
              {payment.planName ? (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Package</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {payment.planName}
                  </p>
                </div>
              ) : null}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Credits Added</p>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-gray-900">
                    +{payment.credits ?? 0}
                  </span>
                </div>
              </div>
              {payment.amount !== undefined ? (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <span className="font-bold text-gray-900">
                    ₹{Number(payment.amount).toFixed(2)}
                  </span>
                </div>
              ) : null}
              {payment.orderNumber ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Order</p>
                  <p className="text-xs font-mono text-gray-700 truncate">
                    {payment.orderNumber}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {!isLoading ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                onClick={() => router.push("/matches")}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Start analyzing
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/subscription")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isSuccess ? "Buy more credits" : "Try again"}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
