"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Mail, Phone, Lock, Eye, EyeOff, User } from "lucide-react";
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
          (sub: any) => sub.isActive === true && sub.expiryDate > new Date()
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
              Create Account
            </h1>
            <p className="text-gray-600">
              Join thousands of cricket prediction winners
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Sign Up for SportPredict
              </CardTitle>
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
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label="Username"
                          component={FormikTextInput}
                          name="username"
                          icon={
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label="Name"
                          component={FormikTextInput}
                          name="name"
                          icon={
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label="Email"
                          component={FormikTextInput}
                          name="email"
                          icon={
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label="Mobile"
                          component={FormikTextInput}
                          name="mobileNumber"
                          icon={
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                      </div>
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label="Confirm Password"
                          component={FormikTextPassword}
                          name="confirmPassword"
                          icon={
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                      <div className="col-span-12 md:col-span-12 lg:col-span-12">
                        <Field
                          label={
                            <>
                              {" "}
                              <>
                                I agree to the{" "}
                                <Link
                                  href="/terms"
                                  className="text-blue-600 hover:underline"
                                >
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                  href="/privacy"
                                  className="text-blue-600 hover:underline"
                                >
                                  Privacy Policy
                                </Link>
                              </>
                            </>
                          }
                          component={FormikCheckBox}
                          name="agreeToTerms"
                        />
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
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign In
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

export default RegisterPage;
