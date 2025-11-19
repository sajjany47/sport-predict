"use client";
import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Clock, Lock, LockKeyhole } from "lucide-react";
import { FormikTextPassword } from "@/components/CustomField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { UserResetPassword } from "../MainService";
import toast from "react-hot-toast";
import { RootState } from "@/store";

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Password is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const ResetPassword = ({
  modalOpen,
  onClose,
  username,
}: {
  modalOpen: boolean;
  onClose: any;
  username: string;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleRegister = (values: any) => {
    setLoading(true);
    UserResetPassword({
      userId: username,
      type: "reset-password",
      password: values.password,
      oldPassword: values.oldPassword,
    })
      .then((res) => {
        toast.success(res.message);
        setLoading(false);
        dispatch(logout());
        router.push("/matches");
      })
      .catch((err) => {
        toast.error(err.message || "Failed update details. Please try again.");
        setLoading(false);
      });
  };
  return (
    <>
      <Dialog open={modalOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
              oldPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <Field
                      label="Old Password"
                      component={FormikTextPassword}
                      name="oldPassword"
                      icon={
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                    <Button className="w-full" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <LockKeyhole className="mr-2 h-4 w-4" />
                          Reset Password
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResetPassword;
