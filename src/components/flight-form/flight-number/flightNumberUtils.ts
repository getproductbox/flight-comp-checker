
import { AIRLINE_CALLSIGN_MAP } from "@/services/flight/airlineMapping";

// Common flight numbers for popular airlines
const POPULAR_FLIGHTS: Record<string, string[]> = {
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

// Extract airline code from a flight number
export const extractAirlineCode = (flightNumber: string): string => {
  return flightNumber.match(/^[A-Z0-9]{2,3}(?=\d)/)?.[0] || '';
};

// Extract numeric part of flight number
export const extractFlightNumber = (flightNumber: string): string => {
  return flightNumber.replace(/^[A-Z0-9]{2,3}/, '');
};

// Check if an airline code is known
export const isKnownAirline = (airlineCode: string): boolean => {
  return AIRLINE_CALLSIGN_MAP[airlineCode] !== undefined || 
    Object.keys(POPULAR_FLIGHTS).includes(airlineCode);
};

// Generate flight suggestions based on input
export const getFlightSuggestions = (input: string) => {
  // Extract an airline code (attempt to match 2-3 characters at the start)
  const airlineCode = extractAirlineCode(input);
  let suggestions: string[] = [];
  let isKnownAirlineCode = false;
  
  if (airlineCode) {
    // Check known airline codes (both in map and popular flights)
    isKnownAirlineCode = isKnownAirline(airlineCode);
    
    if (isKnownAirlineCode) {
      // Generate suggestions
      if (Object.keys(POPULAR_FLIGHTS).includes(airlineCode)) {
        // Use predefined popular flight numbers for this airline
        const flightNumbers = POPULAR_FLIGHTS[airlineCode as keyof typeof POPULAR_FLIGHTS];
        suggestions = flightNumbers.map(num => `${airlineCode}${num}`);
      } else {
        // Generate some random flight numbers for other known airlines
        suggestions = Array.from({ length: 5 }, (_, i) => 
          `${airlineCode}${(Math.floor(Math.random() * 999) + 100)}`
        );
      }
      
      // Filter suggestions based on what the user has typed
      if (input.length > airlineCode.length) {
        const remainingPart = input.substring(airlineCode.length);
        suggestions = suggestions.filter(suggestion => 
          suggestion.substring(airlineCode.length).startsWith(remainingPart)
        );
      }
    }
  }
  
  return { suggestions, isKnownAirlineCode };
};

// Validate flight number format and airline code
export const validateFlightNumber = (input: string) => {
  // Basic format validation (2-3 letter/number airline code followed by 1-4 digits)
  if (input.length < 3) {
    return { 
      isValid: null, 
      errorMessage: "Please enter at least 3 characters" 
    };
  }
  
  if (!FLIGHT_NUMBER_PATTERN.test(input)) {
    return { 
      isValid: false, 
      errorMessage: "Please enter a valid flight number (e.g., BA123)" 
    };
  }
  
  const airlineCode = extractAirlineCode(input);
  if (!isKnownAirline(airlineCode)) {
    return { 
      isValid: false, 
      errorMessage: `Unknown airline code: ${airlineCode}` 
    };
  }
  
  return { isValid: true, errorMessage: null };
};
