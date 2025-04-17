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
import PropertyDetailsStep from '../components/ListingForm/PropertyDetailsStep'; // Import PropertyDetailsStep
import PhotosMediaStep from '../components/ListingForm/PhotosMediaStep';
import ReviewStep from '../components/ListingForm/ReviewStep';
import SuccessStep from '../components/ListingForm/SuccessStep'; // Assuming SuccessStep might be used generically

// Import new Giveaway Form step components
import GiveawayIntroStep from '../components/GiveawayForm/GiveawayIntroStep';
import GiveawayDetailsStep from '../components/GiveawayForm/GiveawayDetailsStep';
import GiveawayDatesStep from '../components/GiveawayForm/GiveawayDatesStep';
import GiveawayAudienceStep from '../components/GiveawayForm/GiveawayAudienceStep';
import GiveawayPromoMethodStep from '../components/GiveawayForm/GiveawayPromoMethodStep';
import GiveawayPaidTypeStep from '../components/GiveawayForm/GiveawayPaidTypeStep';
import GiveawayPaidDetailsStep from '../components/GiveawayForm/GiveawayPaidDetailsStep';
import GiveawayPhotoStep from '../components/GiveawayForm/GiveawayPhotoStep';
// Import new Giveaway Form review component
import GiveawayReviewStep from '../components/GiveawayForm/GiveawayReviewStep';

// Import new Video Edit Request Form components
import VideoEditIntroStep from '../components/VideoEditForm/VideoEditIntroStep';
import VideoDetailsStep from '../components/VideoEditForm/VideoDetailsStep';
import VideoTypeStep from '../components/VideoEditForm/VideoTypeStep';
import EditTypeStep from '../components/VideoEditForm/EditTypeStep';
import EditNotesStep from '../components/VideoEditForm/EditNotesStep';
import UrgencyStep from '../components/VideoEditForm/UrgencyStep';
import VideoEditReviewStep from '../components/VideoEditForm/VideoEditReviewStep';

// Import new Seller Success Story Form components
import SellerSuccessIntroStep from '../components/SellerSuccessForm/SellerSuccessIntroStep';
import PropertyStatsStep from '../components/SellerSuccessForm/PropertyStatsStep';
import SupportingLinksStep from '../components/SellerSuccessForm/SupportingLinksStep';
import MlsLinkStep from '../components/SellerSuccessForm/MlsLinkStep';
import BackstoryStep from '../components/SellerSuccessForm/BackstoryStep';
import StrategyStep from '../components/SellerSuccessForm/StrategyStep';
import ResultsStep from '../components/SellerSuccessForm/ResultsStep';
import EmotionalImpactStep from '../components/SellerSuccessForm/EmotionalImpactStep';
import CallToActionStep from '../components/SellerSuccessForm/CallToActionStep';
import BonusItemsStep from '../components/SellerSuccessForm/BonusItemsStep';
import ClientPermissionsStep from '../components/SellerSuccessForm/ClientPermissionsStep';
import ClientNamePrivacyStep from '../components/SellerSuccessForm/ClientNamePrivacyStep';
import SellerSuccessReviewStep from '../components/SellerSuccessForm/SellerSuccessReviewStep';
// Note: ContactStep, AddressStep, PropertyDetailsStep are reused from ListingForm

// Import new Buyer Success Story Form components
import BuyerSuccessIntroStep from '../components/BuyerSuccessForm/BuyerSuccessIntroStep';
import BuyerPropertyStatsStep from '../components/BuyerSuccessForm/BuyerPropertyStatsStep';
import BuyerSupportingLinksStep from '../components/BuyerSuccessForm/BuyerSupportingLinksStep';
import BuyerBackstoryStep from '../components/BuyerSuccessForm/BuyerBackstoryStep';
import HomeSearchProcessStep from '../components/BuyerSuccessForm/HomeSearchProcessStep';
import BuyerEmotionalImpactStep from '../components/BuyerSuccessForm/BuyerEmotionalImpactStep';
import FinalOutcomeStep from '../components/BuyerSuccessForm/FinalOutcomeStep';
import BuyerCallToActionStep from '../components/BuyerSuccessForm/BuyerCallToActionStep';
import BuyerBonusItemsStep from '../components/BuyerSuccessForm/BuyerBonusItemsStep';
import BuyerClientPermissionsStep from '../components/BuyerSuccessForm/BuyerClientPermissionsStep';
import BuyerClientNamePrivacyStep from '../components/BuyerSuccessForm/BuyerClientNamePrivacyStep';
import BuyerSuccessReviewStep from '../components/BuyerSuccessForm/BuyerSuccessReviewStep';

// ==========================================================================
// Component Registries
// ==========================================================================

/**
 * Registry mapping component IDs (string keys) to actual Step components.
 * Add any component intended to be used as a step in ANY form type here.
 * The 'componentId' in FormStepConfig must match a key in this registry.
 */
export const stepComponentRegistry: StepComponentRegistry = {
  // --- Reusable Components from ListingForm ---
  ContactStep: ContactStep,
  AddressStep: AddressStep,
  PropertyDetailsStep: PropertyDetailsStep, // Register PropertyDetailsStep
  // PhotosMediaStep removed

  // --- New Giveaway Form Components ---
  GiveawayDetailsStep: GiveawayDetailsStep,
  GiveawayDatesStep: GiveawayDatesStep,
  GiveawayAudienceStep: GiveawayAudienceStep,
  GiveawayPromoMethodStep: GiveawayPromoMethodStep,
  GiveawayPaidTypeStep: GiveawayPaidTypeStep,
  GiveawayPaidDetailsStep: GiveawayPaidDetailsStep,
  GiveawayPhotoStep: GiveawayPhotoStep,

  // --- Potentially Reusable / Base Components ---
  // Add other steps from ListingForm here if they become reusable later
  // e.g., PriceStep, etc. if applicable to other form types.

  // --- New Generic/Specific Components (Add as created) ---
  // Example: 'GiveawayDetailsStep': GiveawayDetailsStep,

  // --- New Video Edit Request Form Components ---
  VideoDetailsStep: VideoDetailsStep,
  VideoTypeStep: VideoTypeStep,
  EditTypeStep: EditTypeStep,
  EditNotesStep: EditNotesStep,
  UrgencyStep: UrgencyStep,

  // --- New Seller Success Story Form Components ---
  // Note: ContactStep, AddressStep are already registered from ListingForm reuse
  // We need to register PropertyDetailsStep if it wasn't already (assuming it might be reusable)
  // Let's assume PropertyDetailsStep needs registration if not present
  // PropertyDetailsStep is now registered above with other reusable ListingForm components
  PropertyStatsStep: PropertyStatsStep,
  SupportingLinksStep: SupportingLinksStep,
  MlsLinkStep: MlsLinkStep,
  BackstoryStep: BackstoryStep,
  StrategyStep: StrategyStep,
  ResultsStep: ResultsStep,
  EmotionalImpactStep: EmotionalImpactStep,
  CallToActionStep: CallToActionStep,
  BonusItemsStep: BonusItemsStep,
  ClientPermissionsStep: ClientPermissionsStep,
  ClientNamePrivacyStep: ClientNamePrivacyStep,

  // --- New Buyer Success Story Form Components ---
  // Note: ContactStep, AddressStep, PropertyDetailsStep are already registered
  BuyerPropertyStatsStep: BuyerPropertyStatsStep,
  BuyerSupportingLinksStep: BuyerSupportingLinksStep,
  BuyerBackstoryStep: BuyerBackstoryStep,
  HomeSearchProcessStep: HomeSearchProcessStep,
  BuyerEmotionalImpactStep: BuyerEmotionalImpactStep,
  FinalOutcomeStep: FinalOutcomeStep,
  BuyerCallToActionStep: BuyerCallToActionStep,
  BuyerBonusItemsStep: BuyerBonusItemsStep,
  BuyerClientPermissionsStep: BuyerClientPermissionsStep,
  BuyerClientNamePrivacyStep: BuyerClientNamePrivacyStep,
};

/**
 * Registry for Intro Step components (Step 0).
 * Allows different forms to have unique introductory experiences.
 * The 'introComponentId' in FormTypeConfig must match a key here.
 */
export const introComponentRegistry: IntroComponentRegistry = {
  // Use a default or specific intro steps
  DefaultIntroStep: IntroStep, // Can be used if no specific intro is configured
  GiveawayIntroStep: GiveawayIntroStep, // Specific intro for Giveaway form
  VideoEditIntroStep: VideoEditIntroStep, // Specific intro for Video Edit form
  SellerSuccessIntroStep: SellerSuccessIntroStep, // Specific intro for Seller Success form
  BuyerSuccessIntroStep: BuyerSuccessIntroStep,   // Specific intro for Buyer Success form
};

/**
 * Registry for Review Step components (Final Step before submission).
 * Allows different forms to have unique review/summary screens.
 * The 'reviewComponentId' in FormTypeConfig must match a key here.
 */
export const reviewComponentRegistry: ReviewComponentRegistry = {
  // Use a default or specific review steps
  DefaultReviewStep: ReviewStep, // Can be used if no specific review is configured
  GiveawayReviewStep: GiveawayReviewStep, // Specific review step for Giveaway
  VideoEditReviewStep: VideoEditReviewStep, // Specific review step for Video Edit
  SellerSuccessReviewStep: SellerSuccessReviewStep, // Specific review step for Seller Success
  BuyerSuccessReviewStep: BuyerSuccessReviewStep,   // Specific review step for Buyer Success
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