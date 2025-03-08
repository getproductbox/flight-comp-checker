
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyClaimsStateProps {
  onBack: () => void;
}

const EmptyClaimsState: React.FC<EmptyClaimsStateProps> = ({ onBack }) => {
  return (
    <div className="text-center py-8 px-4">
      <div className="text-elegant-accent mb-4">
        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
        <p>No saved claims found</p>
      </div>
      <Button onClick={onBack} className="mt-4">
        Check a Flight
      </Button>
    </div>
  );
};

export default EmptyClaimsState;
