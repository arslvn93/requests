import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, HelpCircle, DollarSign, Heart } from 'lucide-react';
import { StepProps } from '../../forms/form-types'; // Assuming StepProps is correctly defined
import { GiveawayFormData } from '../../forms/giveaway.config'; // Import the FormData type

// Define the shape of the data slice this step manages
type GiveawayDetailsData = GiveawayFormData['giveawayDetails'];

// Extend StepProps with the specific data type for this step
interface GiveawayDetailsStepProps extends StepProps<GiveawayDetailsData, GiveawayFormData> {}

const GiveawayDetailsStep: React.FC<GiveawayDetailsStepProps> = ({ value, onChange, onNext, onValidationChange, formData }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Suggestions for Q1
  const suggestions = [
    "Golf outing with dining",
    "Luxury spa day",
    "Wine tasting experience",
    "VIP sports tickets",
    "Family pass to aquarium/zoo",
    "Private movie screening",
  ];

  // --- Handlers ---
  const handleChange = (field: keyof GiveawayDetailsData, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Append suggestion to the current description or replace if empty
    const currentDesc = value.giveawayTypeDesc || '';
    const newDesc = currentDesc ? `${currentDesc}, ${suggestion}` : suggestion;
    onChange({ ...value, giveawayTypeDesc: newDesc });
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    return (
      value.giveawayTypeDesc.trim() !== '' &&
      value.giveawayValue.trim() !== '' &&
      value.giveawayReason.trim() !== ''
    );
  }, [value]);

  // Effect to notify parent component of validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, isValid, onValidationChange]);

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardList className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Giveaway Details</h2>
          <p className="text-white/60">Tell us about the prize and why it's special.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 1: Giveaway Type */}
        <div className="space-y-3">
          <p className="text-white/90">What type of giveaway would you like to run?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'giveawayTypeDesc' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <HelpCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <textarea
              id="giveawayTypeDesc"
              value={value.giveawayTypeDesc}
              onChange={(e) => handleChange('giveawayTypeDesc', e.target.value)}
              onFocus={() => setFocusedField('giveawayTypeDesc')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe the event or activity (e.g., Luxury spa day, VIP sports tickets...)"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none min-h-[80px]"
              rows={3}
              required
            />
          </div>
          <p className="text-sm text-white/50">Need ideas? Click a suggestion:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-sm bg-gray-700/50 hover:bg-gray-600/70 text-blue-300 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Giveaway Value */}
        <div className="space-y-3">
          <p className="text-white/90">What is the total value of the giveaway?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'giveawayValue' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <DollarSign className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="text" // Use text to allow currency symbols etc.
              id="giveawayValue"
              value={value.giveawayValue}
              onChange={(e) => handleChange('giveawayValue', e.target.value)}
              onFocus={() => setFocusedField('giveawayValue')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g., $250, Approx. €500"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
          </div>
           <p className="text-sm text-white/50">Include the original price or estimated value.</p>
        </div>

        {/* Question 3: Giveaway Reason */}
        <div className="space-y-3">
          <p className="text-white/90">Why did you choose this giveaway?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'giveawayReason' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <Heart className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <textarea
              id="giveawayReason"
              value={value.giveawayReason}
              onChange={(e) => handleChange('giveawayReason', e.target.value)}
              onFocus={() => setFocusedField('giveawayReason')}
              onBlur={() => setFocusedField(null)}
              placeholder="Explain your personal connection or why it's special (e.g., It's my favorite restaurant because...)"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none min-h-[80px]"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          disabled={!isValid()}
          className="w-full mt-6 py-3 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-button-focus disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default GiveawayDetailsStep;