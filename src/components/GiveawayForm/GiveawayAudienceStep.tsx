import React, { useState, useEffect, useCallback } from 'react';
import { Users, Info, Target } from 'lucide-react'; // Using relevant icons
import { StepProps } from '../../forms/form-types';
import { GiveawayFormData } from '../../forms/giveaway.config';

// Define the shape of the data slice this step manages
type GiveawayAudienceData = GiveawayFormData['giveawayAudience'];

// Extend StepProps with the specific data type for this step
interface GiveawayAudienceStepProps extends StepProps<GiveawayAudienceData, GiveawayFormData> {}

const GiveawayAudienceStep: React.FC<GiveawayAudienceStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // --- Handlers ---
  const handleChange = (field: keyof GiveawayAudienceData, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Check if both fields are filled
    return value.participantInfo.trim() !== '' && value.targetAudience.trim() !== '';
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
        <Users className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Participant & Audience</h2>
          <p className="text-white/60">Define who should enter and who you want to attract.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 6: Participant Info */}
        <div className="space-y-3">
          <p className="text-white/90">What should participants know before entering?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'participantInfo' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <textarea
              id="participantInfo"
              value={value.participantInfo}
              onChange={(e) => handleChange('participantInfo', e.target.value)}
              onFocus={() => setFocusedField('participantInfo')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g., Must be local resident, specific actions required, things to bring..."
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none min-h-[80px]"
              rows={3}
              required
            />
          </div>
           <p className="text-sm text-white/50">What does the potential winner need to do or be aware of?</p>
        </div>

        {/* Question 7: Target Audience */}
        <div className="space-y-3">
          <p className="text-white/90">Who is your target audience for this giveaway?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'targetAudience' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <Target className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <textarea
              id="targetAudience"
              value={value.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              onFocus={() => setFocusedField('targetAudience')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe the ideal participant/client and why this prize appeals to them..."
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none min-h-[80px]"
              rows={3}
              required
            />
          </div>
           <p className="text-sm text-white/50">Why is this giveaway relevant to the clients you want?</p>
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

export default GiveawayAudienceStep;