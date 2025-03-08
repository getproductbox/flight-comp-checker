
import React, { useState } from "react";
import FlightForm from "@/components/FlightForm";
import FlightResult from "@/components/FlightResult";
import { AnimatedTransition } from "@/components/ui-custom/AnimatedTransition";

const Index = () => {
  const [flightData, setFlightData] = useState<{
    flightNumber: string;
    date: Date;
    delayHours?: number;
    isEligible?: boolean;
  } | null>(null);

  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (data: { flightNumber: string; date: Date }) => {
    setFlightData(data);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-elegant-background to-elegant-muted/50 p-6">
      <div className="w-full max-w-md relative">
        <AnimatedTransition show={!showResults} animation="fade">
          {!showResults && <FlightForm onSubmit={handleSubmit} />}
        </AnimatedTransition>
        
        <AnimatedTransition show={showResults} animation="fade">
          {showResults && flightData && <FlightResult flightData={flightData} onBack={handleBack} />}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Index;
