import React, { useState, useEffect, useCallback } from 'react';
import { Megaphone, Share2, Mail, Printer, MousePointerSquare, Check } from 'lucide-react';
import { StepProps } from '../../forms/form-types';
import { GiveawayFormData } from '../../forms/giveaway.config';

// Define the shape of the data slice this step manages
type GiveawayPromoMethodData = GiveawayFormData['promotionMethods'];

// Extend StepProps with the specific data type for this step
interface GiveawayPromoMethodStepProps extends StepProps<GiveawayPromoMethodData, GiveawayFormData> {}

// Define promotion options
const promoOptions = [
  { id: 'A', label: 'Promote via Your Social Media Accounts', description: '(Video + Posts + ManyChat Setup)', icon: Share2 },
  { id: 'B', label: 'Promote via Email Marketing Campaign', description: '(CRM Sequence to Database)', icon: Mail },
  { id: 'C', label: 'Promote via Direct Mail Postcards & Flyers', description: '(Print-Ready Designs w/ QR Code)', icon: Printer },
  { id: 'D', label: 'Promote via Paid Social Media Ads', description: '(Creatives + Copy + Meta Ad Campaign Launch)', icon: MousePointerSquare },
];

const GiveawayPromoMethodStep: React.FC<GiveawayPromoMethodStepProps> = ({ value = [], onChange, onNext, onValidationChange }) => {
  // Ensure value is always an array
  const selectedMethods = Array.isArray(value) ? value : [];

  // --- Handlers ---
  const handleSelect = (methodId: string) => {
    const currentIndex = selectedMethods.indexOf(methodId);
    let newSelected: string[] = [];

    if (currentIndex === -1) {
      newSelected = [...selectedMethods, methodId]; // Add method
    } else {
      newSelected = selectedMethods.filter((id) => id !== methodId); // Remove method
    }
    onChange(newSelected); // Update parent state
  };

  // --- Validation ---
  const isValid = useCallback(() => {
    // Require at least one promotion method to be selected
    return selectedMethods.length > 0;
  }, [selectedMethods]);

  // Effect to notify parent component of validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [selectedMethods, isValid, onValidationChange]);

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
        <Megaphone className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Promotion Method</h2>
          <p className="text-white/60">How would you like to promote this Giveaway? (Select all that apply)</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 8: Promotion Methods */}
        <div className="space-y-3">
           <p className="text-sm text-white/70 mb-4">Every promotion includes a Custom Giveaway Funnel Buildout (Landing, Survey & Thank You Page).</p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {promoOptions.map((option) => {
               const isSelected = selectedMethods.includes(option.id);
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

export default GiveawayPromoMethodStep;