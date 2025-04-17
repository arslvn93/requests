import React, { useEffect, useState } from 'react'; // Import useState
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { TrendingUp } from 'lucide-react'; // Import planned icon

// Define the shape of the data managed by this step
type PropertyStatsData = SellerSuccessStoryData['propertyStats'];

const PropertyStatsStep: React.FC<StepProps<PropertyStatsData, SellerSuccessStoryData>> = ({
  value,
  onChange,
  onValidationChange,
  // formData,
  onNext, // Need onNext for the submit handler
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validation - For now, assume valid as fields aren't strictly required by outline
  // Implement stricter validation here if needed later
  const isValid = () => {
    return true; // Modify if fields become required
  };

  // Effect to notify parent about validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, onValidationChange]); // Rerun when value changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <TrendingUp className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Property Stats</h2>
          <p className="text-white/60">Key numbers about the sale</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listed Price */}
        <div className="space-y-3"> {/* Question Block */}
          <p className="text-white/90">Listed Price</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'listedPrice' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            {/* Optional Icon Here */}
            <input
              id="listedPrice"
              name="listedPrice"
              placeholder="$500,000"
              value={value.listedPrice || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('listedPrice')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
          <p className="text-sm text-white/60">What was the initial asking price?</p>
        </div>

        {/* Sold Price */}
        <div className="space-y-3">
          <p className="text-white/90">Sold Price</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'soldPrice' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              id="soldPrice"
              name="soldPrice"
              placeholder="$525,000"
              value={value.soldPrice || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('soldPrice')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
          <p className="text-sm text-white/60">What was the final sale price?</p>
        </div>

        {/* Days on Market */}
        <div className="space-y-3">
          <p className="text-white/90">Days on Market</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'daysOnMarket' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              id="daysOnMarket"
              name="daysOnMarket"
              type="number"
              placeholder="7"
              value={value.daysOnMarket || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('daysOnMarket')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
          <p className="text-sm text-white/60">How many days was the property listed before going under contract?</p>
        </div>

        {/* Number of Offers */}
        <div className="space-y-3">
          <p className="text-white/90">Number of Offers</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'numOffers' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              id="numOffers"
              name="numOffers"
              type="number"
              placeholder="5"
              value={value.numOffers || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('numOffers')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
          <p className="text-sm text-white/60">How many offers were received in total?</p>
        </div>

        {/* Number of Showings */}
        <div className="space-y-3">
          <p className="text-white/90">Number of Showings</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'numShowings' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              id="numShowings"
              name="numShowings"
              type="number"
              placeholder="25"
              value={value.numShowings || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('numShowings')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
          <p className="text-sm text-white/60">Approximately how many showings took place?</p>
        </div>

        {/* Any Other Relevant Stats */}
        <div className="space-y-3">
          <p className="text-white/90">Any Other Relevant Stats?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'otherStats' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            {/* Optional Icon Here */}
            <textarea
              id="otherStats"
              name="otherStats"
              placeholder="e.g., Sold 15% over asking, Highest sale in the neighborhood this year..."
              value={value.otherStats || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('otherStats')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
          <p className="text-sm text-white/60">Include any other impressive statistics about the sale.</p>
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
      {/* Removed extra closing div */}
    </div>
  );
};

export default PropertyStatsStep;