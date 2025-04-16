import {
  StepComponentRegistry,
  IntroComponentRegistry,
  ReviewComponentRegistry,
  StepProps, // Import StepProps if needed for casting, though often inferred
} from './form-types';

// Import potentially reusable step components
// Note: Adjust imports based on actual component locations and export names
import IntroStep from '../components/ListingForm/IntroStep';
import ContactStep from '../components/ListingForm/ContactStep';
import AddressStep from '../components/ListingForm/AddressStep';
import PhotosMediaStep from '../components/ListingForm/PhotosMediaStep';
import ReviewStep from '../components/ListingForm/ReviewStep';
import SuccessStep from '../components/ListingForm/SuccessStep'; // Assuming SuccessStep might be used generically

// ==========================================================================
// Component Registries
// ==========================================================================

/**
 * Registry mapping component IDs (string keys) to actual Step components.
 * Add any component intended to be used as a step in ANY form type here.
 * The 'componentId' in FormStepConfig must match a key in this registry.
 */
export const stepComponentRegistry: StepComponentRegistry = {
  // --- Reusable Components ---
  ContactStep: ContactStep,
  AddressStep: AddressStep,
  // PhotosMediaStep removed - requires specific props (listingId, onListingIdChange) not in generic StepProps

  // --- Potentially Reusable / Base Components ---
  // Add other steps from ListingForm here if they become reusable later
  // e.g., PriceStep, etc. if applicable to other form types.

  // --- New Generic/Specific Components (Add as created) ---
  // Example: 'GiveawayDetailsStep': GiveawayDetailsStep,
};

/**
 * Registry for Intro Step components (Step 0).
 * Allows different forms to have unique introductory experiences.
 * The 'introComponentId' in FormTypeConfig must match a key here.
 */
export const introComponentRegistry: IntroComponentRegistry = {
  // Use a default or specific intro steps
  DefaultIntroStep: IntroStep, // Using the existing IntroStep as a default for now
  // Example: 'GiveawayIntro': GiveawayIntroComponent,
};

/**
 * Registry for Review Step components (Final Step before submission).
 * Allows different forms to have unique review/summary screens.
 * The 'reviewComponentId' in FormTypeConfig must match a key here.
 */
export const reviewComponentRegistry: ReviewComponentRegistry = {
  // Use a default or specific review steps
  DefaultReviewStep: ReviewStep, // Using the existing ReviewStep as a default for now
  // Example: 'GiveawayReview': GiveawayReviewComponent,
};

/**
 * Registry for Success Step components.
 * Allows customization of the screen shown after successful submission.
 * Note: The current plan doesn't explicitly use a registry for Success,
 * the GenericFormPage might render a default SuccessStep directly.
 * Adding this for potential future flexibility.
 */
export const successComponentRegistry: Record<string, React.ComponentType<any>> = {
    DefaultSuccessStep: SuccessStep,
};

// Type guard to check if a component exists in the step registry
export const isStepComponentRegistered = (id: string): id is keyof typeof stepComponentRegistry => {
    return id in stepComponentRegistry;
}
// Add similar type guards for other registries if needed