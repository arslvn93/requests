import React, { useState, useEffect } from 'react'; // Import useEffect
import { MapPin, Trees, GraduationCap, UtensilsCrossed, ShoppingBag, TramFront, Car, Waves, Plus, Check } from 'lucide-react'; // Replaced TreePalm with Trees

interface NeighborhoodInfo {
  amenities: string[];
  otherAmenity: string;
  comparison: string;
}

interface NeighborhoodInfoStepProps {
  value: NeighborhoodInfo;
  onChange: (value: NeighborhoodInfo) => void;
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void; // Add prop for validation status
}

const defaultAmenities = [
  { value: 'parks', label: 'Parks', icon: Trees }, // Replaced TreePalm with Trees
  { value: 'schools', label: 'Schools', icon: GraduationCap },
  { value: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'transit', label: 'Public Transit', icon: TramFront },
  { value: 'highway', label: 'Highway Access', icon: Car },
  { value: 'waterfront', label: 'Waterfront', icon: Waves },
];

const NeighborhoodInfoStep: React.FC<NeighborhoodInfoStepProps> = ({ value, onChange, onNext, onValidationChange }) => { // Destructure new prop
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(value.amenities.includes('other'));

  const toggleAmenity = (amenity: string) => {
    let newAmenities = [...value.amenities];
    const isOther = amenity === 'other';

    if (newAmenities.includes(amenity)) {
      // Deselecting
      newAmenities = newAmenities.filter(a => a !== amenity);
      if (isOther) {
        setShowOtherInput(false);
        onChange({ ...value, amenities: newAmenities, otherAmenity: '' }); // Clear other text on deselect
        return;
      }
    } else {
      // Selecting
      if (newAmenities.length < 3) {
        newAmenities.push(amenity);
        if (isOther) {
          setShowOtherInput(true);
        }
      } else {
        // Optional: Provide feedback that limit is reached (console log removed)
        // console.log("Maximum 3 amenities selected");
        return;
      }
    }
    onChange({ ...value, amenities: newAmenities });
  };

  const handleOtherAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, otherAmenity: e.target.value });
  };

  const handleComparisonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, comparison: e.target.value });
  };

  // This step is optional
  const isValid = () => true;

  // Effect to notify parent component (ListingForm) about validation status changes
  // This step is always valid, so it will always call back with true.
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, onValidationChange]); // Re-run when value or the callback changes

  // Rule 3: Added handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No validation needed as step is optional, directly call onNext
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MapPin className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Neighborhood Information</h2>
          <p className="text-white/60">Highlight the benefits of the location (optional)</p>
        </div>
      </div>

      {/* Rule 3: Added form wrapper */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amenities Selection */}
        <div className="space-y-3">
          <p className="text-white/90">What local amenities would attract buyers? (Choose up to 3)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {defaultAmenities.map(({ value: amenityValue, label, icon: Icon }) => (
              <button
                key={amenityValue}
                type="button"
                onClick={() => toggleAmenity(amenityValue)}
                className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200 relative
                  ${value.amenities.includes(amenityValue) ? 'border-blue-400 bg-blue-400/10' : ''}`}>
                <Icon className="w-8 h-8 text-blue-400" />
                <span className="text-white/90 font-medium text-center text-sm">{label}</span>
                {value.amenities.includes(amenityValue) && (
                   <Check className="absolute top-2 right-2 w-5 h-5 text-blue-400" />
                 )}
              </button>
            ))}
            {/* Other Button */}
            <button
              type="button"
              onClick={() => toggleAmenity('other')}
              className={`glass-card p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 relative
                ${value.amenities.includes('other') ? 'border-blue-400 bg-blue-400/10' : ''}`}>
              <Plus className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center text-sm">Other</span>
               {value.amenities.includes('other') && (
                 <Check className="absolute top-2 right-2 w-5 h-5 text-blue-400" />
               )}
            </button>
          </div>
          {/* Other Amenity Input */}
          {showOtherInput && (
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 mt-4
              ${focusedField === 'otherAmenity' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <MapPin className="w-6 h-6 text-blue-400" />
              <input
                type="text"
                id="otherAmenity"
                name="otherAmenity"
                value={value.otherAmenity}
                onChange={handleOtherAmenityChange}
                onFocus={() => setFocusedField('otherAmenity')}
                onBlur={() => setFocusedField(null)}
                placeholder="Specify other amenity"
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                required={value.amenities.includes('other')} // Conditionally required
              />
            </div>
          )}
        </div>

        {/* Comparison Textarea */}
        {/* Rule 4: Changed space-y-2 to space-y-3 */}
        <div className="space-y-3">
          <p className="text-white/90">What makes this home better than similar listings in the area?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'comparison' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <MapPin className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="comparison"
              name="comparison"
              value={value.comparison}
              onChange={handleComparisonChange}
              onFocus={() => setFocusedField('comparison')}
              onBlur={() => setFocusedField(null)}
              placeholder="Highlight unique advantages, features, or value compared to nearby properties..."
              rows={5}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        {/* Next Button */}
        {/* Rule 8: Changed type to submit, added disabled attribute */}
        <button
          type="submit"
          disabled={!isValid()} // Keep disabled logic pattern even if always true
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   hidden md:block" // Hide on mobile, show on desktop
        >
          Next {/* Removed specific step name */}
        </button>
      </form>
    </div>
  );
};

export default NeighborhoodInfoStep;