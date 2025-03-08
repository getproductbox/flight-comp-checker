
import React from "react";
import { cn } from "@/lib/utils";
import SuggestionItem from "./SuggestionItem";

interface FlightSuggestionListProps {
  suggestions: string[];
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const FlightSuggestionList: React.FC<FlightSuggestionListProps> = ({
  suggestions,
  showSuggestions,
  onSuggestionClick
}) => {
  if (!showSuggestions) {
    return null;
  }

  return (
    <div 
      className={cn(
        "absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-elegant-border transition-all duration-200",
        showSuggestions ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {suggestions.length > 0 ? (
        <ul className="py-1">
          {suggestions.map((suggestion, index) => (
            <SuggestionItem 
              key={index}
              suggestion={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
            />
          ))}
        </ul>
      ) : (
        <div className="px-4 py-3 text-sm text-elegant-accent/70 italic">
          No matching flights found
        </div>
      )}
    </div>
  );
};

export default FlightSuggestionList;
