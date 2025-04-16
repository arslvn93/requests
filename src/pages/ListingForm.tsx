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

// Define the structure for individual photo upload state
// Exporting these allows PhotosMediaStep and ReviewStep to import them if needed
export interface PhotoUploadInfo { // Export if needed by other components directly
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  s3Key?: string;
  s3Url?: string;
  error?: string;
  previewUrl: string;
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
    uploads: PhotoUploadInfo[];
    featuredPhotoId: string | null;
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
  photosMedia: { uploads: [], featuredPhotoId: null, virtualTourUrl: '', videoUrl: '' },
};


const ListingForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const totalSteps = 12;

  // Removed uploadPhotosToS3 function

  const mapFormDataToPayload = (data: FormData): Record<string, any> => {
    // Get successful photo URLs from the state
    const successfulUploads = data.photosMedia.uploads.filter(p => p.status === 'success');
    const photoUrls = successfulUploads.map(p => p.s3Url).filter((url): url is string => !!url);

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
      featured_photo_id: data.photosMedia.featuredPhotoId, // Include featured photo ID
    };

    // Add the actual S3 photo URLs from successful uploads
    photoUrls.forEach((url, index) => {
      payload[`photo_url_${index + 1}`] = url;
    });

    return payload;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Check if any photos are still uploading
    const uploadsInProgress = formData.photosMedia.uploads.some(p => p.status === 'uploading');
    if (uploadsInProgress) {
      setSubmissionStatus('error');
      setSubmissionMessage('Please wait for all photos to finish uploading before submitting.');
      return; // Prevent submission
    }

    // Optional: Check for failed uploads and warn or prevent submission
    const failedUploads = formData.photosMedia.uploads.filter(p => p.status === 'error');
    if (failedUploads.length > 0) {
       console.warn(`Warning: ${failedUploads.length} photo(s) have upload errors. Proceeding with submission...`);
       // Optionally prevent submission here if desired
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setSubmissionMessage('Preparing listing data...');

    try {
      // Prepare Payload (no need to perform uploads here)
      const payload = mapFormDataToPayload(formData);
      const endpoint = 'https://n8n.salesgenius.co/webhook/listingad';

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

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
        // Adjust success message based on whether there were *initial* upload errors
        const finalSuccessMsg = failedUploads.length > 0
          ? `Listing submitted successfully! (Note: ${failedUploads.length} photo(s) had upload errors.)`
          : 'Listing submitted successfully!';
        setSubmissionMessage(finalSuccessMsg);
        console.log('Submission successful!');
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
    setCurrentStep(1);
    setSubmissionStatus('idle');
    setSubmissionMessage('');
    setIsSubmitting(false);
  };

  const handleBack = () => {
    if (submissionStatus === 'success') return; // Prevent back after success
    if (currentStep === 1) {
      navigate('/');
      return;
    }
    setCurrentStep((prev) => Math.max(1, prev - 1));
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
          <FormProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
            showBack={currentStep > 1}
          />
          <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
            {/* Render the current step based on currentStep */}
            {currentStep === 1 && (
              <ContactStep
                value={formData.contact}
                onChange={(value) => updateFormData('contact', value)}
                onNext={handleNext}
              />
            )}
             {currentStep === 2 && (
              <AddressStep
                value={formData.address}
                onChange={(value) => updateFormData('address', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 3 && (
              <PropertyDetailsStep
                value={formData.propertyDetails}
                onChange={(value) => updateFormData('propertyDetails', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 4 && (
              <PriceStep
                value={{ price: formData.propertyDetails.price, showPrice: formData.propertyDetails.showPrice }}
                onChange={(value) => updateFormData('propertyDetails', { ...formData.propertyDetails, ...value })}
                onNext={handleNext}
              />
            )}
            {currentStep === 5 && (
              <PropertyUpgradesStep
                value={formData.propertyUpgrades}
                onChange={(value) => updateFormData('propertyUpgrades', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 6 && (
              <PropertyHighlightsStep
                value={formData.propertyHighlights}
                onChange={(value) => updateFormData('propertyHighlights', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 7 && (
              <InvestmentPotentialStep
                value={formData.investmentPotential}
                onChange={(value) => updateFormData('investmentPotential', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 8 && (
              <NeighborhoodInfoStep
                value={formData.neighborhoodInfo}
                onChange={(value) => updateFormData('neighborhoodInfo', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 9 && (
              <TargetBuyerStep
                value={formData.targetBuyer}
                onChange={(value) => updateFormData('targetBuyer', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 10 && (
              <AdDetailsStep
                value={formData.adDetails}
                onChange={(value) => updateFormData('adDetails', value)}
                onNext={handleNext}
              />
            )}
             {currentStep === 11 && (
              <PhotosMediaStep
                value={formData.photosMedia}
                listingId={formData.listingId} // Pass listingId
                onChange={updatePhotosMedia} // Pass specific updater for photosMedia
                onListingIdChange={handleListingIdChange} // Pass handler for listingId
                onNext={handleNext}
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
        </>
      )}
    </div>
  );
};

export default ListingForm;