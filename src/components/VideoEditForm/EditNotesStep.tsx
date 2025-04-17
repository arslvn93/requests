import React, { useState, useEffect, useCallback } from 'react';
import { List } from 'lucide-react'; // Using relevant icon
import { StepProps } from '../../forms/form-types';
import { VideoEditRequestFormData } from '../../forms/video-edit-request.config';

// Define the shape of the data slice this step manages
type EditNotesData = VideoEditRequestFormData['additionalNotes'];

// Extend StepProps with the specific data type for this step
interface EditNotesStepProps extends StepProps<EditNotesData, VideoEditRequestFormData> {}

const EditNotesStep: React.FC<EditNotesStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // --- Handlers ---
  const handleChange = (fieldValue: string) => {
    onChange(fieldValue); // This step manages a single string value
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Require some notes to be entered
    return value.trim() !== '';
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
        <List className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Additional Notes & Timestamps</h2>
          <p className="text-white/60">Provide specific instructions for the edits.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 5: Additional Notes */}
        <div className="space-y-3">
          <p className="text-white/90">List what needs to be modified on your video.</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'additionalNotes' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <List className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <textarea
              id="additionalNotes"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setFocusedField('additionalNotes')}
              onBlur={() => setFocusedField(null)}
              placeholder="Be specific! Include timestamp references (e.g., '0:45 - Change text overlay to...'). Example: Remove the first 5 seconds..."
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none min-h-[150px]" // Increased min-height
              rows={6} // Increased rows
              required
            />
          </div>
           <p className="text-sm text-white/50">💡 Example: ✔️ Remove the first 5 seconds... ✔️ Change text overlay at 0:45 to...</p>
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

export default EditNotesStep;