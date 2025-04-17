import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import { Heart } from 'lucide-react'; // Using Heart icon

// Define the shape of the data managed by this step
type BuyerEmotionalImpactData = BuyerSuccessStoryData['buyerEmotionalImpact'];

const BuyerEmotionalImpactStep: React.FC<StepProps<BuyerEmotionalImpactData, BuyerSuccessStoryData>> = ({
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
        <Heart className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">The Emotional Impact</h2>
          <p className="text-white/60">Describe the personal side of this purchase</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Life Change */}
        <div className="space-y-3">
          <p className="text-white/90">How did this purchase change the buyer’s life?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'lifeChange' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="lifeChange"
              name="lifeChange"
              placeholder="e.g., Finally homeowners, closer to family, better school district, investment for the future..."
              value={value.lifeChange || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('lifeChange')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Rewarding Part */}
        <div className="space-y-3">
          <p className="text-white/90">What was the most rewarding part of this deal for you as their agent?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'rewardingPart' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="rewardingPart"
              name="rewardingPart"
              placeholder="e.g., Seeing their excitement at closing, helping them overcome obstacles, finding their perfect fit..."
              value={value.rewardingPart || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('rewardingPart')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Testimonial */}
        <div className="space-y-3">
          <p className="text-white/90">Did the buyers leave a testimonial or share feedback about their experience?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'testimonial' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="testimonial"
              name="testimonial"
              placeholder="Paste any direct quotes or summarize their feedback here..."
              value={value.testimonial || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('testimonial')}
              onBlur={() => setFocusedField(null)}
              rows={4}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Resonating Quote */}
        <div className="space-y-3">
          <p className="text-white/90">What’s one thing the buyer said that would resonate with future clients considering buying a home?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'resonatingQuote' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="resonatingQuote"
              name="resonatingQuote"
              placeholder="e.g., 'We couldn't have done it without you!', 'You made the process so easy!'"
              value={value.resonatingQuote || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('resonatingQuote')}
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

export default BuyerEmotionalImpactStep;