
import React from "react";
import { Loader2 } from "lucide-react";

interface InputStatusIndicatorProps {
  isLoading?: boolean;
}

const InputStatusIndicator: React.FC<InputStatusIndicatorProps> = ({ 
  isLoading = false 
}) => {
  if (isLoading) {
    return <Loader2 className="h-4 w-4 text-elegant-accent animate-spin" />;
  }
  
  return null;
};

export default InputStatusIndicator;
