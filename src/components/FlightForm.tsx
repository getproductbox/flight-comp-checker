
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, PlaneTakeoff, ArrowRight } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface FlightFormProps {
  onSubmit: (data: { flightNumber: string; date: Date }) => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ onSubmit }) => {
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFlightNumberFocused, setIsFlightNumberFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flightNumber && date) {
      onSubmit({ flightNumber, date });
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
            onChange={(e) => setFlightNumber(e.target.value)}
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

        <Button
          type="submit"
          className="w-full h-12 bg-elegant-primary hover:bg-elegant-primary/90 text-white transition-all duration-300 shadow-elegant hover:shadow-elegant-hover"
        >
          <span>Check Eligibility</span>
          <ArrowRight className="ml-2 h-4 w-4" />
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
