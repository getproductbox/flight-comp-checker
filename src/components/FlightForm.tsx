
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, PlaneTakeoff, ArrowRight, Clock, Info } from "lucide-react";
import { GlassCard } from "./ui-custom/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FlightFormData } from "@/types/flight";

interface FlightFormProps {
  onSubmit: (data: FlightFormData) => void;
  isLoading?: boolean;
}

const FlightForm: React.FC<FlightFormProps> = ({ onSubmit, isLoading = false }) => {
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledArrival, setScheduledArrival] = useState("");
  const [isFlightNumberFocused, setIsFlightNumberFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flightNumber && date) {
      onSubmit({ flightNumber, date, scheduledArrival });
    }
  };

  return (
    <GlassCard
      className="w-full max-w-md mx-auto animate-scale-in"
      variant="elevated"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-elegant-muted rounded-full mb-4">
          <PlaneTakeoff className="h-6 w-6 text-elegant-primary" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight mb-2">
          Flight Delay Checker
        </h1>
        <p className="text-elegant-accent text-sm">
          Check if your delayed flight is eligible for compensation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="flightNumber"
            className={cn(
              "text-sm font-medium transition-all duration-200",
              isFlightNumberFocused ? "text-elegant-primary" : "text-elegant-accent"
            )}
          >
            Flight Number
          </Label>
          <Input
            id="flightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            onFocus={() => setIsFlightNumberFocused(true)}
            onBlur={() => setIsFlightNumberFocused(false)}
            placeholder="e.g. BA123"
            className="border-elegant-border bg-white/80 h-12 text-base placeholder:text-elegant-subtle/60"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="date"
            className={cn(
              "text-sm font-medium transition-all duration-200",
              isDateFocused ? "text-elegant-primary" : "text-elegant-accent"
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
                onClick={() => setIsDateFocused(true)}
                onBlur={() => setIsDateFocused(false)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Label
              htmlFor="scheduledArrival"
              className={cn(
                "text-sm font-medium transition-all duration-200",
                isTimeFocused ? "text-elegant-primary" : "text-elegant-accent"
              )}
            >
              Scheduled Arrival Time
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                    <Info className="h-3.5 w-3.5 text-elegant-accent" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    For the most accurate delay calculation, please enter the scheduled
                    arrival time from your ticket or booking confirmation.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-elegant-accent" />
            <Input
              id="scheduledArrival"
              type="time"
              value={scheduledArrival}
              onChange={(e) => setScheduledArrival(e.target.value)}
              onFocus={() => setIsTimeFocused(true)}
              onBlur={() => setIsTimeFocused(false)}
              className="border-elegant-border bg-white/80 h-12 text-base pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-elegant-primary hover:bg-elegant-primary/90 text-white transition-all duration-300 shadow-elegant hover:shadow-elegant-hover"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              <span>Check Eligibility</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-8 text-xs text-elegant-accent text-center">
        We check flight delays against EU 261 regulation criteria.
        <br />
        This is only an eligibility check, not a guarantee of compensation.
      </div>
    </GlassCard>
  );
};

export default FlightForm;
