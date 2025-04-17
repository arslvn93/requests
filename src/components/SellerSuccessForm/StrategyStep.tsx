import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { Target } from 'lucide-react'; // Using Target icon

// Define the shape of the data managed by this step
type StrategyData = SellerSuccessStoryData['strategy'];

const StrategyStep: React.FC<StepProps<StrategyData, SellerSuccessStoryData>> = ({
  value,
  onChange,
  onValidationChange,
  onNext,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Assuming these fields are not strictly required for now
  const isValid = () => {
    return true;
  };

  // Effect to notify parent about validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => { // Added HTMLInputElement for potential future input types
    const { name, value: inputValue } = e.target;
    onChange({
      ...value,
      [name]: inputValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in"> {/* Root element */}
      {/* Header */}
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">The Listing & Marketing Strategy</h2>
          <p className="text-white/60">How did you approach selling this home?</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pricing Strategy */}
        <div className="space-y-3">
          <p className="text-white/90">What strategy did you use to price the home correctly?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'pricing' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="pricing"
              name="pricing"
              placeholder="e.g., Priced slightly below market value to drive multiple offers, based on recent comparable sales..."
              value={value.pricing || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('pricing')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Marketing Impact */}
        <div className="space-y-3">
          <p className="text-white/90">What marketing strategies made the biggest impact?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'marketing' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="marketing"
              name="marketing"
              placeholder="e.g., Professional photography, video tours, staging, social media ads (Facebook/Instagram), targeted email blasts, open house..."
              value={value.marketing || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('marketing')}
              onBlur={() => setFocusedField(null)}
              rows={4} // Slightly more space for this one
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Buyer Source */}
        <div className="space-y-3">
          <p className="text-white/90">Did you attract any out-of-town or unexpected buyers?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'buyerSource' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="buyerSource"
              name="buyerSource"
              placeholder="e.g., Yes, a buyer relocating from another state saw the video tour..."
              value={value.buyerSource || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('buyerSource')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Showings/Offers Generated */}
        <div className="space-y-3">
           {/* NOTE: This duplicates fields from PropertyStatsStep. Consider removing from here or PropertyStatsStep if redundant. Keeping for now based on outline. */}
          <p className="text-white/90">How many showings and offers did you generate?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'showingsOffersGenerated' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="showingsOffersGenerated"
              name="showingsOffersGenerated"
              placeholder="e.g., We had 30 showings in the first weekend and received 8 offers..."
              value={value.showingsOffersGenerated || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('showingsOffersGenerated')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Urgency Creation */}
        <div className="space-y-3">
          <p className="text-white/90">How did you position the home to create urgency?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'urgency' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="urgency"
              name="urgency"
              placeholder="e.g., Set an offer deadline, highlighted unique features, emphasized low inventory..."
              value={value.urgency || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('urgency')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

         {/* Challenges Handled */}
        <div className="space-y-3">
          <p className="text-white/90">What challenges (if any) arose during listing/marketing, and how did you handle them?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'challengesHandled' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="challengesHandled"
              name="challengesHandled"
              placeholder="e.g., Unexpected inspection issue resolved through negotiation, low initial interest overcome by adjusting strategy..."
              value={value.challengesHandled || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('challengesHandled')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>


        {/* Next Button */}
        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()} // Will always be enabled
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default StrategyStep;