
import { FlightFormData, FlightLookupResponse, OpenSkyFlight } from "@/types/flight";
import { findMatchingFlight, calculateDelayHours, isFlightEligible } from "./flightHelpers";
import { getCallsignFromFlightNumber, getNumericPart, getCallsignVariations } from "./airlineMapping";
import { getMockFlightData } from "./mockFlightData";

// Helper function to add retry capability to fetch
const fetchWithRetry = async (url: string, retries = 2): Promise<Response> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      if (response.status === 404) {
        console.warn(`OpenSky API 404 for ${url} - airport may not exist or have data`);
        throw new Error("404 Not Found");
      }
      
      if (response.status === 429) {
        console.warn(`Rate limit hit for ${url} - waiting before retry`);
        // Add a small delay before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${retries + 1} failed for ${url}:`, error);
      lastError = error as Error;
      
      // Add exponential backoff delay
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`);
};

// This is the main function that will be called from the frontend
export const lookupFlight = async (data: FlightFormData): Promise<FlightLookupResponse> => {
  try {
    console.log("Looking up flight:", data);

    // Configuration settings
    const ENABLE_MOCK_FALLBACK = true;  // Use mock data if real data not found
    const USE_MOCK_DATA = false;        // Force use of mock data (for testing)
    const MAX_AIRPORTS_TO_TRY = 10;      // Limit how many airports we check
    
    if (USE_MOCK_DATA) {
      console.log("Using mock data for flight lookup");
      return getMockFlightData(data);
    }
    
    // Validate flight number format (should be airline code + numbers)
    if (!data.flightNumber.match(/^[A-Z]{1,3}\d{1,4}$/)) {
      return {
        success: false,
        error: "Invalid flight number format. Please enter an airline code followed by numbers (e.g., BA123)."
      };
    }
    
    // Get all possible callsign variations to help with matching
    const callsignVariations = getCallsignVariations(data.flightNumber);
    if (callsignVariations.length === 0) {
      return {
        success: false,
        error: "Could not parse the flight number correctly."
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
    console.log(`Will try these callsign variations:`, callsignVariations);
    
    // Expanded list of major airports to increase chances of finding the flight
    // Prioritizing major European hubs for EU261 claims
    const airports = [
      "EGLL", "EGKK", // London (Heathrow, Gatwick)
      "EHAM", // Amsterdam
      "LFPG", // Paris Charles de Gaulle
      "EDDF", // Frankfurt
      "LEMD", // Madrid
      "LIRF", // Rome
      "EDDM", // Munich
      "EGLC", "EGSS", // London (City, Stansted)
      "LFPO", // Paris Orly
      "LEBL", // Barcelona
      "LIML", // Milan
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
    
    console.log(`Searching for flight across airports...`);
    
    // Search both arrival and departure (for more chances to find the flight)
    const searchDirections = ['arrival', 'departure'];
    const limitedAirports = airports.slice(0, MAX_AIRPORTS_TO_TRY);
    
    for (const direction of searchDirections) {
      if (matchedFlight) break;
      
      console.log(`Searching ${direction} flights...`);
      
      for (const airport of limitedAirports) {
        if (matchedFlight) break;
        
        const url = `https://opensky-network.org/api/flights/${direction}?airport=${airport}&begin=${beginTime}&end=${endTime}`;
        
        try {
          console.log(`Fetching flights for ${airport} (${direction})...`);
          // Use retry-enabled fetch
          const response = await fetchWithRetry(url);
          
          const flights: OpenSkyFlight[] = await response.json();
          successfulAirports++;
          totalFlightsChecked += flights.length;
          
          // Filter out flights with empty callsigns before adding to allFlights
          const validFlights = flights.filter(f => f.callsign && f.callsign.trim() !== '');
          allFlights = [...allFlights, ...validFlights];
          
          console.log(`Found ${validFlights.length} valid ${direction} flights at ${airport}`);
          
          // Find a flight with matching callsign
          matchedFlight = findMatchingFlight(validFlights, data.flightNumber, data.date);
          
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
    
    // Return mock data in case of unexpected errors
    if (ENABLE_MOCK_FALLBACK) {
      console.log("Error occurred during lookup. Falling back to mock data.");
      return getMockFlightData(data);
    }
    
    return {
      success: false,
      error: "Failed to retrieve flight data. Please try again later."
    };
  }
};
