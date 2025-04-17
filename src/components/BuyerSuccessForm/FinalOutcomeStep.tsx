import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import { Award } from 'lucide-react'; // Using Award icon

// Define the shape of the data managed by this step
type FinalOutcomeData = BuyerSuccessStoryData['finalOutcome'];

const FinalOutcomeStep: React.FC<StepProps<FinalOutcomeData, BuyerSuccessStoryData>> = ({
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <Award className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">The Final Outcome</h2>
          <p className="text-white/60">Summarize the results of the purchase</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Final vs Asking Price */}
        <div className="space-y-3">
          <p className="text-white/90">What was the final purchase price vs. the original asking price?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'finalVsAsking' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="finalVsAsking"
              name="finalVsAsking"
              placeholder="e.g., Purchased for $5,000 under asking, Secured at asking price in a hot market..."
              value={value.finalVsAsking || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('finalVsAsking')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Offer-to-Close Speed */}
        <div className="space-y-3">
          <p className="text-white/90">How fast did they move from offer to closing?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'offerToCloseSpeed' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="offerToCloseSpeed"
              name="offerToCloseSpeed"
              placeholder="e.g., Quick 30-day close, Standard 60-day process, Some delays due to financing..."
              value={value.offerToCloseSpeed || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('offerToCloseSpeed')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Unexpected Benefits */}
        <div className="space-y-3">
          <p className="text-white/90">What unexpected benefits did they gain from this purchase?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'unexpectedBenefits' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="unexpectedBenefits"
              name="unexpectedBenefits"
              placeholder="e.g., Instant equity due to market shift, discovered amazing neighbors, perfect school district..."
              value={value.unexpectedBenefits || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('unexpectedBenefits')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Market Comparison */}
        <div className="space-y-3">
          <p className="text-white/90">How did this transaction compare to the current market conditions?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'marketComparison' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="marketComparison"
              name="marketComparison"
              placeholder="e.g., Managed to secure a great deal despite a seller's market, capitalized on a brief market dip..."
              value={value.marketComparison || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('marketComparison')}
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

export default FinalOutcomeStep;