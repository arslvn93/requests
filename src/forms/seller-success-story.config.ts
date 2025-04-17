import { FormTypeConfig } from './form-types'; // Assuming form-types.ts exists and exports this

// Define the data structure for the Seller Success Story form
export interface SellerSuccessStoryData {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string; // Added missing phone field
  };
  address: { // Updated to match AddressStep component
    address: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyDetails: {
    propertyType: string;
    bedrooms: number | string;
    bathrooms: number | string;
    squareFootage: number | string;
    yearBuilt: number | string;
  };
  propertyStats: {
    listedPrice: string;
    soldPrice: string;
    daysOnMarket: number | string;
    numOffers: number | string;
    numShowings: number | string;
    otherStats?: string;
  };
  supportingLinks: {
    googleDriveLink: string;
  };
  mlsLink?: {
    mlsUrl?: string;
    mlsDetails?: string;
  };
  backstory: {
    sellerProfile: string;
    challenges: string;
    fears: string;
    whyAgent: string;
    initialGoals: string;
  };
  strategy: {
    pricing: string;
    marketing: string;
    buyerSource?: string;
    showingsOffersGenerated: string;
    urgency: string;
    challengesHandled?: string;
  };
  results: {
    finalVsAsking: string;
    speedVsAverage: string;
    multipleOffers?: string;
    negotiatedTerms?: string;
    sellerReaction: string;
  };
  emotionalImpact: {
    lifeChange: string;
    rewardingPart: string;
    testimonial?: string;
    resonatingQuote?: string;
  };
  callToAction: {
    num1ThingToKnow: string;
    misconception: string;
    advice: string;
  };
  bonusItems?: {
    unique?: string;
    beforeAfter?: string;
    impossibleAchieved?: string;
  };
  clientPermissions: {
    hasReview: 'Yes' | 'No' | '';
    reviewLink?: string;
  };
  clientNamePrivacy: {
    shareName: 'Yes, use their name' | 'No, keep it private' | '';
    clientName?: string;
  };
}

// Define initial data structure
const initialData: SellerSuccessStoryData = {
  contact: { firstName: '', lastName: '', email: '', phone: '' },
  address: { address: '', address2: '', city: '', state: '', zipCode: '', country: 'Canada' }, // Updated to match AddressStep, default country
  propertyDetails: { propertyType: '', bedrooms: '', bathrooms: '', squareFootage: '', yearBuilt: '' },
  propertyStats: { listedPrice: '', soldPrice: '', daysOnMarket: '', numOffers: '', numShowings: '', otherStats: '' },
  supportingLinks: { googleDriveLink: '' },
  mlsLink: { mlsUrl: '', mlsDetails: '' },
  backstory: { sellerProfile: '', challenges: '', fears: '', whyAgent: '', initialGoals: '' },
  strategy: { pricing: '', marketing: '', buyerSource: '', showingsOffersGenerated: '', urgency: '', challengesHandled: '' },
  results: { finalVsAsking: '', speedVsAverage: '', multipleOffers: '', negotiatedTerms: '', sellerReaction: '' },
  emotionalImpact: { lifeChange: '', rewardingPart: '', testimonial: '', resonatingQuote: '' },
  callToAction: { num1ThingToKnow: '', misconception: '', advice: '' },
  bonusItems: { unique: '', beforeAfter: '', impossibleAchieved: '' },
  clientPermissions: { hasReview: '', reviewLink: '' },
  clientNamePrivacy: { shareName: '', clientName: '' },
};

// Define the form configuration
export const sellerSuccessStoryConfig: FormTypeConfig<SellerSuccessStoryData> = {
  formTypeId: 'seller-success-story',
  name: 'Seller Success Story Case Study', // Added required name property
  initialData: initialData,
  steps: [
    // Reused Steps
    { stepId: 'contact', componentId: 'ContactStep', title: 'Contact Info', icon: 'User', dataKey: 'contact' },
    { stepId: 'address', componentId: 'AddressStep', title: 'Property Address', icon: 'MapPin', dataKey: 'address' },
    { stepId: 'propertyDetails', componentId: 'PropertyDetailsStep', title: 'Property Details', icon: 'Home', dataKey: 'propertyDetails' }, // Assuming PropertyDetailsStep is registered

    // New Steps
    { stepId: 'propertyStats', componentId: 'PropertyStatsStep', title: 'Property Stats', icon: 'TrendingUp', dataKey: 'propertyStats' },
    { stepId: 'supportingLinks', componentId: 'SupportingLinksStep', title: 'Media Links', icon: 'Link', dataKey: 'supportingLinks' },
    { stepId: 'mlsLink', componentId: 'MlsLinkStep', title: 'MLS Link', icon: 'Database', dataKey: 'mlsLink', isOptional: true },
    { stepId: 'backstory', componentId: 'BackstoryStep', title: 'Backstory', icon: 'Users', dataKey: 'backstory' },
    { stepId: 'strategy', componentId: 'StrategyStep', title: 'Strategy', icon: 'Target', dataKey: 'strategy' },
    { stepId: 'results', componentId: 'ResultsStep', title: 'Results', icon: 'Award', dataKey: 'results' },
    { stepId: 'emotionalImpact', componentId: 'EmotionalImpactStep', title: 'Impact', icon: 'Heart', dataKey: 'emotionalImpact' },
    { stepId: 'callToAction', componentId: 'CallToActionStep', title: 'Advice', icon: 'Lightbulb', dataKey: 'callToAction' },
    { stepId: 'bonusItems', componentId: 'BonusItemsStep', title: 'Bonus Details', icon: 'Gift', dataKey: 'bonusItems', isOptional: true },
    { stepId: 'clientPermissions', componentId: 'ClientPermissionsStep', title: 'Permissions', icon: 'CheckSquare', dataKey: 'clientPermissions' },
    { stepId: 'clientNamePrivacy', componentId: 'ClientNamePrivacyStep', title: 'Privacy', icon: 'EyeOff', dataKey: 'clientNamePrivacy' },
  ],
  introComponentId: 'SellerSuccessIntroStep', // Matches component name
  reviewComponentId: 'SellerSuccessReviewStep', // Matches component name
  // Removed confirmationComponentId as it's not part of FormTypeConfig
  mapToPayload: (formData) => {
    // Logic to map formData to the backend payload structure
    // For now, just return the raw data (needs refinement based on backend requirements)
    console.log("Mapping data for payload:", formData); // Log for debugging
    return { ...formData };
  },
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/seller-success',
  successMessage: '🎉 Success! Your Just Sold Case Study Has Been Submitted!', // Default, can be overridden by ConfirmationComponent
};