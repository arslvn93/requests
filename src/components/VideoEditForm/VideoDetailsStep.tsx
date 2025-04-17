import React, { useState, useEffect, useCallback } from 'react';
import { FileVideo, Type, Link } from 'lucide-react'; // Using relevant icons
import { StepProps } from '../../forms/form-types';
import { VideoEditRequestFormData } from '../../forms/video-edit-request.config';

// Define the shape of the data slice this step manages
type VideoDetailsData = VideoEditRequestFormData['videoDetails'];

// Extend StepProps with the specific data type for this step
interface VideoDetailsStepProps extends StepProps<VideoDetailsData, VideoEditRequestFormData> {}

const VideoDetailsStep: React.FC<VideoDetailsStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // --- Handlers ---
  const handleChange = (field: keyof VideoDetailsData, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Basic validation: check if fields are not empty
    // Could add URL validation for driveLink
    const isLinkValid = value.driveLink.trim() !== '' && value.driveLink.includes('drive.google.com'); // Basic check
    return value.originalTitle.trim() !== '' && isLinkValid;
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
        <FileVideo className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Video Details</h2>
          <p className="text-white/60">Identify the video needing revisions.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 1: Video Title */}
        <div className="space-y-3">
          <p className="text-white/90">Video Title or Name</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'originalTitle' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <Type className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="text"
              id="originalTitle"
              value={value.originalTitle}
              onChange={(e) => handleChange('originalTitle', e.target.value)}
              onFocus={() => setFocusedField('originalTitle')}
              onBlur={() => setFocusedField(null)}
              placeholder="How it was labeled in the original submission"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
          </div>
        </div>

        {/* Question 2: Google Drive Link */}
        <div className="space-y-3">
          <p className="text-white/90">Google Drive Link to the Edited Video</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'driveLink' ? 'border-blue-400 shadow-input-focus' : ''}`}>
            <Link className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              type="url" // Use URL type for better semantics/validation
              id="driveLink"
              value={value.driveLink}
              onChange={(e) => handleChange('driveLink', e.target.value)}
              onFocus={() => setFocusedField('driveLink')}
              onBlur={() => setFocusedField(null)}
              placeholder="https://drive.google.com/..."
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
          </div>
           <p className="text-sm text-white/50">Ensure sharing settings allow access: "Anyone with the link can view."</p>
           {!value.driveLink.includes('drive.google.com') && value.driveLink.length > 0 && (
             <p className="text-xs text-red-400">Please provide a valid Google Drive link.</p>
           )}
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

export default VideoDetailsStep;