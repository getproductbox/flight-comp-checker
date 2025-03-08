
import React from "react";
import { Check, AlertCircle } from "lucide-react";

interface InputStatusIndicatorProps {
  isValid: boolean | null;
}

const InputStatusIndicator: React.FC<InputStatusIndicatorProps> = ({ isValid }) => {
  if (isValid === true) {
    return <Check className="h-4 w-4 text-green-500" />;
  } else if (isValid === false) {
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
  return null;
};

export default InputStatusIndicator;
