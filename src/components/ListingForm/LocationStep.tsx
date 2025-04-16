import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ value, onChange, onNext }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">Property Location</h2>
      <div className="relative">
        <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
          ${isFocused ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <MapPin className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter the full property address"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
        </div>
      </div>
      {value && (
        <button
          onClick={onNext}
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default LocationStep;