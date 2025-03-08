
import React, { useState, useEffect } from "react";
import { GlassCard } from "./ui-custom/GlassCard";
import { FlightFormData } from "@/types/flight";
import { getSavedFlightClaims } from "@/services/storage";

// Import refactored components
import FlightNumberInput from "./flight-form/FlightNumberInput";
import FlightDatePicker from "./flight-form/FlightDatePicker";
import ArrivalTimeInput from "./flight-form/ArrivalTimeInput";
import SubmitButton from "./flight-form/SubmitButton";
import FormHeader from "./flight-form/FormHeader";
import FormFooter from "./flight-form/FormFooter";

interface FlightFormProps {
  onSubmit: (data: FlightFormData) => void;
  isLoading?: boolean;
  onShowSavedClaims?: () => void;
}

const FlightForm: React.FC<FlightFormProps> = ({
  onSubmit,
  isLoading = false,
  onShowSavedClaims,
}) => {
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledArrival, setScheduledArrival] = useState("");
  const [isFlightNumberFocused, setIsFlightNumberFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);
  
  // Get saved claims count
  const [savedClaimsCount, setSavedClaimsCount] = useState(0);
  
  useEffect(() => {
    // Update saved claims count when component mounts
    const claims = getSavedFlightClaims();
    setSavedClaimsCount(claims.length);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flightNumber && date) {
      onSubmit({ flightNumber, date, scheduledArrival });
    }
  };

  return (
    <GlassCard
      className="w-full max-w-md mx-auto animate-scale-in"
      variant="elevated"
    >
      <FormHeader 
        savedClaimsCount={savedClaimsCount} 
        onShowSavedClaims={onShowSavedClaims} 
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FlightNumberInput
          value={flightNumber}
          onChange={setFlightNumber}
          isFocused={isFlightNumberFocused}
          onFocus={() => setIsFlightNumberFocused(true)}
          onBlur={() => setIsFlightNumberFocused(false)}
        />

        <FlightDatePicker
          date={date}
          onDateChange={setDate}
          isFocused={isDateFocused}
          onFocus={() => setIsDateFocused(true)}
          onBlur={() => setIsDateFocused(false)}
        />

        <ArrivalTimeInput
          value={scheduledArrival}
          onChange={setScheduledArrival}
          isFocused={isTimeFocused}
          onFocus={() => setIsTimeFocused(true)}
          onBlur={() => setIsTimeFocused(false)}
        />

        <SubmitButton isLoading={isLoading} />
      </form>
      
      <FormFooter 
        savedClaimsCount={savedClaimsCount} 
        onShowSavedClaims={onShowSavedClaims} 
      />
    </GlassCard>
  );
};

export default FlightForm;
