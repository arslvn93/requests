import React from 'react';
import { SellerSuccessStoryData } from '../../forms/seller-success-story.config';
import {
  ClipboardList, User, MapPin, Home, TrendingUp, Link as LinkIcon, Database,
  Users as UsersIcon, Target, Award, Heart, Lightbulb, Gift, CheckSquare, EyeOff
} from 'lucide-react';

// Define props expected by Review steps (as passed by GenericFormPage)
interface ReviewStepProps {
  formData: SellerSuccessStoryData;
  onEdit: (stepId: string) => void; // Function to navigate back to a specific step for editing
  // Props related to submission status (passed but not used directly for rendering button here)
  isSubmitting?: boolean;
  submissionStatus?: 'idle' | 'success' | 'error';
  submissionMessage?: string;
}

// Helper component for consistent section layout (copied from ListingForm/ReviewStep)
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

// Helper component for consistent label/value pairs (copied from ListingForm/ReviewStep)
const InfoPair: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
  // Render only if value is present and not an empty string
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return (
    <div>
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-white/90 mt-1 whitespace-pre-wrap">{value}</p> {/* Added whitespace-pre-wrap */}
    </div>
  );
};

// Helper to format Yes/No values
const formatYesNo = (value?: string) => {
  if (value === 'Yes' || value === 'yes') return 'Yes';
  if (value === 'No' || value === 'no') return 'No';
  return '-';
};


const SellerSuccessReviewStep: React.FC<ReviewStepProps> = ({ formData, onEdit }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Review Your Case Study Details</h2>
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

      <Section title="Property Stats" icon={TrendingUp} stepId="propertyStats" onEdit={onEdit}>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <InfoPair label="Listed Price" value={formData.propertyStats.listedPrice} />
            <InfoPair label="Sold Price" value={formData.propertyStats.soldPrice} />
            <InfoPair label="Days on Market" value={formData.propertyStats.daysOnMarket} />
            <InfoPair label="Number of Offers" value={formData.propertyStats.numOffers} />
            <InfoPair label="Number of Showings" value={formData.propertyStats.numShowings} />
            <InfoPair label="Other Relevant Stats" value={formData.propertyStats.otherStats} />
         </div>
      </Section>

      <Section title="Supporting Links & Media" icon={LinkIcon} stepId="supportingLinks" onEdit={onEdit}>
         <InfoPair label="Google Drive Link" value={formData.supportingLinks.googleDriveLink} />
      </Section>

      {/* Optional Section: MLS Link */}
      {(formData.mlsLink?.mlsUrl || formData.mlsLink?.mlsDetails) && (
        <Section title="MLS Link" icon={Database} stepId="mlsLink" onEdit={onEdit}>
           <InfoPair label="Link to MLS Data" value={formData.mlsLink.mlsUrl} />
           <InfoPair label="Supporting Details" value={formData.mlsLink.mlsDetails} />
        </Section>
      )}

      <Section title="Backstory" icon={UsersIcon} stepId="backstory" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Seller Profile" value={formData.backstory.sellerProfile} />
            <InfoPair label="Challenges Faced" value={formData.backstory.challenges} />
            <InfoPair label="Biggest Fear" value={formData.backstory.fears} />
            <InfoPair label="Why They Chose You" value={formData.backstory.whyAgent} />
            <InfoPair label="Initial Goals" value={formData.backstory.initialGoals} />
         </div>
      </Section>

      <Section title="Listing & Marketing Strategy" icon={Target} stepId="strategy" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Pricing Strategy" value={formData.strategy.pricing} />
            <InfoPair label="Marketing Impact" value={formData.strategy.marketing} />
            <InfoPair label="Buyer Source" value={formData.strategy.buyerSource} />
            <InfoPair label="Showings/Offers Generated" value={formData.strategy.showingsOffersGenerated} />
            <InfoPair label="Urgency Creation" value={formData.strategy.urgency} />
            <InfoPair label="Challenges Handled" value={formData.strategy.challengesHandled} />
         </div>
      </Section>

      <Section title="Results" icon={Award} stepId="results" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Final vs. Asking Price" value={formData.results.finalVsAsking} />
            <InfoPair label="Speed vs. Market Average" value={formData.results.speedVsAverage} />
            <InfoPair label="Multiple Offers Details" value={formData.results.multipleOffers} />
            <InfoPair label="Negotiated Terms" value={formData.results.negotiatedTerms} />
            <InfoPair label="Seller's Reaction" value={formData.results.sellerReaction} />
         </div>
      </Section>

      <Section title="Emotional Impact" icon={Heart} stepId="emotionalImpact" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="How Sale Changed Seller's Life" value={formData.emotionalImpact.lifeChange} />
            <InfoPair label="Most Rewarding Part for You" value={formData.emotionalImpact.rewardingPart} />
            <InfoPair label="Testimonial/Feedback" value={formData.emotionalImpact.testimonial} />
            <InfoPair label="Quote for Future Clients" value={formData.emotionalImpact.resonatingQuote} />
         </div>
      </Section>

      <Section title="Call To Action / Advice" icon={Lightbulb} stepId="callToAction" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="#1 Thing Sellers Should Know" value={formData.callToAction.num1ThingToKnow} />
            <InfoPair label="Biggest Misconception" value={formData.callToAction.misconception} />
            <InfoPair label="Advice for Those on the Fence" value={formData.callToAction.advice} />
         </div>
      </Section>

       {/* Optional Section: Bonus Items */}
      {(formData.bonusItems?.unique || formData.bonusItems?.beforeAfter || formData.bonusItems?.impossibleAchieved) && (
        <Section title="Bonus Items" icon={Gift} stepId="bonusItems" onEdit={onEdit}>
           <div className="space-y-3">
              <InfoPair label="Unique/Surprising Aspects" value={formData.bonusItems.unique} />
              <InfoPair label="'Before & After' Transformations" value={formData.bonusItems.beforeAfter} />
              <InfoPair label="Achieved the 'Impossible'?" value={formData.bonusItems.impossibleAchieved} />
           </div>
        </Section>
      )}

      <Section title="Client Permissions" icon={CheckSquare} stepId="clientPermissions" onEdit={onEdit}>
         <InfoPair label="Client Provided Review?" value={formatYesNo(formData.clientPermissions.hasReview)} />
         <InfoPair label="Review Link" value={formData.clientPermissions.reviewLink} />
      </Section>

      <Section title="Client Name Privacy" icon={EyeOff} stepId="clientNamePrivacy" onEdit={onEdit}>
         <InfoPair label="Share Client Name?" value={formData.clientNamePrivacy.shareName} />
         <InfoPair label="Client's Name" value={formData.clientNamePrivacy.clientName} />
      </Section>


      {/* Submission button is handled by GenericFormPage */}
       <p className="text-center text-sm text-white/60 pt-4">
         Ready to submit? Click the "Submit Case Study" button below.
       </p>
    </div>
  );
};

export default SellerSuccessReviewStep;