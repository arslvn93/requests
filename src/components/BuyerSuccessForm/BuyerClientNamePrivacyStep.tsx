import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import { EyeOff, UserCheck } from 'lucide-react'; // Using EyeOff and UserCheck icons

// Define the shape of the data managed by this step
type BuyerClientNamePrivacyData = BuyerSuccessStoryData['buyerClientNamePrivacy'];

const BuyerClientNamePrivacyStep: React.FC<StepProps<BuyerClientNamePrivacyData, BuyerSuccessStoryData>> = ({
  value,
  onChange,
  onValidationChange,
  onNext,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isNameRequired = value.shareName === 'Yes, use their name';

  // Validation: Check if a selection is made, and if 'Yes' is selected, ensure name is provided
  const isValid = () => {
    if (!value.shareName) {
      return false; // Must select one option
    }
    if (isNameRequired && (!value.clientName || value.clientName.trim().length === 0)) {
      return false; // Name is required but not provided
    }
    return true;
  };

  // Effect to notify parent about validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, onValidationChange]);

  const handleSelectionChange = (selectedValue: 'Yes, use their name' | 'No, keep it private') => {
    onChange({
      ...value,
      shareName: selectedValue,
      // Clear the name if 'No' is selected
      clientName: selectedValue === 'No, keep it private' ? '' : value.clientName,
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
        <EyeOff className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Client Name Privacy</h2>
          <p className="text-white/60">Specify if the client's name can be used</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Share Name Question */}
        <div className="space-y-3">
          <p className="text-white/90">Is the client okay with their name being shared, or should it remain private?</p>
          <div className="flex flex-col sm:flex-row gap-4"> {/* Stack on small screens */}
            <button
              type="button"
              onClick={() => handleSelectionChange('Yes, use their name')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${
                value.shareName === 'Yes, use their name' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'
              }`}
            >
              Yes, use their name
            </button>
            <button
              type="button"
              onClick={() => handleSelectionChange('No, keep it private')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 ${
                value.shareName === 'No, keep it private' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'
              }`}
            >
              No, keep it private
            </button>
          </div>
           {!value.shareName && <p className="text-sm text-red-400">Please select an option.</p>}
        </div>

        {/* Conditional Client Name Input */}
        {isNameRequired && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-white/90">Client’s Name (Required)</p>
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'clientName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <UserCheck className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <input
                id="clientName"
                name="clientName"
                type="text"
                placeholder="Enter client's full name"
                value={value.clientName || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('clientName')}
                onBlur={() => setFocusedField(null)}
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                required={isNameRequired} // Dynamically set required based on selection
              />
            </div>
            {isNameRequired && (!value.clientName || value.clientName.trim().length === 0) && <p className="text-sm text-red-400">Client name is required when sharing is permitted.</p>}
          </div>
        )}

        {/* Next Button */}
        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default BuyerClientNamePrivacyStep;