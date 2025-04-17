import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays } from 'lucide-react';
import { StepProps } from '../../forms/form-types';
import { GiveawayFormData } from '../../forms/giveaway.config';

// Define the shape of the data slice this step manages
type GiveawayDatesData = GiveawayFormData['giveawayDates'];

// Extend StepProps with the specific data type for this step
interface GiveawayDatesStepProps extends StepProps<GiveawayDatesData, GiveawayFormData> {}

const GiveawayDatesStep: React.FC<GiveawayDatesStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // --- Handlers ---
  const handleChange = (field: keyof GiveawayDatesData, fieldValue: string) => {
    // Ensure value is in YYYY-MM-DD format if needed, though type="date" handles this
    onChange({ ...value, [field]: fieldValue });
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Basic validation: check if dates are not empty
    // More complex validation (e.g., promo start before draw date) could be added
    return value.drawDate !== '' && value.promoStartDate !== '';
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
        <CalendarDays className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Giveaway Dates</h2>
          <p className="text-white/60">Set the timeline for your giveaway.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 4: Draw Date */}
        <div className="space-y-3">
          <p className="text-white/90">When would you like to hold the giveaway draw?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'drawDate' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <CalendarDays className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="date"
              id="drawDate"
              value={value.drawDate} // Expects YYYY-MM-DD format
              onChange={(e) => handleChange('drawDate', e.target.value)}
              onFocus={() => setFocusedField('drawDate')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 appearance-none" // appearance-none might be needed for custom styling
              required
              // Add min date if needed, e.g., min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <p className="text-sm text-white/50">Specify the date for selecting a winner.</p>
        </div>

        {/* Question 5: Promotion Start Date */}
        <div className="space-y-3">
          <p className="text-white/90">When would you like to start promoting the giveaway?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'promoStartDate' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <CalendarDays className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="date"
              id="promoStartDate"
              value={value.promoStartDate} // Expects YYYY-MM-DD format
              onChange={(e) => handleChange('promoStartDate', e.target.value)}
              onFocus={() => setFocusedField('promoStartDate')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 appearance-none"
              required
              // Add min date if needed
            />
          </div>
          <p className="text-sm text-white/50">Provide the start date for sharing and posting.</p>
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

export default GiveawayDatesStep;