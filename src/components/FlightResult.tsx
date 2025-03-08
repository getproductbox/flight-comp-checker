
import React from "react";
import { ArrowLeft, CheckCircle, XCircle, Clock, Calendar, Plane, Share2 } from "lucide-react";
import { GlassCard } from "./ui-custom/GlassCard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AnimatedTransition } from "./ui-custom/AnimatedTransition";
import { FlightResult as FlightResultType } from "@/types/flight";
import { toast } from "@/components/ui/use-toast";

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
  
  // Share result functionality
  const handleShare = async () => {
    const shareText = `My flight ${flightNumber} on ${format(date, "PP")} was delayed by ${delayHours} hours. ${isEligible ? "I might be eligible for EU261 compensation!" : ""}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Flight Delay Checker Result",
          text: shareText,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Result has been copied to your clipboard."
        });
      }
    } catch (error) {
      console.error("Error sharing result:", error);
    }
  };

  // Calculate appropriate color based on delay hours
  const getDelayColor = () => {
    if (delayHours >= 5) return "text-red-500";
    if (delayHours >= 3) return "text-amber-500";
    return "text-yellow-400";
  };

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
          
          <div className={cn("flex items-center justify-center mb-3", getDelayColor())}>
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
              
              {delayHours > 0 && (
                <div className="pt-2 mt-2 border-t border-elegant-border/30">
                  <div className={cn(
                    "flex justify-between items-center",
                    getDelayColor()
                  )}>
                    <span>Delay Duration:</span>
                    <span className="font-medium">{delayHours} hour{delayHours !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isEligible && (
          <div className="text-sm text-elegant-accent mb-6 p-4 border border-green-200 rounded-xl bg-green-50/50">
            <strong className="font-medium text-elegant-primary block mb-2">Next steps:</strong>
            <ul className="space-y-2">
              <li className="flex">
                <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
                  <span className="text-green-700 text-xs">1</span>
                </span>
                <span>Contact your airline directly via their customer service</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
                  <span className="text-green-700 text-xs">2</span>
                </span>
                <span>Reference EU Regulation 261/2004 in your communication</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
                  <span className="text-green-700 text-xs">3</span>
                </span>
                <span>Provide your booking reference and flight details</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
                  <span className="text-green-700 text-xs">4</span>
                </span>
                <span>Keep all relevant documentation (boarding passes, receipts)</span>
              </li>
            </ul>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <Button
            onClick={onBack}
            className="flex-1 h-12 bg-elegant-primary hover:bg-elegant-primary/90 text-white transition-all duration-300 shadow-elegant hover:shadow-elegant-hover"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Check Another</span>
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="h-12 px-4 border-elegant-border bg-white/80 hover:bg-elegant-muted/20"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-elegant-accent bg-elegant-muted/30 p-3 rounded-lg">
          <p className="font-medium text-elegant-primary/80 mb-1">Disclaimer:</p>
          <p>This is a preliminary check only. Airlines may apply additional criteria or exceptions based on the specific circumstances of your flight.</p>
        </div>
      </GlassCard>
    </AnimatedTransition>
  );
};

export default FlightResult;
