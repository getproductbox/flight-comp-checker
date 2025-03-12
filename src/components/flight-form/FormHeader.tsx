import React from "react";
import { PlaneTakeoff } from "lucide-react";
import SavedClaimsButton from "./SavedClaimsButton";
interface FormHeaderProps {
  savedClaimsCount: number;
  onShowSavedClaims?: () => void;
}
const FormHeader: React.FC<FormHeaderProps> = ({
  savedClaimsCount,
  onShowSavedClaims
}) => {
  return <div className="text-center mb-8 relative">
      {savedClaimsCount > 0 && onShowSavedClaims && <SavedClaimsButton count={savedClaimsCount} onShowSavedClaims={onShowSavedClaims} />}
      <div className="inline-flex items-center justify-center p-2 bg-elegant-muted rounded-full mb-4">
        <PlaneTakeoff className="h-6 w-6 text-elegant-primary" />
      </div>
      <h1 className="text-2xl font-medium tracking-tight mb-2">Flight Comp Checker</h1>
      <p className="text-elegant-accent text-sm">
        Check if your delayed flight is eligible for compensation
      </p>
    </div>;
};
export default FormHeader;