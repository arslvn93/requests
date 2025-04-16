import React from 'react';
import { Check, DollarSign, MapPin, Home, Users, Target, Wrench, TrendingUp, Camera, Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react'; // Added Loader2, AlertCircle, CheckCircle

// Helper component for consistent section layout
const Section = ({
  icon: Icon,
  title,
  children
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex items-center gap-3 mb-4"> {/* Added mb-4 for spacing below header */}
      <Icon className="w-6 h-6 text-blue-400" />
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
    </div>
    {children}
  </div>
);

// Helper component for consistent label/value pairs
const InfoPair = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-white/60 text-sm">{label}</p> {/* Adjusted label size */}
    <p className="text-white/90 mt-1">{value || '-'}</p> {/* Added fallback and margin */}
  </div>
);

// Helper to format Yes/No values
const formatYesNo = (value?: string) => {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  return '-';
};

// Define the complete props based on final FormData
// Import the necessary types from ListingForm or define them here
// Assuming they are exported from ListingForm.tsx
import { FormData, PhotoUploadInfo } from '../../pages/ListingForm';

interface ReviewStepProps {
  formData: FormData; // Use the imported FormData type
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submissionStatus: 'idle' | 'success' | 'error';
  submissionMessage: string;
}

/* Remove the old inline definition
interface ReviewStepProps {
  formData: {
    contact: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    address: {
      address: string;
      address2: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    propertyDetails: {
      propertyType: string;
      otherType?: string;
      hasDen?: string;
      hasBasement?: string;
      basementType?: string;
      basementBedrooms?: string;
      basementBathrooms?: string;
      hasBasementEntrance?: string;
      squareFootage: string;
      bedrooms: string;
      bathrooms: string;
      price: string;
      showPrice: 'ad' | 'email' | '';
    };
    propertyUpgrades: {
      upgradesDescription: string;
    };
    propertyHighlights: {
      topFeatures: string;
      wowFactor: string;
      firstImpression: string;
      hiddenGems: string;
    };
    investmentPotential: {
      isGoodInvestment: 'yes' | 'no' | '';
      rentalIncome: string;
      propertyAppreciation: string;
      developmentPlans: string;
      investmentHighlights: string[];
    };
    neighborhoodInfo: {
      amenities: string[];
      otherAmenity: string;
      comparison: string;
    };
    targetBuyer: {
      idealBuyer: string;
      lifestyle: string;
      propertyAppeal: string;
      neighborhoodAppeal: string;
    };
    adDetails: {
      objective: string;
      dailyBudget: string;
      targetLocations: string[];
      duration: string;
      endDate?: string;
      targetEmotion: 'excited' | 'curious' | 'urgency' | 'trust' | 'luxury' | '';
    };
    photosMedia: {
      photos: File[];
      featuredPhotoIndex: number;
      virtualTourUrl?: string;
      videoUrl?: string;
    };
  };
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submissionStatus: 'idle' | 'success' | 'error';
  submissionMessage: string;
}
*/

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onSubmit,
  isSubmitting,
  submissionStatus,
  submissionMessage
}) => {
  const formatPrice = (price: string) => {
    if (!price) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(parseInt(price));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white/90 mb-2">Review Your Listing</h2>
        <p className="text-white/60">Please review all information before submitting</p>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <Section icon={Users} title="Contact Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4"> {/* Adjusted gap */}
            <InfoPair label="First Name" value={formData.contact.firstName} />
            <InfoPair label="Last Name" value={formData.contact.lastName} />
            <InfoPair label="Phone" value={formData.contact.phone} />
            <InfoPair label="Email" value={formData.contact.email} />
          </div>
        </Section>

        {/* Property Address */}
        <Section icon={MapPin} title="Property Address">
          <div className="space-y-3"> {/* Added spacing */}
            <InfoPair label="Address" value={formData.address.address} />
            {formData.address.address2 && <InfoPair label="Address Line 2" value={formData.address.address2} />}
            <InfoPair label="City" value={formData.address.city} />
            <InfoPair label="State/Province" value={formData.address.state} />
            <InfoPair label="ZIP/Postal Code" value={formData.address.zipCode} />
            <InfoPair label="Country" value={formData.address.country} />
          </div>
        </Section>

        {/* Property Details */}
        <Section icon={Home} title="Property Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <InfoPair label="Property Type" value={formData.propertyDetails.propertyType === 'other' ? formData.propertyDetails.otherType : formData.propertyDetails.propertyType} />
            <InfoPair label="Bedrooms" value={formData.propertyDetails.bedrooms} />
            <InfoPair label="Bathrooms" value={formData.propertyDetails.bathrooms} />
            <InfoPair label="Square Footage" value={`${formData.propertyDetails.squareFootage} sq ft`} />
            {formData.propertyDetails.propertyType === 'condo' && (
              <InfoPair label="Has Den?" value={formatYesNo(formData.propertyDetails.hasDen)} />
            )}
            {(formData.propertyDetails.propertyType === 'freehold' || formData.propertyDetails.propertyType === 'townhouse' || formData.propertyDetails.propertyType === 'other') && (
              <InfoPair label="Has Basement?" value={formatYesNo(formData.propertyDetails.hasBasement)} />
            )}
            {formData.propertyDetails.hasBasement === 'yes' && (
              <>
                <InfoPair label="Basement Type" value={formData.propertyDetails.basementType} />
                <InfoPair label="Basement Bedrooms" value={formData.propertyDetails.basementBedrooms} />
                <InfoPair label="Basement Bathrooms" value={formData.propertyDetails.basementBathrooms} />
                <InfoPair label="Separate Basement Entrance?" value={formatYesNo(formData.propertyDetails.hasBasementEntrance)} />
              </>
            )}
          </div>
        </Section>

        {/* Listing Price */}
        <Section icon={DollarSign} title="Listing Price">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
             <InfoPair label="Price" value={formatPrice(formData.propertyDetails.price)} />
             <InfoPair label="Display Location" value={formData.propertyDetails.showPrice === 'ad' ? 'Show in Ad' : 'Email Sequence Only'} />
           </div>
        </Section>

        {/* Property Upgrades */}
        <Section icon={Wrench} title="Property Upgrades">
          <InfoPair label="Recent Upgrades/Renovations" value={formData.propertyUpgrades.upgradesDescription || 'None specified'} />
        </Section>

        {/* Property Highlights */}
        <Section icon={Sparkles} title="Property Highlights">
           <div className="space-y-3">
             <InfoPair label="Top Features" value={formData.propertyHighlights.topFeatures} />
             <InfoPair label="WOW Factor" value={formData.propertyHighlights.wowFactor} />
             <InfoPair label="First Impression" value={formData.propertyHighlights.firstImpression} />
             <InfoPair label="Hidden Gems" value={formData.propertyHighlights.hiddenGems} />
           </div>
        </Section>

        {/* Investment Potential */}
        <Section icon={TrendingUp} title="Investment Potential">
          <div className="space-y-3">
            <InfoPair label="Good Investment Opportunity?" value={formatYesNo(formData.investmentPotential.isGoodInvestment)} />
            {formData.investmentPotential.isGoodInvestment === 'yes' && (
              <>
                {formData.investmentPotential.rentalIncome && <InfoPair label="Potential Monthly Rental Income" value={`${formatPrice(formData.investmentPotential.rentalIncome)}/month`} />}
                {formData.investmentPotential.propertyAppreciation && <InfoPair label="Appreciation Potential" value={formData.investmentPotential.propertyAppreciation} />}
                {formData.investmentPotential.developmentPlans && <InfoPair label="Upcoming Development Plans" value={formData.investmentPotential.developmentPlans} />}
                {formData.investmentPotential.investmentHighlights.length > 0 && (
                  <div>
                    <p className="text-white/60 text-sm">Investment Highlights</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.investmentPotential.investmentHighlights.map((highlight, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Section>

        {/* Neighborhood Information */}
        <Section icon={MapPin} title="Neighborhood Information">
          <div className="space-y-3">
            {formData.neighborhoodInfo.amenities.length > 0 && (
              <div>
                <p className="text-white/60 text-sm">Nearby Amenities</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.neighborhoodInfo.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-sm capitalize">
                      {amenity === 'other' ? formData.neighborhoodInfo.otherAmenity || 'Other' : amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {formData.neighborhoodInfo.comparison && (
               <InfoPair label="Comparison to Similar Listings" value={formData.neighborhoodInfo.comparison} />
            )}
            {!formData.neighborhoodInfo.amenities.length && !formData.neighborhoodInfo.comparison && (
              <p className="text-white/60 italic">No neighborhood information provided.</p>
            )}
          </div>
        </Section>

        {/* Target Buyer */}
        <Section icon={Users} title="Target Buyer">
           <div className="space-y-3">
             <InfoPair label="Ideal Buyer" value={formData.targetBuyer.idealBuyer} />
             <InfoPair label="Lifestyle" value={formData.targetBuyer.lifestyle} />
             <InfoPair label="Property Appeal" value={formData.targetBuyer.propertyAppeal} />
             <InfoPair label="Neighborhood Appeal" value={formData.targetBuyer.neighborhoodAppeal} />
           </div>
        </Section>

        {/* Ad Details */}
        <Section icon={Target} title="Ad Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <InfoPair label="Objective" value={formData.adDetails.objective} />
            <InfoPair label="Daily Budget" value={formatPrice(formData.adDetails.dailyBudget)} />
            <InfoPair label="Target Locations" value={formData.adDetails.targetLocations.join(', ')} />
            <InfoPair label="Duration" value={formData.adDetails.duration === 'until_sold' ? 'Until Sold' : `Until ${formData.adDetails.endDate}`} />
            <InfoPair label="Target Emotion" value={formData.adDetails.targetEmotion} />
          </div>
        </Section>

        {/* Photos & Media */}
        <Section icon={Camera} title="Photos & Media">
          <div className="space-y-4">
            {/* Filter for successfully uploaded photos */}
            {/* Display photos based on the order in the uploads array (user-defined ranking) */}
            {formData.photosMedia.uploads.length > 0 ? (
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                 {formData.photosMedia.uploads.map((photoInfo, index) => (
                   <div key={photoInfo.id} className="relative aspect-square">
                     <img
                       src={photoInfo.s3Url} // Use the final S3 URL
                       alt={`Property photo ${index + 1}`} // Alt text indicates order
                       className="w-full h-full object-cover rounded-lg"
                     />
                     {/* Display order badge */}
                     <div className="absolute top-1 left-1 px-2 py-0.5 bg-blue-500/80 rounded-full text-white text-xs font-medium backdrop-blur-sm">
                       {index + 1}
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
               <p className="text-white/60 italic">No photos uploaded.</p> // Updated message
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {formData.photosMedia.virtualTourUrl && <InfoPair label="Virtual Tour URL" value={formData.photosMedia.virtualTourUrl} />}
              {formData.photosMedia.videoUrl && <InfoPair label="Video URL" value={formData.photosMedia.videoUrl} />}
            </div>
          </div>
        </Section>

        {/* Submission Status Messages */}
        {submissionStatus === 'error' && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{submissionMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`w-full mt-8 py-4 px-6 rounded-xl transition-all duration-200
                     flex items-center justify-center gap-2 font-medium
                     ${isSubmitting
                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                       : 'bg-blue-500/90 hover:bg-blue-500 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                     }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Submit Listing
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;