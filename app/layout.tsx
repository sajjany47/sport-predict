"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { PersistGate } from "redux-persist/integration/react";
import ReactQueryProvider from "@/lib/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-right" />
            </PersistGate>
          </Provider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
