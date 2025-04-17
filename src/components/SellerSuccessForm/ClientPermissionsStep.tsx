import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { CheckSquare, Link as LinkIcon } from 'lucide-react'; // Using CheckSquare and Link icons

// Define the shape of the data managed by this step
type ClientPermissionsData = SellerSuccessStoryData['clientPermissions'];

const ClientPermissionsStep: React.FC<StepProps<ClientPermissionsData, SellerSuccessStoryData>> = ({
  value,
  onChange,
  onValidationChange,
  onNext,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // This step is always valid as the link is optional
  const isValid = () => {
    return true;
  };

  // Effect to notify parent about validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [onValidationChange]);

  const handleSelectionChange = (selectedValue: 'Yes' | 'No') => {
    onChange({
      ...value,
      hasReview: selectedValue,
      // Clear the link if 'No' is selected
      reviewLink: selectedValue === 'No' ? '' : value.reviewLink,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <CheckSquare className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Client Permissions & Reviews</h2>
          <p className="text-white/60">Confirm review status and link if applicable</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Has Review Question */}
        <div className="space-y-3">
          <p className="text-white/90">Has this client given you a review?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleSelectionChange('Yes')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${
                value.hasReview === 'Yes' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleSelectionChange('No')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${
                value.hasReview === 'No' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Conditional Review Link Input */}
        {value.hasReview === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-white/90">Review Link (Optional)</p>
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'reviewLink' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <LinkIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <input
                id="reviewLink"
                name="reviewLink"
                type="url"
                placeholder="Link to Google/Facebook/Zillow review..."
                value={value.reviewLink || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('reviewLink')}
                onBlur={() => setFocusedField(null)}
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              />
            </div>
            <p className="text-sm text-white/60">Paste the link to the client's review if available.</p>
          </div>
        )}

        {/* Next Button */}
        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()} // Will always be enabled
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default ClientPermissionsStep;