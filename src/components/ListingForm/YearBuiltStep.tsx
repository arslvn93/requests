import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface YearBuiltStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const YearBuiltStep: React.FC<YearBuiltStepProps> = ({ value, onChange, onNext }) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (input && parseInt(input) > currentYear) return;
    onChange(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value && value.length === 4) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">When was it built?</h2>
      <form onSubmit={handleSubmit}>
        <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
          ${isFocused ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Calendar className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter year built"
            maxLength={4}
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
        </div>
        {value && value.length === 4 && parseInt(value) <= currentYear && (
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
}

export default YearBuiltStep;