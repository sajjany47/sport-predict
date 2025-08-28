/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { fetchUserDetails } from "../admin/AdminService";
import toast from "react-hot-toast";
import CustomLoader from "@/components/ui/CustomLoader";
import { UserDetails } from "@/components/UserDetails";

const DashboardPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetUserDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const GetUserDetails = () => {
    setLoading(true);

    fetchUserDetails({ userId: user?.id })
      .then((res) => {
        setLoading(false);
        setUserData(res.data[0]);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to fetch users. Please try again.");
      });
  };

  return (
    <>
      {loading && <CustomLoader message="Details Loading" />}
      {Object.keys(userData).length > 0 && <UserDetails userData={userData} />}
    </>
  );
};

export default DashboardPage;
