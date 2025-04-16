import React from 'react';
import { Bed } from 'lucide-react';

interface BedroomsStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const BedroomsStep: React.FC<BedroomsStepProps> = ({ value, onChange, onNext }) => {
  const options = [1, 2, 3, 4, 5];

  const handleSelect = (number: number) => {
    onChange(number.toString());
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">How many bedrooms?</h2>
      <div className="flex justify-center gap-4">
        {options.map((number) => (
          <button
            key={number}
            onClick={() => handleSelect(number)}
            className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-200
              ${value === number.toString()
                ? 'bg-blue-500 text-white border-2 border-blue-400'
                : 'glass-card hover:border-blue-400'
              }`}
          >
            <Bed className="w-5 h-5 mb-1 text-blue-400" />
            <span className="text-lg font-medium">{number}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BedroomsStep;