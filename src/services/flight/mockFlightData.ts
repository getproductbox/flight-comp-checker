
import { FlightFormData, FlightLookupResponse } from "@/types/flight";

// Mock implementation for testing or fallback
export const getMockFlightData = (data: FlightFormData): FlightLookupResponse => {
  // Generate mock delay (1-6 hours)
  const mockDelay = Math.floor(Math.random() * 6) + 1;
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
  return {
    success: true,
    flight: {
      actualArrival,
      delayHours: mockDelay,
      isEligible
    }
  };
};
