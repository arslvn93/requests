import React, { useState, useEffect, useCallback } from 'react';
import { Target, Repeat, ThumbsUp, Instagram, MapPin, Check } from 'lucide-react';
import { StepProps } from '../../forms/form-types';
import { GiveawayFormData } from '../../forms/giveaway.config';

// Define the shape of the data slice this step manages
// Note: It's optional in the main FormData, but required if this step is reached.
type GiveawayPaidTypeData = GiveawayFormData['paidCampaignType'];

// Extend StepProps with the specific data type for this step
interface GiveawayPaidTypeStepProps extends StepProps<GiveawayPaidTypeData, GiveawayFormData> {}

// Define campaign type options
const campaignOptions = [
  { id: 'A', label: 'Retargeting Campaign', description: '(Show to engaged contacts - requires CSV list)', icon: Repeat },
  { id: 'B', label: 'Facebook Page Like Campaign', description: '(Promote to gain new Facebook page likes)', icon: ThumbsUp },
  { id: 'C', label: 'Instagram Follower Campaign', description: '(Use giveaway to attract new Instagram followers)', icon: Instagram },
  { id: 'D', label: 'Local Lead Generation', description: '(Target potential clients in a specific area)', icon: MapPin },
];

const GiveawayPaidTypeStep: React.FC<GiveawayPaidTypeStepProps> = ({ value = [], onChange, onNext, onValidationChange }) => {
  // Ensure value is always an array
  const selectedTypes = Array.isArray(value) ? value : [];

  // --- Handlers ---
  const handleSelect = (typeId: string) => {
    const currentIndex = selectedTypes.indexOf(typeId);
    let newSelected: string[] = [];

    if (currentIndex === -1) {
      newSelected = [...selectedTypes, typeId]; // Add type
    } else {
      newSelected = selectedTypes.filter((id) => id !== typeId); // Remove type
    }
    onChange(newSelected); // Update parent state
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Require at least one campaign type if this step is shown
    return selectedTypes.length > 0;
  }, [selectedTypes]);

  // Effect to notify parent component of validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [selectedTypes, isValid, onValidationChange]);

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Paid Ad Campaign Type</h2>
          <p className="text-white/60">What type of paid social media campaign? (Select all that apply)</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 9: Paid Campaign Types */}
        <div className="space-y-3">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {campaignOptions.map((option) => {
               const isSelected = selectedTypes.includes(option.id);
               return (
                 <button
                   type="button"
                   key={option.id}
                   onClick={() => handleSelect(option.id)}
                   className={`glass-card p-4 flex flex-col items-center gap-3 text-center transition-all duration-200 relative rounded-lg ${
                     isSelected ? 'border-blue-400 bg-blue-400/10 ring-1 ring-blue-400' : 'hover:border-white/30'
                   }`}
                 >
                   {isSelected && (
                     <Check className="absolute top-2 right-2 w-5 h-5 text-blue-400 bg-gray-800 rounded-full p-0.5" />
                   )}
                   <option.icon className={`w-10 h-10 mb-2 ${isSelected ? 'text-blue-400' : 'text-blue-300/70'}`} />
                   <span className="text-white/90 font-medium">{option.label}</span>
                   <span className="text-xs text-white/60">{option.description}</span>
                 </button>
               );
             })}
           </div>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          disabled={!isValid()}
          className="w-full mt-6 py-3 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-button-focus disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default GiveawayPaidTypeStep;