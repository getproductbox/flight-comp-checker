
import React from "react";
import { Plane, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FlightDetailsProps {
  flightNumber: string;
  date: Date;
  scheduledArrival?: string;
  actualArrival?: string;
  delayHours: number;
  isEligible: boolean;
  formatTimeString: (timeString?: string) => string;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({
  flightNumber,
  date,
  scheduledArrival,
  actualArrival,
  delayHours,
  isEligible,
  formatTimeString
}) => {
  const scheduledTime = formatTimeString(scheduledArrival);
  const actualTime = formatTimeString(actualArrival);

  // Calculate appropriate color based on delay hours
  const getDelayColor = () => {
    if (delayHours >= 5) return "text-red-500";
    if (delayHours >= 3) return "text-amber-500";
    return "text-yellow-400";
  };

  return (
    <div className={cn(
      "px-5 py-4 rounded-xl mb-6",
      isEligible ? "bg-green-50" : "bg-elegant-muted"
    )}>
      <div className="text-sm text-left">
        <div className="font-medium mb-3">Flight Details</div>
        <div className="text-elegant-accent space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <Plane className="mr-2 h-4 w-4" />
              Flight Number:
            </span>
            <span className="font-medium text-elegant-primary">{flightNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Date:
            </span>
            <span className="font-medium text-elegant-primary">{format(date, "PP")}</span>
          </div>

          {scheduledArrival && (
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Scheduled Arrival:
              </span>
              <span className="font-medium text-elegant-primary">{scheduledTime}</span>
            </div>
          )}

          {actualArrival && (
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Actual Arrival:
              </span>
              <span className="font-medium text-elegant-primary">{actualTime}</span>
            </div>
          )}
          
          {delayHours > 0 && (
            <div className="pt-2 mt-2 border-t border-elegant-border/30">
              <div className={cn(
                "flex justify-between items-center",
                getDelayColor()
              )}>
                <span>Delay Duration:</span>
                <span className="font-medium">{delayHours} hour{delayHours !== 1 ? "s" : ""}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
