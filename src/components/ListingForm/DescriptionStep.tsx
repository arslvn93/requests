import React, { useState } from 'react';
import { FileText } from 'lucide-react';

interface DescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const DescriptionStep: React.FC<DescriptionStepProps> = ({ value, onChange, onNext }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">Property Description</h2>
      <p className="text-white/60">Write a detailed description of the property (minimum 100 characters)</p>
      <form onSubmit={handleSubmit}>
        <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
          ${isFocused ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <FileText className="w-6 h-6 text-blue-400 mt-1" />
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe the property's unique features, condition, and selling points..."
            rows={6}
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
          />
        </div>
        <div className="flex justify-between items-center mt-2 px-2">
          <span className="text-sm text-white/60">
            {value.length} characters (100+ recommended)
          </span>
        </div>
        {value.trim() && (
          <button
            type="submit"
            className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                     text-white font-medium rounded-xl transition-all duration-200
                     hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Next
          </button>
        )}
      </form>
    </div>
  );
};

export default DescriptionStep;