"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { loginSuccess, logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Trophy,
  User,
  Settings,
  CreditCard,
  LogOut,
  Home,
  Calendar,
  LayoutDashboard,
  SwitchCamera,
  HandCoins,
  Sparkles,
  Bell,
  ChevronDown,
  Shield,
  Crown,
  Target,
  Users,
  BarChart,
  Info,
  HelpCircle,
} from "lucide-react";
import MarqueeNotice from "../ui/marquee-notice";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { DailyCreditAd } from "../GetDailyCredit";
import { UserOrderCredit } from "@/app/MainService";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [dailyCredit, setDailyCredit] = useState(false);
  const [dailyCreditRes, setDailyCreditRes] = useState<any>({
    message: "",
    isSuccess: null,
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/support", label: "Support", icon: HelpCircle },
    { href: "/subscription", label: "Token", icon: CreditCard },
    { href: "/matches", label: "Matches", icon: Calendar },
    { href: "/about", label: "About", icon: Info },
  ];

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      description: "Your personal dashboard",
    },
    {
      label: "Token",
      href: "/subscription",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      description: "Manage your token",
    },
  ];

  const handleCreditAdd = () => {
    let payload = {
      ordertype: "credit",
      userId: user!.id,
      credits: 1,
      status: "completed",
      paymentMode: "PROMOTION",
      paymentDate: new Date(),
    };

    UserOrderCredit(payload)
      .then((res) => {
        const prepareUser: any = user
          ? { ...user, credits: user.credits + 1 }
          : null;

        setDailyCreditRes({ message: res.message, isSuccess: true });
        dispatch(loginSuccess({ ...prepareUser }));
      })
      .catch((error) => {
        setDailyCreditRes({ message: error.message, isSuccess: false });
      });
  };

  return (
    <>
      {showNotice && !pathname.startsWith("/admin") && (
        <MarqueeNotice onClose={() => setShowNotice(false)} />
      )}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 lg:space-x-3 group"
            >
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
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {isAuthenticated && user ? (
                <>
                  {/* User Credits Badge - Mobile */}
                  <div className="lg:hidden">
                    <Badge variant="secondary" className="font-semibold">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {user.credits}
                    </Badge>
                  </div>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 px-2 lg:px-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        <Avatar className="h-7 w-7 lg:h-8 lg:w-8 mr-2 border-2 border-blue-100">
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:flex flex-col items-start">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {user.username}
                            </span>
                            {user.role === "admin" && (
                              <Shield className="h-3 w-3 ml-1 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <Sparkles className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs font-bold text-blue-600">
                              {user.credits} Credits
                            </span>
                          </div>
                        </div>
                        <ChevronDown className="hidden lg:block ml-1 h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 lg:w-72 shadow-xl rounded-xl border"
                      align="end"
                    >
                      <DropdownMenuLabel className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.username}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {user.credits} Credits
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "outline"
                          }
                          className="ml-2"
                        >
                          {user.role}
                        </Badge>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="cursor-pointer flex items-center py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                        onClick={() => {
                          setTimeout(() => setDailyCredit(true), 50);
                        }}
                      >
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-2 rounded-lg mr-3">
                          <HandCoins className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-medium">Get Daily Credits</div>
                          <div className="text-xs text-gray-500">
                            Claim your free daily credits
                          </div>
                        </div>
                      </DropdownMenuItem>

                      {user.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin"
                            className="cursor-pointer flex items-center py-3 hover:bg-gray-50"
                          >
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg mr-3">
                              <SwitchCamera className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">Admin Panel</div>
                              <div className="text-xs text-gray-500">
                                Switch to admin interface
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {menuItems.map((item) => (
                        <DropdownMenuItem asChild key={item.href}>
                          <Link
                            href={item.href}
                            className="cursor-pointer flex items-center py-2 hover:bg-gray-50"
                          >
                            <div className="mr-3">{item.icon}</div>
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer py-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <div className="bg-red-50 p-2 rounded-lg mr-3">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Logout</div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Mobile Auth Buttons - IN ROW */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      asChild
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 border border-gray-200 hidden sm:inline-flex"
                    >
                      <Link href="/auth/login">Login</Link>
                    </Button>

                    {/* Mobile View - Smaller Login Button */}
                    <Button
                      variant="outline"
                      asChild
                      size="sm"
                      className="sm:hidden h-9 px-3 text-sm border-gray-200"
                    >
                      <Link href="/auth/login">Login</Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all h-9 px-3 sm:px-4"
                    >
                      <Link href="/auth/register" className="flex items-center">
                        <span className="text-sm">Join</span>
                        <Sparkles className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-gray-100 ml-1"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[85vw] sm:w-[400px] p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Sheet Header */}
                    <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                      {isAuthenticated && user ? (
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-white shadow">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-gray-900">
                              {user.username}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {user.credits} Credits
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xl font-bold text-gray-900">
                            SportPredict
                          </div>
                          <div className="text-sm text-gray-600">
                            AI Cricket Predictions
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 overflow-y-auto py-4">
                      <div className="space-y-1 px-2">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            pathname === item.href ||
                            (item.href !== "/" &&
                              pathname.startsWith(item.href));
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center space-x-3 p-3 rounded-lg mx-2 transition-all ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Mobile Auth Actions */}
                      {isAuthenticated && user ? (
                        <div className="mt-6 space-y-2 px-2">
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setTimeout(() => setDailyCredit(true), 50);
                            }}
                            className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                          >
                            <div className="flex items-center">
                              <HandCoins className="h-5 w-5 text-yellow-600 mr-3" />
                              <div>
                                <div className="font-semibold text-gray-900">
                                  Get Daily Credits
                                </div>
                                <div className="text-xs text-gray-600">
                                  Claim free credits
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Free
                            </Badge>
                          </button>

                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      ) : (
                        <div className="mt-6 px-4">
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              asChild
                              className="w-full"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                              asChild
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Link href="/auth/register">Sign Up</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      {dailyCredit && (
        <DailyCreditAd
          isOpen={dailyCredit}
          onClose={() => setDailyCredit(false)}
          onCreditAdd={handleCreditAdd}
          dailyCreditRes={dailyCreditRes}
        />
      )}
    </>
  );
};

export default Header;
