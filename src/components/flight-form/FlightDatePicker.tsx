
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FlightDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const FlightDatePicker: React.FC<FlightDatePickerProps> = ({
  date,
  onDateChange,
  isFocused,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor="date"
        className={cn(
          "text-sm font-medium transition-all duration-200",
          isFocused ? "text-elegant-primary" : "text-elegant-accent"
        )}
      >
        Flight Date
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-elegant-border bg-white/80 h-12",
              !date && "text-elegant-subtle/60"
            )}
            onClick={onFocus}
            onBlur={onBlur}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FlightDatePicker;
