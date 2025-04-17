import React from 'react';
import { BuyerSuccessStoryData } from '../../forms/buyer-success-story.config';
import {
  ClipboardList, User, MapPin, Home, TrendingUp, Link as LinkIcon, Search, Users, // Added Users
  Heart, Award, Lightbulb, Gift, CheckSquare, EyeOff
} from 'lucide-react'; // Import necessary icons

// Define props expected by Review steps
interface ReviewStepProps {
  formData: BuyerSuccessStoryData;
  onEdit: (stepId: string) => void;
  isSubmitting?: boolean; // Optional props from GenericFormPage
  submissionStatus?: 'idle' | 'success' | 'error';
  submissionMessage?: string;
}

// Helper component for consistent section layout (Copied pattern)
const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; stepId: string; onEdit: (stepId: string) => void }> = ({
  title,
  icon: Icon,
  children,
  stepId,
  onEdit
}) => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      </div>
      <button onClick={() => onEdit(stepId)} className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
    </div>
    {children}
  </div>
);

// Helper component for consistent label/value pairs (Copied pattern)
const InfoPair: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return (
    <div>
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-white/90 mt-1 whitespace-pre-wrap">{value}</p>
    </div>
  );
};

// Helper to format Yes/No values
const formatYesNo = (value?: string) => {
  if (value === 'Yes' || value === 'yes') return 'Yes';
  if (value === 'No' || value === 'no') return 'No';
  return '-';
};


const BuyerSuccessReviewStep: React.FC<ReviewStepProps> = ({ formData, onEdit }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Review Buyer Case Study Details</h2>
          <p className="text-white/60">Please confirm everything looks correct before submitting.</p>
        </div>
      </div>

      {/* Sections */}
      <Section title="Contact Info" icon={User} stepId="contact" onEdit={onEdit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          <InfoPair label="First Name" value={formData.contact.firstName} />
          <InfoPair label="Last Name" value={formData.contact.lastName} />
          <InfoPair label="Email" value={formData.contact.email} />
          <InfoPair label="Phone" value={formData.contact.phone} />
        </div>
      </Section>

      <Section title="Property Address" icon={MapPin} stepId="address" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Address" value={formData.address.address} />
            <InfoPair label="Address Line 2" value={formData.address.address2} />
            <InfoPair label="City" value={formData.address.city} />
            <InfoPair label="State/Province" value={formData.address.state} />
            <InfoPair label="ZIP/Postal Code" value={formData.address.zipCode} />
            <InfoPair label="Country" value={formData.address.country} />
         </div>
      </Section>

      <Section title="Property Details" icon={Home} stepId="propertyDetails" onEdit={onEdit}>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <InfoPair label="Property Type" value={formData.propertyDetails.propertyType} />
            <InfoPair label="Bedrooms" value={formData.propertyDetails.bedrooms} />
            <InfoPair label="Bathrooms" value={formData.propertyDetails.bathrooms} />
            <InfoPair label="Square Footage" value={formData.propertyDetails.squareFootage ? `${formData.propertyDetails.squareFootage} sq ft` : '-'} />
            <InfoPair label="Year Built" value={formData.propertyDetails.yearBuilt} />
         </div>
      </Section>

      <Section title="Property Stats (Purchase)" icon={TrendingUp} stepId="buyerPropertyStats" onEdit={onEdit}>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <InfoPair label="Listed Price" value={formData.buyerPropertyStats.listedPrice} />
            <InfoPair label="Purchased Price" value={formData.buyerPropertyStats.purchasedPrice} />
            <InfoPair label="Multiple Offer Situation?" value={formatYesNo(formData.buyerPropertyStats.multipleOffers)} />
            <InfoPair label="Other Relevant Stats" value={formData.buyerPropertyStats.otherStats} />
         </div>
      </Section>

      <Section title="Supporting Links & Media" icon={LinkIcon} stepId="buyerSupportingLinks" onEdit={onEdit}>
         <InfoPair label="Google Drive Link" value={formData.buyerSupportingLinks.googleDriveLink} />
      </Section>

      <Section title="Buyer Backstory" icon={Users} stepId="buyerBackstory" onEdit={onEdit}> {/* Now Users icon is imported */}
         <div className="space-y-3">
            <InfoPair label="Buyer Profile" value={formData.buyerBackstory.buyerProfile} />
            <InfoPair label="Challenges Faced" value={formData.buyerBackstory.challenges} />
            <InfoPair label="Biggest Fear" value={formData.buyerBackstory.fears} />
            <InfoPair label="Why They Chose You" value={formData.buyerBackstory.whyAgent} />
            <InfoPair label="Initial Goals" value={formData.buyerBackstory.initialGoals} />
         </div>
      </Section>

      <Section title="Home Search & Buying Process" icon={Search} stepId="homeSearchProcess" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Homes Viewed" value={formData.homeSearchProcess.homesViewed} />
            <InfoPair label="Top 3 Must-Haves" value={formData.homeSearchProcess.mustHaves} />
            <InfoPair label="Bidding Wars / Competition" value={formData.homeSearchProcess.biddingWars} />
            <InfoPair label="Strategies Used to Win" value={formData.homeSearchProcess.strategiesUsed} />
            <InfoPair label="Negotiated Terms (Beyond Price)" value={formData.homeSearchProcess.negotiatedTerms} />
         </div>
      </Section>

      <Section title="Emotional Impact" icon={Heart} stepId="buyerEmotionalImpact" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="How Purchase Changed Buyer's Life" value={formData.buyerEmotionalImpact.lifeChange} />
            <InfoPair label="Most Rewarding Part for You" value={formData.buyerEmotionalImpact.rewardingPart} />
            <InfoPair label="Testimonial/Feedback" value={formData.buyerEmotionalImpact.testimonial} />
            <InfoPair label="Quote for Future Buyers" value={formData.buyerEmotionalImpact.resonatingQuote} />
         </div>
      </Section>

      <Section title="Final Outcome" icon={Award} stepId="finalOutcome" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Final vs. Asking Price" value={formData.finalOutcome.finalVsAsking} />
            <InfoPair label="Offer-to-Close Speed" value={formData.finalOutcome.offerToCloseSpeed} />
            <InfoPair label="Unexpected Benefits" value={formData.finalOutcome.unexpectedBenefits} />
            <InfoPair label="Market Comparison" value={formData.finalOutcome.marketComparison} />
         </div>
      </Section>

      <Section title="Call To Action / Advice" icon={Lightbulb} stepId="buyerCallToAction" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="#1 Thing Buyers Should Know" value={formData.buyerCallToAction.num1ThingToKnow} />
            <InfoPair label="Biggest Misconception" value={formData.buyerCallToAction.misconception} />
            <InfoPair label="Advice for Those on the Fence" value={formData.buyerCallToAction.advice} />
         </div>
      </Section>

       {/* Optional Section: Bonus Items */}
      {(formData.buyerBonusItems?.unique || formData.buyerBonusItems?.beforeAfter || formData.buyerBonusItems?.impossibleAchieved) && (
        <Section title="Bonus Items" icon={Gift} stepId="buyerBonusItems" onEdit={onEdit}>
           <div className="space-y-3">
              <InfoPair label="Unique/Surprising Aspects" value={formData.buyerBonusItems.unique} />
              <InfoPair label="'Before & After' Transformations" value={formData.buyerBonusItems.beforeAfter} />
              <InfoPair label="Achieved the 'Impossible'?" value={formData.buyerBonusItems.impossibleAchieved} />
           </div>
        </Section>
      )}

      <Section title="Client Permissions" icon={CheckSquare} stepId="buyerClientPermissions" onEdit={onEdit}>
         <InfoPair label="Client Provided Review?" value={formatYesNo(formData.buyerClientPermissions.hasReview)} />
         <InfoPair label="Review Link" value={formData.buyerClientPermissions.reviewLink} />
      </Section>

      <Section title="Client Name Privacy" icon={EyeOff} stepId="buyerClientNamePrivacy" onEdit={onEdit}>
         <InfoPair label="Share Client Name?" value={formData.buyerClientNamePrivacy.shareName} />
         <InfoPair label="Client's Name" value={formData.buyerClientNamePrivacy.clientName} />
      </Section>


      {/* Submission button is handled by GenericFormPage */}
       <p className="text-center text-sm text-white/60 pt-4">
         Ready to submit? Click the "Submit Case Study" button below.
       </p>
    </div>
  );
};

export default BuyerSuccessReviewStep;