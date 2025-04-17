import { FormTypeConfig } from './form-types';

// Import specific form configurations
import { giveawayFormConfig } from './giveaway.config';
import { videoEditRequestFormConfig } from './video-edit-request.config';
import { sellerSuccessStoryConfig } from './seller-success-story.config';
import { buyerSuccessStoryConfig } from './buyer-success-story.config'; // Import Buyer Success config
import { openHouseFormConfig } from './open-house.config'; // Import Open House config
// Import other form configs here as they are created
// import { listingAdFormConfig } from './listing-ad.config'; // Example for future

// Define a type for the loader function if needed, or use inline
type GetFormConfigFunction = (formTypeId: string) => FormTypeConfig<any> | null;

/**
 * Retrieves the configuration object for a given form type ID.
 * In a larger application, this might involve dynamic imports or more complex lookup.
 * For now, it uses a simple switch or if/else based on imported configs.
 *
 * @param formTypeId The unique identifier of the form (e.g., 'giveaway-campaign').
 * @returns The corresponding FormTypeConfig object, or null if not found.
 */
export const getFormConfig: GetFormConfigFunction = (formTypeId) => {
  console.log(`[configLoader] Attempting to load config for: ${formTypeId}`); // Added log for clarity

  switch (formTypeId) {
    case 'giveaway-campaign':
      return giveawayFormConfig;
    case 'video-edit-request':
      return videoEditRequestFormConfig;
    case 'seller-success-story':
      return sellerSuccessStoryConfig;
    case 'buyer-success-story':
      return buyerSuccessStoryConfig;
    case 'open-house': // Add case for Open House form
      return openHouseFormConfig;
    // Add cases for other form types here
    // case 'listing-ad':
    //   return listingAdFormConfig; // Example
    default:
      console.error(`[configLoader] No configuration found for formTypeId: ${formTypeId}`);
      return null;
  }
};

// Optional: Function to get all available configs if needed for a dashboard etc.
// export const getAllFormConfigs = (): FormTypeConfig<any>[] => {
//   return [giveawayFormConfig /*, listingAdFormConfig */];
// };