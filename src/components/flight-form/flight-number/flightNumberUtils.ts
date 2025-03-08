
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

export const getFlightSuggestions = (input: string) => {
  // Extract an airline code (attempt to match 2-3 characters at the start)
  const airlineCode = input.match(/^[A-Z0-9]{2,3}/)?.[0];
  let suggestions: string[] = [];
  let isKnownAirline = false;
  
  if (airlineCode) {
    // Check known airline codes (both in map and popular flights)
    isKnownAirline = 
      AIRLINE_CALLSIGN_MAP[airlineCode] !== undefined || 
      Object.keys(POPULAR_FLIGHTS).includes(airlineCode);
    
    if (isKnownAirline) {
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
  
  return { suggestions, isKnownAirline };
};

export const validateFlightNumber = (input: string) => {
  // Basic format validation (2-3 letter/number airline code followed by 1-4 digits)
  if (FLIGHT_NUMBER_PATTERN.test(input)) {
    return { isValid: true, errorMessage: null };
  } else {
    return { 
      isValid: false, 
      errorMessage: "Please enter a valid flight number (e.g., BA123)" 
    };
  }
};
