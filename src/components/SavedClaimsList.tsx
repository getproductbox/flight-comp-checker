
import React from "react";
import { GlassCard } from "./ui-custom/GlassCard";
import { Button } from "@/components/ui/button";
import { SavedFlightClaim } from "@/types/flight";
import { getSavedFlightClaims, clearFlightClaim } from "@/services/storage";
import { toast } from "@/components/ui/use-toast";

// Import the new smaller components
import SavedClaimsHeader from "./saved-claims/SavedClaimsHeader";
import EmptyClaimsState from "./saved-claims/EmptyClaimsState";
import ClaimItem from "./saved-claims/ClaimItem";

interface SavedClaimsListProps {
  onBack: () => void;
}

const SavedClaimsList: React.FC<SavedClaimsListProps> = ({ onBack }) => {
  const [claims, setClaims] = React.useState<SavedFlightClaim[]>([]);

  React.useEffect(() => {
    // Load saved claims when component mounts
    setClaims(getSavedFlightClaims());
  }, []);

  const handleDeleteClaim = (id: string) => {
    clearFlightClaim(id);
    setClaims(getSavedFlightClaims());
    toast({
      title: "Claim deleted",
      description: "The flight claim has been removed from your saved claims."
    });
  };

  return (
    <GlassCard variant="elevated" className="w-full max-w-md mx-auto">
      <SavedClaimsHeader claimsCount={claims.length} />

      {claims.length === 0 ? (
        <EmptyClaimsState onBack={onBack} />
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {claims.map((claim) => (
              <ClaimItem 
                key={claim.id}
                claim={claim} 
                onDelete={handleDeleteClaim} 
              />
            ))}
          </div>
          
          <Button 
            onClick={onBack}
            className="w-full"
          >
            Back to Flight Checker
          </Button>
        </>
      )}
    </GlassCard>
  );
};

export default SavedClaimsList;
