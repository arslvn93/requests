import React, { useEffect } from 'react';
import { Home, ArrowRight, CornerDownLeft, CheckCircle, AlertTriangle } from 'lucide-react';

// Define props based on expected usage in GenericFormPage, matching IntroComponentRegistry type expectation
interface OpenHouseIntroStepProps {
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void;
  // Add other props if GenericFormPage passes them, e.g., formTypeId
  formTypeId?: string;
}

const OpenHouseIntroStep: React.FC<OpenHouseIntroStepProps> = ({ onNext, onValidationChange }) => {

  // --- Functionality ---
  const handleStart = () => { onNext(); };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') { onNext(); }
  };

  useEffect(() => {
    // Set validation to true (intro steps are always valid)
    onValidationChange(true);

    // Focus the container for keyboard navigation
    const container = document.getElementById('open-house-intro-step-container');
    if (container) {
      container.focus();
    }
  }, [onValidationChange]);

  // --- JSX Structure ---
  return (
    <div
      id="open-house-intro-step-container" // Unique ID
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 pb-8 pt-16 focus:outline-none animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make focusable
    >
      {/* 1. Icon */}
      <div className="flex justify-center mb-8">
        <Home className="w-16 h-16 text-blue-400" />
      </div>

      {/* 2. Main Heading */}
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-white/90 leading-tight">
          Open House Funnel Request <br />
          <span className="inline-block bg-blue-600/40 text-blue-100 px-4 py-1 rounded-lg mt-2 shadow-md">Capture & Convert Leads!</span>
        </h1>
      </div>

      {/* 3. Optimal Results Alert */}
      <div className="bg-yellow-900/30 border border-yellow-600/50 text-yellow-300/90 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 max-w-xl mx-auto">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm text-left">
          <strong>For Optimal Results:</strong> Please provide detailed information to create the most effective landing page and follow-up automation for your open house.
        </p>
      </div>

      {/* 4. Description Paragraph */}
      <p className="text-base text-white/70 max-w-xl mx-auto mb-8">
        This form collects all the necessary details to build a customized Open House Funnel. This includes a dedicated landing page to capture visitor contact information and automated follow-up communications to nurture leads after the event.
      </p>

      {/* 5. Information Section(s) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8 text-left">
        {/* What We'll Create */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white/90 mb-3">What We'll Create:</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Custom Landing Page for visitor sign-in.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Automated Email/SMS follow-up sequence.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Integration with your CRM (if applicable).</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>QR Code for easy access at the event.</span></li>
          </ul>
        </div>

        {/* What We Need */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
           <h3 className="text-lg font-semibold text-white/90 mb-3">What We Need From You:</h3>
           <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>Accurate Property Details & Highlights.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>Specific Open House Date(s) & Time(s).</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>High-Quality Property Photos (min 4).</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>Your Contact Information for setup.</span></li>
           </ul>
        </div>
      </div>

      {/* 6. Start Button */}
      <button
        onClick={handleStart}
        className="bg-blue-500/90 hover:bg-blue-500 text-white font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2 group"
      >
        Start Request
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      {/* 7. Enter Key Hint */}
      <div className="text-xs text-white/50 mt-3 flex items-center gap-2">
        <span>press Enter</span>
        <CornerDownLeft className="w-3 h-3" />
        {/* Optional: Add estimated time */}
        {/* <span className="mx-1">|</span> */}
        {/* <span>Takes ~5 minutes</span> */}
      </div>
    </div>
  );
};

export default OpenHouseIntroStep;