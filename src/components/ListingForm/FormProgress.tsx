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
      <div className="flex items-center justify-between px-4 py-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors p-2 touch-manipulation"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <button className="text-white/60 hover:text-white text-sm">
          Save Draft
        </button>
      </div>
    </div>
  );
};
export default FormProgress;