
import React from "react";

interface SavedClaimsHeaderProps {
  claimsCount: number;
}

const SavedClaimsHeader: React.FC<SavedClaimsHeaderProps> = ({ claimsCount }) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-medium tracking-tight mb-2">Saved Claims</h1>
      <p className="text-elegant-accent text-sm">
        {claimsCount > 0 
          ? "Your saved flight claims for future reference" 
          : "You haven't saved any flight claims yet"}
      </p>
    </div>
  );
};

export default SavedClaimsHeader;
