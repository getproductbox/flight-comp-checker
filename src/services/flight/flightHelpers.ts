
import { OpenSkyFlight } from "@/types/flight";
import { getCallsignFromFlightNumber, normalizeCallsign, getNumericPart } from "./airlineMapping";

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
  
  // Extract airline code and numeric part from flight number
  const airlineCode = flightNumber.match(/^[A-Z]+/)?.[0];
  const numericPart = getNumericPart(flightNumber);
  
  if (!airlineCode || !numericPart) {
    console.log(`Could not parse flight number components from: ${flightNumber}`);
    return null;
  }
  
  // Get both the original code (e.g., "BA") and the mapped callsign (e.g., "BAW")
  const mappedCallsign = getCallsignFromFlightNumber(flightNumber);
  
  console.log(`Searching with airline code: ${airlineCode}, mapped callsign: ${mappedCallsign}, numeric part: ${numericPart}`);
  console.log(`Total flights to search through: ${flights.length}`);

  // Log a few sample flights to help debugging
  if (flights.length > 0) {
    console.log("Sample flights for debugging:");
    flights.slice(0, Math.min(3, flights.length)).forEach(flight => {
      console.log(`- Callsign: ${flight.callsign}, First seen: ${new Date(flight.firstSeen * 1000).toISOString()}`);
    });
  }
  
  // Priority 1: Try to find exact match with mapped callsign (e.g., "BAW123")
  const exactMatchMapped = flights.find(flight => {
    if (!flight.callsign) return false;
    const normalizedCallsign = normalizeCallsign(flight.callsign);
    const expected = normalizeCallsign(`${mappedCallsign}${numericPart}`);
    return normalizedCallsign === expected;
  });
  
  if (exactMatchMapped) {
    console.log(`Found exact match with mapped callsign: ${exactMatchMapped.callsign}`);
    return exactMatchMapped;
  }
  
  // Priority 2: Try to find exact match with original airline code (e.g., "BA123")
  const exactMatchOriginal = flights.find(flight => {
    if (!flight.callsign) return false;
    const normalizedCallsign = normalizeCallsign(flight.callsign);
    const expected = normalizeCallsign(`${airlineCode}${numericPart}`);
    return normalizedCallsign === expected;
  });
  
  if (exactMatchOriginal) {
    console.log(`Found exact match with original airline code: ${exactMatchOriginal.callsign}`);
    return exactMatchOriginal;
  }
  
  // Priority 3: Look for flights where callsign contains mapped callsign AND numeric part
  const partialMatchMapped = flights.find(flight => {
    if (!flight.callsign) return false;
    const normalizedCallsign = normalizeCallsign(flight.callsign);
    return normalizedCallsign.includes(normalizeCallsign(mappedCallsign || "")) && 
           normalizedCallsign.includes(numericPart);
  });
  
  if (partialMatchMapped) {
    console.log(`Found partial match with mapped callsign: ${partialMatchMapped.callsign}`);
    return partialMatchMapped;
  }
  
  // Priority 4: Look for flights where callsign contains original airline code AND numeric part
  const partialMatchOriginal = flights.find(flight => {
    if (!flight.callsign) return false;
    const normalizedCallsign = normalizeCallsign(flight.callsign);
    return normalizedCallsign.includes(normalizeCallsign(airlineCode)) && 
           normalizedCallsign.includes(numericPart);
  });
  
  if (partialMatchOriginal) {
    console.log(`Found partial match with original airline code: ${partialMatchOriginal.callsign}`);
    return partialMatchOriginal;
  }
  
  // Priority 5: Just match on numeric part (least reliable)
  const numericMatch = flights.find(flight => {
    if (!flight.callsign) return false;
    const normalizedCallsign = normalizeCallsign(flight.callsign);
    return normalizedCallsign.includes(numericPart);
  });
  
  if (numericMatch) {
    console.log(`Found numeric-only match: ${numericMatch.callsign}`);
    return numericMatch;
  }
  
  console.log(`No matching flight found for ${flightNumber}`);
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
