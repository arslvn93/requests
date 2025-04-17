import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react'; // Import icons for submit button
import { v4 as uuidv4 } from 'uuid'; // Import uuid

import { FormTypeConfig, StepProps } from '../forms/form-types';
import { getFormConfig } from '../forms/configLoader'; // Import the real loader
import {
  stepComponentRegistry,
  introComponentRegistry,
  reviewComponentRegistry,
  successComponentRegistry,
  isStepComponentRegistered // Import type guard if needed later
} from '../forms/registries';

// Import shared UI components
import FormProgress from '../components/ListingForm/FormProgress';
import MobileFormNavigation from '../components/ListingForm/MobileFormNavigation';
// Assuming a generic SuccessStep exists or we use the one from ListingForm
import SuccessStep from '../components/ListingForm/SuccessStep';


// Expect formTypeId as a direct prop now
interface GenericFormPageProps {
  formTypeId: string;
}

const GenericFormPage: React.FC<GenericFormPageProps> = ({ formTypeId }) => {
  // Removed useParams hook
  const navigate = useNavigate();

  const [config, setConfig] = useState<FormTypeConfig<any> | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = Intro/First Step
  const [formData, setFormData] = useState<any>({}); // Generic state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInstanceId, setFormInstanceId] = useState<string | null>(null); // Unique ID for this form session
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false); // Validity of the current step's inputs
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Effect to load configuration based on formTypeId
  useEffect(() => {
    if (!formTypeId) {
      console.error("Form Type ID is missing from URL parameters.");
      // Handle error state - maybe navigate away or show an error message
      setIsLoadingConfig(false);
      return;
    }

    setIsLoadingConfig(true);
    const loadedConfig = getFormConfig(formTypeId); // Use the placeholder

    if (loadedConfig) {
      setConfig(loadedConfig);
      setFormData(loadedConfig.initialData);
      setCurrentStep(0); // Reset to first step
      setFormInstanceId(uuidv4()); // Generate unique ID for this form instance
      setSubmissionStatus('idle');
      setIsSubmitting(false);
      // Initial validation state depends on whether step 0/intro needs validation
      setIsCurrentStepValid(!loadedConfig.introComponentId); // Assume intro doesn't need validation unless specified otherwise
    } else {
      console.error(`Configuration not found for form type: ${formTypeId}`);
      // Handle error state - navigate or show error
    }
    setIsLoadingConfig(false);
  }, [formTypeId]); // useEffect dependency remains formTypeId (now from props)

  const totalConfiguredSteps = config?.steps.length ?? 0;
  // Total steps including potential intro (0) and review (last)
  // This logic might need refinement based on how intro/review are handled
  const totalUiSteps = totalConfiguredSteps + (config?.reviewComponentId ? 1 : 0); // Assuming intro is step 0

  // --- Submission ---
  const handleSubmit = useCallback(async () => {
    if (!config || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setSubmissionMessage('Preparing data...');

    try {
      const payload = config.mapToPayload(formData);
      setSubmissionMessage('Submitting data...');

      console.log('Submitting payload:', JSON.stringify(payload, null, 2)); // For debugging

      const response = await fetch(config.submissionEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setSubmissionMessage(config.successMessage || 'Submission successful!');
      } else {
        const errorData = await response.text();
        console.error('Webhook submission failed:', response.status, errorData);
        setSubmissionStatus('error');
        setSubmissionMessage(`Submission failed: ${response.status} - ${errorData || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error during submission process:', error);
      setSubmissionStatus('error');
      setSubmissionMessage('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [config, formData, isSubmitting]);

  // --- Navigation Handlers ---
  const handleNext = useCallback(() => {
    // Prevent advancing if current step is invalid (unless it's optional?)
    // TODO: Add check for stepConfig.isOptional here if implementing optional steps fully
    if (!isCurrentStepValid && currentStep > 0) {
        console.log("Next blocked: Current step invalid");
        return;
    }

    setCurrentStep((prev) => {
        let nextStepIndex = prev + 1; // Start by assuming we go to the next sequential step

        // --- Calculate the actual next step, skipping if necessary ---
        while (config && nextStepIndex <= totalConfiguredSteps) {
            const potentialNextStepConfig = config.steps[nextStepIndex - 1]; // Get config for the potential next step
            // Check if the step exists and has a shouldSkip function that returns true
            if (potentialNextStepConfig?.shouldSkip && potentialNextStepConfig.shouldSkip(formData)) {
                console.log(`Skipping step ${nextStepIndex}: ${potentialNextStepConfig.stepId}`);
                nextStepIndex++; // Increment to check the *following* step
            } else {
                break; // Found the next non-skipped step or went past the end
            }
        }
        // --- End of skip calculation ---

        // --- Handle transitions after the last configured step ---
        // If skipping led us past the last step AND there's a review step configured
        if (config && nextStepIndex > totalConfiguredSteps && config.reviewComponentId) {
            nextStepIndex = totalConfiguredSteps + 1; // Set index to the review step
        }
        // If skipping led us past the last step AND there's NO review step configured
        else if (config && nextStepIndex > totalConfiguredSteps && !config.reviewComponentId) {
            // No more steps, trigger submission directly
            console.warn("Skipped past last configured step without a review step. Triggering submit.");
            handleSubmit();
            return prev; // Return previous state as submission handles the flow now
        }
        // If we landed exactly on the step *after* the last configured one, it must be the review step
        else if (config && nextStepIndex === totalConfiguredSteps + 1 && !config.reviewComponentId) {
             // This case should ideally not be hit if the previous check works, but as a safeguard:
             console.warn("Reached step after last configured step without a review step. Triggering submit.");
             handleSubmit();
             return prev;
        }


        // Reset validation state for the upcoming step (assume invalid until proven otherwise)
        // Only reset if we are actually moving to a new step (not submitting)
        if (nextStepIndex !== prev) {
             setIsCurrentStepValid(false); // TODO: Consider setting true for optional steps?
        }

        // Return the calculated next step index, ensuring it doesn't exceed total UI steps + 1 (for safety)
        return Math.min(nextStepIndex, totalUiSteps + 1);
    });

  }, [
      config,
      currentStep, // currentStep is implicitly used via setCurrentStep's `prev`
      totalConfiguredSteps,
      totalUiSteps,
      isCurrentStepValid,
      handleSubmit,
      formData, // Needed for shouldSkip check
      // No need to list setCurrentStep or setIsCurrentStepValid in deps
  ]);

  const handleBack = useCallback(() => {
    if (submissionStatus === 'success') return; // Don't go back from success screen

    if (currentStep === 0) {
      navigate('/'); // Navigate home from the first step (or intro)
    } else {
      setCurrentStep((prev) => Math.max(0, prev - 1));
      // Assume previous step was valid when going back
      setIsCurrentStepValid(true);
    }
  }, [currentStep, navigate, submissionStatus]);

  // --- Data Handling ---
  const updateFormData = useCallback((stepDataKey: keyof any, value: any) => {
      setFormData((prev: any) => ({
          ...prev,
          [stepDataKey]: value,
      }));
  }, []);

  // --- Reset ---
   const handleReset = useCallback(() => {
    if (config) {
        setFormData(config.initialData);
        setCurrentStep(0); // Go back to the first step (intro or step 1)
        setSubmissionStatus('idle');
        setSubmissionMessage('');
        setIsSubmitting(false);
        setIsCurrentStepValid(!config.introComponentId); // Reset validation for the first step
        // Removed navigate('/') to restart the current form instead of going home
    }
  }, [config]); // Removed navigate from dependencies

  // --- Rendering Logic ---

  if (isLoadingConfig) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Configuration...</div>;
  }

  if (!config) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Error: Form configuration not found for '{formTypeId}'.</div>;
  }

  // Determine which component to render
  let CurrentStepComponent: React.ComponentType<any> | null = null;
  let stepProps: any = {}; // Props to pass to the step component

  // Define all boolean flags first
  const isIntroStep = !!(currentStep === 0 && config?.introComponentId);
  const isReviewStep = !!(config?.reviewComponentId && currentStep === totalConfiguredSteps + 1);
  const isStandardStep = currentStep > 0 && currentStep <= totalConfiguredSteps;

  // --- Debugging Log ---
  console.log(`[GenericFormPage] Rendering Step Calculation: currentStep=${currentStep}, totalConfiguredSteps=${totalConfiguredSteps}, isIntroStep=${isIntroStep}, isReviewStep=${isReviewStep}, isStandardStep=${isStandardStep}`);
  // --- End Debugging Log ---

  if (isIntroStep) {
      CurrentStepComponent = introComponentRegistry[config.introComponentId!];
      stepProps = { onNext: handleNext, onValidationChange: setIsCurrentStepValid }; // Basic props for intro
  } else if (isReviewStep) {
      CurrentStepComponent = reviewComponentRegistry[config.reviewComponentId!];
      stepProps = {
          formData: formData,
          onSubmit: handleSubmit,
          isSubmitting: isSubmitting,
          submissionStatus: submissionStatus,
          submissionMessage: submissionMessage,
          onValidationChange: setIsCurrentStepValid, // Pass validation callback
          onEdit: setCurrentStep, // Pass function to jump to a step index
      };
  } else if (isStandardStep) {
      const stepConfig = config.steps[currentStep - 1]; // Adjust index for 0-based array
      if (stepConfig && stepComponentRegistry[stepConfig.componentId]) {
          CurrentStepComponent = stepComponentRegistry[stepConfig.componentId];
          stepProps = {
              value: formData[stepConfig.dataKey],
              onChange: (value: any) => updateFormData(stepConfig.dataKey, value),
              onNext: handleNext,
              onValidationChange: setIsCurrentStepValid,
              formData: formData, // Pass full form data if needed
              formTypeId: formTypeId,
              stepId: stepConfig.stepId,
          } as StepProps<any, any>;

          // --- Add specific props for components needing the form instance ID ---
          if (stepConfig.componentId === 'GiveawayPhotoStep') {
              stepProps.giveawayId = formInstanceId;
              stepProps.onGiveawayIdChange = setFormInstanceId; // Pass setter function
          }
          // Add similar check for ListingForm's PhotosMediaStep if it's registered and used
          else if (stepConfig.componentId === 'PhotosMediaStep') { // Assuming 'PhotosMediaStep' is the ID used in registry
              stepProps.listingId = formInstanceId;
              stepProps.onListingIdChange = setFormInstanceId; // Pass setter function
          }
          else if (stepConfig.componentId === 'VideoUploadStep') {
              stepProps.videoEditRequestId = formInstanceId;
              stepProps.onVideoEditRequestIdChange = setFormInstanceId;
          }
          // --- End specific props ---

      } else {
          console.error(`Component not found in registry for stepId: ${stepConfig?.stepId}, componentId: ${stepConfig?.componentId}`);
          // Render error state
      }
  } else if (currentStep === 0 && !config.introComponentId) {
      // Handle case where there's no specific intro step - render the first configured step
      const stepConfig = config.steps[0];
       if (stepConfig && stepComponentRegistry[stepConfig.componentId]) {
          CurrentStepComponent = stepComponentRegistry[stepConfig.componentId];
           stepProps = {
              value: formData[stepConfig.dataKey],
              onChange: (value: any) => updateFormData(stepConfig.dataKey, value),
              onNext: handleNext,
              onValidationChange: setIsCurrentStepValid,
              formData: formData,
              formTypeId: formTypeId,
              stepId: stepConfig.stepId,
          } as StepProps<any, any>;
      }
  }


  // Determine Success Component
  const SuccessComponent = successComponentRegistry['DefaultSuccessStep'] || SuccessStep; // Fallback

  return (
    <div className="min-h-screen bg-black">
      {submissionStatus === 'success' ? (
        <SuccessComponent submissionMessage={submissionMessage} onReset={handleReset} />
      ) : (
        <>
          {/* Render Progress Bar (conditionally, maybe not for intro) */}
          {currentStep > 0 && (
            <FormProgress
              // Pass dynamic steps based on config
              // This needs refinement: map config.steps to titles/icons
              currentStep={currentStep} // The actual UI step number
              totalSteps={totalUiSteps} // Total steps including review
              onBack={handleBack}
              showBack={currentStep > 0} // Always show back unless on step 0
            />
          )}

          {/* Main content area */}
          <div className={`max-w-2xl mx-auto px-4 pb-24 md:pb-8 ${currentStep > 0 ? 'pt-12 md:pt-24' : 'pt-0'}`}>
            {CurrentStepComponent ? (
              <CurrentStepComponent {...stepProps} />
            ) : (
              <div className="text-red-500">Error: Could not render step {currentStep}. Component not found or configuration error.</div>
            )}

            {/* Desktop Submit Button (Only on Review Step) - REMOVED */}
            {/* This button is now expected to be rendered within the specific ReviewStep component itself */}
          </div>

          {/* Mobile Navigation */}
          <MobileFormNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit} // Submit only shown on review step
            isBackDisabled={currentStep === 0}
            // Disable next if step invalid, unless it's optional or intro/review?
            isNextDisabled={!isCurrentStepValid && currentStep !== 0 && !isReviewStep} // Needs refinement for optional steps
            isReviewStep={isReviewStep}
          />
        </>
      )}
    </div>
  );
};

export default GenericFormPage;