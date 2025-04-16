import React, { useState } from 'react';
import { MapPin, Building2 } from 'lucide-react';

interface AddressInfo {
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressStepProps {
  value: AddressInfo;
  onChange: (value: AddressInfo) => void;
  onNext: () => void;
}

const AddressStep: React.FC<AddressStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof AddressInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const isValid = () => {
    return (
      value.address.trim().length > 0 &&
      value.city.trim().length > 0 &&
      value.state.trim().length > 0 &&
      value.zipCode.trim().length > 0 &&
      value.country.trim().length > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">Property Address</h2>
      <p className="text-white/60">Where is the property located?</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
          ${focusedField === 'address' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <MapPin className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            value={value.address}
            onChange={(e) => updateField('address', e.target.value)}
            onFocus={() => setFocusedField('address')}
            onBlur={() => setFocusedField(null)}
            placeholder="Street Address"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
        </div>

        <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
          ${focusedField === 'address2' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Building2 className="w-6 h-6 text-blue-400" />
          <input
            type="text"
            value={value.address2}
            onChange={(e) => updateField('address2', e.target.value)}
            onFocus={() => setFocusedField('address2')}
            onBlur={() => setFocusedField(null)}
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'city' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              type="text"
              value={value.city}
              onChange={(e) => updateField('city', e.target.value)}
              onFocus={() => setFocusedField('city')}
              onBlur={() => setFocusedField(null)}
              placeholder="City"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>

          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'state' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              type="text"
              value={value.state}
              onChange={(e) => updateField('state', e.target.value)}
              onFocus={() => setFocusedField('state')}
              onBlur={() => setFocusedField(null)}
              placeholder="State/Province"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'zipCode' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <input
              type="text"
              value={value.zipCode}
              onChange={(e) => updateField('zipCode', e.target.value)}
              onFocus={() => setFocusedField('zipCode')}
              onBlur={() => setFocusedField(null)}
              placeholder="ZIP/Postal Code"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>

          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'country' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <select
              value={value.country}
              onChange={(e) => updateField('country', e.target.value)}
              onFocus={() => setFocusedField('country')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent border-none outline-none text-white/90 cursor-pointer"
            >
              <option value="Canada" className="bg-gray-900">Canada</option>
              <option value="United States" className="bg-gray-900">United States</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next: Property Details
        </button>
      </form>
    </div>
  );
};

export default AddressStep;