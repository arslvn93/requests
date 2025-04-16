import React, { useState } from 'react';
import { Users, FileText } from 'lucide-react';

interface TargetBuyerInfo {
  idealBuyer: string;
  lifestyle: string;
  propertyAppeal: string;
  neighborhoodAppeal: string;
}

interface TargetBuyerStepProps {
  value: TargetBuyerInfo;
  onChange: (value: TargetBuyerInfo) => void;
  onNext: () => void;
}

const TargetBuyerStep: React.FC<TargetBuyerStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof TargetBuyerInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const isValid = () => {
    return (
      value.idealBuyer.trim().length > 0 &&
      value.lifestyle.trim().length > 0 &&
      value.propertyAppeal.trim().length > 0 &&
      value.neighborhoodAppeal.trim().length > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Target Buyer</h2>
          <p className="text-white/60">Help us understand who would love this property</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">Who is the ideal buyer for this property?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'idealBuyer' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="idealBuyer"
              name="idealBuyer"
              value={value.idealBuyer}
              onChange={(e) => updateField('idealBuyer', e.target.value)}
              onFocus={() => setFocusedField('idealBuyer')}
              onBlur={() => setFocusedField(null)}
              placeholder="First-time buyers, young professionals, growing families, etc."
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
              required
            />
          </div>
        </div>

        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">What lifestyle does this property support?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'lifestyle' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="lifestyle"
              name="lifestyle"
              value={value.lifestyle}
              onChange={(e) => updateField('lifestyle', e.target.value)}
              onFocus={() => setFocusedField('lifestyle')}
              onBlur={() => setFocusedField(null)}
              placeholder="Active outdoor lifestyle, work-from-home setup, entertaining friends..."
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
              required
            />
          </div>
        </div>

        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">Why would this property appeal to them?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'propertyAppeal' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="propertyAppeal"
              name="propertyAppeal"
              value={value.propertyAppeal}
              onChange={(e) => updateField('propertyAppeal', e.target.value)}
              onFocus={() => setFocusedField('propertyAppeal')}
              onBlur={() => setFocusedField(null)}
              placeholder="Specific features or aspects that match their needs..."
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
              required
            />
          </div>
        </div>

        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">What makes this neighborhood perfect for them?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'neighborhoodAppeal' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="neighborhoodAppeal"
              name="neighborhoodAppeal"
              value={value.neighborhoodAppeal}
              onChange={(e) => updateField('neighborhoodAppeal', e.target.value)}
              onFocus={() => setFocusedField('neighborhoodAppeal')}
              onBlur={() => setFocusedField(null)}
              placeholder="Local amenities, community features, location benefits..."
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
              required
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
          Next: Ad Details
        </button>
      </form>
    </div>
  );
};

export default TargetBuyerStep;