import React, { useState } from 'react';
import { Users, Megaphone, Calendar, MapPin, Plus, DollarSign } from 'lucide-react';

interface AdDetailsInfo {
  objective: string;
  duration: string;
  endDate?: string;
  dailyBudget: string;
  targetLocations: string[];
}

interface AdDetailsStepProps {
  value: AdDetailsInfo;
  onChange: (value: AdDetailsInfo) => void;
  onNext: () => void;
}

const AdDetailsStep: React.FC<AdDetailsStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState('');

  const updateField = (field: keyof AdDetailsInfo, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const addLocation = () => {
    if (newLocation.trim() && !value.targetLocations.includes(newLocation.trim())) {
      updateField('targetLocations', [...value.targetLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    updateField('targetLocations', value.targetLocations.filter(l => l !== location));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    updateField('dailyBudget', input);
  };

  const isValid = () => {
    return value.objective && value.dailyBudget && value.targetLocations.length > 0 && value.duration;
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
      <h2 className="text-2xl font-bold text-white/90">Ad Details</h2>
      <p className="text-white/60">Tell us about your advertising goals</p>
      
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
              value={displayBudget}
              onChange={handleBudgetChange}
              onFocus={() => setFocusedField('dailyBudget')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter daily budget"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
            <span className="text-white/60">/day</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/90">What City / Area would you like to promote your listing ad?</p>
          <div className="flex gap-4">
            <div className={`glass-card flex-1 flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'newLocation' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <MapPin className="w-6 h-6 text-blue-400" />
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onFocus={() => setFocusedField('newLocation')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter city or area"
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              />
            </div>
            
            <button
              type="button"
              onClick={addLocation}
              disabled={!newLocation.trim()}
              className="glass-card p-4 text-blue-400 hover:text-blue-300 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {value.targetLocations.length > 0 && (
            <div className="space-y-2">
              {value.targetLocations.map((location) => (
                <div key={location} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="text-white/90">{location}</span>
                  </div>
                  <button
                    onClick={() => removeLocation(location)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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
                value={value.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                onFocus={() => setFocusedField('endDate')}
                onBlur={() => setFocusedField(null)}
                min={new Date().toISOString().split('T')[0]}
                className="flex-1 bg-transparent border-none outline-none text-white/90"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next: Marketing Strategy
        </button>
      </form>
    </div>
  );
};

export default AdDetailsStep;