import React, { useState, useEffect, useCallback } from 'react';
import { Wand2, Check, Type } from 'lucide-react'; // Using relevant icons
import { StepProps } from '../../forms/form-types';
import { VideoEditRequestFormData } from '../../forms/video-edit-request.config';

// Define the shape of the data slice this step manages
type EditTypeData = VideoEditRequestFormData['editTypes'];
type EditTypeValue = EditTypeData['selectedEdits'][number]; // Type for individual edit keys

// Extend StepProps with the specific data type for this step
interface EditTypeStepProps extends StepProps<EditTypeData, VideoEditRequestFormData> {}

// Define edit type options
const editOptions: { id: EditTypeValue; label: string }[] = [
  { id: 'captions', label: 'Adjust captions/subtitles' },
  { id: 'trim', label: 'Trim/cut specific sections' },
  { id: 'music', label: 'Change/add background music' },
  { id: 'branding', label: 'Insert branding elements (logo, lower thirds)' },
  { id: 'cta', label: 'Adjust call-to-action overlay' },
  { id: 'audio', label: 'Fix audio issues/enhance quality' },
  { id: 'pacing', label: 'Adjust the pacing/speed of the video' },
  { id: 'other', label: 'Other (Please specify below)' }, // Special value for conditional input
];

const EditTypeStep: React.FC<EditTypeStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Ensure value and selectedEdits are initialized correctly
  const currentData = {
      selectedEdits: Array.isArray(value?.selectedEdits) ? value.selectedEdits : [],
      otherEdit: value?.otherEdit ?? '',
  };

  const showOtherInput = currentData.selectedEdits.includes('other');

  // --- Handlers ---
  const handleSelect = (editId: EditTypeValue) => {
    const currentIndex = currentData.selectedEdits.indexOf(editId);
    let newSelected: EditTypeValue[] = [];

    if (currentIndex === -1) {
      newSelected = [...currentData.selectedEdits, editId]; // Add edit type
    } else {
      newSelected = currentData.selectedEdits.filter((id) => id !== editId); // Remove edit type
    }

    // If "Other" is deselected, clear the otherEdit field
    const otherEdit = newSelected.includes('other') ? currentData.otherEdit : '';
    onChange({ selectedEdits: newSelected, otherEdit });
  };

  const handleOtherChange = (otherValue: string) => {
    // Only update if "Other" is selected
    if (currentData.selectedEdits.includes('other')) {
      onChange({ ...currentData, otherEdit: otherValue });
    }
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Require at least one edit type selected
    if (currentData.selectedEdits.length === 0) return false;
    // If "Other" is selected, ensure the otherEdit field is not empty
    if (currentData.selectedEdits.includes('other') && !currentData.otherEdit?.trim()) return false;
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
        <Wand2 className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Type of Edits Requested</h2>
          <p className="text-white/60">What specific changes do you need? (Check all that apply)</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 4: Edit Type Selection */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {editOptions.map((option) => {
              const isSelected = currentData.selectedEdits.includes(option.id);
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`glass-card p-4 text-left transition-all duration-200 rounded-lg flex items-center gap-3 ${
                    isSelected ? 'border-blue-400 bg-blue-400/10 ring-1 ring-blue-400' : 'hover:border-white/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-white/30'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-blue-300' : 'text-white/90'}`}>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conditional "Other" Text Input */}
        {showOtherInput && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-white/90">Please specify the other edit needed:</p>
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'otherEdit' ? 'border-blue-400 shadow-input-focus' : ''}`}>
              <Type className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <input
                type="text"
                id="otherEdit"
                value={currentData.otherEdit}
                onChange={(e) => handleOtherChange(e.target.value)}
                onFocus={() => setFocusedField('otherEdit')}
                onBlur={() => setFocusedField(null)}
                placeholder="Describe the other edit"
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                required={showOtherInput} // Only required if "Other" is selected
              />
            </div>
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

export default EditTypeStep;