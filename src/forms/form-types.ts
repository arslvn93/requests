import React from 'react';

// ==========================================================================
// Step Component Interface
// ==========================================================================

/**
 * Defines the standard props expected by every form step component.
 * @template TStepData The shape of the data managed by this specific step.
 * @template TFormData The shape of the entire form's data object.
 */
export interface StepProps<TStepData, TFormData = any> {
  /** The slice of form data relevant to this step. */
  value: TStepData;
  /** Callback function to update the main form data for this step's slice. */
  onChange: (value: TStepData) => void;
  /** Callback function to trigger navigation to the next step. */
  onNext: () => void;
  /** Callback function to signal whether the current step's data is valid. */
  onValidationChange: (isValid: boolean) => void;
  /** Optional: Access to the complete form data object, if needed by the step. */
  formData?: TFormData;
  /** Optional: The unique ID of the form type being rendered. */
  formTypeId?: string;
   /** Optional: The unique ID of the current step configuration. */
  stepId?: string;
}

// ==========================================================================
// Form Configuration Interfaces
// ==========================================================================

/**
 * Defines the configuration for a single step within a form type.
 * @template TStepData The shape of the data managed by this specific step.
 * @template TFormData The shape of the entire form's data object.
 */
export interface FormStepConfig<TStepData = any, TFormData = any> {
  /** A unique identifier for this step within the form configuration (e.g., "contactInfo", "prizeDetails"). */
  stepId: string;
  /** The key used to look up the corresponding React component in the stepComponentRegistry. */
  componentId: string;
  /** The title displayed in the progress bar or step header. */
  title: string;
  /** An optional subtitle displayed in the step header. */
  subtitle?: string;
  /** Optional: The name of the icon (e.g., from lucide-react) to display in the header. */
  icon?: string; // Consider defining a specific IconName type if using a library like lucide
  /** The key within the main TFormData object that this step is responsible for managing. */
  dataKey: keyof TFormData;
  /** Optional flag indicating if this step's input is required for progression. Defaults to true if not specified. */
  isOptional?: boolean;
}

/**
 * Defines the complete configuration for a specific type of form.
 * @template TFormData The shape of the entire data object for this form type.
 */
export interface FormTypeConfig<TFormData> {
  /** The unique identifier for this form type (e.g., "listing-ad", "giveaway-campaign"). Matches ID in services.json. */
  formTypeId: string;
  /** The user-friendly name of the form (e.g., "Real Estate Listing Ad", "Giveaway Campaign Setup"). */
  name: string;
  /** An ordered array defining the sequence of steps for this form (excluding intro/review unless handled generically). */
  steps: FormStepConfig<any, TFormData>[];
  /** The initial state object structure for this form type. */
  initialData: TFormData;
  /** A function that transforms the final form state (TFormData) into the JSON payload required for submission. */
  mapToPayload: (data: TFormData) => Record<string, any>;
  /** The API endpoint URL where the mapped payload should be submitted. */
  submissionEndpoint: string;
  /** The message displayed to the user upon successful submission. */
  successMessage: string;
  /** Optional: The componentId for a custom introductory step (Step 0). If omitted, a default intro might be used or step 0 skipped. */
  introComponentId?: string;
  /** Optional: The componentId for a custom review step (Final Step). If omitted, a default review step might be used. */
  reviewComponentId?: string;
}

// ==========================================================================
// Component Registries (Type Definitions)
// ==========================================================================
// These registries will be populated elsewhere (e.g., src/forms/registries.ts)

/** Type definition for the registry mapping component IDs to actual Step components. */
export type StepComponentRegistry = Record<string, React.ComponentType<StepProps<any, any>>>;

/** Type definition for the registry mapping component IDs to actual Intro components. */
export type IntroComponentRegistry = Record<string, React.ComponentType<any>>; // Define specific IntroProps if needed

/** Type definition for the registry mapping component IDs to actual Review components. */
export type ReviewComponentRegistry = Record<string, React.ComponentType<any>>; // Define specific ReviewProps if needed