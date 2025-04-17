import React, { useState, useEffect } from 'react'; // Import useEffect
import { MapPin, Building2 } from 'lucide-react';

// Updated interface to match common form data structure
interface AddressData {
  street: string;
  address2?: string; // Make optional
  city: string;
  province: string; // Changed from state
  postalCode: string; // Changed from zipCode
  country: string;
}

interface AddressStepProps {
  value: AddressData; // Use updated interface
  onChange: (value: AddressData) => void; // Use updated interface
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const AddressStep: React.FC<AddressStepProps> = ({ value, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Ensure value is initialized if potentially undefined/null from parent
  const currentAddress = value || { street: '', address2: '', city: '', province: '', postalCode: '', country: 'Canada' };


  const updateField = (field: keyof AddressData, newValue: string) => {
    onChange({ ...currentAddress, [field]: newValue });
  };

  const isValid = () => {
    // Check required fields based on the updated interface
    return (
      currentAddress.street?.trim().length > 0 &&
      currentAddress.city?.trim().length > 0 &&
      currentAddress.province?.trim().length > 0 &&
      currentAddress.postalCode?.trim().length > 0 &&
      currentAddress.country?.trim().length > 0
    );
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
        <MapPin className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Property Address</h2>
          <p className="text-white/60">Where is the property located?</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule 4 & 5: Added Question Block wrapper and Label */}
        <div className="space-y-3">
          <p className="text-white/90">Street Address</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'address' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <MapPin className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            id="street" // Changed id/name
            name="street" // Changed id/name
            value={currentAddress.street || ''} // Use updated field name
            onChange={(e) => updateField('street', e.target.value)} // Use updated field name
            onFocus={() => setFocusedField('street')} // Use updated field name
            onBlur={() => setFocusedField(null)}
            placeholder="Street Address"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            required
          />
          </div>
        </div>

        {/* Rule 4 & 5: Added Question Block wrapper and Label */}
        <div className="space-y-3">
          <p className="text-white/90">Apartment, suite, etc. (Optional)</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'address2' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Building2 className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            id="address2"
            name="address2"
            value={currentAddress.address2 || ''} // Use updated field name (optional)
            onChange={(e) => updateField('address2', e.target.value)} // Use updated field name
            onFocus={() => setFocusedField('address2')}
            onBlur={() => setFocusedField(null)}
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
          </div>
        </div>

        {/* Rule 4 & 5: Added Question Block wrapper and Labels */}
        <div className="space-y-3">
          <p className="text-white/90">City & State/Province</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'city' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              type="text"
              id="city"
              name="city"
              value={currentAddress.city || ''} // Use updated field name
              onChange={(e) => updateField('city', e.target.value)}
              onFocus={() => setFocusedField('city')}
              onBlur={() => setFocusedField(null)}
              placeholder="City"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
            </div>

            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'state' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              type="text"
              id="province" // Changed id/name
              name="province" // Changed id/name
              value={currentAddress.province || ''} // Use updated field name
              onChange={(e) => updateField('province', e.target.value)} // Use updated field name
              onFocus={() => setFocusedField('province')} // Use updated field name
              onBlur={() => setFocusedField(null)}
              placeholder="Province" // Updated placeholder
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
            </div>
          </div>
        </div>

        {/* Rule 4 & 5: Added Question Block wrapper and Labels */}
        <div className="space-y-3">
          <p className="text-white/90">ZIP/Postal Code & Country</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'zipCode' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              type="text"
              id="postalCode" // Changed id/name
              name="postalCode" // Changed id/name
              value={currentAddress.postalCode || ''} // Use updated field name
              onChange={(e) => updateField('postalCode', e.target.value)} // Use updated field name
              onFocus={() => setFocusedField('postalCode')} // Use updated field name
              onBlur={() => setFocusedField(null)}
              placeholder="Postal Code" // Updated placeholder
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
            </div>

            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'country' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <select
              id="country"
              name="country"
              value={currentAddress.country || 'Canada'} // Use updated field name, default to Canada
              onChange={(e) => updateField('country', e.target.value)}
              onFocus={() => setFocusedField('country')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 cursor-pointer"
              required
            >
              <option value="Canada" className="bg-gray-900">Canada</option>
              <option value="United States" className="bg-gray-900">United States</option>
            </select>
           </div>
         </div>
       </div>

       {/* Rule 8: Next button styling is already consistent */}
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

export default AddressStep;