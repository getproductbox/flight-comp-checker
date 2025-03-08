
import React from "react";
import { Search } from "lucide-react";
import { extractAirlineCode, extractFlightNumber } from "./flightNumberUtils";

interface SuggestionItemProps {
  suggestion: string;
  onClick: () => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestion, onClick }) => {
  const airlineCode = extractAirlineCode(suggestion);
  const flightNumber = extractFlightNumber(suggestion);

  return (
    <li
      className="px-4 py-2 hover:bg-elegant-muted/30 cursor-pointer text-elegant-primary flex items-center"
      onClick={onClick}
    >
      <Search className="h-3.5 w-3.5 mr-2 text-elegant-accent/70" />
      <span className="font-medium">{airlineCode}</span>
      <span>{flightNumber}</span>
    </li>
  );
};

export default SuggestionItem;
