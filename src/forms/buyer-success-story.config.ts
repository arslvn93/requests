import { FormTypeConfig } from './form-types';

// Define the data structure for the Buyer Success Story form
export interface BuyerSuccessStoryData {
  // Slice matching ContactStep's ContactInfo interface
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  // Slice matching AddressStep's AddressInfo interface
  address: {
    address: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Slice matching PropertyDetailsStep's PropertyDetailsInfo interface (Confirmed same as Seller form)
  propertyDetails: {
    propertyType: string;
    bedrooms: number | string;
    bathrooms: number | string;
    squareFootage: number | string;
    yearBuilt: number | string;
    // Add other fields PropertyDetailsStep might expect/use if necessary
  };
  buyerPropertyStats: {
    listedPrice: string;
    purchasedPrice: string;
    multipleOffers: 'Yes' | 'No' | '';
    otherStats?: string;
  };
  buyerSupportingLinks: {
    googleDriveLink: string;
  };
  buyerBackstory: {
    buyerProfile: string;
    challenges: string;
    fears: string;
    whyAgent: string;
    initialGoals: string;
  };
  homeSearchProcess: {
    homesViewed: number | string;
    mustHaves: string;
    biddingWars?: string;
    strategiesUsed?: string;
    negotiatedTerms?: string;
  };
  buyerEmotionalImpact: {
    lifeChange: string;
    rewardingPart: string;
    testimonial?: string;
    resonatingQuote?: string;
  };
  finalOutcome: {
    finalVsAsking: string;
    offerToCloseSpeed: string;
    unexpectedBenefits?: string;
    marketComparison?: string;
  };
  buyerCallToAction: {
    num1ThingToKnow: string;
    misconception: string;
    advice: string;
  };
  buyerBonusItems?: {
    unique?: string;
    beforeAfter?: string;
    impossibleAchieved?: string;
  };
  buyerClientPermissions: {
    hasReview: 'Yes' | 'No' | '';
    reviewLink?: string;
  };
  buyerClientNamePrivacy: {
    shareName: 'Yes, use their name' | 'No, keep it private' | '';
    clientName?: string;
  };
}

// Define initial data structure, ensuring reused slices match component expectations
const initialData: BuyerSuccessStoryData = {
  contact: { firstName: '', lastName: '', email: '', phone: '' },
  address: { address: '', address2: '', city: '', state: '', zipCode: '', country: 'Canada' },
  propertyDetails: { propertyType: '', bedrooms: '', bathrooms: '', squareFootage: '', yearBuilt: '' },
  buyerPropertyStats: { listedPrice: '', purchasedPrice: '', multipleOffers: '', otherStats: '' },
  buyerSupportingLinks: { googleDriveLink: '' },
  buyerBackstory: { buyerProfile: '', challenges: '', fears: '', whyAgent: '', initialGoals: '' },
  homeSearchProcess: { homesViewed: '', mustHaves: '', biddingWars: '', strategiesUsed: '', negotiatedTerms: '' },
  buyerEmotionalImpact: { lifeChange: '', rewardingPart: '', testimonial: '', resonatingQuote: '' },
  finalOutcome: { finalVsAsking: '', offerToCloseSpeed: '', unexpectedBenefits: '', marketComparison: '' },
  buyerCallToAction: { num1ThingToKnow: '', misconception: '', advice: '' },
  buyerBonusItems: { unique: '', beforeAfter: '', impossibleAchieved: '' },
  buyerClientPermissions: { hasReview: '', reviewLink: '' },
  buyerClientNamePrivacy: { shareName: '', clientName: '' },
};

// Define the form configuration
export const buyerSuccessStoryConfig: FormTypeConfig<BuyerSuccessStoryData> = {
  formTypeId: 'buyer-success-story',
  name: 'Buyer Success Story Case Study',
  initialData: initialData,
  steps: [
    // Reused Steps
    { stepId: 'contact', componentId: 'ContactStep', title: 'Contact Info', icon: 'User', dataKey: 'contact' },
    { stepId: 'address', componentId: 'AddressStep', title: 'Property Address', icon: 'MapPin', dataKey: 'address' },
    { stepId: 'propertyDetails', componentId: 'PropertyDetailsStep', title: 'Property Details', icon: 'Home', dataKey: 'propertyDetails' },

    // New Steps
    { stepId: 'buyerPropertyStats', componentId: 'BuyerPropertyStatsStep', title: 'Purchase Stats', icon: 'TrendingUp', dataKey: 'buyerPropertyStats' },
    { stepId: 'buyerSupportingLinks', componentId: 'BuyerSupportingLinksStep', title: 'Media Links', icon: 'Link', dataKey: 'buyerSupportingLinks' },
    { stepId: 'buyerBackstory', componentId: 'BuyerBackstoryStep', title: 'Buyer Backstory', icon: 'Users', dataKey: 'buyerBackstory' },
    { stepId: 'homeSearchProcess', componentId: 'HomeSearchProcessStep', title: 'Search Process', icon: 'Search', dataKey: 'homeSearchProcess' },
    { stepId: 'buyerEmotionalImpact', componentId: 'BuyerEmotionalImpactStep', title: 'Impact', icon: 'Heart', dataKey: 'buyerEmotionalImpact' },
    { stepId: 'finalOutcome', componentId: 'FinalOutcomeStep', title: 'Outcome', icon: 'Award', dataKey: 'finalOutcome' },
    { stepId: 'buyerCallToAction', componentId: 'BuyerCallToActionStep', title: 'Buyer Advice', icon: 'Lightbulb', dataKey: 'buyerCallToAction' },
    { stepId: 'buyerBonusItems', componentId: 'BuyerBonusItemsStep', title: 'Bonus Details', icon: 'Gift', dataKey: 'buyerBonusItems', isOptional: true },
    { stepId: 'buyerClientPermissions', componentId: 'BuyerClientPermissionsStep', title: 'Permissions', icon: 'CheckSquare', dataKey: 'buyerClientPermissions' },
    { stepId: 'buyerClientNamePrivacy', componentId: 'BuyerClientNamePrivacyStep', title: 'Privacy', icon: 'EyeOff', dataKey: 'buyerClientNamePrivacy' },
  ],
  introComponentId: 'BuyerSuccessIntroStep', // Matches component name
  reviewComponentId: 'BuyerSuccessReviewStep', // Matches component name
  mapToPayload: (formData) => {
    // Basic mapping, may need refinement based on backend needs
    console.log("Mapping Buyer Success data for payload:", formData);
    return { ...formData };
  },
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/buyer-success',
  successMessage: '🎉 Success! Your Just Purchased Case Study Has Been Submitted!',
};