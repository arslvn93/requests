import React, { useEffect } from 'react';
import { Edit, ArrowRight, CornerDownLeft, CheckCircle, AlertTriangle } from 'lucide-react'; // Add necessary icons

// Define props expected by this Intro step
interface VideoEditIntroStepProps {
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void; // Included for consistency, always valid
}

const VideoEditIntroStep: React.FC<VideoEditIntroStepProps> = ({ onNext, onValidationChange }) => {

  // This step is always considered "valid" for navigation purposes
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  const handleStart = () => {
    onNext(); // Call the onNext function passed from the parent container
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onNext();
    }
  };

  // Add focus management and keydown listener to the main div
  React.useEffect(() => {
    const container = document.getElementById('video-edit-intro-step-container');
    if (container) {
      container.focus();
    }
    // This step is always valid to proceed from
    onValidationChange(true);
  }, [onValidationChange]); // Add dependency


  return (
    <div
      id="video-edit-intro-step-container"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 pb-8 pt-16 focus:outline-none animate-fade-in" // Apply styles, keep animation
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make the div focusable
    >
      {/* Icon */}
      <div className="flex justify-center mb-8"> {/* Add bottom margin */}
        <Edit className="w-16 h-16 text-blue-400" />
      </div>

      {/* Header - Match Listing Ad style */}
      <div className="space-y-2 mb-8"> {/* Add bottom margin */}
        <h1 className="text-4xl font-bold text-white/90 leading-tight">
          Video Editing Request <br />
          <span className="inline-block bg-blue-600/40 text-blue-100 px-4 py-1 rounded-lg mt-2 shadow-md">Submit Your Changes</span>
        </h1>
      </div>

      {/* Optimal Results Alert - Moved to correct position */}
      <div className="bg-yellow-900/30 border border-yellow-600/50 text-yellow-300/90 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 max-w-xl mx-auto">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm text-left">
          <strong>For Optimal Results:</strong> Please take a few minutes to complete this form with as much detail as possible.
        </p>
      </div>

      {/* Description Paragraph - Moved below alert */}
      <p className="text-base text-white/70 max-w-xl mx-auto mb-8"> {/* Added bottom margin */}
        Need modifications, adjustments, or additional edits? Submit your change requests here. Be specific for faster revisions!
      </p>

      {/* Info Sections - Using two-column layout like Listing Ad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8 text-left">
        {/* How It Works Section */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white/90 mb-3">How It Works:</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Submit requested changes via this form.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Our team reviews and begins revisions.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Turnaround: 1-3 business days (may vary).</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>For urgent edits, contact clientcare@salesgenius.co after submitting.</span></li>
          </ul>
        </div>

        {/* Important Notes Section */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
           <h3 className="text-lg font-semibold text-white/90 mb-3">Important Notes:</h3>
           <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>Fill out one form per video requiring edits.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>Be specific! Clear instructions = faster revisions.</span></li>
           </ul>
        </div>
      </div>

      {/* Start Button - Match Listing Ad style */}
      <button
        onClick={handleStart}
        className="bg-blue-500/90 hover:bg-blue-500 text-white font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2 group"
      >
        Start Request
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
      {/* Enter Key Hint - Match Listing Ad style */}
      <div className="text-xs text-white/50 mt-3 flex items-center gap-2">
        <span>press Enter</span>
        <CornerDownLeft className="w-3 h-3" />
      </div>
    </div>
  );
};

export default VideoEditIntroStep;