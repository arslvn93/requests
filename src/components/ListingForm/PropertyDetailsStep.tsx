import React, { useState, useEffect } from 'react'; // Import useEffect
import { Building2, Home, Building, Bed, Bath, Ruler } from 'lucide-react';

interface PropertyDetailsInfo {
  propertyType: string;
  otherType?: string;
  hasDen?: string;
  hasBasement?: string;
  basementType?: string;
  basementBedrooms?: string;
  basementBathrooms?: string;
  hasBasementEntrance?: string;
  squareFootage: string;
  bedrooms: string;
  bathrooms: string;
  price: string; // Added price
  showPrice: 'ad' | 'email' | ''; // Updated type
}

interface PropertyDetailsStepProps {
  value: PropertyDetailsInfo;
  onChange: (value: PropertyDetailsInfo) => void;
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void; // Add prop for validation status
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ value, onChange, onNext, onValidationChange }) => { // Destructure new prop
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof PropertyDetailsInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const isValid = () => {
    // Ensure the function always returns a boolean using double negation !!()
    return !!(
      value.propertyType.trim().length > 0 &&
      (value.propertyType !== 'other' || (value.otherType && value.otherType.trim().length > 0)) &&
      (value.propertyType !== 'condo' || value.hasDen !== undefined) &&
      ((value.propertyType !== 'freehold' && value.propertyType !== 'townhouse' && value.propertyType !== 'other') ||
        (value.hasBasement !== undefined &&
          (value.hasBasement === 'no' ||
            (value.basementType &&
             value.basementBedrooms !== undefined &&
             value.basementBathrooms !== undefined &&
             value.hasBasementEntrance !== undefined)))) &&
      value.squareFootage.trim().length > 0 &&
      value.bedrooms.trim().length > 0 &&
      value.bathrooms.trim().length > 0
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
        <Home className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Property Details</h2>
          <p className="text-white/60">Tell us about the property features</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="text-white/90">What type of property is this?</p>
          <div className="grid grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => updateField('propertyType', 'condo')}
              className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200
                ${value.propertyType === 'condo' ? 'border-blue-400 bg-blue-400/10' : ''}`}
            >
              <Building2 className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center">Condo</span>
            </button>
            
            <button
              type="button"
              onClick={() => updateField('propertyType', 'freehold')}
              className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200
                ${value.propertyType === 'freehold' ? 'border-blue-400 bg-blue-400/10' : ''}`}
            >
              <Home className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center">Freehold</span>
            </button>

            <button
              type="button"
              onClick={() => updateField('propertyType', 'townhouse')}
              className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200
                ${value.propertyType === 'townhouse' ? 'border-blue-400 bg-blue-400/10' : ''}`}
            >
              <Building className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center">Townhouse</span>
            </button>

            <button
              type="button"
              onClick={() => updateField('propertyType', 'other')}
              className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200
                ${value.propertyType === 'other' ? 'border-blue-400 bg-blue-400/10' : ''}`}
            >
              <span className="text-3xl text-blue-400">...</span>
              <span className="text-white/90 font-medium text-center">Other</span>
            </button>
          </div>
        </div>

        {value.propertyType === 'other' && (
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'otherType' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Home className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              id="otherType"
              name="otherType"
              value={value.otherType}
              onChange={(e) => updateField('otherType', e.target.value)}
              onFocus={() => setFocusedField('otherType')}
              onBlur={() => setFocusedField(null)}
              placeholder="Please specify the property type"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required={value.propertyType === 'other'} // Conditionally required
            />
          </div>
        )}

        {value.propertyType === 'condo' && (
          <div className="space-y-3">
            <p className="text-white/90">Does this unit have a den?</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => updateField('hasDen', 'yes')}
                className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                  ${value.hasDen === 'yes'
                    ? 'bg-blue-500 text-white'
                    : 'glass-card text-white/90 hover:border-blue-400'}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => updateField('hasDen', 'no')}
                className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                  ${value.hasDen === 'no'
                    ? 'bg-blue-500 text-white'
                    : 'glass-card text-white/90 hover:border-blue-400'}`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {(value.propertyType === 'freehold' || value.propertyType === 'townhouse' || value.propertyType === 'other') && (
          /* Rule 4: Changed outer space-y-6 to space-y-3 for consistency within form */
          <div className="space-y-3">
            <div className="space-y-3">
              <p className="text-white/90">Does this property have a basement?</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateField('hasBasement', 'yes')}
                  className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                    ${value.hasBasement === 'yes'
                      ? 'bg-blue-500 text-white'
                      : 'glass-card text-white/90 hover:border-blue-400'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateField('hasBasement', 'no')}
                  className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                    ${value.hasBasement === 'no'
                      ? 'bg-blue-500 text-white'
                      : 'glass-card text-white/90 hover:border-blue-400'}`}
                >
                  No
                </button>
              </div>
            </div>

            {value.hasBasement === 'yes' && (
              <>
                <div className="space-y-3">
                  <p className="text-white/90">What type of basement is it?</p>
                  <div className="flex gap-4">
                    {['finished', 'unfinished', 'partially'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField('basementType', type)}
                        className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                          ${value.basementType === type
                            ? 'bg-blue-500 text-white'
                            : 'glass-card text-white/90 hover:border-blue-400'}`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rule 4: Added Question Block wrapper */}
                <div className="space-y-3">
                  {/* Rule 5: Removed mb-3 */}
                  <p className="text-white/90">Basement Bedrooms</p>
                  <div className="flex flex-wrap gap-3">
                    {[0, 1, 2, 3, 4].map((number) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() => updateField('basementBedrooms', number.toString())}
                        className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200
                          ${value.basementBedrooms === number.toString()
                            ? 'bg-blue-500 text-white border-2 border-blue-400'
                            : 'glass-card hover:border-blue-400'}`}
                      >
                        <Bed className="w-4 h-4 mb-0.5 text-blue-400" />
                        <span className="text-sm font-medium">{number}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rule 4: Added Question Block wrapper */}
                <div className="space-y-3">
                  {/* Rule 5: Removed mb-3 */}
                  <p className="text-white/90">Basement Bathrooms</p>
                  <div className="flex flex-wrap gap-3">
                    {['0', '1', '1.5', '2', '2.5', '3'].map((number) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() => updateField('basementBathrooms', number)}
                        className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200
                          ${value.basementBathrooms === number
                            ? 'bg-blue-500 text-white border-2 border-blue-400'
                            : 'glass-card hover:border-blue-400'}`}
                      >
                        <Bath className="w-4 h-4 mb-0.5 text-blue-400" />
                        <span className="text-sm font-medium">{number}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-white/90">Does the basement have a separate entrance?</p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => updateField('hasBasementEntrance', 'yes')}
                      className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                        ${value.hasBasementEntrance === 'yes'
                          ? 'bg-blue-500 text-white'
                          : 'glass-card text-white/90 hover:border-blue-400'}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('hasBasementEntrance', 'no')}
                      className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                        ${value.hasBasementEntrance === 'no'
                          ? 'bg-blue-500 text-white'
                          : 'glass-card text-white/90 hover:border-blue-400'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Rule 4: Added Question Block wrapper */}
        <div className="space-y-3">
          {/* Rule 5: Removed mb-3 */}
          <p className="text-white/90">Bedrooms</p>
          <div className="flex flex-wrap gap-3">
            {[0, 1, 2, 3, 4, 5].map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => updateField('bedrooms', number.toString())}
                className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200
                  ${value.bedrooms === number.toString()
                    ? 'bg-blue-500 text-white border-2 border-blue-400'
                    : 'glass-card hover:border-blue-400'
                  }`}
              >
                <Bed className="w-4 h-4 mb-0.5 text-blue-400" />
                <span className="text-sm font-medium">{number}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rule 4: Added Question Block wrapper */}
        <div className="space-y-3">
          {/* Rule 5: Removed mb-3 */}
          <p className="text-white/90">Bathrooms</p>
          <div className="flex flex-wrap gap-3">
            {['1', '1.5', '2', '2.5', '3', '3.5', '4'].map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => updateField('bathrooms', number)}
                className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200
                  ${value.bathrooms === number
                    ? 'bg-blue-500 text-white border-2 border-blue-400'
                    : 'glass-card hover:border-blue-400'
                  }`}
              >
                <Bath className="w-4 h-4 mb-0.5 text-blue-400" />
                <span className="text-sm font-medium">{number}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rule 4: Added Question Block wrapper */}
        <div className="space-y-3">
          {/* Rule 5: Removed mb-3 */}
          <p className="text-white/90">Square Footage</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'squareFootage' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Ruler className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            id="squareFootage"
            name="squareFootage"
            inputMode="numeric" // Better for mobile keyboards
            pattern="[0-9]*" // Helps with validation
            value={value.squareFootage}
            onChange={(e) => updateField('squareFootage', e.target.value.replace(/\D/g, ''))}
            onFocus={() => setFocusedField('squareFootage')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter square footage"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            required
          />
          <span className="text-white/60">sq ft</span>
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

export default PropertyDetailsStep