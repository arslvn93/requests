import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
import PhotosMediaStep from '../components/ListingForm/PhotosMediaStep';
import ReviewStep from '../components/ListingForm/ReviewStep';
import SuccessStep from '../components/ListingForm/SuccessStep'; // Import SuccessStep

interface FormData {
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
    photos: File[];
    featuredPhotoIndex: number;
    virtualTourUrl?: string;
    videoUrl?: string;
  };
}

// S3 Client Configuration
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = import.meta.env.VITE_S3_BUCKET;
const awsRegion = import.meta.env.VITE_AWS_REGION;

// Define initial state outside the component for resetting
const initialFormData: FormData = {
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
  photosMedia: { photos: [], featuredPhotoIndex: 0, virtualTourUrl: '', videoUrl: '' },
};


const ListingForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData); // Use initial state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const totalSteps = 12;

  const uploadPhotosToS3 = async (photos: File[], listingId: string): Promise<{ successfulUrls: string[]; failedCount: number; }> => {
    const uploadPromises = photos.map(async (photo) => {
      const sanitizedFilename = photo.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      const key = `listings/${listingId}/${sanitizedFilename}`;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: photo,
        ContentType: photo.type,
        ACL: 'public-read',
      });

      try {
        await s3Client.send(command);
        const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
        console.log(`Successfully uploaded ${key} to ${url}`);
        return { status: 'fulfilled', value: url };
      } catch (error) {
        console.error(`Failed to upload ${key}:`, error);
        return { status: 'rejected', reason: error };
      }
    });

    const results = await Promise.allSettled(uploadPromises);
    const successfulUrls: string[] = [];
    let failedCount = 0;

    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.status === 'fulfilled' && typeof result.value.value === 'string') {
        successfulUrls.push(result.value.value);
      } else {
        failedCount++;
        const reason = result.status === 'rejected'
          ? result.reason
          : (result.value.status === 'rejected' ? result.value.reason : 'Unknown upload error: value was not a string');
        console.error("Upload failed. Reason:", reason);
      }
    });

    return { successfulUrls, failedCount };
  };


  const mapFormDataToPayload = (data: FormData, photoUrls: string[]): Record<string, any> => {
     const payload: Record<string, any> = {
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
    };

    // Add the actual S3 photo URLs
    photoUrls.forEach((url, index) => {
      payload[`photo_url_${index + 1}`] = url;
    });

    return payload;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setSubmissionMessage('Starting submission...');

    const listingId = uuidv4();
    let successfulUrls: string[] = [];
    let failedCount = 0;

    try {
      if (formData.photosMedia.photos.length > 0) {
        setSubmissionMessage(`Uploading ${formData.photosMedia.photos.length} photo(s)...`);
        const uploadResult = await uploadPhotosToS3(formData.photosMedia.photos, listingId);
        successfulUrls = uploadResult.successfulUrls;
        failedCount = uploadResult.failedCount;
        if (failedCount > 0) {
           console.warn(`${failedCount} photo(s) failed to upload.`);
        }
      } else {
        console.log("No photos to upload.");
      }

      setSubmissionMessage('Preparing listing data...');
      const payload = mapFormDataToPayload(formData, successfulUrls);
      const endpoint = 'https://n8n.salesgenius.co/webhook/listingad';

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

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
        const successMsg = failedCount > 0
          ? `Listing submitted successfully! (Note: ${failedCount} photo(s) failed to upload.)`
          : 'Listing submitted successfully!';
        setSubmissionMessage(successMsg);
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

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            showBack={currentStep > 1} // Only show back if not on step 1
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
                onChange={(value) => updateFormData('photosMedia', value)}
                onNext={handleNext}
              />
            )}
            {currentStep === 12 && (
              <ReviewStep
                formData={formData}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submissionStatus={submissionStatus} // Still needed for error display
                submissionMessage={submissionMessage} // Still needed for error display
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ListingForm;