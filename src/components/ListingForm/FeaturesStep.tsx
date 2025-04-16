import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';

interface FeaturesStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({ value, onChange, onNext }) => {
  const [customFeature, setCustomFeature] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const defaultFeatures = [
    'Pool',
    'Garden',
    'Fireplace',
    'Central AC',
    'Garage',
    'Basement',
    'Solar Panels',
    'Smart Home',
  ];

  const toggleFeature = (feature: string) => {
    const newFeatures = value.includes(feature)
      ? value.filter(f => f !== feature)
      : [...value, feature];
    onChange(newFeatures);
  };

  const addCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFeature && !value.includes(customFeature)) {
      onChange([...value, customFeature]);
      setCustomFeature('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">Property Features</h2>
      <div className="grid grid-cols-2 gap-4">
        {defaultFeatures.map((feature) => (
          <button
            key={feature}
            onClick={() => toggleFeature(feature)}
            className={`glass-card p-4 flex items-center justify-between transition-all duration-200
              ${value.includes(feature) ? 'border-blue-400 bg-blue-400/10' : ''}`}
          >
            <span className="text-white/90">{feature}</span>
            {value.includes(feature) && (
              <Check className="w-5 h-5 text-blue-400" />
            )}
          </button>
        ))}
      </div>
      
      <form onSubmit={addCustomFeature}>
        <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
          ${isFocused ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Plus className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Add custom feature"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
        </div>
      </form>

      {value.length > 0 && (
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

export default FeaturesStep;