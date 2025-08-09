/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { loginSuccess } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { FormikTextInput, FormikTextPassword } from "@/components/CustomField";
import { UserLogin } from "@/app/MainService";
import moment from "moment";
import CustomLoader from "@/components/ui/CustomLoader";

// ✅ Validation Schema
const loginValidationSchema = Yup.object({
  userId: Yup.string().required("User Id is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ Initial Values
  const initialValues = {
    userId: "",
    password: "",
  };

  const handleEmailLogin = (e: any) => {
    setIsLoading(true);
    UserLogin({ ...e })
      .then((res) => {
        const findSubscription = (res.data.user.subscription ?? []).find(
          (sub: any) => sub.isActive === true
        );
        const userData = {
          id: res.data.user._id,
          username: res.data.user.username,
          email: res.data.user.email,
          mobile: res.data.user.mobileNumber,
          credits: res.data.user.role === "admin" ? 999 : res.data.user.credits,
          subscriptionPlan: findSubscription.subscriptionId || null,
          subscriptionExpiry: findSubscription.expiryDate || null,
          role: res.data.user.role,
          isActive: res.data.user.isActive,
          token: res.data.token,
          subscription: res.data.user.subscription ?? [],
        };
        localStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(userData));
        setIsLoading(false);
        toast.success(" login successful!");
        router.back();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message || "Login failed. Please try again.");
      });
  };

  return (
    <>
      {isLoading && <CustomLoader message="Logging in..." />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                SportPredict
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your cricket predictions
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Login to Your Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={loginValidationSchema}
                onSubmit={handleEmailLogin}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label="UserName/Email/Mobile"
                          component={FormikTextInput}
                          name="userId"
                          icon={
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label="Password"
                          component={FormikTextPassword}
                          name="password"
                          icon={
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                        <div className="text-right">
                          <Link
                            href="/auth/forgot-password"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-12 lg:col-span-12 mt-2">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          Sign In
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
