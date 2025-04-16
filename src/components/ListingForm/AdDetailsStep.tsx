import React, { useState } from 'react';
import { Users, Megaphone, Calendar, MapPin, Plus, DollarSign, Smile, Search, Zap, ShieldCheck, Gem } from 'lucide-react'; // Added emotion icons

interface AdDetailsInfo {
  objective: string;
  duration: string;
  endDate?: string;
  dailyBudget: string;
  targetLocations: string[];
  targetEmotion: 'excited' | 'curious' | 'urgency' | 'trust' | 'luxury' | ''; // Added targetEmotion
}

interface AdDetailsStepProps {
  value: AdDetailsInfo;
  onChange: (value: AdDetailsInfo) => void;
  onNext: () => void;
}

const AdDetailsStep: React.FC<AdDetailsStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // Removed newLocation state

  const updateField = (field: keyof AdDetailsInfo, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  // Add a new empty location input field
  const addLocation = () => {
    updateField('targetLocations', [...value.targetLocations, '']);
  };

  // Remove location input field by index
  const removeLocation = (index: number) => {
    updateField('targetLocations', value.targetLocations.filter((_: string, i: number) => i !== index));
  };

  // Handle change for a specific location input
  const handleLocationChange = (index: number, newValue: string) => {
    const updatedLocations = [...value.targetLocations];
    updatedLocations[index] = newValue;
    updateField('targetLocations', updatedLocations);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    updateField('dailyBudget', input);
  };

  const isValid = () => {
    // Ensure objective, budget, at least one location, duration, and emotion are selected
    return value.objective &&
           value.dailyBudget &&
           value.targetLocations.some((loc: string) => loc.trim() !== '') &&
           value.duration &&
           value.targetEmotion !== ''; // Added emotion check
  };

  const setDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  const displayBudget = value.dailyBudget ? parseInt(value.dailyBudget).toLocaleString() : '';

  return (
    <div className="space-y-6">
      {/* Rule 2: Added consistent header structure with icon */}
      <div className="flex items-center gap-3">
        <Megaphone className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Ad Details</h2>
          <p className="text-white/60">Tell us about your advertising goals</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="text-white/90">What Is The Objective Of Your Ad?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateField('objective', 'leads')}
              className={`glass-card p-6 flex flex-col items-center gap-4 transition-all duration-200
                ${value.objective === 'leads' ? 'border-blue-400 bg-blue-400/10' : ''}`}
            >
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center">
                I Want To Generate Leads
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => updateField('objective', 'exposure')}
              className={`glass-card p-6 flex flex-col items-center gap-4 transition-all duration-200
                ${value.objective === 'exposure' ? 'border-blue-400 bg-blue-400/10' : ''}`}
            >
              <Megaphone className="w-8 h-8 text-blue-400" />
              <span className="text-white/90 font-medium text-center">
                I Want To Get Maximum Exposure
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/90">What is your daily budget for the Listing ad?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'dailyBudget' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <DollarSign className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              id="dailyBudget"
              name="dailyBudget"
              inputMode="numeric" // Better for mobile keyboards
              value={displayBudget}
              onChange={handleBudgetChange}
              onFocus={() => setFocusedField('dailyBudget')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter daily budget"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required
            />
            <span className="text-white/60">/day</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/90">What City / Area would you like to promote your listing ad?</p>
          
          {/* Render input for each location */}
          <div className="space-y-3">
            {value.targetLocations.map((location: string, index: number) => (
              <div key={index} className="flex gap-3 items-center">
                <div className={`glass-card flex-1 flex items-center gap-3 p-4 transition-all duration-200
                  ${focusedField === `location-${index}` ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <input
                    type="text"
                    id={`location-${index}`}
                    name={`location-${index}`}
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange(index, e.target.value)}
                    onFocus={() => setFocusedField(`location-${index}`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter city or area"
                    className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                    required
                  />
                </div>
                {/* Show remove button only if there's more than one location */}
                {value.targetLocations.length > 1 && (
                   <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="glass-card p-4 text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Remove location"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Button to add a new location input */}
          <button
            type="button"
            onClick={addLocation}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add another location</span>
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-white/90">When would you like to run this ad?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onChange({
                ...value,
                duration: 'until_sold',
                endDate: undefined
              })}
              className={`glass-card flex-1 p-4 text-center transition-all duration-200
                ${value.duration === 'until_sold' ? 'border-blue-400 bg-blue-400/10' : 'hover:border-blue-400'}`}
            >
              <span className="text-white/90 font-medium">Until It's Sold</span>
            </button>
            
            <button
              type="button"
              onClick={() => onChange({
                ...value,
                duration: 'specific',
                endDate: setDefaultEndDate()
              })}
              className={`glass-card flex-1 p-4 text-center transition-all duration-200
                ${value.duration === 'specific' ? 'border-blue-400 bg-blue-400/10' : 'hover:border-blue-400'}`}
            >
              <span className="text-white/90 font-medium">Specific Date</span>
            </button>
          </div>

          {value.duration === 'specific' && (
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'endDate' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <Calendar className="w-6 h-6 text-blue-400" />
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={value.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('endDate', e.target.value)}
                onFocus={() => setFocusedField('endDate')}
                onBlur={() => setFocusedField(null)}
                min={new Date().toISOString().split('T')[0]}
                className="flex-1 bg-transparent border-none outline-none text-white/90"
                required={value.duration === 'specific'} // Conditionally required
              />
            </div>
          )}
        </div>

        {/* --- Target Emotion Section --- */}
        <div className="space-y-3">
          <p className="text-white/90">What emotions do you want potential buyers to feel when they see this ad?</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {[
              { value: 'excited', label: 'Excited', icon: Smile },
              { value: 'curious', label: 'Curious', icon: Search },
              { value: 'urgency', label: 'Urgency', icon: Zap },
              { value: 'trust', label: 'Trust', icon: ShieldCheck },
              { value: 'luxury', label: 'Luxury', icon: Gem },
            ].map(({ value: emotionValue, label, icon: Icon }) => (
              <button
                key={emotionValue}
                type="button"
                onClick={() => updateField('targetEmotion', emotionValue)}
                className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200
                  ${value.targetEmotion === emotionValue ? 'border-blue-400 bg-blue-400/10' : ''}`}
              >
                <Icon className="w-8 h-8 text-blue-400" />
                <span className="text-white/90 font-medium text-center text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* --- End Target Emotion Section --- */}

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next {/* Changed button text */}
        </button>
      </form>
    </div>
  );
};

export default AdDetailsStep;