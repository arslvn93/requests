import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import { Search } from 'lucide-react'; // Using Search icon

// Define the shape of the data managed by this step
type HomeSearchProcessData = BuyerSuccessStoryData['homeSearchProcess'];

const HomeSearchProcessStep: React.FC<StepProps<HomeSearchProcessData, BuyerSuccessStoryData>> = ({
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => { // Added input for homesViewed
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
        <Search className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">The Home Search & Buying Process</h2>
          <p className="text-white/60">Describe the journey to finding and securing the home</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Homes Viewed */}
        <div className="space-y-3">
          <p className="text-white/90">How many homes did they view before finding “the one”?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'homesViewed' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              id="homesViewed"
              name="homesViewed"
              type="number"
              placeholder="e.g., 5, 10, 20+"
              value={value.homesViewed || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('homesViewed')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        {/* Must-Haves */}
        <div className="space-y-3">
          <p className="text-white/90">What were their top 3 “must-haves” in a home?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'mustHaves' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="mustHaves"
              name="mustHaves"
              placeholder="e.g., Large backyard, updated kitchen, specific school district..."
              value={value.mustHaves || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('mustHaves')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Bidding Wars */}
        <div className="space-y-3">
          <p className="text-white/90">Did they face any bidding wars or competitive situations? (How did you navigate them?)</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'biddingWars' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="biddingWars"
              name="biddingWars"
              placeholder="e.g., Yes, we competed against 5 other offers. We used an escalation clause..."
              value={value.biddingWars || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('biddingWars')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Strategies Used */}
        <div className="space-y-3">
          <p className="text-white/90">Were there any unique strategies you used to help them win their dream home?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'strategiesUsed' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="strategiesUsed"
              name="strategiesUsed"
              placeholder="e.g., Pre-offer inspections, personalized letters to the seller, strong financing pre-approval, creative negotiation..."
              value={value.strategiesUsed || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('strategiesUsed')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Negotiated Terms */}
        <div className="space-y-3">
          <p className="text-white/90">Did you help them negotiate better terms beyond just price?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'negotiatedTerms' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="negotiatedTerms"
              name="negotiatedTerms"
              placeholder="e.g., Favorable closing date, seller credits for repairs, inclusion of certain appliances..."
              value={value.negotiatedTerms || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('negotiatedTerms')}
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

export default HomeSearchProcessStep;