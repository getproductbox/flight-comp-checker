
import { FlightResult } from "@/types/flight";

const STORAGE_KEY = 'flightclaims';

/**
 * Save a flight claim to localStorage
 */
export const saveFlightClaim = (flightData: FlightResult): void => {
  try {
    // Get existing claims
    const existingClaims = getSavedFlightClaims();
    
    // Generate a unique ID for the claim (using timestamp + flight number)
    const claimId = `${Date.now()}-${flightData.flightNumber}`;
    
    // Add the new claim with its ID
    const updatedClaims = [
      { id: claimId, ...flightData, savedAt: new Date().toISOString() },
      ...existingClaims
    ];
    
    // Store updated claims
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClaims));
    
    console.log('Flight claim saved:', claimId);
  } catch (error) {
    console.error('Error saving flight claim:', error);
  }
};

/**
 * Get all saved flight claims from localStorage
 */
export const getSavedFlightClaims = (): Array<FlightResult & { id: string, savedAt: string }> => {
  try {
    const claims = localStorage.getItem(STORAGE_KEY);
    return claims ? JSON.parse(claims) : [];
  } catch (error) {
    console.error('Error retrieving saved flight claims:', error);
    return [];
  }
};

/**
 * Remove a specific flight claim from localStorage
 */
export const clearFlightClaim = (claimId: string): void => {
  try {
    const existingClaims = getSavedFlightClaims();
    const updatedClaims = existingClaims.filter(claim => claim.id !== claimId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClaims));
    console.log('Flight claim removed:', claimId);
  } catch (error) {
    console.error('Error removing flight claim:', error);
  }
};
