"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  return (
    <>
      {!isAuthenticated || user?.role !== "admin" ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking permissions...</p>
          </div>
        </div>
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
