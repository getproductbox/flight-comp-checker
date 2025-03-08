
import React from "react";
import { XCircle, ArrowLeft, Search } from "lucide-react";
import { GlassCard } from "./ui-custom/GlassCard";
import { Button } from "@/components/ui/button";
import { AnimatedTransition } from "./ui-custom/AnimatedTransition";

interface FlightNotFoundProps {
  message: string;
  onBack: () => void;
}

const FlightNotFound: React.FC<FlightNotFoundProps> = ({ message, onBack }) => {
  return (
    <AnimatedTransition show={true} animation="scale" className="w-full max-w-md mx-auto">
      <GlassCard variant="elevated" className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full mb-4">
            <XCircle className="h-16 w-16 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-medium tracking-tight mb-3">
            Flight Not Found
          </h1>
          
          <p className="text-elegant-accent text-sm mb-6">
            {message}
          </p>
        </div>

        <div className="bg-elegant-muted/40 px-5 py-4 rounded-xl mb-6">
          <div className="text-sm text-left">
            <div className="font-medium mb-3">Suggestions:</div>
            <div className="text-elegant-accent space-y-2">
              <div className="flex items-start">
                <Search className="h-4 w-4 mr-2 mt-0.5" />
                <span>Double-check your flight number format (e.g., BA123)</span>
              </div>
              <div className="flex items-start">
                <Search className="h-4 w-4 mr-2 mt-0.5" />
                <span>Try a different date (OpenSky may have limited historical data)</span>
              </div>
              <div className="flex items-start">
                <Search className="h-4 w-4 mr-2 mt-0.5" />
                <span>Major EU airports have better coverage in the API</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-elegant-primary hover:bg-elegant-primary/90 text-white transition-all duration-300 shadow-elegant hover:shadow-elegant-hover"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Try Another Flight</span>
        </Button>
      </GlassCard>
    </AnimatedTransition>
  );
};

export default FlightNotFound;
