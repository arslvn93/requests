import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { Award } from 'lucide-react'; // Using Award icon

// Define the shape of the data managed by this step
type ResultsData = SellerSuccessStoryData['results'];

const ResultsStep: React.FC<StepProps<ResultsData, SellerSuccessStoryData>> = ({
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
          <h2 className="text-2xl font-bold text-white/90">The Results</h2>
          <p className="text-white/60">Highlight the successful outcomes</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Final vs Asking Price */}
        <div className="space-y-3">
          <p className="text-white/90">What was the final selling price vs. the original asking price?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'finalVsAsking' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="finalVsAsking"
              name="finalVsAsking"
              placeholder="e.g., Sold for $25,000 over asking price..."
              value={value.finalVsAsking || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('finalVsAsking')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Speed vs Average */}
        <div className="space-y-3">
          <p className="text-white/90">How fast did it sell compared to the market average?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'speedVsAverage' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="speedVsAverage"
              name="speedVsAverage"
              placeholder="e.g., Sold in 5 days, while the average was 30 days..."
              value={value.speedVsAverage || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('speedVsAverage')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Multiple Offers */}
        <div className="space-y-3">
          <p className="text-white/90">Did the seller receive multiple offers?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'multipleOffers' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="multipleOffers"
              name="multipleOffers"
              placeholder="e.g., Yes, we received 8 offers, 3 of which were significantly over asking..."
              value={value.multipleOffers || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('multipleOffers')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Negotiated Terms */}
        <div className="space-y-3">
          <p className="text-white/90">Did you help the sellers negotiate better terms beyond just price?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'negotiatedTerms' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="negotiatedTerms"
              name="negotiatedTerms"
              placeholder="e.g., Secured a faster closing date, waived inspection contingency, rent-back agreement..."
              value={value.negotiatedTerms || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('negotiatedTerms')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Seller Reaction */}
        <div className="space-y-3">
          <p className="text-white/90">What was the seller’s reaction when they saw the results?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'sellerReaction' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="sellerReaction"
              name="sellerReaction"
              placeholder="e.g., They were thrilled and relieved, couldn't believe how smooth it went..."
              value={value.sellerReaction || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('sellerReaction')}
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

export default ResultsStep;