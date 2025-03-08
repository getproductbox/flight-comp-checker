
import React from "react";
import { Check, AlertCircle } from "lucide-react";

interface FlightNumberValidationProps {
  isValid: boolean | null;
  errorMessage: string | null;
}

const FlightNumberValidation: React.FC<FlightNumberValidationProps> = ({
  isValid,
  errorMessage
}) => {
  if (isValid === null) {
    return null;
  }
  
  if (isValid) {
    return (
      <div className="flex items-center gap-1 text-green-500 text-xs mt-1 ml-1">
        <Check className="h-3.5 w-3.5" />
        <span>Valid flight number</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1 animate-fade-in">
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{errorMessage || "Invalid flight number"}</span>
    </div>
  );
};

export default FlightNumberValidation;
