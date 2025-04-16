import React, { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react'; // Added Sparkles icon

interface PropertyHighlightsInfo {
  topFeatures: string;
  wowFactor: string;
  firstImpression: string;
  hiddenGems: string;
}

interface PropertyHighlightsStepProps {
  value: PropertyHighlightsInfo;
  onChange: (value: PropertyHighlightsInfo) => void;
  onNext: () => void;
}

const PropertyHighlightsStep: React.FC<PropertyHighlightsStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof PropertyHighlightsInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const isValid = () => {
    return (
      value.topFeatures.trim().length > 0 &&
      value.wowFactor.trim().length > 0 &&
      value.firstImpression.trim().length > 0 &&
      value.hiddenGems.trim().length > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      {/* Rule 2: Added consistent header structure with icon */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Property Highlights</h2>
          <p className="text-white/60">Help us showcase what makes this property special</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">What are the top 3-5 selling features of this home?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'topFeatures' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.topFeatures}
              onChange={(e) => updateField('topFeatures', e.target.value)}
              onFocus={() => setFocusedField('topFeatures')}
              onBlur={() => setFocusedField(null)}
              placeholder="Examples: Open-concept kitchen, large backyard, lake view, school zone, etc."
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">What's the biggest WOW factor about this home?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'wowFactor' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.wowFactor}
              onChange={(e) => updateField('wowFactor', e.target.value)}
              onFocus={() => setFocusedField('wowFactor')}
              onBlur={() => setFocusedField(null)}
              placeholder="What's the one feature that makes this property stand out from others?"
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">What's one thing people LOVE when they walk in?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'firstImpression' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.firstImpression}
              onChange={(e) => updateField('firstImpression', e.target.value)}
              onFocus={() => setFocusedField('firstImpression')}
              onBlur={() => setFocusedField(null)}
              placeholder="What's the first positive reaction most visitors have?"
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">What are some things people don't immediately notice but should?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'hiddenGems' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.hiddenGems}
              onChange={(e) => updateField('hiddenGems', e.target.value)}
              onFocus={() => setFocusedField('hiddenGems')}
              onBlur={() => setFocusedField(null)}
              placeholder="Hidden features or benefits that add value"
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next: Investment Potential
        </button>
      </form>
    </div>
  );
};

export default PropertyHighlightsStep;