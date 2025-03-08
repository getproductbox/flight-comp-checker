
import { OpenSkyFlight } from "@/types/flight";
import { getCallsignFromFlightNumber, normalizeCallsign, getNumericPart } from "./airlineMapping";

// Find matching flight from OpenSky results with improved matching logic
export const findMatchingFlight = (
  flights: OpenSkyFlight[],
  flightNumber: string,
  date: Date
): OpenSkyFlight | null => {
  console.log(`Attempting to find a match for flight: ${flightNumber} on date: ${date.toISOString().split('T')[0]}`);
  
  // Extract callsign prefix from flight number (e.g., "BAW" from "BA123")
  const callsignPrefix = getCallsignFromFlightNumber(flightNumber);
  if (!callsignPrefix) {
    console.warn(`Could not get a valid callsign prefix for ${flightNumber}`);
    return null;
  }
  
  // Get normalized callsign prefix for comparison
  const normalizedPrefix = normalizeCallsign(callsignPrefix);
  
  // Extract the numeric part of the flight number (e.g., "123" from "BA123")
  const numericPart = getNumericPart(flightNumber);
  if (!numericPart) {
    console.warn(`Could not extract numeric part from flight number: ${flightNumber}`);
    return null;
  }
  
  console.log(`Looking for flights with callsign prefix: ${normalizedPrefix} and number: ${numericPart}`);
  console.log(`Total flights to search through: ${flights.length}`);
  
  // First, try to find exact callsign match (e.g., "BAW123")
  const exactMatch = flights.find(flight => {
    if (!flight.callsign) return false;
    const normalizedCallsign = normalizeCallsign(flight.callsign);
    return normalizedCallsign === `${normalizedPrefix}${numericPart}`;
  });
  
  if (exactMatch) {
    console.log(`Found exact match: ${exactMatch.callsign}`);
    return exactMatch;
  }
  
  // Second, try to find a match where the callsign contains both the prefix and numeric part
  const prefixNumericMatch = flights.find(flight => {
    if (!flight.callsign) return false;
    const normalizedCallsign = normalizeCallsign(flight.callsign);
    return normalizedCallsign.includes(normalizedPrefix) && normalizedCallsign.includes(numericPart);
  });
  
  if (prefixNumericMatch) {
    console.log(`Found prefix-numeric match: ${prefixNumericMatch.callsign}`);
    return prefixNumericMatch;
  }
  
  // Third, just try to match the numeric part (less reliable but might catch some edge cases)
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
