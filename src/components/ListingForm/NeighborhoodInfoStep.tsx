import React, { useState } from 'react';
import { Map, Tree, School, Utensils, ShoppingBag, Bus, Road, Waves, Plus } from 'lucide-react';

interface NeighborhoodInfo {
  amenities: string[];
  otherAmenities?: string;
  uniqueAdvantages: string;
}

interface NeighborhoodInfoStepProps {
  value: NeighborhoodInfo;
  onChange: (value: NeighborhoodInfo) => void;
  onNext: () => void;
}

const NeighborhoodInfoStep: React.FC<NeighborhoodInfoStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const amenityOptions = [
    { id: 'parks', label: 'Parks', icon: Tree },
    { id: 'schools', label: 'Schools', icon: School },
    { id: 'restaurants', label: 'Restaurants', icon: Utensils },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'transit', label: 'Public Transit', icon: Bus },
    { id: 'highway', label: 'Highway Access', icon: Road },
    { id: 'waterfront', label: 'Waterfront', icon: Waves },
    { id: 'other', label: 'Other', icon: Plus },
  ];

  const toggleAmenity = (amenityId: string) => {
    if (value.amenities.includes(amenityId)) {
      onChange({
        ...value,
        amenities: value.amenities.filter(a => a !== amenityId),
        ...(amenityId === 'other' && { otherAmenities: '' })
      });
    } else if (value.amenities.length < 3 || value.amenities.includes(amenityId)) {
      onChange({
        ...value,
        amenities: [...value.amenities, amenityId]
      });
    }
  };

  const isValid = () => {
    if (value.amenities.length === 0) return false;
    if (value.amenities.includes('other') && !value.otherAmenities) return false;
    if (!value.uniqueAdvantages) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Map className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Neighborhood Information</h2>
          <p className="text-white/60">Tell us about the area around the property</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="text-white/90">What local amenities would attract buyers? (Choose up to 3)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {amenityOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleAmenity(id)}
                disabled={value.amenities.length >= 3 && !value.amenities.includes(id)}
                className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200
                  ${value.amenities.includes(id) ? 'border-blue-400 bg-blue-400/10' : ''}
                  ${value.amenities.length >= 3 && !value.amenities.includes(id) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className="w-6 h-6 text-blue-400" />
                <span className="text-white/90 text-sm font-medium text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {value.amenities.includes('other') && (
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'otherAmenities' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Plus className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              value={value.otherAmenities || ''}
              onChange={(e) => onChange({ ...value, otherAmenities: e.target.value })}
              onFocus={() => setFocusedField('otherAmenities')}
              onBlur={() => setFocusedField(null)}
              placeholder="Please specify other amenities"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-white/90">What makes this home better than similar listings in the area?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'uniqueAdvantages' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Map className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.uniqueAdvantages}
              onChange={(e) => onChange({ ...value, uniqueAdvantages: e.target.value })}
              onFocus={() => setFocusedField('uniqueAdvantages')}
              onBlur={() => setFocusedField(null)}
              placeholder="What sets this property apart from others in the neighborhood?"
              rows={4}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
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
          Next
        </button>
      </form>
    </div>
  );
};

export default NeighborhoodInfoStep;