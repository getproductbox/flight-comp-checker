
import React from "react";
import { XCircle, ArrowLeft, Search, RefreshCw, PlaneTakeoff } from "lucide-react";
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
            <div className="text-elegant-accent space-y-3">
              <div className="flex items-start">
                <PlaneTakeoff className="h-4 w-4 mr-2 mt-0.5 text-elegant-primary/70" />
                <span>Double-check your flight number format (e.g., BA123, LH456)</span>
              </div>
              <div className="flex items-start">
                <RefreshCw className="h-4 w-4 mr-2 mt-0.5 text-elegant-primary/70" />
                <span>Try a different date (OpenSky may have limited historical data)</span>
              </div>
              <div className="flex items-start">
                <Search className="h-4 w-4 mr-2 mt-0.5 text-elegant-primary/70" />
                <span>Major EU airports have better coverage in the API</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-elegant-border/60 rounded-xl bg-white/40 mb-6">
          <h3 className="text-sm font-medium mb-2 text-elegant-primary">Popular Test Flights:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-elegant-muted/30 rounded-lg">
              <div className="font-medium">British Airways</div>
              <div className="text-elegant-accent">BA341 • March 8, 2025</div>
            </div>
            <div className="p-2 bg-elegant-muted/30 rounded-lg">
              <div className="font-medium">Lufthansa</div>
              <div className="text-elegant-accent">LH5JN • March 8, 2025</div>
            </div>
            <div className="p-2 bg-elegant-muted/30 rounded-lg">
              <div className="font-medium">EasyJet</div>
              <div className="text-elegant-accent">U226YH • March 8, 2025</div>
            </div>
            <div className="p-2 bg-elegant-muted/30 rounded-lg">
              <div className="font-medium">Ryanair</div>
              <div className="text-elegant-accent">FR2WJ • March 8, 2025</div>
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
