
import { OpenSkyFlight } from "@/types/flight";
import { getCallsignFromFlightNumber, normalizeCallsign } from "./airlineMapping";

// Find matching flight from OpenSky results with improved matching logic
export const findMatchingFlight = (
  flights: OpenSkyFlight[],
  flightNumber: string,
  date: Date
): OpenSkyFlight | null => {
  const targetCallsign = getCallsignFromFlightNumber(flightNumber);
  if (!targetCallsign) return null;
  
  const normalized = normalizeCallsign(targetCallsign);
  const numericPart = flightNumber.match(/\d+/)?.[0];
  
  // Filter flights by matching callsign
  return flights.find(flight => {
    if (!flight.callsign) return false;
    
    const flightCallsign = normalizeCallsign(flight.callsign);
    
    // Try to match the callsign prefix
    const callsignMatch = flightCallsign.includes(normalized);
    
    // If we have a numeric part of the flight number, check if it's in the callsign too
    const numericMatch = numericPart && flightCallsign.includes(numericPart);
    
    // Return true if we have a callsign match AND (no numeric part OR numeric part matches)
    return callsignMatch && (!numericPart || numericMatch);
  }) || null;
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
