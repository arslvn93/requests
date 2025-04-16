import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface MobileFormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void; // Added for the review step
  isBackDisabled: boolean;
  isNextDisabled: boolean;
  isReviewStep: boolean; // To know when to show Submit instead of Next
}

const MobileFormNavigation: React.FC<MobileFormNavigationProps> = ({
  onBack,
  onNext,
  onSubmit,
  isBackDisabled,
  isNextDisabled,
  isReviewStep,
}) => {
  return (
    // Fixed bottom bar, only visible on mobile (flex md:hidden)
    // Added background blur and slight transparency for a modern look
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm border-t border-white/10 md:hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={isBackDisabled}
        className="p-3 rounded-full text-white/60 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors touch-manipulation"
        aria-label="Go back"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Conditional Next/Submit Button */}
      {isReviewStep ? (
        <button
          onClick={onSubmit}
          disabled={isNextDisabled} // Reuse isNextDisabled for submit validation state
          className="flex items-center gap-2 px-5 py-3 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          aria-label="Submit listing"
        >
          Submit
          <Check className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="p-3 rounded-full bg-blue-500/90 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] touch-manipulation"
          aria-label="Go next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MobileFormNavigation;