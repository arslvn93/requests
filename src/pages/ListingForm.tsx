import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed S3Client and PutObjectCommand imports
import { v4 as uuidv4 } from 'uuid';
import FormProgress from '../components/ListingForm/FormProgress';
import ContactStep from '../components/ListingForm/ContactStep';
import AddressStep from '../components/ListingForm/AddressStep';
import PropertyDetailsStep from '../components/ListingForm/PropertyDetailsStep';
import PriceStep from '../components/ListingForm/PriceStep';
import AdDetailsStep from '../components/ListingForm/AdDetailsStep';
import PropertyHighlightsStep from '../components/ListingForm/PropertyHighlightsStep';
import TargetBuyerStep from '../components/ListingForm/TargetBuyerStep';
import PropertyUpgradesStep from '../components/ListingForm/PropertyUpgradesStep';
import InvestmentPotentialStep from '../components/ListingForm/InvestmentPotentialStep';
import NeighborhoodInfoStep from '../components/ListingForm/NeighborhoodInfoStep';
import PhotosMediaStep from '../components/ListingForm/PhotosMediaStep'; // Assuming PhotosMediaStep handles its own imports now
import ReviewStep from '../components/ListingForm/ReviewStep';
import SuccessStep from '../components/ListingForm/SuccessStep';
import IntroStep from '../components/ListingForm/IntroStep'; // Import the new IntroStep
import MobileFormNavigation from '../components/ListingForm/MobileFormNavigation'; // Import the mobile nav

// Define the structure for individual photo upload state
// Exporting these allows PhotosMediaStep and ReviewStep to import them if needed
export interface PhotoUploadInfo { // Simplified: Order in array determines rank
  id: string; // Unique ID for the photo instance
  s3Key: string; // Key in S3 bucket
  s3Url: string; // URL after successful upload
}

export interface FormData { // Export if needed by other components directly
  listingId: string | null;
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
  adDetails: {
    objective: string;
    dailyBudget: string;
    targetLocations: string[];
    duration: string;
    endDate?: string;
    targetEmotion: 'excited' | 'curious' | 'urgency' | 'trust' | 'luxury' | '';
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
  propertyHighlights: {
    topFeatures: string;
    wowFactor: string;
    firstImpression: string;
    hiddenGems: string;
  };
  targetBuyer: {
    idealBuyer: string;
    lifestyle: string;
    propertyAppeal: string;
    neighborhoodAppeal: string;
  };
  propertyUpgrades: {
    upgradesDescription: string;
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
  photosMedia: {
    uploads: PhotoUploadInfo[]; // Array order represents user ranking (0 = 1st best)
    virtualTourUrl?: string;
    videoUrl?: string;
  };
}

// Define initial state outside the component for resetting
const initialFormData: FormData = {
  listingId: null,
  contact: { firstName: '', lastName: '', phone: '', email: '' },
  address: { address: '', address2: '', city: '', state: '', zipCode: '', country: 'Canada' },
  propertyDetails: {
    propertyType: '', otherType: '', hasDen: undefined, hasBasement: undefined,
    basementType: undefined, basementBedrooms: undefined, basementBathrooms: undefined,
    hasBasementEntrance: undefined, squareFootage: '', bedrooms: '', bathrooms: '',
    price: '', showPrice: '',
  },
  adDetails: {
    objective: '', duration: '', endDate: undefined, dailyBudget: '',
    targetLocations: [''], targetEmotion: '',
  },
  propertyHighlights: { topFeatures: '', wowFactor: '', firstImpression: '', hiddenGems: '' },
  targetBuyer: { idealBuyer: '', lifestyle: '', propertyAppeal: '', neighborhoodAppeal: '' },
  propertyUpgrades: { upgradesDescription: '' },
  investmentPotential: {
    isGoodInvestment: '', rentalIncome: '', propertyAppreciation: '',
    developmentPlans: '', investmentHighlights: [],
  },
  neighborhoodInfo: { amenities: [], otherAmenity: '', comparison: '' },
  photosMedia: { uploads: [], virtualTourUrl: '', videoUrl: '' }, // Removed featuredPhotoId
};


const ListingForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0); // Start at step 0 (Intro)
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false); // State for mobile nav button enablement

  const totalSteps = 12;

  // Removed uploadPhotosToS3 function

  const mapFormDataToPayload = (data: FormData): Record<string, any> => {
    // The uploads array now only contains successfully uploaded photos, ordered by user preference.
    const photoUrls = data.photosMedia.uploads.map(p => p.s3Url);

     const payload: Record<string, any> = {
      listing_id: data.listingId, // Add listingId
      // Contact
      first_name: data.contact.firstName,
      last_name: data.contact.lastName,
      email: data.contact.email,
      phone: data.contact.phone,
      // Address
      address_line_1: data.address.address,
      address_line_2: data.address.address2 || null,
      city: data.address.city,
      state_province_region: data.address.state,
      zip_postal_code: data.address.zipCode,
      country: data.address.country,
      // Ad Details
      ad_objective: data.adDetails.objective,
      ad_target_locations: data.adDetails.targetLocations.filter(loc => loc).join(', '),
      ad_duration_type: data.adDetails.duration,
      ad_end_date: data.adDetails.duration === 'specific_date' ? data.adDetails.endDate : null,
      ad_daily_budget: data.adDetails.dailyBudget,
      ad_target_emotion: data.adDetails.targetEmotion,
      // Property Details
      property_type: data.propertyDetails.propertyType === 'other' ? data.propertyDetails.otherType : data.propertyDetails.propertyType,
      property_type_other: data.propertyDetails.propertyType === 'other' ? data.propertyDetails.otherType : null,
      listing_price: data.propertyDetails.price,
      show_price_in_ad: data.propertyDetails.showPrice === 'ad',
      bedrooms: data.propertyDetails.bedrooms,
      bathrooms: data.propertyDetails.bathrooms,
      has_den: data.propertyDetails.hasDen === 'yes',
      has_basement: data.propertyDetails.hasBasement === 'yes',
      basement_type: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.basementType : null,
      basement_bedrooms: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.basementBedrooms : null,
      basement_bathrooms: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.basementBathrooms : null,
      has_separate_basement_entrance: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.hasBasementEntrance === 'yes' : null,
      square_footage: data.propertyDetails.squareFootage,
      // Property Highlights
      top_features: data.propertyHighlights.topFeatures,
      wow_factor: data.propertyHighlights.wowFactor,
      first_impression: data.propertyHighlights.firstImpression,
      hidden_gems: data.propertyHighlights.hiddenGems,
      // Target Buyer
      ideal_buyer: data.targetBuyer.idealBuyer,
      lifestyle: data.targetBuyer.lifestyle,
      property_appeal: data.targetBuyer.propertyAppeal,
      neighborhood_appeal: data.targetBuyer.neighborhoodAppeal,
      // Neighborhood Info
      local_amenities: data.neighborhoodInfo.amenities,
      other_amenity: data.neighborhoodInfo.otherAmenity || null,
      comparison_to_similar_listings: data.neighborhoodInfo.comparison,
      // Property Upgrades
      recent_upgrades: data.propertyUpgrades.upgradesDescription,
      // Investment Potential
      is_investment_property: data.investmentPotential.isGoodInvestment === 'yes',
      potential_rental_income: data.investmentPotential.isGoodInvestment === 'yes' ? data.investmentPotential.rentalIncome : null,
      property_appreciation_potential: data.investmentPotential.isGoodInvestment === 'yes' ? data.investmentPotential.propertyAppreciation : null,
      upcoming_development_plans: data.investmentPotential.isGoodInvestment === 'yes' ? data.investmentPotential.developmentPlans : null,
      investment_highlights: data.investmentPotential.isGoodInvestment === 'yes' ? data.investmentPotential.investmentHighlights : [],
      // Photos/Media
      branded_photo_tour_url: data.photosMedia.virtualTourUrl || null,
      // featured_photo_id is removed
    };

    // Add the S3 photo URLs based on the user-defined order in the uploads array
    photoUrls.forEach((url, index) => {
      // Map array index (0-based) to payload key (1-based)
      payload[`photo_url_${index + 1}`] = url;
    });

    return payload;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Removed checks for uploading/failed photos as the new component handles this differently.
    // The photosMedia.uploads array will only contain successfully uploaded photos.

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setSubmissionMessage('Preparing listing data...');

    try {
      // Prepare Payload (no need to perform uploads here)
      const payload = mapFormDataToPayload(formData);
      const endpoint = 'https://n8n.salesgenius.co/webhook/listingad';

      // console.log('Submitting payload:', JSON.stringify(payload, null, 2)); // Removed log

      // Submit to Webhook
      setSubmissionMessage('Submitting listing data...');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        // Simplified success message
        setSubmissionMessage('Listing submitted successfully!');
        // console.log('Submission successful!'); // Removed log
      } else {
        const errorData = await response.text();
        console.error('Webhook submission failed:', response.status, errorData);
        setSubmissionStatus('error');
        setSubmissionMessage(`Webhook submission failed: ${response.status} - ${errorData || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error during submission process:', error);
      setSubmissionStatus('error');
      setSubmissionMessage('An error occurred during the submission process. Please check the console and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(0); // Reset to Intro step
    setSubmissionStatus('idle');
    setSubmissionMessage('');
    setIsSubmitting(false);
  };

  const handleBack = () => {
    if (submissionStatus === 'success') return; // Prevent back after success
    if (currentStep === 0) {
      navigate('/'); // Navigate away if on Intro step
      return;
    }
    if (currentStep === 1) {
      setCurrentStep(0); // Go back to Intro step from the first real step
      return;
    }
    setCurrentStep((prev) => Math.max(0, prev - 1)); // Allow going back to step 0
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  // Specific handler for updating listingId from PhotosMediaStep
  const handleListingIdChange = (id: string) => {
     setFormData((prev) => ({ ...prev, listingId: id }));
  };

  // Generic handler for updating form data fields
  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
     setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Specific handler for updating photosMedia state from PhotosMediaStep
  const updatePhotosMedia = (value: FormData['photosMedia']) => {
    setFormData((prev) => ({ ...prev, photosMedia: value }));
  };


  return (
    <div className="min-h-screen bg-black">
      {submissionStatus === 'success' ? (
        // Show Success Step on successful submission
        <SuccessStep submissionMessage={submissionMessage} onReset={handleReset} />
      ) : (
        // Otherwise, show the form progress and current step
        <>
          {currentStep > 0 && ( // Only show progress bar after the intro step
            <FormProgress
              currentStep={currentStep} // Pass the actual current step (1-12)
              totalSteps={totalSteps} // Total steps remain 12 (excluding intro)
              onBack={handleBack}
              showBack={currentStep > 1} // Show back button only after step 1 (for desktop)
            />
          )}
          {/* Main content area - Added responsive padding-bottom (pb-24) for mobile nav */}
          {/* Changed pt-24 to pt-12 md:pt-24 for smaller top padding on mobile */}
          <div className={`max-w-2xl mx-auto px-4 pb-24 md:pb-8 ${currentStep > 0 ? 'pt-12 md:pt-24' : 'pt-0'}`}>
            {/* Render the current step based on currentStep */}
            {currentStep === 0 && ( // Render Intro Step
              <IntroStep onNext={handleNext} onValidationChange={setIsCurrentStepValid} />
            )}
            {currentStep === 1 && (
              <ContactStep
                value={formData.contact}
                onChange={(value) => updateFormData('contact', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
             {currentStep === 2 && (
              <AddressStep
                value={formData.address}
                onChange={(value) => updateFormData('address', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 3 && (
              <PropertyDetailsStep
                value={formData.propertyDetails}
                onChange={(value) => updateFormData('propertyDetails', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 4 && (
              <PriceStep
                value={{ price: formData.propertyDetails.price, showPrice: formData.propertyDetails.showPrice }}
                onChange={(value) => updateFormData('propertyDetails', { ...formData.propertyDetails, ...value })}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 5 && (
              <PropertyUpgradesStep
                value={formData.propertyUpgrades}
                onChange={(value) => updateFormData('propertyUpgrades', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 6 && (
              <PropertyHighlightsStep
                value={formData.propertyHighlights}
                onChange={(value) => updateFormData('propertyHighlights', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 7 && (
              <InvestmentPotentialStep
                value={formData.investmentPotential}
                onChange={(value) => updateFormData('investmentPotential', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 8 && (
              <NeighborhoodInfoStep
                value={formData.neighborhoodInfo}
                onChange={(value) => updateFormData('neighborhoodInfo', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 9 && (
              <TargetBuyerStep
                value={formData.targetBuyer}
                onChange={(value) => updateFormData('targetBuyer', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 10 && (
              <AdDetailsStep
                value={formData.adDetails}
                onChange={(value) => updateFormData('adDetails', value)}
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
             {currentStep === 11 && (
              <PhotosMediaStep
                value={formData.photosMedia}
                listingId={formData.listingId} // Pass listingId
                onChange={updatePhotosMedia} // Pass specific updater for photosMedia
                onListingIdChange={handleListingIdChange} // Pass handler for listingId
                onNext={handleNext}
                onValidationChange={setIsCurrentStepValid}
              />
            )}
            {currentStep === 12 && (
              <ReviewStep
                formData={formData} // Pass the whole formData
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submissionStatus={submissionStatus}
                submissionMessage={submissionMessage}
              />
            )}
          </div>

          {/* Render Mobile Navigation */}
          <MobileFormNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isBackDisabled={currentStep === 0} // Disable back on Intro step
            isNextDisabled={!isCurrentStepValid && currentStep !== 0} // Disable next if step invalid (except intro)
            isReviewStep={currentStep === totalSteps}
          />
        </>
      )}
    </div>
  );
};

export default ListingForm;