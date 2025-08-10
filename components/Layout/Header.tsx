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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Trophy,
  User,
  Settings,
  CreditCard,
  History,
  LogOut,
  Home,
  Info,
  HelpCircle,
  Calendar,
  LayoutDashboard,
  SwitchCamera,
  HandCoins,
} from "lucide-react";
import MarqueeNotice from "../ui/marquee-notice";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { DailyCreditAd } from "../GetDailyCredit";
import { UserCreditUpdate } from "@/app/MainService";
import toast from "react-hot-toast";

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
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/support", label: "Support", icon: HelpCircle },
    { href: "/matches", label: "Matches", icon: Calendar },
    { href: "/subscription", label: "Subscription", icon: CreditCard },
  ];

  const menuItems = [
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      label: "Subscription",
      href: "/dashboard/subscription",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    {
      label: "Order History",
      href: "/dashboard/orders",
      icon: <History className="mr-2 h-4 w-4" />,
    },
  ];

  const handleCreditAdd = () => {
    UserCreditUpdate({ type: "daily" })
      .then((res) => {
        const prepareUser: any = user
          ? { ...user, credits: res.data.credits }
          : null;

        setDailyCreditRes({ message: res.message, isSuccess: true });
        dispatch(loginSuccess({ ...prepareUser }));
      })
      .catch((error) => {
        setDailyCreditRes({ message: error.message, isSuccess: false });
        // toast.error(
        //   error.message || "Failed to get free credits. Please try again."
        // );
      });
  };

  return (
    <>
      {showNotice && !pathname.startsWith("/admin") && (
        <MarqueeNotice onClose={() => setShowNotice(false)} />
      )}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              SportPredict
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto px-3">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.username}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {user.credits} Credits
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => {
                      // Delay opening the dialog so dropdown can close
                      setTimeout(() => setDailyCredit(true), 50);
                    }}
                  >
                    <HandCoins className="mr-2 h-4 w-4" />
                    Get Daily Credits
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={"/admin"}
                        className="cursor-pointer flex items-center"
                      >
                        <SwitchCamera className="mr-2 h-4 w-4" />
                        Switch To Admin
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {menuItems.map((item) => (
                    <DropdownMenuItem asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="cursor-pointer flex items-center"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Access all SportPredict features
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
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

      {/* {dailyCredit && <DailyCreditAd />} */}
    </>
  );
};

export default Header;
