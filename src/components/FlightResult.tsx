
import React from "react";
import { GlassCard } from "./ui-custom/GlassCard";
import { format } from "date-fns";
import { AnimatedTransition } from "./ui-custom/AnimatedTransition";
import { FlightResult as FlightResultType } from "@/types/flight";

// Import the new smaller components
import ResultHeader from "./flight-result/ResultHeader";
import FlightDetails from "./flight-result/FlightDetails";
import NextSteps from "./flight-result/NextSteps";
import ResultActions from "./flight-result/ResultActions";
import Disclaimer from "./flight-result/Disclaimer";

interface FlightResultProps {
  flightData: FlightResultType;
  onBack: () => void;
}

const FlightResult: React.FC<FlightResultProps> = ({ flightData, onBack }) => {
  const { 
    flightNumber, 
    date, 
    scheduledArrival, 
    actualArrival, 
    delayHours = 0, 
    isEligible = false 
  } = flightData;

  // Format time string for display
  const formatTimeString = (timeString?: string): string => {
    if (!timeString) return "Not available";
    
    // Handle ISO date strings from the backend
    if (timeString.includes('T')) {
      return format(new Date(timeString), 'HH:mm');
    }
    
    // Handle HH:MM format from the form
    return timeString;
  };

  return (
    <AnimatedTransition show={true} animation="scale" className="w-full max-w-md mx-auto">
      <GlassCard variant="elevated" className="text-center">
        <ResultHeader 
          isEligible={isEligible} 
          delayHours={delayHours} 
        />
        
        <FlightDetails 
          flightNumber={flightNumber}
          date={date}
          scheduledArrival={scheduledArrival}
          actualArrival={actualArrival}
          delayHours={delayHours}
          isEligible={isEligible}
          formatTimeString={formatTimeString}
        />
        
        <NextSteps isEligible={isEligible} />
        
        <ResultActions 
          flightData={flightData}
          onBack={onBack}
        />
        
        <Disclaimer />
      </GlassCard>
    </AnimatedTransition>
  );
};

export default FlightResult;
