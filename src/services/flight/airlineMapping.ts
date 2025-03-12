
// Detailed mapping from airline codes to callsign prefixes
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
  EK: "UAE", // Emirates
  QF: "QFA", // Qantas
  SQ: "SIA", // Singapore Airlines
  CX: "CPA", // Cathay Pacific
  EI: "EIN", // Aer Lingus
  VS: "VIR", // Virgin Atlantic
  TP: "TAP", // TAP Portugal
  SK: "SAS", // SAS
  LX: "SWR", // Swiss
  OS: "AUA", // Austrian Airlines
  TK: "THY", // Turkish Airlines
  MS: "MSR", // EgyptAir
  GF: "GFA", // Gulf Air
  // Add more mappings as needed
};

// Helper function to map airline code to callsign prefix
export const getCallsignFromFlightNumber = (flightNumber: string): string | null => {
  // Extract airline code from flight number (only the letters at the beginning)
  const airlineCode = flightNumber.match(/^[A-Z]+/)?.[0];
  
  if (!airlineCode) {
    console.log(`Could not extract airline code from flight number: ${flightNumber}`);
    return null;
  }
  
  console.log(`Extracted airline code: ${airlineCode} from flight number: ${flightNumber}`);
  
  // Return the corresponding callsign prefix or the original if not found
  const callsign = AIRLINE_CALLSIGN_MAP[airlineCode] || airlineCode;
  console.log(`Mapped to callsign prefix: ${callsign}`);
  
  return callsign;
};

// Normalize callsign for comparison (remove spaces, convert to uppercase)
export const normalizeCallsign = (callsign: string): string => {
  return callsign.replace(/\s+/g, '').toUpperCase().trim();
};

// Extract numeric part from flight number
export const getNumericPart = (flightNumber: string): string | null => {
  const numericPart = flightNumber.match(/\d+/)?.[0] || null;
  console.log(`Extracted numeric part: ${numericPart} from flight number: ${flightNumber}`);
  return numericPart;
};
