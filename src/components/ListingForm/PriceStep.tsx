import React, { useState, useEffect } from 'react'; // Import useEffect
import { DollarSign, Eye, Mail } from 'lucide-react';

interface PriceInfo {
  price: string;
  showPrice: 'ad' | 'email' | ''; // 'ad' or 'email'
}

interface PriceStepProps {
  value: PriceInfo;
  onChange: (value: PriceInfo) => void;
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void; // Add prop for validation status
}

const PriceStep: React.FC<PriceStepProps> = ({ value, onChange, onNext, onValidationChange }) => { // Destructure new prop
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof PriceInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    updateField('price', input);
  };

  const formatPriceDisplay = (price: string) => {
    if (!price) return '';
    return parseInt(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD', // Or your desired currency
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const isValid = () => {
    return value.price.trim().length > 0 && value.showPrice !== '';
  };

  // Effect to notify parent component (ListingForm) about validation status changes
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, onValidationChange]); // Re-run when value or the callback changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      {/* Rule 2: Added consistent header structure with icon */}
      <div className="flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Listing Price</h2>
          <p className="text-white/60">Set the price for your property listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="text-white/90">What is the listing price?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'price' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <DollarSign className="w-6 h-6 text-blue-400" />
            <input
              type="text" // Use text type to allow custom formatting display
              id="price"
              name="price"
              inputMode="numeric" // Better for mobile keyboards
              value={formatPriceDisplay(value.price)}
              onChange={handlePriceChange}
              onFocus={() => setFocusedField('price')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter listing price"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/90">Where do you want the listing price shown?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateField('showPrice', 'ad')}
              className={`glass-card p-6 flex flex-col items-center gap-4 transition-all duration-200
                ${value.showPrice === 'ad' ? 'border-blue-400 bg-blue-400/10' : ''}`}>
              <Eye className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center">
                Show In Ad
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateField('showPrice', 'email')}
              className={`glass-card p-6 flex flex-col items-center gap-4 transition-all duration-200
                ${value.showPrice === 'email' ? 'border-blue-400 bg-blue-400/10' : ''}`}>
              <Mail className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center">
                Only Show In Email Sequence
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hidden md:block" // Hide on mobile, show on desktop
          disabled={!isValid()}
        >
          Next {/* Removed specific step name */}
        </button>
      </form>
    </div>
  );
};

export default PriceStep;