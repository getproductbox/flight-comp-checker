
import React, { useState, useEffect, useRef } from "react";
import { Info, Search, AlertCircle, Check, X } from "lucide-react";
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
import { AIRLINE_CALLSIGN_MAP } from "@/services/flight/airlineMapping";

// Common flight numbers for popular airlines
const POPULAR_FLIGHTS = {
  BA: ["123", "456", "789", "234", "567", "890", "213", "456"],
  LH: ["400", "401", "456", "789", "900", "901", "800"],
  AF: ["123", "234", "345", "456", "567", "678", "789"],
  KL: ["758", "759", "760", "761", "642", "643", "644"],
  FR: ["1234", "5678", "9012", "3456", "7890"],
  EZY: ["2001", "2002", "2003", "2004", "2005"],
  U2: ["8001", "8002", "8003", "8004", "8005"],
};

// Flight number regex pattern
const FLIGHT_NUMBER_PATTERN = /^[A-Z0-9]{2,3}\d{1,4}$/;

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate flight suggestions based on input
  useEffect(() => {
    if (value.length >= 2) {
      // Extract an airline code (attempt to match 2-3 characters at the start)
      const airlineCode = value.match(/^[A-Z0-9]{2,3}/)?.[0];
      
      if (airlineCode) {
        // Check known airline codes (both in map and popular flights)
        const isKnownAirline = 
          AIRLINE_CALLSIGN_MAP[airlineCode] !== undefined || 
          Object.keys(POPULAR_FLIGHTS).includes(airlineCode);
        
        if (isKnownAirline) {
          // Generate suggestions
          let flightSuggestions: string[] = [];
          
          if (Object.keys(POPULAR_FLIGHTS).includes(airlineCode)) {
            // Use predefined popular flight numbers for this airline
            const flightNumbers = POPULAR_FLIGHTS[airlineCode as keyof typeof POPULAR_FLIGHTS];
            flightSuggestions = flightNumbers.map(num => `${airlineCode}${num}`);
          } else {
            // Generate some random flight numbers for other known airlines
            flightSuggestions = Array.from({ length: 5 }, (_, i) => 
              `${airlineCode}${(Math.floor(Math.random() * 999) + 100)}`
            );
          }
          
          // Filter suggestions based on what the user has typed
          if (value.length > airlineCode.length) {
            const remainingPart = value.substring(airlineCode.length);
            flightSuggestions = flightSuggestions.filter(suggestion => 
              suggestion.substring(airlineCode.length).startsWith(remainingPart)
            );
          }
          
          setSuggestions(flightSuggestions);
          
          // Only validate if they've entered enough characters
          if (value.length >= airlineCode.length + 1) {
            validateFlightNumber(value);
          } else {
            // Still typing, not enough to fully validate
            setIsValid(null);
            setErrorMessage(null);
          }
          
          return;
        }
      }
      
      // If we get here, either the airline code wasn't recognized or the format is invalid
      // Only show error after they've typed enough characters
      if (value.length >= 3) {
        setIsValid(false);
        setErrorMessage("Please enter a valid airline code followed by numbers (e.g., BA123)");
      } else {
        // Still typing, give them a chance
        setIsValid(null);
        setErrorMessage(null);
      }
    } else if (value.length === 0) {
      // Empty input, reset everything
      setIsValid(null);
      setErrorMessage(null);
    }
    
    // If we're here and value.length < 2, we don't have enough to suggest
    if (value.length < 2) {
      setSuggestions([]);
    }
  }, [value]);

  const validateFlightNumber = (input: string) => {
    // Basic format validation (2-3 letter/number airline code followed by 1-4 digits)
    if (FLIGHT_NUMBER_PATTERN.test(input)) {
      setIsValid(true);
      setErrorMessage(null);
    } else {
      setIsValid(false);
      setErrorMessage("Please enter a valid flight number (e.g., BA123)");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsValid(true);
    setErrorMessage(null);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getInputStatusIcon = () => {
    if (value.length === 0) {
      return null;
    }
    
    if (isValid === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (isValid === false) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
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
        <div className="relative">
          <Input
            id="flightNumber"
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="e.g. BA123"
            className={cn(
              "border-elegant-border bg-white/80 h-12 text-base placeholder:text-elegant-subtle/60 pr-10",
              isValid === false && "border-red-400 focus-visible:ring-red-400/20"
            )}
            required
          />
          {value.length > 0 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
              {getInputStatusIcon()}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 p-0 -mr-1 text-elegant-subtle hover:text-elegant-accent" 
                onClick={handleClearInput}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Show suggestions dropdown */}
        <div 
          className={cn(
            "absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-elegant-border transition-all duration-200",
            showSuggestions && value.length >= 2 ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-elegant-muted/30 cursor-pointer text-elegant-primary flex items-center"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search className="h-3.5 w-3.5 mr-2 text-elegant-accent/70" />
                  {suggestion}
                </li>
              ))}
            </ul>
          ) : value.length >= 2 ? (
            <div className="px-4 py-3 text-sm text-elegant-accent/70 italic">
              No matching flights found
            </div>
          ) : null}
        </div>
        
        {isValid === false && errorMessage && (
          <p className="text-red-500 text-xs mt-1 ml-1 animate-fade-in">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default FlightNumberInput;
