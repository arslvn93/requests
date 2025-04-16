import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormProgress from '../components/ListingForm/FormProgress';
import ContactStep from '../components/ListingForm/ContactStep';
import AddressStep from '../components/ListingForm/AddressStep';
import PropertyDetailsStep from '../components/ListingForm/PropertyDetailsStep';
import AdDetailsStep from '../components/ListingForm/AdDetailsStep';
import PropertyHighlightsStep from '../components/ListingForm/PropertyHighlightsStep';
import TargetBuyerStep from '../components/ListingForm/TargetBuyerStep';
import MarketingStrategyStep from '../components/ListingForm/MarketingStrategyStep';
import PropertyUpgradesStep from '../components/ListingForm/PropertyUpgradesStep';
import InvestmentPotentialStep from '../components/ListingForm/InvestmentPotentialStep';
import PhotosMediaStep from '../components/ListingForm/PhotosMediaStep';
import ReviewStep from '../components/ListingForm/ReviewStep';

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
    showPrice: string;
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
  marketingStrategy: {
    marketingChannels: string[];
    targetAudience: string;
    uniqueSellingPoints: string;
    callToAction: string;
  };
  propertyUpgrades: {
    recentUpgrades: Array<{ name: string; year: string; }>;
    customFeatures: string[];
    customFeature: string;
  };
  investmentPotential: {
    rentalIncome: string;
    propertyAppreciation: string;
    developmentPlans: string;
    investmentHighlights: string[];
  };
  photosMedia: {
    photos: File[];
    featuredPhotoIndex: number;
    virtualTourUrl?: string;
    videoUrl?: string;
  };
}

const ListingForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    address: {
      address: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Canada',
    },
    propertyDetails: {
      propertyType: '',
      otherType: '',
      hasDen: undefined,
      hasBasement: undefined,
      basementType: undefined,
      basementBedrooms: undefined,
      basementBathrooms: undefined,
      hasBasementEntrance: undefined,
      squareFootage: '',
      bedrooms: '',
      bathrooms: '',
      price: '',
      showPrice: '',
    },
    adDetails: {
      objective: '',
      duration: '',
      endDate: undefined,
      dailyBudget: '',
      targetLocations: []
    },
    propertyHighlights: {
      topFeatures: '',
      wowFactor: '',
      firstImpression: '',
      hiddenGems: ''
    },
    targetBuyer: {
      idealBuyer: '',
      lifestyle: '',
      propertyAppeal: '',
      neighborhoodAppeal: ''
    },
    marketingStrategy: {
      marketingChannels: [],
      targetAudience: '',
      uniqueSellingPoints: '',
      callToAction: ''
    },
    propertyUpgrades: {
      recentUpgrades: [],
      customFeatures: [],
      customFeature: ''
    },
    investmentPotential: {
      rentalIncome: '',
      propertyAppreciation: '',
      developmentPlans: '',
      investmentHighlights: []
    },
    photosMedia: {
      photos: [],
      featuredPhotoIndex: 0,
      virtualTourUrl: '',
      videoUrl: ''
    }
  });

  const totalSteps = 11;

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const handleBack = () => {
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
      <FormProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        showBack={true}
      />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
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
          <PropertyUpgradesStep
            value={formData.propertyUpgrades}
            onChange={(value) => updateFormData('propertyUpgrades', value)}
            onNext={handleNext}
          />
        )}
        {currentStep === 5 && (
          <PropertyHighlightsStep
            value={formData.propertyHighlights}
            onChange={(value) => updateFormData('propertyHighlights', value)}
            onNext={handleNext}
          />
        )}
        {currentStep === 6 && (
          <InvestmentPotentialStep
            value={formData.investmentPotential}
            onChange={(value) => updateFormData('investmentPotential', value)}
            onNext={handleNext}
          />
        )}
        {currentStep === 7 && (
          <TargetBuyerStep
            value={formData.targetBuyer}
            onChange={(value) => updateFormData('targetBuyer', value)}
            onNext={handleNext}
          />
        )}
        {currentStep === 8 && (
          <AdDetailsStep
            value={formData.adDetails}
            onChange={(value) => updateFormData('adDetails', value)}
            onNext={handleNext}
          />
        )}
        {currentStep === 9 && (
          <MarketingStrategyStep
            value={formData.marketingStrategy}
            onChange={(value) => updateFormData('marketingStrategy', value)}
            onNext={handleNext}
          />
        )}
        {currentStep === 10 && (
          <PhotosMediaStep
            value={formData.photosMedia}
            onChange={(value) => updateFormData('photosMedia', value)}
            onNext={handleNext}
          />
        )}
        {currentStep === 11 && (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ListingForm;