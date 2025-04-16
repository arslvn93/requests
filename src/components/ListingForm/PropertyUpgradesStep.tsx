import React, { useState } from 'react';
import { Wrench, Plus, Calendar, Check } from 'lucide-react';

interface UpgradeInfo {
  name: string;
  year: string;
}

interface PropertyUpgradesInfo {
  upgradesDescription: string; // Changed structure
}

interface PropertyUpgradesStepProps {
  value: PropertyUpgradesInfo;
  onChange: (value: PropertyUpgradesInfo) => void;
  onNext: () => void;
}

const PropertyUpgradesStep: React.FC<PropertyUpgradesStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // Removed old state and logic

  const isValid = () => {
    // Step is always valid (optional)
    return true;
  };

  // Rule 3: Added handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No validation needed as step is optional, directly call onNext
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Property Upgrades</h2>
          <p className="text-white/60">Describe any recent improvements (optional)</p>
        </div>
      </div>
      
      {/* Rule 3: Added form wrapper */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Removed old input sections */}
        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">Are there any recent upgrades/renovations?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'upgradesDescription' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Wrench className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="upgradesDescription"
              name="upgradesDescription"
              value={value.upgradesDescription}
              onChange={(e) => onChange({ ...value, upgradesDescription: e.target.value })}
              onFocus={() => setFocusedField('upgradesDescription')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe any recent upgrades, renovations, or special features..."
              rows={5}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Removed Special Features section */}

        {/* Removed Special Features section */}

        {/* Rule 8: Changed type to submit, added disabled attribute */}
        <button
          type="submit"
          disabled={!isValid()} // Keep disabled logic pattern even if always true
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        >
          Next: Property Highlights {/* Adjust if needed */}
        </button>
      </form>
    </div>
  );
};

export default PropertyUpgradesStep;