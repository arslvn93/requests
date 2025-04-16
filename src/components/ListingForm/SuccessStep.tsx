import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { CheckCircle, RotateCcw } from 'lucide-react';

// Simple hook to get window dimensions
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

interface SuccessStepProps {
  submissionMessage: string;
  onReset: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ submissionMessage, onReset }) => {
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Stop confetti after a short duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Show confetti for 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 pb-8 pt-16">
      {showConfetti && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={300} />}

      <CheckCircle className="w-16 h-16 text-green-400 mb-6" />

      <h2 className="text-3xl font-bold text-white/90 mb-4">Listing Submitted!</h2>

      <p className="text-white/70 mb-8 max-w-md">
        {submissionMessage || 'Your listing details have been successfully submitted.'}
      </p>

      <button
        onClick={onReset}
        className="mt-8 py-3 px-6 bg-blue-500/90 hover:bg-blue-500
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-5 h-5" />
        Submit Another Listing
      </button>
    </div>
  );
};

export default SuccessStep;