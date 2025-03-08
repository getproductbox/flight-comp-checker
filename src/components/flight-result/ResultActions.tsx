
import React from "react";
import { ArrowLeft, Share2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FlightResult } from "@/types/flight";
import { saveFlightClaim } from "@/services/storage";
import { format } from "date-fns";

interface ResultActionsProps {
  flightData: FlightResult;
  onBack: () => void;
}

const ResultActions: React.FC<ResultActionsProps> = ({ flightData, onBack }) => {
  const { flightNumber, date, isEligible, delayHours } = flightData;
  
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

  // Save claim functionality
  const handleSaveClaim = () => {
    saveFlightClaim(flightData);
    toast({
      title: "Claim saved",
      description: "Your flight claim has been saved for future reference."
    });
  };

  return (
    <div className="flex gap-3 mb-6">
      <Button
        onClick={onBack}
        className="flex-1 h-12 bg-elegant-primary hover:bg-elegant-primary/90 text-white transition-all duration-300 shadow-elegant hover:shadow-elegant-hover"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Check Another</span>
      </Button>
      
      <Button
        onClick={handleSaveClaim}
        variant="outline"
        className="h-12 px-4 border-elegant-border bg-white/80 hover:bg-elegant-muted/20"
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button
        onClick={handleShare}
        variant="outline"
        className="h-12 px-4 border-elegant-border bg-white/80 hover:bg-elegant-muted/20"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ResultActions;
