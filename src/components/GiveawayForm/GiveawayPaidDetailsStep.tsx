import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, MapPin, CalendarOff } from 'lucide-react'; // Using relevant icons
import { StepProps } from '../../forms/form-types';
import { GiveawayFormData } from '../../forms/giveaway.config';

// Define the shape of the data slice this step manages
// Note: It's optional in the main FormData, but required if this step is reached.
type GiveawayPaidDetailsData = GiveawayFormData['paidCampaignDetails'];

// Extend StepProps with the specific data type for this step
interface GiveawayPaidDetailsStepProps extends StepProps<GiveawayPaidDetailsData, GiveawayFormData> {}

const GiveawayPaidDetailsStep: React.FC<GiveawayPaidDetailsStepProps> = ({ value = {}, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Provide default values if the object slice is undefined initially
  const currentData = {
      paidCampaignTarget: value.paidCampaignTarget ?? '',
      paidCampaignBudget: value.paidCampaignBudget ?? '',
      paidCampaignEndDate: value.paidCampaignEndDate ?? '',
  };


  // --- Handlers ---
  const handleChange = (field: keyof NonNullable<GiveawayPaidDetailsData>, fieldValue: string) => {
    onChange({ ...currentData, [field]: fieldValue });
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Check if all fields required for this step are filled
    return (
        currentData.paidCampaignTarget.trim() !== '' &&
        currentData.paidCampaignBudget.trim() !== '' && // Basic check, could add numeric validation
        currentData.paidCampaignEndDate !== ''
    );
  }, [currentData]);

  // Effect to notify parent component of validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [currentData, isValid, onValidationChange]);

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
        <DollarSign className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Paid Ad Details</h2>
          <p className="text-white/60">Configure your paid social media campaign.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 10: Target City/Area */}
        <div className="space-y-3">
          <p className="text-white/90">What City / Area would you like the ad campaign to target?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'paidCampaignTarget' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="text"
              id="paidCampaignTarget"
              value={currentData.paidCampaignTarget}
              onChange={(e) => handleChange('paidCampaignTarget', e.target.value)}
              onFocus={() => setFocusedField('paidCampaignTarget')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g., Toronto, Mississauga, New York City"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
          </div>
        </div>

        {/* Question 11: Daily Budget */}
        <div className="space-y-3">
          <p className="text-white/90">What is your daily budget for the giveaway ad campaign?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'paidCampaignBudget' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <DollarSign className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="text" // Use text for flexibility (e.g., allow '$') but consider number/pattern for validation
              inputMode="decimal" // Hint for mobile keyboards
              id="paidCampaignBudget"
              value={currentData.paidCampaignBudget}
              onChange={(e) => handleChange('paidCampaignBudget', e.target.value)}
              onFocus={() => setFocusedField('paidCampaignBudget')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g., 10, 15, 20 (per day)"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
          </div>
        </div>

        {/* Question 12: Ad Stop Date */}
        <div className="space-y-3">
          <p className="text-white/90">When would you like to STOP the ad campaign?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'paidCampaignEndDate' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <CalendarOff className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="date"
              id="paidCampaignEndDate"
              value={currentData.paidCampaignEndDate} // Expects YYYY-MM-DD format
              onChange={(e) => handleChange('paidCampaignEndDate', e.target.value)}
              onFocus={() => setFocusedField('paidCampaignEndDate')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 appearance-none"
              required
              // Add min date if needed, e.g., related to promo start or draw date
            />
          </div>
           <p className="text-sm text-white/50">Example: Day before the draw.</p>
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

export default GiveawayPaidDetailsStep;