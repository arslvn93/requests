import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ImagePlus, UploadCloud, FileCheck } from 'lucide-react'; // Using relevant icons
import { StepProps } from '../../forms/form-types';
import { GiveawayFormData } from '../../forms/giveaway.config';

// Define the shape of the data slice this step manages
type GiveawayPhotoData = GiveawayFormData['themePhoto'];

// Extend StepProps with the specific data type for this step
interface GiveawayPhotoStepProps extends StepProps<GiveawayPhotoData, GiveawayFormData> {}

const GiveawayPhotoStep: React.FC<GiveawayPhotoStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [fileName, setFileName] = useState<string | null>(value?.name || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file); // Update parent state with the File object
      setFileName(file.name);
    } else {
      onChange(null); // Clear the file if selection is cancelled
      setFileName(null);
    }
  };

  // Trigger hidden file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // This step is optional according to the config, so it's always valid for navigation
    // If it were required, validation would be: return value instanceof File;
    return true;
  }, []); // No dependency on 'value' needed if always valid

  // Effect to notify parent component of validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [isValid, onValidationChange]);

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No validation check needed here if step is optional
    onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ImagePlus className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Giveaway Theme Photo</h2>
          <p className="text-white/60">Upload a relevant photo (optional).</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 13: File Upload */}
        <div className="space-y-3">
          <p className="text-white/90">Please upload a relevant photo related to your giveaway theme.</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif, image/webp" // Specify acceptable image types
            className="hidden" // Hide the default input
            id="giveawayPhotoUpload"
          />
          {/* Custom Upload Button */}
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-full glass-card p-6 border-2 border-dashed border-white/20 hover:border-blue-400 transition-colors duration-200 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
          >
            {fileName ? (
              <>
                <FileCheck className="w-12 h-12 text-green-400 mb-3" />
                <p className="text-white/90 font-medium">File Selected:</p>
                <p className="text-sm text-blue-300 break-all">{fileName}</p>
                <p className="text-xs text-white/50 mt-2">(Click again to change)</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-blue-400 mb-3" />
                <p className="text-white/90 font-medium">Click to Upload Photo</p>
                <p className="text-xs text-white/50 mt-1">PNG, JPG, GIF, WEBP accepted</p>
              </>
            )}
          </button>
           <p className="text-sm text-white/50">Example: If it's Halloween-themed, include a fun photo of yourself related to it.</p>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          // disabled={!isValid()} // Button is always enabled as step is optional
          className="w-full mt-6 py-3 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-button-focus disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default GiveawayPhotoStep;