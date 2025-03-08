
import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultHeaderProps {
  isEligible: boolean;
  delayHours: number;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ isEligible, delayHours }) => {
  // Calculate appropriate color based on delay hours
  const getDelayColor = () => {
    if (delayHours >= 5) return "text-red-500";
    if (delayHours >= 3) return "text-amber-500";
    return "text-yellow-400";
  };
  
  return (
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
  );
};

export default ResultHeader;
