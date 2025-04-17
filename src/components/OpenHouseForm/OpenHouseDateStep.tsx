import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Clock, PlusCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { OpenHouseDateEntry, OpenHouseFormData } from '../../forms/open-house.config'; // Import the specific types
import { StepProps } from '../../forms/form-types';

// Use the specific StepProps type defined in the config
type OpenHouseDateProps = StepProps<OpenHouseDateEntry[], OpenHouseFormData>;

const OpenHouseDateStep: React.FC<OpenHouseDateProps> = ({ value: dateEntries, onChange, onNext, onValidationChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // --- Validation ---
  const isValid = useCallback(() => {
    if (!dateEntries || dateEntries.length === 0) {
      return false; // Need at least one entry
    }
    // Check if *every* entry has date, startTime, and endTime filled
    return dateEntries.every(entry => entry.date && entry.startTime && entry.endTime);
  }, [dateEntries]);

  useEffect(() => {
    onValidationChange(isValid());
  }, [dateEntries, isValid, onValidationChange]);

  // --- Handlers ---
  const handleInputChange = (id: string, field: keyof Omit<OpenHouseDateEntry, 'id'>, inputValue: string) => {
    console.log(`[OpenHouseDateStep] handleInputChange: id=${id}, field=${field}, value=${inputValue}`);
    const updatedEntries = dateEntries.map(entry =>
      entry.id === id ? { ...entry, [field]: inputValue } : entry
    );
    console.log('[OpenHouseDateStep] Updated entries after input change:', updatedEntries);
    onChange(updatedEntries);
  };

  const addDateEntry = () => {
    const newEntry: OpenHouseDateEntry = {
      id: uuidv4(),
      date: '',
      startTime: '',
      endTime: '',
    };
    const updatedEntries = [...dateEntries, newEntry];
    console.log('[OpenHouseDateStep] Updated entries after adding:', updatedEntries);
    onChange(updatedEntries);
  };

  const removeDateEntry = (id: string) => {
    // Prevent removing the last entry if only one exists
    if (dateEntries.length <= 1) {
        console.log('[OpenHouseDateStep] Prevented removing the last entry.');
        return;
    }
    const updatedEntries = dateEntries.filter(entry => entry.id !== id);
    console.log('[OpenHouseDateStep] Updated entries after removing:', updatedEntries);
    onChange(updatedEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      onNext();
    }
  };

  // --- Rendering ---
  console.log('[OpenHouseDateStep] Rendering with dateEntries:', dateEntries); // Log entries on render
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarDays className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Open House Date & Time</h2>
          <p className="text-white/60">Specify when the open house(s) will take place.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {dateEntries.map((entry, index) => (
          <div key={entry.id} className="space-y-4 p-4 glass-card rounded-lg relative">
            {/* Remove Button - only show if more than one entry */}
            {dateEntries.length > 1 && (
               <button
                 type="button"
                 onClick={() => removeDateEntry(entry.id)}
                 className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300 transition-colors"
                 aria-label="Remove date entry"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
            )}

            {/* Date Input */}
            <div className="space-y-3">
              <p className="text-white/90">Date</p>
              <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === `${entry.id}-date` ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
                <CalendarDays className="w-6 h-6 text-blue-400" />
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) => handleInputChange(entry.id, 'date', e.target.value)}
                  onFocus={() => setFocusedField(`${entry.id}-date`)}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                  required
                />
              </div>
            </div>

            {/* Time Inputs (Start & End) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-3">
                <p className="text-white/90">Start Time</p>
                <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === `${entry.id}-startTime` ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
                  <Clock className="w-6 h-6 text-blue-400" />
                  <input
                    type="time"
                    value={entry.startTime}
                    onChange={(e) => handleInputChange(entry.id, 'startTime', e.target.value)}
                    onFocus={() => setFocusedField(`${entry.id}-startTime`)}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                    required
                  />
                </div>
              </div>
              {/* End Time */}
              <div className="space-y-3">
                <p className="text-white/90">End Time</p>
                <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === `${entry.id}-endTime` ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
                  <Clock className="w-6 h-6 text-blue-400" />
                  <input
                    type="time"
                    value={entry.endTime}
                    onChange={(e) => handleInputChange(entry.id, 'endTime', e.target.value)}
                    onFocus={() => setFocusedField(`${entry.id}-endTime`)}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add More Button */}
        <button
          type="button"
          onClick={addDateEntry}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 text-blue-300 hover:text-blue-200 border-2 border-blue-500/50 hover:border-blue-400/80 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <PlusCircle className="w-5 h-5" />
          Add Another Date/Time
        </button>

        {/* Next Button */}
        <button
          type="submit"
          disabled={!isValid()}
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default OpenHouseDateStep;