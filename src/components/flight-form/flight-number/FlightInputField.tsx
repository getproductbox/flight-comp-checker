
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlightInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isValid: boolean | null;
  onClear: () => void;
}

const FlightInputField: React.FC<FlightInputFieldProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  isValid,
  onClear
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getInputStatusIcon = () => {
    if (value.length === 0) {
      return null;
    }
    
    if (isValid === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (isValid === false) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const handleClearClick = () => {
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <Input
        id="flightNumber"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="e.g. BA123"
        className={cn(
          "border-elegant-border bg-white/80 h-12 text-base placeholder:text-elegant-subtle/60 pr-10",
          isValid === false && "border-red-400 focus-visible:ring-red-400/20"
        )}
        required
      />
      {value.length > 0 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
          {getInputStatusIcon()}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 p-0 -mr-1 text-elegant-subtle hover:text-elegant-accent" 
            onClick={handleClearClick}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlightInputField;
