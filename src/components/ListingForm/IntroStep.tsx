import React, { useEffect } from 'react'; // Import useEffect
// Removed incorrect Button import
import { AlertTriangle, CheckCircle, ArrowRight, CornerDownLeft } from 'lucide-react';

interface IntroStepProps {
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void; // Add prop for validation status
}

const IntroStep: React.FC<IntroStepProps> = ({ onNext, onValidationChange }) => { // Destructure new prop

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onNext();
    }
  };

  // Add focus management and keydown listener to the main div
  React.useEffect(() => {
    const container = document.getElementById('intro-step-container');
    if (container) {
      container.focus();
    }
    // This step is always valid to proceed from
    onValidationChange(true);
  }, [onValidationChange]); // Add dependency


  return (
    <div
      id="intro-step-container"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 pb-8 pt-16 focus:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make the div focusable
    >
      <h1 className="text-4xl font-bold text-white/90 mb-8 leading-tight"> {/* Increased bottom margin and adjusted line height */}
        Submit Your Listing <br />
        <span className="inline-block bg-blue-600/40 text-blue-100 px-4 py-1 rounded-lg mt-2 shadow-md">We’ll Handle the Ads!</span>
      </h1>

      <div className="bg-yellow-900/30 border border-yellow-600/50 text-yellow-300/90 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 max-w-xl mx-auto">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm text-left">
          <strong>For Optimal Results:</strong> Please take a few minutes to complete this form with as much detail as possible.
        </p>
      </div>

      <p className="text-white/70 mb-8 max-w-xl mx-auto text-base">
        We ask for a lot of details because we don’t just create generic ads – we craft high-converting custom ones that get you more leads and make you look like a rockstar to sellers. 🎯
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8 text-left">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white/90 mb-3">What to Expect:</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>3 business day turnaround for ad production</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Your approval via Slack before launch</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Next-day go-live at 6:00 AM (business days) after approval</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Support available Mon-Fri, 9 AM–5 PM (weekend approvals processed Monday)</span></li>
          </ul>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white/90 mb-3">Important Guidelines:</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>We ONLY use the information provided in this form</span></li>
            <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>We DO NOT look up external photos, videos or MLS listings</span></li>
            <li className="flex items-start gap-2"><span className="text-lg mt-[-2px] flex-shrink-0">😁</span><span>Better details = better ads for your property</span></li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-white/60 mb-6 max-w-xl mx-auto">
        By submitting this form, you acknowledge that the information provided is accurate and complete.
      </p>

      <p className="text-sm text-white/80 mb-8 max-w-xl mx-auto">
        👉 Most questions are optional, but highly recommended for better results.
      </p>

      <button
        onClick={onNext}
        className="bg-blue-500/90 hover:bg-blue-500 text-white font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2 group
                   hidden md:flex" // Hide on mobile, show on desktop (flex)
      >
        Start
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
      <div className="text-xs text-white/50 mt-3 flex items-center gap-2">
        <span>press Enter</span>
        <CornerDownLeft className="w-3 h-3" />
        <span className="mx-1">|</span>
        <span>Takes 7+ minutes</span>
      </div>
    </div>
  );
};

export default IntroStep;