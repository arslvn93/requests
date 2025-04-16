import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Assuming a function to get config exists - we'll create this later
// import { getFormConfig } from '../forms/config-loader'; // Placeholder
import { FormTypeConfig, StepProps } from '../forms/form-types';
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

// Placeholder type for the config loader function
type GetFormConfigFunction = (formTypeId: string) => FormTypeConfig<any> | null;
const getFormConfig: GetFormConfigFunction = (formTypeId: string) => {
    console.warn(`Placeholder: getFormConfig called for ${formTypeId}. Implement actual loading.`);
    // In a real implementation, this would dynamically import or look up the config
    // based on formTypeId and return it or null/throw error if not found.
    return null; // Return null for now
};


interface GenericFormPageProps {
  // If not using URL params, pass formTypeId directly
  // formTypeId: string;
}

const GenericFormPage: React.FC<GenericFormPageProps> = () => {
  const { formTypeId } = useParams<{ formTypeId: string }>();
  const navigate = useNavigate();

  const [config, setConfig] = useState<FormTypeConfig<any> | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = Intro/First Step
  const [formData, setFormData] = useState<any>({}); // Generic state
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setSubmissionStatus('idle');
      setIsSubmitting(false);
      // Initial validation state depends on whether step 0/intro needs validation
      setIsCurrentStepValid(!loadedConfig.introComponentId); // Assume intro doesn't need validation unless specified otherwise
    } else {
      console.error(`Configuration not found for form type: ${formTypeId}`);
      // Handle error state - navigate or show error
    }
    setIsLoadingConfig(false);
  }, [formTypeId]);

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

      // console.log('Submitting payload:', JSON.stringify(payload, null, 2)); // For debugging

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
    // Logic might need refinement based on isOptional flag in step config
    if (!isCurrentStepValid && currentStep > 0) return; // Allow advancing from intro (step 0)

    // Check if it's the last *configured* step before review
    if (config && currentStep === totalConfiguredSteps) {
       if (config.reviewComponentId) {
           setCurrentStep(currentStep + 1); // Move to review step
       } else {
           // If no review step, maybe trigger submit directly? Or handle error.
           console.warn("Trying to advance past last configured step without a review step.");
           handleSubmit(); // Or maybe show an error?
       }
    } else {
       setCurrentStep((prev) => Math.min(totalUiSteps + 1, prev + 1)); // +1 to account for potential review step
    }
     // Reset validation state for the next step (assume invalid until proven otherwise)
     setIsCurrentStepValid(false);
  }, [config, currentStep, totalConfiguredSteps, totalUiSteps, isCurrentStepValid, handleSubmit]); // handleSubmit is now defined before this

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
        setCurrentStep(0);
        setSubmissionStatus('idle');
        setSubmissionMessage('');
        setIsSubmitting(false);
        setIsCurrentStepValid(!config.introComponentId); // Reset validation
        // Optionally navigate home or to a dashboard
        navigate('/');
    }
  }, [config, navigate]);

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

  const isIntroStep = !!(currentStep === 0 && config?.introComponentId);
  const isReviewStep = !!(config?.reviewComponentId && currentStep === totalConfiguredSteps + 1);
  const isStandardStep = currentStep > 0 && currentStep <= totalConfiguredSteps;

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
          // Add any other props the review component expects
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