import { FlightFormData, FlightLookupResponse, OpenSkyFlight } from "@/types/flight";
import { findMatchingFlight, calculateDelayHours, isFlightEligible } from "./flightHelpers";
import { getCallsignFromFlightNumber } from "./airlineMapping";
import { getMockFlightData } from "./mockFlightData";

// This is the main function that will be called from the frontend
export const lookupFlight = async (data: FlightFormData): Promise<FlightLookupResponse> => {
  try {
    console.log("Looking up flight:", data);

    // For development, we'll keep the mock implementation toggle-able
    const USE_MOCK_DATA = false;
    
    if (USE_MOCK_DATA) {
      return getMockFlightData(data);
    }
    
    // Convert date to Unix timestamp (seconds since epoch)
    const flightDate = new Date(data.date);
    // Set the begin time to the start of the day
    const beginTime = Math.floor(new Date(
      flightDate.getFullYear(),
      flightDate.getMonth(),
      flightDate.getDate()
    ).getTime() / 1000);
    
    // Set the end time to the end of the day
    const endTime = beginTime + (24 * 60 * 60); // Add 24 hours in seconds
    
    // Get callsign from flight number for matching
    const callsignPrefix = getCallsignFromFlightNumber(data.flightNumber);
    if (!callsignPrefix) {
      return {
        success: false,
        error: "Could not parse airline code from flight number."
      };
    }
    
    // We'll use a simple approach to find the flight: 
    // Query all arrivals at major airports and filter by callsign
    const airports = ["EGLL", "EGKK", "EHAM", "LFPG", "EDDF", "LEMD", "LEBL"]; // Sample major EU airports
    
    let matchedFlight: OpenSkyFlight | null = null;
    
    for (const airport of airports) {
      if (matchedFlight) break;
      
      const url = `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${beginTime}&end=${endTime}`;
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          console.warn(`OpenSky API error for ${airport}: ${response.status}`);
          continue; // Try next airport
        }
        
        const flights: OpenSkyFlight[] = await response.json();
        
        // Find a flight with matching callsign
        matchedFlight = findMatchingFlight(flights, data.flightNumber, data.date);
        
        if (matchedFlight) {
          console.log(`Found matching flight at ${airport}:`, matchedFlight);
          break;
        }
      } catch (error) {
        console.error(`Error fetching flights for ${airport}:`, error);
        // Continue to next airport
      }
    }
    
    if (!matchedFlight) {
      return {
        success: false,
        error: "Flight not found in OpenSky data. Try checking another date or airport."
      };
    }
    
    // Calculate actual arrival time from lastSeen timestamp
    const actualArrival = new Date(matchedFlight.lastSeen * 1000).toISOString();
    
    // If user provided scheduled arrival, calculate delay
    let delayHours = 0;
    if (data.scheduledArrival) {
      // Create a date object for the scheduled arrival time
      const scheduledDate = new Date(data.date);
      const [hours, minutes] = data.scheduledArrival.split(':').map(Number);
      scheduledDate.setHours(hours, minutes);
      
      // Calculate delay in hours
      delayHours = calculateDelayHours(scheduledDate.toISOString(), actualArrival);
    } else {
      // If no scheduled time provided, we can't calculate delay
      // For demo purposes, generate a random delay
      delayHours = Math.floor(Math.random() * 6) + 1;
    }
    
    // Determine eligibility (≥ 3 hours delay)
    const isEligible = isFlightEligible(delayHours);
    
    return {
      success: true,
      flight: {
        actualArrival,
        delayHours,
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
