"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Trophy,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";
import { loginSuccess } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  FormikCheckBox,
  FormikTextInput,
  FormikTextPassword,
} from "@/components/CustomField";
import { UserRegister } from "@/app/MainService";
import CustomLoader from "@/components/ui/CustomLoader";

const validationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),

  name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Invalid email address"),

  mobileNumber: Yup.string()
    .trim()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),

  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegister = (e: any) => {
    setIsLoading(true);
    const formData = {
      username: e.username.trim(),
      name: e.name.trim(),
      email: e.email.trim().toLowerCase(),
      mobileNumber: e.mobileNumber.trim(),
      password: e.password,
      agreeToTerms: e.agreeToTerms,
    };

    UserRegister(formData)
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
        sessionStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(userData));
        setIsLoading(false);
        toast.success("Account created successfully!");
        router.push("/dashboard");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message || "Registration failed. Please try again.");
      });
  };

  return (
    <>
      {isLoading && <CustomLoader message="Creating account..." />}
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>
        </div>

        <div className="w-full max-w-md z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-2 mb-4 relative">
              <div className="absolute -inset-2 bg-blue-500/20 rounded-xl blur-sm"></div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl relative">
                <Trophy className="h-8 w-8 text-white" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-md">
                SportPredict
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join Winners Circle
            </h1>
            <p className="text-purple-200">
              Create your account and start predicting like a pro
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-500">
                Join thousands of cricket prediction winners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  username: "",
                  name: "",
                  email: "",
                  mobileNumber: "",
                  password: "",
                  confirmPassword: "",
                  agreeToTerms: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12">
                        <Field
                          label="Username"
                          component={FormikTextInput}
                          name="username"
                          icon={
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12">
                        <Field
                          label="Full Name"
                          component={FormikTextInput}
                          name="name"
                          icon={
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12">
                        <Field
                          label="Email Address"
                          component={FormikTextInput}
                          name="email"
                          icon={
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12">
                        <Field
                          label="Mobile Number"
                          component={FormikTextInput}
                          name="mobileNumber"
                          icon={
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12">
                        <Field
                          label="Password"
                          component={FormikTextPassword}
                          name="password"
                          icon={
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12">
                        <Field
                          label="Confirm Password"
                          component={FormikTextPassword}
                          name="confirmPassword"
                          icon={
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12">
                        <Field
                          label={
                            <span className="text-sm">
                              I agree to the{" "}
                              <Link
                                href="/terms"
                                className="text-blue-600 hover:underline font-medium"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="/privacy"
                                className="text-blue-600 hover:underline font-medium"
                              >
                                Privacy Policy
                              </Link>
                            </span>
                          }
                          component={FormikCheckBox}
                          name="agreeToTerms"
                          containerClass="mb-6"
                        />
                      </div>

                      <div className="col-span-12">
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating Account...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Check className="h-5 w-5 mr-2" />
                              Create Account
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Already a member?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign In to Your Account
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-purple-200 text-sm">
              By registering, you agree to our{" "}
              <Link href="/terms" className="text-white hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-white hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
