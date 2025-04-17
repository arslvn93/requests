import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { Lightbulb } from 'lucide-react'; // Using Lightbulb icon

// Define the shape of the data managed by this step
type CallToActionData = SellerSuccessStoryData['callToAction'];

const CallToActionStep: React.FC<StepProps<CallToActionData, SellerSuccessStoryData>> = ({
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
        <Lightbulb className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">The Call to Action</h2>
          <p className="text-white/60">Share insights for future sellers</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* #1 Thing to Know */}
        <div className="space-y-3">
          <p className="text-white/90">If another homeowner is thinking of selling, what’s the #1 thing they should know about today’s market?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'num1ThingToKnow' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="num1ThingToKnow"
              name="num1ThingToKnow"
              placeholder="e.g., Importance of pricing strategy, need for preparation, current buyer demand..."
              value={value.num1ThingToKnow || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('num1ThingToKnow')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Misconception */}
        <div className="space-y-3">
          <p className="text-white/90">What’s the biggest misconception about selling that you’d like to clear up?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'misconception' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="misconception"
              name="misconception"
              placeholder="e.g., That they need to spend a fortune on renovations, that Zestimates are accurate..."
              value={value.misconception || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('misconception')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Advice */}
        <div className="space-y-3">
          <p className="text-white/90">What advice would you give to someone on the fence about listing their home?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'advice' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <textarea
              id="advice"
              name="advice"
              placeholder="e.g., Focus on their goals, talk to a professional, understand the local market conditions..."
              value={value.advice || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('advice')}
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

export default CallToActionStep;