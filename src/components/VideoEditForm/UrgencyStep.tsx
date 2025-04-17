import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CalendarDays, AlertTriangle } from 'lucide-react'; // Using relevant icons
import { StepProps } from '../../forms/form-types';
import { VideoEditRequestFormData } from '../../forms/video-edit-request.config';

// Define the shape of the data slice this step manages
type UrgencyData = VideoEditRequestFormData['urgency'];

// Extend StepProps with the specific data type for this step
interface UrgencyStepProps extends StepProps<UrgencyData, VideoEditRequestFormData> {}

const UrgencyStep: React.FC<UrgencyStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Provide default values if the object slice is undefined initially
  const currentData = {
      deadline: value?.deadline ?? '',
      isUrgent: value?.isUrgent ?? '',
      notifiedTeam: value?.notifiedTeam ?? '',
  };

  const showNotifiedTeamQuestion = currentData.isUrgent === 'yes';

  // --- Handlers ---
  const handleChange = (field: keyof UrgencyData, fieldValue: string | 'yes' | 'no') => {
    const updatedData = { ...currentData, [field]: fieldValue };

    // If urgency is set back to 'no', clear the notifiedTeam field
    if (field === 'isUrgent' && fieldValue === 'no') {
      updatedData.notifiedTeam = '';
    }

    onChange(updatedData);
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Deadline is optional based on config, so only validate urgency selection
    if (currentData.isUrgent === '') return false;
    // If urgent, ensure notifiedTeam is selected
    if (currentData.isUrgent === 'yes' && currentData.notifiedTeam === '') return false;
    return true;
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
        <Clock className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Urgency & Deadline</h2>
          <p className="text-white/60">Let us know about your timeline.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Question 6: Deadline */}
        <div className="space-y-3">
          <p className="text-white/90">When do you need these changes completed by? (Optional)</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'deadline' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <CalendarDays className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="date"
              id="deadline"
              value={currentData.deadline} // Expects YYYY-MM-DD format
              onChange={(e) => handleChange('deadline', e.target.value)}
              onFocus={() => setFocusedField('deadline')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 appearance-none"
              // Not required as per config update
            />
          </div>
          <p className="text-sm text-white/50">Standard turnaround: 2-3 business days depending on complexity.</p>
        </div>

        {/* Question 7: Is Urgent? */}
        <div className="space-y-3">
          <p className="text-white/90">Is this highly urgent? <span className="text-white/60">(Less than 2-3 Business Days)</span></p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleChange('isUrgent', 'yes')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${currentData.isUrgent === 'yes' ? 'bg-red-500 text-white ring-2 ring-red-400' : 'glass-card text-white/90 hover:border-red-400'}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleChange('isUrgent', 'no')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${currentData.isUrgent === 'no' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'}`}
            >
              No
            </button>
          </div>
        </div>

        {/* Question 8: Notified Team? (Conditional) */}
        {showNotifiedTeamQuestion && (
          <div className="space-y-3 animate-fade-in border-l-4 border-red-500 pl-4 py-2 bg-red-900/10">
            <p className="text-white/90 font-medium">Have you already notified our team about the urgent request?</p>
             <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleChange('notifiedTeam', 'yes')}
                  className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${currentData.notifiedTeam === 'yes' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('notifiedTeam', 'no')}
                  className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${currentData.notifiedTeam === 'no' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'}`}
                >
                  No
                </button>
             </div>
             <p className="text-sm text-yellow-300/80 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 inline-block flex-shrink-0" />
                If 'No', please email clientcare@salesgenius.co immediately after submitting.
             </p>
          </div>
        )}


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

export default UrgencyStep;