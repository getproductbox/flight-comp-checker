
import { OpenSkyFlight } from "@/types/flight";
import { 
  getCallsignFromFlightNumber, 
  normalizeCallsign, 
  getNumericPart,
  getCallsignVariations
} from "./airlineMapping";

// Find matching flight from OpenSky results with improved matching logic
export const findMatchingFlight = (
  flights: OpenSkyFlight[],
  flightNumber: string,
  date: Date
): OpenSkyFlight | null => {
  console.log(`Attempting to find a match for flight: ${flightNumber} on date: ${date.toISOString().split('T')[0]}`);
  
  if (!flights || flights.length === 0) {
    console.log("No flights data provided for matching");
    return null;
  }
  
  // Generate all possible callsign variations to match against
  const callsignVariations = getCallsignVariations(flightNumber);
  console.log(`Generated callsign variations for ${flightNumber}:`, callsignVariations);

  // Get numeric part for fallback matching
  const numericPart = getNumericPart(flightNumber);
  
  if (callsignVariations.length === 0) {
    console.log(`Could not generate callsign variations from: ${flightNumber}`);
    return null;
  }
  
  console.log(`Searching through ${flights.length} flights for matches`);

  // Log a few sample flights to help debugging
  if (flights.length > 0) {
    console.log("Sample flights for debugging:");
    flights.slice(0, Math.min(5, flights.length)).forEach(flight => {
      console.log(`- Callsign: "${flight.callsign}", First seen: ${new Date(flight.firstSeen * 1000).toISOString()}`);
    });
  }
  
  // MATCHING STRATEGY 1: Exact match with any of our callsign variations
  for (const variation of callsignVariations) {
    const exactMatch = flights.find(flight => {
      if (!flight.callsign) return false;
      const normalizedFlightCallsign = normalizeCallsign(flight.callsign);
      const isMatch = normalizedFlightCallsign === variation;
      if (isMatch) {
        console.log(`Found exact match: "${flight.callsign}" matches variation "${variation}"`);
      }
      return isMatch;
    });
    
    if (exactMatch) {
      console.log(`Found exact match with callsign: ${exactMatch.callsign}`);
      return exactMatch;
    }
  }
  
  // MATCHING STRATEGY 2: Check if any flight callsign CONTAINS one of our variations
  for (const variation of callsignVariations) {
    const containsMatch = flights.find(flight => {
      if (!flight.callsign) return false;
      const normalizedFlightCallsign = normalizeCallsign(flight.callsign);
      const isMatch = normalizedFlightCallsign.includes(variation);
      if (isMatch) {
        console.log(`Found contains match: "${flight.callsign}" contains variation "${variation}"`);
      }
      return isMatch;
    });
    
    if (containsMatch) {
      console.log(`Found contains match with callsign: ${containsMatch.callsign}`);
      return containsMatch;
    }
  }
  
  // MATCHING STRATEGY 3: Check if any flight's callsign contains the numeric part
  if (numericPart) {
    const numericMatch = flights.find(flight => {
      if (!flight.callsign) return false;
      const normalizedFlightCallsign = normalizeCallsign(flight.callsign);
      const isMatch = normalizedFlightCallsign.includes(numericPart);
      if (isMatch) {
        console.log(`Found numeric match: "${flight.callsign}" contains numeric part "${numericPart}"`);
      }
      return isMatch;
    });
    
    if (numericMatch) {
      console.log(`Found numeric-only match: ${numericMatch.callsign}`);
      return numericMatch;
    }
  }
  
  console.log(`No matching flight found for ${flightNumber} after trying all strategies`);
  return null;
};

// Calculate delay in hours between scheduled and actual arrival
export const calculateDelayHours = (
  scheduledArrival: string,
  actualArrival: string
): number => {
  const scheduled = new Date(scheduledArrival).getTime();
  const actual = new Date(actualArrival).getTime();
  
  // Calculate difference in milliseconds and convert to hours
  const diffMs = actual - scheduled;
  return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal place
};

// Check if flight is eligible for compensation
export const isFlightEligible = (delayHours: number): boolean => {
  // Per EU 261, flights delayed by 3+ hours may be eligible
  return delayHours >= 3;
};
