import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import { TrendingUp } from 'lucide-react'; // Using TrendingUp icon

// Define the shape of the data managed by this step
type BuyerPropertyStatsData = BuyerSuccessStoryData['buyerPropertyStats'];

const BuyerPropertyStatsStep: React.FC<StepProps<BuyerPropertyStatsData, BuyerSuccessStoryData>> = ({
  value,
  onChange,
  onValidationChange,
  onNext,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validation: Check if multipleOffers has a selection
  const isValid = () => {
    return value.multipleOffers === 'Yes' || value.multipleOffers === 'No';
  };

  // Effect to notify parent about validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: inputValue } = e.target;
    onChange({
      ...value,
      [name]: inputValue,
    });
  };

  const handleSelectionChange = (selectedValue: 'Yes' | 'No') => {
    onChange({
      ...value,
      multipleOffers: selectedValue,
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
        <TrendingUp className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Property Stats</h2>
          <p className="text-white/60">Key numbers about the purchase</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listed Price */}
        <div className="space-y-3">
          <p className="text-white/90">Listed Price</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'listedPrice' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              id="listedPrice"
              name="listedPrice"
              placeholder="Original asking price (e.g., $500,000)"
              value={value.listedPrice || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('listedPrice')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        {/* Purchased Price */}
        <div className="space-y-3">
          <p className="text-white/90">Purchased Price</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'purchasedPrice' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              id="purchasedPrice"
              name="purchasedPrice"
              placeholder="Final price paid (e.g., $495,000)"
              value={value.purchasedPrice || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('purchasedPrice')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        {/* Multiple Offer Situation */}
        <div className="space-y-3">
          <p className="text-white/90">Was this home a multiple-offer situation?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleSelectionChange('Yes')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${
                value.multipleOffers === 'Yes' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleSelectionChange('No')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${
                value.multipleOffers === 'No' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'
              }`}
            >
              No
            </button>
          </div>
           {!value.multipleOffers && <p className="text-sm text-red-400">Please select Yes or No.</p>}
        </div>

        {/* Any Other Relevant Stats */}
        <div className="space-y-3">
          <p className="text-white/90">Any Other Relevant Stats? (Optional)</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'otherStats' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="otherStats"
              name="otherStats"
              placeholder="e.g., Purchased under asking, appraisal came in high..."
              value={value.otherStats || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('otherStats')}
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
          disabled={!isValid()}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default BuyerPropertyStatsStep;