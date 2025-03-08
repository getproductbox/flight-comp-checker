
import React from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";

interface InputStatusIndicatorProps {
  isValid: boolean | null;
  isLoading?: boolean;
}

const InputStatusIndicator: React.FC<InputStatusIndicatorProps> = ({ 
  isValid, 
  isLoading = false 
}) => {
  if (isLoading) {
    return <Loader2 className="h-4 w-4 text-elegant-accent animate-spin" />;
  }
  
  if (isValid === true) {
    return <Check className="h-4 w-4 text-green-500" />;
  } 
  
  if (isValid === false) {
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
  
  return null;
};

export default InputStatusIndicator;
