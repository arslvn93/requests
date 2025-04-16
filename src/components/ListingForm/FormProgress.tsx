import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, totalSteps, onBack, showBack = true }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-white/10">
        <div 
          className="h-full bg-blue-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Container for the top back button - hidden on mobile, flex on desktop */}
      <div className="hidden md:flex items-center justify-start px-4 py-3"> {/* Changed justify-between to justify-start */}
        {showBack ? (
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors p-2 touch-manipulation"
            aria-label="Go back" // Added aria-label
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10 h-10" /> // Keep placeholder for alignment if needed, added height
        )}
        {/* "Save Draft" button removed */}
      </div>
    </div>
  );
};
export default FormProgress;