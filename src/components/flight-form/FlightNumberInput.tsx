
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import FlightInputField from "./flight-number/FlightInputField";
import FlightSuggestionList from "./flight-number/FlightSuggestionList";
import { getFlightSuggestions, validateFlightNumber } from "./flight-number/flightNumberUtils";
import FlightNumberValidation from "./flight-number/FlightNumberValidation";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate flight suggestions based on input
  useEffect(() => {
    if (value.length >= 2) {
      const { suggestions: flightSuggestions } = getFlightSuggestions(value);
      setSuggestions(flightSuggestions);
      
      // Only validate if they've entered enough characters
      if (value.length >= 3) {
        const { isValid: flightValid, errorMessage: validationError } = validateFlightNumber(value);
        setIsValid(flightValid);
        setErrorMessage(validationError);
      } else {
        // Still typing, not enough to fully validate
        setIsValid(null);
        setErrorMessage(null);
      }
    } else {
      // Empty or too short input, reset everything
      setSuggestions([]);
      setIsValid(null);
      setErrorMessage(null);
    }
  }, [value]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsValid(true);
    setErrorMessage(null);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    onFocus();
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks to register
    setTimeout(() => {
      setShowSuggestions(false);
      onBlur();
    }, 200);
  };

  const handleClearInput = () => {
    onChange("");
    setIsValid(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-2 relative">
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
        <FlightNumberTooltip />
      </div>
      
      <div className="relative">
        <FlightInputField
          value={value}
          onChange={onChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          isValid={isValid}
          onClear={handleClearInput}
        />
        
        <FlightSuggestionList
          suggestions={suggestions}
          showSuggestions={showSuggestions && value.length >= 2}
          onSuggestionClick={handleSuggestionClick}
        />
        
        <FlightNumberValidation isValid={isValid} errorMessage={errorMessage} />
      </div>
    </div>
  );
};

// Helper component for the tooltip
const FlightNumberTooltip: React.FC = () => (
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
);

export default FlightNumberInput;
