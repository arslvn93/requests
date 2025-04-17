import React from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';
import { GiveawayFormData } from '../../forms/giveaway.config'; // Import the specific FormData type

// Define props expected by this Review step
interface GiveawayReviewStepProps {
  formData: GiveawayFormData;
  onSubmit: () => void;
  isSubmitting: boolean;
  submissionStatus: 'idle' | 'success' | 'error'; // Re-add status if needed for display
  submissionMessage: string; // Re-add message if needed for display
  // Add onBack or other navigation if needed from props
}

// Helper to display array data nicely
const formatArray = (arr: string[] | undefined): string => {
    if (!arr || arr.length === 0) return 'N/A';
    // You might want more sophisticated mapping based on IDs (A, B, C, D) later
    return arr.join(', ');
}

const GiveawayReviewStep: React.FC<GiveawayReviewStepProps> = ({
  formData,
  onSubmit,
  isSubmitting,
  submissionStatus, // Currently unused, but available
  submissionMessage // Currently unused, but available
}) => {

  // Destructure for easier access, provide defaults
  const {
    contact = { firstName: '', lastName: '', phone: '', email: '' },
    giveawayDetails = { giveawayTypeDesc: '', giveawayValue: '', giveawayReason: '' },
    giveawayDates = { drawDate: '', promoStartDate: '' },
    giveawayAudience = { participantInfo: '', targetAudience: '' },
    promotionMethods = [],
    paidCampaignType, // Optional
    paidCampaignDetails, // Optional
    themePhoto // Optional
  } = formData;

  const showPaidAdSection = promotionMethods.includes('D');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CheckSquare className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Review Your Giveaway Details</h2>
          <p className="text-white/60">Please confirm everything looks correct before submitting.</p>
        </div>
      </div>

      {/* Review Sections */}
      <div className="space-y-6 text-white/90">

        {/* Contact Info */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Contact Info</h3>
          <p><strong>Name:</strong> {contact.firstName} {contact.lastName}</p>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone || 'N/A'}</p>
        </div>

        {/* Giveaway Details */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Giveaway Details</h3>
          <p><strong>Type/Description:</strong> {giveawayDetails.giveawayTypeDesc || 'N/A'}</p>
          <p><strong>Value:</strong> {giveawayDetails.giveawayValue || 'N/A'}</p>
          <p><strong>Reason:</strong> {giveawayDetails.giveawayReason || 'N/A'}</p>
        </div>

        {/* Dates */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Dates</h3>
          <p><strong>Draw Date:</strong> {giveawayDates.drawDate || 'N/A'}</p>
          <p><strong>Promotion Start Date:</strong> {giveawayDates.promoStartDate || 'N/A'}</p>
        </div>

        {/* Audience */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Audience & Info</h3>
          <p><strong>Participant Info:</strong> {giveawayAudience.participantInfo || 'N/A'}</p>
          <p><strong>Target Audience:</strong> {giveawayAudience.targetAudience || 'N/A'}</p>
        </div>

        {/* Promotion */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Promotion</h3>
          <p><strong>Methods:</strong> {formatArray(promotionMethods)}</p>
          {showPaidAdSection && (
            <>
              <p><strong>Paid Ad Type(s):</strong> {formatArray(paidCampaignType)}</p>
              <p><strong>Ad Target Area:</strong> {paidCampaignDetails?.paidCampaignTarget || 'N/A'}</p>
              <p><strong>Ad Daily Budget:</strong> {paidCampaignDetails?.paidCampaignBudget || 'N/A'}</p>
              <p><strong>Ad End Date:</strong> {paidCampaignDetails?.paidCampaignEndDate || 'N/A'}</p>
            </>
          )}
        </div>

         {/* Photo */}
         <div className="glass-card p-4 rounded-lg">
           <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Theme Photo</h3>
           <p><strong>File Selected:</strong> {themePhoto?.name || 'No photo uploaded'}</p>
         </div>

      </div>

      {/* Submission Button */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full mt-8 py-3 px-6 bg-green-600/90 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Confirm & Submit Giveaway'
        )}
      </button>

       {/* Display submission errors here if needed */}
       {submissionStatus === 'error' && (
         <p className="text-red-400 text-center mt-4">{submissionMessage}</p>
       )}

    </div>
  );
};

export default GiveawayReviewStep;