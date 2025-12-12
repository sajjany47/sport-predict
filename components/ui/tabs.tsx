"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

/**
 * TabsList — FULL WIDTH + SCROLLABLE on mobile
 * -------------------------------------------
 * - 100% width container
 * - On mobile → horizontally scrollable
 * - On large screens → grid layout
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto scrollbar-hide">
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex w-full gap-2 sm:gap-0",
        "sm:grid sm:grid-cols-5", // 5 tabs → adjust as needed
        "rounded-md bg-muted text-muted-foreground",
        "min-w-max sm:min-w-0", // allows scroll on mobile
        className
      )}
      {...props}
    />
  </div>
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * TabsTrigger — 100% width on mobile (scrollable)
 * ----------------------------------------------
 * - Automatically takes space based on content on mobile
 * - Equal grid width on larger screens
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap",
      "rounded-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "ring-offset-background focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "min-w-max sm:min-w-0", // scrollable on mobile
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * TabsContent — unchanged
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
