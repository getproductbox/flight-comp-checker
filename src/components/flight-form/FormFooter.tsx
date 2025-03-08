
import React from "react";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormFooterProps {
  savedClaimsCount: number;
  onShowSavedClaims?: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({
  savedClaimsCount,
  onShowSavedClaims,
}) => {
  return (
    <>
      <div className="mt-8 text-xs text-elegant-accent text-center">
        We check flight delays against EU 261 regulation criteria.
        <br />
        This is only an eligibility check, not a guarantee of compensation.
      </div>
      
      {savedClaimsCount > 0 && onShowSavedClaims && (
        <div className="mt-4 pt-4 border-t border-elegant-border/20 text-center">
          <Button 
            variant="ghost" 
            className="text-elegant-accent text-sm" 
            onClick={onShowSavedClaims}
          >
            <List className="h-4 w-4 mr-2" />
            View {savedClaimsCount} saved claim{savedClaimsCount !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </>
  );
};

export default FormFooter;
