
// Simple mapping from airline codes to callsign prefixes
export const AIRLINE_CALLSIGN_MAP: Record<string, string> = {
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
