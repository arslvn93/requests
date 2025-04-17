import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import { Users } from 'lucide-react'; // Using Users icon

// Define the shape of the data managed by this step
type BuyerBackstoryData = BuyerSuccessStoryData['buyerBackstory'];

const BuyerBackstoryStep: React.FC<StepProps<BuyerBackstoryData, BuyerSuccessStoryData>> = ({
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
        <Users className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">The Backstory</h2>
          <p className="text-white/60">Tell us about the buyers and their situation</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Buyer Profile */}
        <div className="space-y-3">
          <p className="text-white/90">Who were the buyers?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'buyerProfile' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="buyerProfile"
              name="buyerProfile"
              placeholder="e.g., First-time homebuyers, upsizing family, relocating, downsizers, investors..."
              value={value.buyerProfile || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('buyerProfile')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Challenges */}
        <div className="space-y-3">
          <p className="text-white/90">What challenges did they face when looking for a home?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'challenges' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="challenges"
              name="challenges"
              placeholder="e.g., Competitive market, limited budget, specific location needs, finding the right features..."
              value={value.challenges || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('challenges')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Fears */}
        <div className="space-y-3">
          <p className="text-white/90">What was their biggest fear about the home-buying process?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'fears' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="fears"
              name="fears"
              placeholder="e.g., Overpaying, losing in multiple offers, hidden problems with the house, complexity of paperwork..."
              value={value.fears || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('fears')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Why Agent */}
        <div className="space-y-3">
          <p className="text-white/90">Why did they choose to work with you over another agent?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'whyAgent' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="whyAgent"
              name="whyAgent"
              placeholder="e.g., Referral, your local knowledge, negotiation skills, responsiveness..."
              value={value.whyAgent || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('whyAgent')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Initial Goals */}
        <div className="space-y-3">
          <p className="text-white/90">What were their initial goals and expectations for the home search?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'initialGoals' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="initialGoals"
              name="initialGoals"
              placeholder="e.g., Find a home within budget, specific neighborhood, certain number of bedrooms, move-in ready..."
              value={value.initialGoals || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('initialGoals')}
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

export default BuyerBackstoryStep;