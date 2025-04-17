import { FormTypeConfig, StepProps } from './form-types';
import { v4 as uuidv4 } from 'uuid';

// Define the structure for individual photo upload state matching ListingForm/PhotosMediaStep
export interface PhotoUploadInfo {
  id: string; // Unique ID for the photo instance
  s3Key: string; // Key in S3 bucket
  s3Url: string; // URL after successful upload
}

// Represents a single date/time slot for the open house (custom step data)
export interface OpenHouseDateEntry {
  id: string; // Unique ID for list rendering/management
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM (24-hour)
  endTime: string; // Format: HH:MM (24-hour)
}

// Main data structure for the entire form - ALIGNED WITH LISTING FORM COMPONENTS
export interface OpenHouseFormData {
  openHouseRequestId: string | null; // Unique ID for this request, needed for S3 path
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  address: { // Uses the structure from the updated AddressStep
    street: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  propertyDetails: { // Expanded to match PropertyDetailsStep expectations
    propertyType: string;
    otherType?: string;
    hasDen?: string;
    hasBasement?: string;
    basementType?: string;
    basementBedrooms?: string;
    basementBathrooms?: string;
    hasBasementEntrance?: string;
    squareFootage: string; // Use string to match component
    bedrooms: string; // Use string to match component
    bathrooms: string; // Use string to match component
    price: string; // Added (May not be needed for OH, but component expects it)
    showPrice: 'ad' | 'email' | ''; // Added (May not be needed for OH, but component expects it)
  };
  propertyHighlights: { // Changed to match PropertyHighlightsStep expectations
    topFeatures: string;
    wowFactor: string;
    firstImpression: string;
    hiddenGems: string;
  };
  neighborhoodInfo: { // Changed to match NeighborhoodInfoStep expectations
    amenities: string[];
    otherAmenity: string;
    comparison: string;
  };
  openHouseDates: OpenHouseDateEntry[]; // Custom step data remains
  photosMedia: { // Changed to match PhotosMediaStep expectations
    uploads: PhotoUploadInfo[]; // Array order represents user ranking
    virtualTourUrl?: string;
    videoUrl?: string;
  };
}

// --- Form Configuration ---

export const openHouseFormConfig: FormTypeConfig<OpenHouseFormData> = {
  formTypeId: 'open-house',
  name: 'Open House Request',
  initialData: {
    openHouseRequestId: null, // Initialize request ID
    contact: { firstName: '', lastName: '', email: '', phone: '' },
    address: { street: '', address2: '', city: '', province: '', postalCode: '', country: 'Canada' },
    propertyDetails: { // Expanded initial data
      propertyType: '', otherType: '', hasDen: undefined, hasBasement: undefined,
      basementType: undefined, basementBedrooms: undefined, basementBathrooms: undefined,
      hasBasementEntrance: undefined, squareFootage: '', bedrooms: '', bathrooms: '',
      price: '', showPrice: '',
    },
    propertyHighlights: { topFeatures: '', wowFactor: '', firstImpression: '', hiddenGems: '' }, // Updated initial data
    neighborhoodInfo: { amenities: [], otherAmenity: '', comparison: '' }, // Updated initial data
    openHouseDates: [{ id: uuidv4(), date: '', startTime: '', endTime: '' }],
    photosMedia: { uploads: [], virtualTourUrl: '', videoUrl: '' }, // Updated initial data
  },
  steps: [
    // Step 1: Intro (Handled by introComponentId)
    // Step 2: Contact
    {
      stepId: 'contact',
      componentId: 'ContactStep', // Reusable
      title: 'Contact Information',
      icon: 'User',
      dataKey: 'contact',
    },
    // Step 3: Address
    {
      stepId: 'address',
      componentId: 'AddressStep', // Reusable
      title: 'Property Address',
      icon: 'MapPin',
      dataKey: 'address',
    },
    // Step 4: Property Details
    {
      stepId: 'propertyDetails',
      componentId: 'PropertyDetailsStep', // Reusable
      title: 'Property Details',
      icon: 'Building',
      dataKey: 'propertyDetails',
    },
    // Step 5: Property Highlights
    {
      stepId: 'propertyHighlights',
      componentId: 'PropertyHighlightsStep', // Reusable
      title: 'Property Highlights',
      icon: 'Sparkles',
      dataKey: 'propertyHighlights',
      isOptional: true, // Keep optional as per ListingForm usage
    },
    // Step 6: Neighborhood Info
    {
      stepId: 'neighborhoodInfo',
      componentId: 'NeighborhoodInfoStep', // Reusable
      title: 'Neighborhood Information',
      icon: 'Map',
      dataKey: 'neighborhoodInfo',
      isOptional: true, // Keep optional as per ListingForm usage
    },
    // Step 7: Date & Time (Custom Step)
    {
      stepId: 'openHouseDates',
      componentId: 'OpenHouseDateStep', // Keep custom component
      title: 'Open House Date & Time',
      icon: 'CalendarDays',
      dataKey: 'openHouseDates',
    },
    // Step 8: Photos & Media
    {
      stepId: 'photosMedia',
      componentId: 'PhotosMediaStep', // Reusable
      title: 'Photos & Media',
      icon: 'Camera',
      dataKey: 'photosMedia',
    },
    // Step 9: Review (Handled by reviewComponentId)
  ],
  introComponentId: 'OpenHouseIntroStep', // Custom Intro
  reviewComponentId: 'OpenHouseReviewStep', // Custom Review
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/open-house-request', // Updated Endpoint
  mapToPayload: (data: OpenHouseFormData) => {
    // Map the expanded data structure, similar to ListingForm
    // Note: Backend field names are placeholders and should be confirmed
    const photoUrls = data.photosMedia.uploads.map((p: PhotoUploadInfo) => p.s3Url); // Added type for p

    const payload: Record<string, any> = {
      open_house_request_id: data.openHouseRequestId,
      // Contact
      first_name: data.contact.firstName,
      last_name: data.contact.lastName,
      email: data.contact.email,
      phone: data.contact.phone,
      // Address
      address_line_1: data.address.street,
      address_line_2: data.address.address2 || null,
      city: data.address.city,
      state_province_region: data.address.province,
      zip_postal_code: data.address.postalCode,
      country: data.address.country,
      // Property Details (Expanded)
      property_type: data.propertyDetails.propertyType === 'other' ? data.propertyDetails.otherType : data.propertyDetails.propertyType,
      property_type_other: data.propertyDetails.propertyType === 'other' ? data.propertyDetails.otherType : null,
      listing_price: data.propertyDetails.price, // Include if needed by backend
      show_price_in_ad: data.propertyDetails.showPrice === 'ad', // Include if needed
      bedrooms: data.propertyDetails.bedrooms,
      bathrooms: data.propertyDetails.bathrooms,
      has_den: data.propertyDetails.hasDen === 'yes',
      has_basement: data.propertyDetails.hasBasement === 'yes',
      basement_type: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.basementType : null,
      basement_bedrooms: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.basementBedrooms : null,
      basement_bathrooms: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.basementBathrooms : null,
      has_separate_basement_entrance: data.propertyDetails.hasBasement === 'yes' ? data.propertyDetails.hasBasementEntrance === 'yes' : null,
      square_footage: data.propertyDetails.squareFootage,
      // Property Highlights (Updated)
      top_features: data.propertyHighlights.topFeatures,
      wow_factor: data.propertyHighlights.wowFactor,
      first_impression: data.propertyHighlights.firstImpression,
      hidden_gems: data.propertyHighlights.hiddenGems,
      // Neighborhood Info (Updated)
      local_amenities: data.neighborhoodInfo.amenities,
      other_amenity: data.neighborhoodInfo.otherAmenity || null,
      comparison_to_similar_listings: data.neighborhoodInfo.comparison,
      // Open House Dates (Custom Step)
      open_house_dates: JSON.stringify(data.openHouseDates), // Send as JSON string or process as needed
      // Photos/Media (Updated - send URLs from S3 uploads)
      branded_photo_tour_url: data.photosMedia.virtualTourUrl || null,
      video_url: data.photosMedia.videoUrl || null,
    };

     // Add the S3 photo URLs based on the user-defined order in the uploads array
     photoUrls.forEach((url: string, index: number) => { // Added types for url, index
       // Map array index (0-based) to payload key (1-based)
       payload[`photo_url_${index + 1}`] = url;
     });

    console.log("Submitting JSON payload (Open House):", payload);
    return payload; // Return JSON payload as PhotosMediaStep handles uploads
  },
  successMessage: "Your Open House request has been submitted successfully! We'll get started on creating your funnel.",
};

// Type assertion for specific step props (if needed elsewhere)
// Ensure the second generic argument matches the full FormData type
export type OpenHouseDateProps = StepProps<OpenHouseFormData['openHouseDates'], OpenHouseFormData>;