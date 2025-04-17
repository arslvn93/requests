import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { Gift } from 'lucide-react'; // Using Gift icon

// Define the shape of the data managed by this step
type BonusItemsData = SellerSuccessStoryData['bonusItems'];

const BonusItemsStep: React.FC<StepProps<BonusItemsData, SellerSuccessStoryData>> = ({
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
          <p className="text-white/60">Add any extra unique details</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unique/Surprising */}
        <div className="space-y-3">
          <p className="text-white/90">Was there anything unique or surprising about this sale?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'unique' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="unique"
              name="unique"
              placeholder="e.g., Sold in a weekend, buyer bought sight unseen, multiple offers in a slow market..."
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
          <p className="text-white/90">Any "Before & After" transformations?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'beforeAfter' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="beforeAfter"
              name="beforeAfter"
              placeholder="e.g., “We made one simple change (staging/paint), and it led to 10+ offers!”"
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
          <p className="text-white/90">Did you help the sellers achieve something they didn’t think was possible?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'impossibleAchieved' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="impossibleAchieved"
              name="impossibleAchieved"
              placeholder="e.g., Selling above a certain price point, finding a buyer under difficult circumstances..."
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

export default BonusItemsStep;