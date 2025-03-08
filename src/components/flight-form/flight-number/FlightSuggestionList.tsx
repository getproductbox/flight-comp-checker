
import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
            <li
              key={index}
              className="px-4 py-2 hover:bg-elegant-muted/30 cursor-pointer text-elegant-primary flex items-center"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <Search className="h-3.5 w-3.5 mr-2 text-elegant-accent/70" />
              {suggestion}
            </li>
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
