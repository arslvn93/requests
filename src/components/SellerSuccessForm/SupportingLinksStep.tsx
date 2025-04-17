import React, { useEffect, useState } from 'react'; // Import useState
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { Link } from 'lucide-react'; // Using Link icon

// Define the shape of the data managed by this step
type SupportingLinksData = SellerSuccessStoryData['supportingLinks'];

const SupportingLinksStep: React.FC<StepProps<SupportingLinksData, SellerSuccessStoryData>> = ({
  value,
  onChange,
  onValidationChange,
  onNext, // Add onNext prop
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null); // Add focus state

  const isValid = () => {
    // Basic validation: check if the Google Drive link is provided (non-empty)
    // More robust URL validation could be added if needed
    return value.googleDriveLink.trim().length > 0;
  };

  useEffect(() => {
    onValidationChange(isValid());
  }, [value, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    onChange({
      ...value,
      [name]: inputValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in"> {/* Root element */}
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Supporting Links & Media</h2>
          <p className="text-white/60">Share property photos via Google Drive</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Google Drive Link */}
        <div className="space-y-3"> {/* Question Block */}
          <p className="text-white/90">Google Drive Link (Required)</p>
          <p className="text-sm text-white/70">
            Please share a Google Drive link to photos of the property featured in this case study.
          </p>
          <div className="text-sm text-white/60 space-y-1 pl-4 border-l-2 border-blue-400/50">
              <p><strong>Required Photos:</strong></p>
              <ul className="list-disc list-inside ml-2">
                  <li>1-2 photos of the front of the property</li>
                  <li>2-3 photos of the inside of the property</li>
              </ul>
              <p className="pt-1"><strong>📌 Important:</strong> Ensure your Google Drive sharing settings allow access. (Click Share, set General Access to "Anyone with the link".)</p>
          </div>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'googleDriveLink' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Link className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <input
              id="googleDriveLink"
              name="googleDriveLink"
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
              value={value.googleDriveLink || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField('googleDriveLink')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
          </div>
          <p className="text-sm text-white/60">Paste the shareable Google Drive link here.</p>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next
        </button>
      </form> {/* Added missing closing form tag */}
    </div>
  );
};

export default SupportingLinksStep;