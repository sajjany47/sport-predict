"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: any;
  placeholder?: string;
  className?: string;
}

const DateRangePicker = ({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = (range: DateRange) => {
    if (!range.from) return placeholder;
    if (!range.to) return format(range.from, "MMM dd, yyyy");
    if (range.from.toDateString() === range.to.toDateString()) {
      return format(range.from, "MMM dd, yyyy");
    }
    return `${format(range.from, "MMM dd")} - ${format(
      range.to,
      "MMM dd, yyyy"
    )}`;
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange(range);
      // Close popover when both dates are selected
      if (range.from && range.to) {
        setIsOpen(false);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value.from}
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
