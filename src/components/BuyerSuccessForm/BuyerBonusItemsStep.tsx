import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import { Gift } from 'lucide-react'; // Using Gift icon

// Define the shape of the data managed by this step
type BuyerBonusItemsData = BuyerSuccessStoryData['buyerBonusItems'];

const BuyerBonusItemsStep: React.FC<StepProps<BuyerBonusItemsData, BuyerSuccessStoryData>> = ({
  value = { unique: '', beforeAfter: '', impossibleAchieved: '' }, // Provide default empty object
  onChange,
  onValidationChange,
  onNext,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // This step is optional, so validation always passes
  const isValid = () => {
    return true;
  };

  // Effect to notify parent about validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value: inputValue } = e.target;
     // Ensure value is not undefined before spreading
    const currentValue = value || { unique: '', beforeAfter: '', impossibleAchieved: '' };
    onChange({
      ...currentValue,
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
        <Gift className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Bonus Items (Optional)</h2>
          <p className="text-white/60">Add any extra unique details about the purchase</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unique/Surprising */}
        <div className="space-y-3">
          <p className="text-white/90">Was there anything unique or surprising about this purchase?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'unique' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="unique"
              name="unique"
              placeholder="e.g., Buyer got a great deal, won a bidding war against many offers, secured a rare property type..."
              value={value?.unique || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('unique')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Before & After */}
        <div className="space-y-3">
          <p className="text-white/90">Any "Before & After" transformations related to the deal?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'beforeAfter' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="beforeAfter"
              name="beforeAfter"
              placeholder="e.g., “We negotiated a $20,000 price reduction with a few simple strategies!”, “Secured seller credits covering all closing costs”"
              value={value?.beforeAfter || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('beforeAfter')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Impossible Achieved */}
        <div className="space-y-3">
          <p className="text-white/90">Did you help the buyers achieve something they didn’t think was possible?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'impossibleAchieved' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="impossibleAchieved"
              name="impossibleAchieved"
              placeholder="e.g., Buying their first home sooner than expected, finding a property with a specific rare feature..."
              value={value?.impossibleAchieved || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('impossibleAchieved')}
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

export default BuyerBonusItemsStep;