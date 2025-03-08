
import React from "react";
import { ArrowLeft, CheckCircle, XCircle, Clock, Calendar, Plane } from "lucide-react";
import { GlassCard } from "./ui-custom/GlassCard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AnimatedTransition } from "./ui-custom/AnimatedTransition";
import { FlightResult as FlightResultType } from "@/types/flight";

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

  const scheduledTime = formatTimeString(scheduledArrival);
  const actualTime = formatTimeString(actualArrival);

  return (
    <AnimatedTransition show={true} animation="scale" className="w-full max-w-md mx-auto">
      <GlassCard variant="elevated" className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full mb-4">
            {isEligible ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-400" />
            )}
          </div>
          
          <h1 className="text-2xl font-medium tracking-tight mb-3">
            {isEligible
              ? "You might be eligible!"
              : "Not eligible for compensation"}
          </h1>
          
          <div className="flex items-center justify-center mb-3 text-elegant-accent">
            <Clock className="mr-2 h-5 w-5" />
            <span className="font-medium">
              {delayHours} hour{delayHours !== 1 ? "s" : ""} delay
            </span>
          </div>
          
          <p className="text-elegant-accent text-sm mb-6">
            {isEligible
              ? "Your flight meets the basic criteria for EU 261 compensation."
              : "Your flight delay doesn't meet the 3+ hour threshold required."}
          </p>
        </div>

        <div className={cn(
          "px-5 py-4 rounded-xl mb-6",
          isEligible ? "bg-green-50" : "bg-elegant-muted"
        )}>
          <div className="text-sm text-left">
            <div className="font-medium mb-3">Flight Details</div>
            <div className="text-elegant-accent space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Plane className="mr-2 h-4 w-4" />
                  Flight Number:
                </span>
                <span className="font-medium text-elegant-primary">{flightNumber}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date:
                </span>
                <span className="font-medium text-elegant-primary">{format(date, "PP")}</span>
              </div>

              {scheduledArrival && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Scheduled Arrival:
                  </span>
                  <span className="font-medium text-elegant-primary">{scheduledTime}</span>
                </div>
              )}

              {actualArrival && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Actual Arrival:
                  </span>
                  <span className="font-medium text-elegant-primary">{actualTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isEligible && (
          <div className="text-sm text-elegant-accent mb-6 text-left">
            <strong className="font-medium text-elegant-primary">Next steps:</strong>
            <ul className="mt-2 space-y-1">
              <li>• Contact your airline directly</li>
              <li>• Reference EU Regulation 261/2004</li>
              <li>• Provide your booking reference and flight details</li>
            </ul>
          </div>
        )}

        <Button
          onClick={onBack}
          className="w-full h-12 bg-elegant-primary hover:bg-elegant-primary/90 text-white transition-all duration-300 shadow-elegant hover:shadow-elegant-hover"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Check Another Flight</span>
        </Button>
        
        <div className="mt-6 text-xs text-elegant-accent">
          Disclaimer: This is a preliminary check only. Airlines may apply additional criteria or exceptions.
        </div>
      </GlassCard>
    </AnimatedTransition>
  );
};

export default FlightResult;
