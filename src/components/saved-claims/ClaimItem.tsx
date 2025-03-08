
import React from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SavedFlightClaim } from "@/types/flight";

interface ClaimItemProps {
  claim: SavedFlightClaim;
  onDelete: (id: string) => void;
}

const ClaimItem: React.FC<ClaimItemProps> = ({ claim, onDelete }) => {
  // Calculate appropriate color based on delay hours
  const getDelayColor = (delayHours: number = 0) => {
    if (delayHours >= 5) return "text-red-500";
    if (delayHours >= 3) return "text-amber-500";
    return "text-yellow-400";
  };

  return (
    <div 
      className={cn(
        "p-4 rounded-lg border text-left",
        claim.isEligible 
          ? "border-green-200 bg-green-50/50" 
          : "border-elegant-border/30 bg-elegant-muted/20"
      )}
    >
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          {claim.isEligible ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
          )}
          <span className="font-medium">
            {claim.flightNumber}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => onDelete(claim.id)}
        >
          <Trash2 className="h-4 w-4 text-elegant-accent" />
        </Button>
      </div>

      <div className="text-sm text-elegant-accent space-y-1">
        <div className="flex justify-between">
          <span className="flex items-center">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            Date:
          </span>
          <span>{format(new Date(claim.date), "PP")}</span>
        </div>
        <div className={cn(
          "flex justify-between",
          getDelayColor(claim.delayHours)
        )}>
          <span className="flex items-center">
            <Clock className="mr-1 h-3.5 w-3.5" />
            Delay:
          </span>
          <span>{claim.delayHours} hour{claim.delayHours !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex justify-between text-xs opacity-70 mt-2 pt-1 border-t border-elegant-border/20">
          <span>Saved:</span>
          <span>{format(new Date(claim.savedAt), "PP")}</span>
        </div>
      </div>
    </div>
  );
};

export default ClaimItem;
