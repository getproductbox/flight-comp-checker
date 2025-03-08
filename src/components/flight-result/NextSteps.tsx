
import React from "react";

interface NextStepsProps {
  isEligible: boolean;
}

const NextSteps: React.FC<NextStepsProps> = ({ isEligible }) => {
  if (!isEligible) return null;
  
  return (
    <div className="text-sm text-elegant-accent mb-6 p-4 border border-green-200 rounded-xl bg-green-50/50">
      <strong className="font-medium text-elegant-primary block mb-2">Next steps:</strong>
      <ul className="space-y-2">
        <li className="flex">
          <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
            <span className="text-green-700 text-xs">1</span>
          </span>
          <span>Contact your airline directly via their customer service</span>
        </li>
        <li className="flex">
          <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
            <span className="text-green-700 text-xs">2</span>
          </span>
          <span>Reference EU Regulation 261/2004 in your communication</span>
        </li>
        <li className="flex">
          <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
            <span className="text-green-700 text-xs">3</span>
          </span>
          <span>Provide your booking reference and flight details</span>
        </li>
        <li className="flex">
          <span className="inline-flex items-center justify-center bg-green-100 rounded-full h-5 w-5 min-w-5 mr-2">
            <span className="text-green-700 text-xs">4</span>
          </span>
          <span>Keep all relevant documentation (boarding passes, receipts)</span>
        </li>
      </ul>
    </div>
  );
};

export default NextSteps;
