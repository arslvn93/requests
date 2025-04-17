import { FormTypeConfig } from './form-types';

// ==========================================================================
// Data Structure for Giveaway Form
// ==========================================================================

// Define the structure for storing uploaded photo information
export interface GiveawayPhotoInfo {
  id: string;       // Unique identifier for the photo instance
  s3Key: string;    // The key (path) in the S3 bucket
  s3Url: string;    // The public URL of the uploaded photo
}

export interface GiveawayFormData {
  // Step 1: Contact Info
  contact: {
    firstName: string;
    lastName: string;
    phone: string; // Assuming phone is still needed for consistency
    email: string;
  };
  // Step 2: Giveaway Details (Managed by GiveawayDetailsStep)
  giveawayDetails: {
      giveawayTypeDesc: string;         // Q1 (Textarea)
      giveawayValue: string;            // Q2 (Text input, allows currency/text)
      giveawayReason: string;           // Q3 (Textarea)
  };
  // Step 3: Dates (Managed by GiveawayDatesStep)
  giveawayDates: {
      drawDate: string;                 // Q4 (Date input YYYY-MM-DD)
      promoStartDate: string;           // Q5 (Date input YYYY-MM-DD)
  };
  // Step 4: Participant & Audience (Managed by GiveawayAudienceStep)
  giveawayAudience: {
      participantInfo: string;          // Q6 (Textarea)
      targetAudience: string;           // Q7 (Textarea)
  };
  // Step 5: Promotion Method
  promotionMethods: string[];       // Q8 (Multi-select, values: 'A', 'B', 'C', 'D')
  // Step 6: Paid Campaign Type (Conditional)
  paidCampaignType?: string[];      // Q9 (Multi-select, values: 'A', 'B', 'C', 'D')
  // Step 7: Paid Campaign Details (Conditional - Managed by GiveawayPaidDetailsStep)
  paidCampaignDetails?: {
      paidCampaignTarget?: string;      // Q10 (Text input)
      paidCampaignBudget?: string;      // Q11 (Text input, numeric ideally but string for flexibility)
      paidCampaignEndDate?: string;     // Q12 (Date input YYYY-MM-DD)
  };
  // Step 8: Theme Photo
  themePhoto?: GiveawayPhotoInfo | null; // Stores S3 upload info
}

// ==========================================================================
// Initial Data for Giveaway Form
// ==========================================================================
const initialGiveawayData: GiveawayFormData = {
  contact: { firstName: '', lastName: '', phone: '', email: '' },
  giveawayDetails: {
      giveawayTypeDesc: '',
      giveawayValue: '',
      giveawayReason: '',
  },
  giveawayDates: {
      drawDate: '',
      promoStartDate: '',
  },
  giveawayAudience: {
      participantInfo: '',
      targetAudience: '',
  },
  promotionMethods: [],
  paidCampaignType: [], // Initialize as empty array
  paidCampaignDetails: { // Initialize sub-object
      paidCampaignTarget: '',
      paidCampaignBudget: '',
      paidCampaignEndDate: '',
  },
  themePhoto: null,
};

// ==========================================================================
// Configuration Object for Giveaway Form
// ==========================================================================
export const giveawayFormConfig: FormTypeConfig<GiveawayFormData> = {
  formTypeId: 'giveaway-campaign',
  name: 'Giveaway Campaign Setup',
  introComponentId: 'GiveawayIntroStep', // New component needed
  reviewComponentId: 'GiveawayReviewStep', // Use the new specific review step

  steps: [
    // Step 1: Contact Info (Reused)
    {
        stepId: 'contact',
        componentId: 'ContactStep', // From registry
        title: 'Contact Info',
        dataKey: 'contact',
        icon: 'User'
    },
    // Step 2: Giveaway Details (New Component)
    {
        stepId: 'giveawayDetails',
        componentId: 'GiveawayDetailsStep', // New component needed
        title: 'Giveaway Details',
        dataKey: 'giveawayDetails', // Manages the giveawayDetails object slice
        icon: 'ClipboardList'
    },
    // Step 3: Dates (New Component)
    {
        stepId: 'giveawayDates',
        componentId: 'GiveawayDatesStep', // New component needed
        title: 'Dates',
        dataKey: 'giveawayDates', // Manages the giveawayDates object slice
        icon: 'CalendarDays'
    },
    // Step 4: Participant & Audience (New Component)
    {
        stepId: 'giveawayAudience',
        componentId: 'GiveawayAudienceStep', // New component needed
        title: 'Audience',
        dataKey: 'giveawayAudience', // Manages the giveawayAudience object slice
        icon: 'Users'
    },
    // Step 5: Promotion Method (New Component)
    {
        stepId: 'giveawayPromoMethod',
        componentId: 'GiveawayPromoMethodStep', // New component needed
        title: 'Promotion',
        dataKey: 'promotionMethods',
        icon: 'Megaphone'
    },
    // Step 6: Paid Campaign Type (Conditional - New Component)
    {
      stepId: 'paidCampaignType',
      componentId: 'GiveawayPaidTypeStep', // New component needed
      title: 'Ad Type',
      dataKey: 'paidCampaignType',
      icon: 'Target',
      isOptional: true, // Mark as optional as it might be skipped
      shouldSkip: (formData: GiveawayFormData) => !formData.promotionMethods?.includes('D')
    },
    // Step 7: Paid Campaign Details (Conditional - New Component)
    {
      stepId: 'paidCampaignDetails',
      componentId: 'GiveawayPaidDetailsStep', // New component needed
      title: 'Ad Details',
      dataKey: 'paidCampaignDetails', // Manages the paidCampaignDetails object slice
      icon: 'DollarSign',
      isOptional: true, // Mark as optional as it might be skipped
      shouldSkip: (formData: GiveawayFormData) => !formData.promotionMethods?.includes('D')
    },
    // Step 8: Theme Photo (New Component)
    {
        stepId: 'giveawayPhoto',
        componentId: 'GiveawayPhotoStep', // New component needed
        title: 'Photo',
        dataKey: 'themePhoto',
        icon: 'ImagePlus',
        isOptional: true // Assuming photo is optional
    },
  ],

  initialData: initialGiveawayData,

  mapToPayload: (data: GiveawayFormData): Record<string, any> => {
    // Logic to transform GiveawayFormData into the backend JSON payload
    const payload: Record<string, any> = {
      // Contact
      contact_first_name: data.contact.firstName,
      contact_last_name: data.contact.lastName,
      contact_email: data.contact.email,
      contact_phone: data.contact.phone,
      // Giveaway Details
      giveaway_description: data.giveawayDetails.giveawayTypeDesc,
      giveaway_value: data.giveawayDetails.giveawayValue,
      giveaway_reason: data.giveawayDetails.giveawayReason,
      // Dates
      draw_date: data.giveawayDates.drawDate,
      promo_start_date: data.giveawayDates.promoStartDate,
      // Audience
      participant_info: data.giveawayAudience.participantInfo,
      target_audience: data.giveawayAudience.targetAudience,
      // Promotion
      promo_methods: data.promotionMethods?.join(','), // Join array into comma-separated string
      // Photo (send S3 URL)
      theme_photo_url: data.themePhoto?.s3Url || null,
    };

    // Conditionally include paid ad details only if 'D' was selected
    if (data.promotionMethods?.includes('D')) {
        payload.paid_ad_type = data.paidCampaignType?.join(',');
        payload.paid_ad_target = data.paidCampaignDetails?.paidCampaignTarget;
        payload.paid_ad_budget = data.paidCampaignDetails?.paidCampaignBudget;
        payload.paid_ad_end_date = data.paidCampaignDetails?.paidCampaignEndDate;
    }

    return payload;
  },

  // TODO: Confirm the actual submission endpoint for giveaways
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/giveaway-test', // Using a test endpoint for now

  successMessage: `🎉 Success! Giveaway Funnel Has Been Submitted!\n🚀 Next Steps:\n✅ Our team will review your responses and craft your Giveaway Funnel.\n✅ We’ll send you a preview before launching the ad and email campaign.\n✅ Expect to hear from us within 3 business days.\n💡 Need to update something? Contact clientcare@salesgenius.co.\nThanks for sharing your success – let’s turn it into more wins! 🏡💰`,
};