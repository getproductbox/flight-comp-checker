
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import FlightForm from "@/components/FlightForm";
import FlightResult from "@/components/FlightResult";
import FlightNotFound from "@/components/FlightNotFound";
import { AnimatedTransition } from "@/components/ui-custom/AnimatedTransition";
import { FlightFormData, FlightResult as FlightResultType } from "@/types/flight";
import { lookupFlight } from "@/services/flightService";

const Index = () => {
  const [flightData, setFlightData] = useState<FlightResultType | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: FlightFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await lookupFlight(data);
      
      if (response.success && response.flight) {
        const result: FlightResultType = {
          flightNumber: data.flightNumber,
          date: data.date,
          scheduledArrival: data.scheduledArrival,
          actualArrival: response.flight.actualArrival,
          delayHours: response.flight.delayHours,
          isEligible: response.flight.isEligible
        };
        
        setFlightData(result);
        setShowResults(true);
      } else {
        setErrorMessage(response.error || "Failed to retrieve flight data");
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error processing flight:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setShowResults(true);
      
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-elegant-background to-elegant-muted/50 p-6">
      <div className="w-full max-w-md relative">
        <AnimatedTransition show={!showResults} animation="fade">
          {!showResults && <FlightForm onSubmit={handleSubmit} isLoading={isLoading} />}
        </AnimatedTransition>
        
        <AnimatedTransition show={showResults && !errorMessage} animation="fade">
          {showResults && !errorMessage && flightData && (
            <FlightResult flightData={flightData} onBack={handleBack} />
          )}
        </AnimatedTransition>
        
        <AnimatedTransition show={showResults && !!errorMessage} animation="fade">
          {showResults && errorMessage && (
            <FlightNotFound message={errorMessage} onBack={handleBack} />
          )}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Index;
