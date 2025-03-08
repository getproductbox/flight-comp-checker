
export interface FlightFormData {
  flightNumber: string;
  date: Date;
  scheduledArrival?: string;
}

export interface FlightResult {
  flightNumber: string;
  date: Date;
  scheduledArrival?: string;
  actualArrival?: string;
  delayHours?: number;
  isEligible?: boolean;
  error?: string;
}

export interface SavedFlightClaim extends FlightResult {
  id: string;
  savedAt: string;
}

export interface OpenSkyFlight {
  icao24: string;
  firstSeen: number;
  estDepartureAirport: string;
  lastSeen: number;
  estArrivalAirport: string;
  callsign: string;
  estDepartureAirportHorizDistance: number;
  estDepartureAirportVertDistance: number;
  estArrivalAirportHorizDistance: number;
  estArrivalAirportVertDistance: number;
  departureAirportCandidatesCount: number;
  arrivalAirportCandidatesCount: number;
}

export interface FlightLookupResponse {
  success: boolean;
  flight?: {
    actualArrival?: string;
    delayHours?: number;
    isEligible?: boolean;
  };
  error?: string;
}
