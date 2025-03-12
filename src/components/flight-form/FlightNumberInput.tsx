
import React, { useState } from "react";
import { Info, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlightNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const FlightNumberInput: React.FC<FlightNumberInputProps> = ({
  value,
  onChange,
  isFocused,
  onFocus,
  onBlur,
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Simple validation for flight number format
  const validateFlightNumber = (input: string): boolean => {
    // Valid format: 2-3 letters followed by 1-4 digits (e.g., BA123, LH1234)
    return /^[A-Z]{2,3}\d{1,4}$/.test(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
    
    // Only validate if there's input
    if (newValue.length > 0) {
      setIsValid(validateFlightNumber(newValue));
    } else {
      setIsValid(null);
    }
  };

  // Get icon and status color
  const getStatusInfo = () => {
    if (isValid === null) return null;
    
    if (isValid) {
      return {
        icon: <Check className="h-4 w-4 text-green-500" />,
        color: "border-green-500"
      };
    }
    
    return {
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      color: "border-red-500"
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label
          htmlFor="flightNumber"
          className={cn(
            "text-sm font-medium transition-all duration-200",
            isFocused ? "text-elegant-primary" : "text-elegant-accent"
          )}
        >
          Flight Number
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
                Enter the flight number as shown on your ticket or booking confirmation 
                (e.g., BA123, LH456). This is the airline code followed by the flight number.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative">
        <Input
          id="flightNumber"
          value={value}
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="e.g. BA123"
          className={cn(
            "border-elegant-border bg-white/80 h-12 text-base placeholder:text-elegant-subtle/60 pr-10",
            statusInfo?.color
          )}
          required
        />
        {statusInfo && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {statusInfo.icon}
          </div>
        )}
      </div>
      {isValid === false && (
        <p className="text-xs text-red-500 mt-1">
          Please enter a valid flight number (e.g., BA123)
        </p>
      )}
    </div>
  );
};

export default FlightNumberInput;
