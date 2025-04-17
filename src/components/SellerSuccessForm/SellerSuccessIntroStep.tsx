import React, { useEffect } from 'react';
import { ThumbsUp, ArrowRight, CornerDownLeft, CheckCircle, AlertTriangle } from 'lucide-react';

// Define props expected by Intro steps (simplified from StepProps)
interface IntroStepProps {
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const SellerSuccessIntroStep: React.FC<IntroStepProps> = ({ onNext, onValidationChange }) => {

  // --- Functionality ---
  const handleStart = () => { onNext(); };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') { onNext(); }
  };

  useEffect(() => {
    // Set validation to true (intro steps are always valid)
    onValidationChange(true);

    // Focus the container for keyboard navigation
    const container = document.getElementById('seller-success-intro-step-container');
    if (container) {
      container.focus();
    }
  }, [onValidationChange]);

  // --- JSX Structure ---
  return (
    <div
      id="seller-success-intro-step-container"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 pb-8 pt-16 focus:outline-none animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make focusable
    >
      {/* 1. Icon */}
      <div className="flex justify-center mb-8">
        <ThumbsUp className="w-16 h-16 text-blue-400" />
      </div>

      {/* 2. Main Heading */}
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-white/90 leading-tight">
          Just Sold - Listing Case Study <br />
          <span className="inline-block bg-blue-600/40 text-blue-100 px-4 py-1 rounded-lg mt-2 shadow-md">Turn Your Win into More Wins!</span>
        </h1>
      </div>

      {/* 3. Optimal Results Alert */}
      <div className="bg-yellow-900/30 border border-yellow-600/50 text-yellow-300/90 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 max-w-xl mx-auto">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm text-left">
          <strong>For Optimal Results:</strong> Please take a few minutes to complete this form with as much detail as possible.
        </p>
      </div>

      {/* 4. Description Paragraph */}
      <p className="text-base text-white/70 max-w-xl mx-auto mb-4">
        You just had an amazing real estate win, eh? Great job! 🎉 Now let’s turn it into a powerful case study that helps you attract even more clients.
      </p>
       <p className="text-base text-white/70 max-w-xl mx-auto mb-8">
         People don’t just want an agent… they want proof that you get results. Case studies do the selling for you!
      </p>

      {/* 5. Information Section(s) */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 max-w-xl mx-auto mb-8 text-left">
         <h3 className="text-lg font-semibold text-white/90 mb-3 text-center">🔥 Fill out this form and our team will create:</h3>
         <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>A Facebook & Instagram ad that builds your brand.</span>
            </li>
            <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>An email campaign that turns leads into listings.</span>
            </li>
         </ul>
      </div>

       <p className="text-base text-white/70 max-w-xl mx-auto mb-8">
         💡 It’s easy! Just answer a few quick questions, and we’ll do the rest. Hit Start and let’s make your success story work for you! 🎯
      </p>


      {/* 6. Start Button */}
      <button
        onClick={handleStart}
        className="bg-blue-500/90 hover:bg-blue-500 text-white font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2 group"
      >
        Start
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      {/* 7. Enter Key Hint */}
      <div className="text-xs text-white/50 mt-3 flex items-center gap-2">
        <span>press Enter</span>
        <CornerDownLeft className="w-3 h-3" />
      </div>
    </div>
  );
};

export default SellerSuccessIntroStep;