"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SportPredict
                </span>
                <span className="text-[10px] lg:text-xs text-gray-500">
                  AI Cricket Predictions
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate cricket fantasy prediction platform powered by AI.
              Get accurate predictions and build winning Dream11 teams.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors transform hover:-translate-y-1 duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-sky-400 transition-colors transform hover:-translate-y-1 duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors transform hover:-translate-y-1 duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors transform hover:-translate-y-1 duration-300"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/matches"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Matches
                </Link>
              </li>
              <li>
                <Link
                  href="/subscription"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Subscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group text-sm md:text-base"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-lg text-white">Contact Info</h3>
            <ul className="space-y-4 text-sm md:text-base">
              <li className="flex items-start space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300 hover:text-blue-400 transition-colors">
                    {process.env.NEXT_PUBLIC_EMAIL ||
                      "support@sportpredict.com"}
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-300 hover:text-blue-400 transition-colors">
                    {process.env.NEXT_PUBLIC_MOBILE || "+1 (555) 123-4567"}
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Availability</p>
                  <p className="text-gray-300">24/7 Support</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-center md:text-left text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SportPredict. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Mobile-only additional info */}
          <div className="mt-4 pt-4 border-t border-gray-800 md:hidden">
            <p className="text-center text-xs text-gray-500">
              Disclaimer: SportPredict is a prediction platform for
              entertainment purposes only. Please play responsibly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
