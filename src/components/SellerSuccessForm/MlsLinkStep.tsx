import React, { useEffect, useState } from 'react';
import { StepProps } from '../../forms/form-types';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import { Database } from 'lucide-react'; // Using Database icon

// Define the shape of the data managed by this step
type MlsLinkData = SellerSuccessStoryData['mlsLink'];

const MlsLinkStep: React.FC<StepProps<MlsLinkData, SellerSuccessStoryData>> = ({
  value = { mlsUrl: '', mlsDetails: '' }, // Provide default empty object
  onChange,
  onValidationChange,
  onNext,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // This step is optional, so validation always passes
  const isValid = () => {
    return true;
  };

  // Effect to notify parent about validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [onValidationChange]); // Only needs to run once or when callback changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: inputValue } = e.target;
    // Ensure value is not undefined before spreading
    const currentValue = value || { mlsUrl: '', mlsDetails: '' };
    onChange({
      ...currentValue,
      [name]: inputValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext(); // Should always proceed as isValid is true
  };

  return (
    <div className="space-y-6 animate-fade-in"> {/* Root element */}
      {/* Header */}
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">MLS Link (Optional)</h2>
          <p className="text-white/60">Provide MLS listing/sold data if available</p>
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MLS Link Input */}
        <div className="space-y-3"> {/* Question Block */}
          <p className="text-white/90">Link to MLS Listing/Sold Data</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'mlsUrl' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Database className="w-6 h-6 text-blue-400 flex-shrink-0" /> {/* Reusing icon */}
            <input
              id="mlsUrl"
              name="mlsUrl"
              type="url"
              placeholder="https://www.mlswebsite.com/listing/..."
              value={value?.mlsUrl || ''} // Handle potentially undefined value
              onChange={handleChange}
              onFocus={() => setFocusedField('mlsUrl')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
          <p className="text-sm text-white/60">Paste the link here if you have one.</p>
        </div>

        {/* Supporting Details Textarea */}
        <div className="space-y-3">
          <p className="text-white/90">Supporting Details (If No Link)</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'mlsDetails' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
             {/* Optional Icon Here */}
            <textarea
              id="mlsDetails"
              name="mlsDetails"
              placeholder="MLS#: 123456, Sold Date: YYYY-MM-DD..."
              value={value?.mlsDetails || ''} // Handle potentially undefined value
              onChange={handleChange}
              onFocus={() => setFocusedField('mlsDetails')}
              onBlur={() => setFocusedField(null)}
              rows={4}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
          <p className="text-sm text-white/60">Enter details here only if you couldn't provide a link above.</p>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()} // Will always be enabled as isValid returns true
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default MlsLinkStep;