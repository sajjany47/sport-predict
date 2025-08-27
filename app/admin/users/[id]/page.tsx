/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/store";
import CustomLoader from "@/components/ui/CustomLoader";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserDetails } from "@/components/UserDetails";

const DashboardPage = () => {
  const params = useParams();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { users } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    setLoading(true);
    if (params.id) {
      const findData = (users ?? []).find(
        (item: any) => item._id === params.id
      );
      setUserData(findData);
    } else {
      setUserData({});
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <CustomLoader message="Details Loading" />}
      <AdminLayout>
        {Object.keys(userData).length > 0 && (
          <UserDetails userData={userData} />
        )}
      </AdminLayout>
    </>
  );
};

export default DashboardPage;
