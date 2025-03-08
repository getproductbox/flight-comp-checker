
import React from "react";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedClaimsButtonProps {
  count: number;
  onShowSavedClaims: () => void;
}

const SavedClaimsButton: React.FC<SavedClaimsButtonProps> = ({
  count,
  onShowSavedClaims,
}) => {
  if (count <= 0) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 h-8 w-8 text-elegant-accent hover:text-elegant-primary"
        onClick={onShowSavedClaims}
      >
        <List className="h-4 w-4" />
        <span className="absolute -top-2 -right-2 bg-elegant-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      </Button>
    </>
  );
};

export default SavedClaimsButton;
