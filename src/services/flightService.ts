
import { FlightFormData, FlightLookupResponse, OpenSkyFlight } from "@/types/flight";

// Simple mapping from airline codes to callsign prefixes
const AIRLINE_CALLSIGN_MAP: Record<string, string> = {
  BA: "BAW", // British Airways
  LH: "DLH", // Lufthansa
  AF: "AFR", // Air France
  KL: "KLM", // KLM
  IB: "IBE", // Iberia
  FR: "RYR", // Ryanair
  EZY: "EZY", // EasyJet
  U2: "EZY", // EasyJet (alternative code)
  DL: "DAL", // Delta
  AA: "AAL", // American Airlines
  UA: "UAL", // United Airlines
  // Add more mappings as needed
};

// Mock implementation for local development before we create the edge function
export const lookupFlight = async (data: FlightFormData): Promise<FlightLookupResponse> => {
  try {
    console.log("Looking up flight:", data);
    
    // For development without API, return mock data
    const mockDelay = Math.floor(Math.random() * 6) + 1; // 1-6 hours delay
    const isEligible = mockDelay >= 3;

    // Calculate actual arrival based on schedule and delay
    let actualArrival;
    if (data.scheduledArrival) {
      const scheduledDate = new Date(data.date);
      const [hours, minutes] = data.scheduledArrival.split(':').map(Number);
      scheduledDate.setHours(hours, minutes);
      
      const actualDate = new Date(scheduledDate);
      actualDate.setHours(scheduledDate.getHours() + mockDelay);
      actualArrival = actualDate.toISOString();
    }

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      flight: {
        actualArrival,
        delayHours: mockDelay,
        isEligible
      }
    };
  } catch (error) {
    console.error("Error looking up flight:", error);
    return {
      success: false,
      error: "Failed to retrieve flight data. Please try again later."
    };
  }
};

// Helper function to map airline code to callsign prefix
export const getCallsignFromFlightNumber = (flightNumber: string): string | null => {
  // Extract airline code from flight number (e.g., "BA" from "BA123")
  const airlineCode = flightNumber.match(/^[A-Z0-9]{2,3}/)?.[0];
  if (!airlineCode) return null;
  
  // Return the corresponding callsign prefix or the original if not found
  return AIRLINE_CALLSIGN_MAP[airlineCode] || airlineCode;
};

// Normalize callsign for comparison (remove spaces, convert to uppercase)
export const normalizeCallsign = (callsign: string): string => {
  return callsign.replace(/\s+/g, '').toUpperCase().trim();
};

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
