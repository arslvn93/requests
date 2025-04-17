import React, { useState, useEffect, useCallback } from 'react';
import { Film, Type } from 'lucide-react'; // Using relevant icons
import { StepProps } from '../../forms/form-types';
import { VideoEditRequestFormData } from '../../forms/video-edit-request.config';

// Define the shape of the data slice this step manages
type VideoTypeData = VideoEditRequestFormData['videoType'];

// Extend StepProps with the specific data type for this step
interface VideoTypeStepProps extends StepProps<VideoTypeData, VideoEditRequestFormData> {}

// Define video type options
const videoTypeOptions = [
  'Giveaway Promo Video (Organic Social Media)',
  'Listing Ad Video (Short Form Listing Ad)',
  'Just Sold Brand Awareness Video (Short Form Brand Awareness Ad)',
  'General Brand Awareness Video (Short Form Ad)',
  'Lead Gen Campaign Video (Short Form Ad)',
  'General Social Media Video (Short Form Organic Social Media)',
  'Client Testimonial Video (Short Form Brand Awareness Ad)',
  'Marketing Update Video (Short Form Organic Social Media)',
  'VSL Pillar Video (Long-Form Marketing Hub)',
  'Marketing Update Video (Long Form Landing Page or Email)',
  'Other', // Special value for conditional input
];

const VideoTypeStep: React.FC<VideoTypeStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const showOtherInput = value.selectedType === 'Other';

  // --- Handlers ---
  const handleSelect = (typeValue: string) => {
    // If selecting something other than "Other", clear the otherType field
    const otherType = typeValue === 'Other' ? value.otherType : '';
    onChange({ selectedType: typeValue, otherType });
  };

  const handleOtherChange = (otherValue: string) => {
    // Only update if "Other" is selected
    if (value.selectedType === 'Other') {
      onChange({ ...value, otherType: otherValue });
    }
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Check if a type is selected
    if (!value.selectedType) return false;
    // If "Other" is selected, ensure the otherType field is not empty
    if (value.selectedType === 'Other' && !value.otherType?.trim()) return false;
    return true;
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
        <Film className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Video Type</h2>
          <p className="text-white/60">What type of video is this? (Select One)</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 3: Video Type Selection */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videoTypeOptions.map((option) => {
              const isSelected = value.selectedType === option;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`glass-card p-4 text-left transition-all duration-200 rounded-lg ${
                    isSelected ? 'border-blue-400 bg-blue-400/10 ring-1 ring-blue-400' : 'hover:border-white/30'
                  }`}
                >
                  <span className={`block font-medium ${isSelected ? 'text-blue-300' : 'text-white/90'}`}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conditional "Other" Text Input */}
        {showOtherInput && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-white/90">Please specify the video type:</p>
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'otherType' ? 'border-blue-400 shadow-input-focus' : ''}`}>
              <Type className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <input
                type="text"
                id="otherType"
                value={value.otherType || ''}
                onChange={(e) => handleOtherChange(e.target.value)}
                onFocus={() => setFocusedField('otherType')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter video type"
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

export default VideoTypeStep;