
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import InputStatusIndicator from "./InputStatusIndicator";

interface FlightInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isValid: boolean | null;
  isLoading?: boolean;
  onClear: () => void;
}

const FlightInputField: React.FC<FlightInputFieldProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  isValid,
  isLoading = false,
  onClear
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearClick = () => {
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add handling for escape key to clear input
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      onClear();
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
        onKeyDown={handleKeyDown}
        placeholder="e.g. BA123"
        className={cn(
          "border-elegant-border bg-white/80 h-12 text-base placeholder:text-elegant-subtle/60 pr-10",
          isValid === false && "border-red-400 focus-visible:ring-red-400/20"
        )}
        required
      />
      {value.length > 0 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
          <InputStatusIndicator isValid={isValid} isLoading={isLoading} />
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
