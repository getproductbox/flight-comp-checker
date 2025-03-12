
import { FlightFormData, FlightLookupResponse, OpenSkyFlight } from "@/types/flight";
import { findMatchingFlight, calculateDelayHours, isFlightEligible } from "./flightHelpers";
import { getCallsignFromFlightNumber, getNumericPart } from "./airlineMapping";
import { getMockFlightData } from "./mockFlightData";

// This is the main function that will be called from the frontend
export const lookupFlight = async (data: FlightFormData): Promise<FlightLookupResponse> => {
  try {
    console.log("Looking up flight:", data);

    // For development or fallback, we'll use mock data
    const ENABLE_MOCK_FALLBACK = true;
    const USE_MOCK_DATA = false;
    
    if (USE_MOCK_DATA) {
      console.log("Using mock data for flight lookup");
      return getMockFlightData(data);
    }
    
    // Validate flight number format (should be airline code + numbers)
    if (!data.flightNumber.match(/^[A-Z0-9]{2,3}\d+$/)) {
      return {
        success: false,
        error: "Invalid flight number format. Please enter an airline code followed by numbers (e.g., BA123)."
      };
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
    
    // Extract the numeric part of the flight number
    const flightNumberNumeric = getNumericPart(data.flightNumber);
    console.log(`Looking for flight with callsign prefix ${callsignPrefix} and number ${flightNumberNumeric || 'unknown'}`);
    
    // Expanded list of major airports to increase chances of finding the flight
    const airports = [
      "EGLL", "EGKK", // London (Heathrow, Gatwick)
      "EGLC", "EGSS", // London (City, Stansted)
      "EHAM", // Amsterdam
      "LFPG", "LFPO", // Paris (Charles de Gaulle, Orly)
      "EDDF", "EDDM", // Frankfurt, Munich
      "LEMD", "LEBL", // Madrid, Barcelona
      "LIRF", "LIML", // Rome, Milan
      "EDDH", "EDDB", // Hamburg, Berlin
      "LOWW", "LSZH", // Vienna, Zurich
      "EKCH", "ESSA", // Copenhagen, Stockholm
      "ENGM", "EFHK"  // Oslo, Helsinki
    ];
    
    let matchedFlight: OpenSkyFlight | null = null;
    let totalFlightsChecked = 0;
    let successfulAirports = 0;
    let failedAirports = 0;
    let allFlights: OpenSkyFlight[] = [];
    
    console.log(`Searching for flight across ${airports.length} major airports...`);
    
    // Search both arrival and departure (for more chances to find the flight)
    const searchDirections = ['arrival', 'departure'];
    
    for (const direction of searchDirections) {
      if (matchedFlight) break;
      
      console.log(`Searching ${direction} flights...`);
      
      for (const airport of airports) {
        if (matchedFlight) break;
        
        const url = `https://opensky-network.org/api/flights/${direction}?airport=${airport}&begin=${beginTime}&end=${endTime}`;
        
        try {
          console.log(`Fetching flights for ${airport} (${direction})...`);
          const response = await fetch(url);
          
          if (!response.ok) {
            console.warn(`OpenSky API error for ${airport}: ${response.status}`);
            failedAirports++;
            continue; // Try next airport
          }
          
          const flights: OpenSkyFlight[] = await response.json();
          successfulAirports++;
          totalFlightsChecked += flights.length;
          allFlights = [...allFlights, ...flights];
          
          console.log(`Found ${flights.length} ${direction} flights at ${airport}`);
          
          // Find a flight with matching callsign
          matchedFlight = findMatchingFlight(flights, data.flightNumber, data.date);
          
          if (matchedFlight) {
            console.log(`Found matching flight at ${airport} (${direction}):`, matchedFlight);
            break;
          }
        } catch (error) {
          console.error(`Error fetching flights for ${airport}:`, error);
          failedAirports++;
          // Continue to next airport
        }
      }
    }
    
    console.log(`Checked ${totalFlightsChecked} flights across ${successfulAirports} airports (${failedAirports} airports failed)`);
    
    // If we didn't find a matching flight, try to match against all collected flights
    if (!matchedFlight && allFlights.length > 0) {
      console.log(`Trying to match against all ${allFlights.length} collected flights...`);
      matchedFlight = findMatchingFlight(allFlights, data.flightNumber, data.date);
    }
    
    // If we still didn't find a match and fallback is enabled, use mock data
    if (!matchedFlight && ENABLE_MOCK_FALLBACK) {
      console.log("No flight found in OpenSky data. Falling back to mock data.");
      return getMockFlightData(data);
    }
    
    if (!matchedFlight) {
      return {
        success: false,
        error: "Flight not found in our database. Please double-check your flight number and date."
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
      // If no scheduled time provided, generate a random delay (for demo purposes)
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
