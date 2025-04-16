import React from 'react';
import { Home, Building } from 'lucide-react';

interface PropertyTypeStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const PropertyTypeStep: React.FC<PropertyTypeStepProps> = ({ value, onChange, onNext }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">Property Type</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            onChange('house');
            onNext();
          }}
          className={`glass-card p-8 flex flex-col items-center justify-center gap-4 transition-all duration-200
            ${value === 'house' ? 'border-blue-400 bg-blue-400/10' : ''}`}
        >
          <Home className="w-10 h-10 text-blue-400" />
          <span className="text-white/90 font-medium">House</span>
        </button>
        <button
          onClick={() => {
            onChange('condo');
            onNext();
          }}
          className={`glass-card p-8 flex flex-col items-center justify-center gap-4 transition-all duration-200
            ${value === 'condo' ? 'border-blue-400 bg-blue-400/10' : ''}`}
        >
          <Building className="w-10 h-10 text-blue-400" />
          <span className="text-white/90 font-medium">Condo</span>
        </button>
      </div>
    </div>
  );
};

export default PropertyTypeStep;