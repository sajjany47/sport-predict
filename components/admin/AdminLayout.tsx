/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import AdminSidebar from "./AdminSidebar";
import CustomLoader from "../ui/CustomLoader";
import { logout } from "@/store/slices/authSlice";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated or not an admin
    if (!isAuthenticated || user?.role !== "admin") {
      dispatch(logout());
      router.push("/");
    }
  }, []);

  return (
    <>
      {!isAuthenticated || user?.role !== "admin" ? (
        <CustomLoader message="Checking permissions" />
      ) : (
        <div className="min-h-screen bg-gray-50 flex">
          {/* Fixed Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 shadow-lg z-30">
            <AdminSidebar />
          </div>

          {/* Main Content with left margin and scrollable */}
          <div className="flex-1 ml-64">
            <main className="min-h-screen overflow-y-auto">
              <div className="p-8">{children}</div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;
