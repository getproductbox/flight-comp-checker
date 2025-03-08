
import { OpenSkyFlight } from "@/types/flight";
import { getCallsignFromFlightNumber, normalizeCallsign } from "./airlineMapping";

// Find matching flight from OpenSky results
export const findMatchingFlight = (
  flights: OpenSkyFlight[],
  flightNumber: string,
  date: Date
): OpenSkyFlight | null => {
  const targetCallsign = getCallsignFromFlightNumber(flightNumber);
  if (!targetCallsign) return null;
  
  const normalized = normalizeCallsign(targetCallsign);
  
  // Filter flights by matching callsign
  return flights.find(flight => {
    if (!flight.callsign) return false;
    const flightCallsign = normalizeCallsign(flight.callsign);
    return flightCallsign.includes(normalized);
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
