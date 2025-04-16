# Plan: Implementing Configurable Multi-Step Forms (Phased Approach)

## 1. Introduction & Goal

**Goal:** To enable the creation and integration of multiple, distinct multi-step forms (e.g., "Giveaway Campaign", "Seller Success Story") within the React application, replacing the current reliance on external Typeforms for services beyond the initial "Listing Ad".

**Challenge:** The current implementation (`src/pages/ListingForm.tsx`) is tightly coupled to the specific requirements of the "Listing Ad" form. A direct refactoring risks breaking existing functionality and requires complete specifications for all new forms upfront, which may not be available.

**Solution:** This plan outlines a **phased approach** to introduce a flexible, configuration-driven system for multi-step forms. This approach prioritizes stability by leaving the existing `ListingForm.tsx` untouched initially, while building a reusable foundation for all future forms.

## 2. Analysis Summary & Current Limitations

An analysis of the existing codebase and documentation revealed:

*   **`src/pages/ListingForm.tsx`:** Manages all state centrally, orchestrates a hardcoded sequence of steps, maps data to a specific payload structure (`mapFormDataToPayload`), and submits to a hardcoded endpoint (`/webhook/listingad`).
*   **Step Components (`src/components/ListingForm/*Step.tsx`):** Modular UI components, guided by `FORM_STEP_GUIDELINES.md`, handling their specific fields and validation. Data flows via `value` and `onChange` props.
*   **`FORM_STEP_GUIDELINES.md`:** Provides excellent standards for building consistent step UI components but doesn't address varying step sequences or data structures.
*   **`SUBMISSION_PLAN.md`:** Confirms the submission logic is tailored specifically for the "Listing Ad" payload and endpoint.
*   **`src/data/services.json`:** Lists various services offered, but currently directs users to external Typeform URLs for most services, indicating only the "Listing Ad" form is integrated natively.

**Conclusion:** The current architecture lacks the flexibility to easily add new, distinct form types within the application without significant code duplication and potential regressions.

## 3. Revised Phased Implementation Strategy

To mitigate risks and allow for incremental development, the following phased strategy will be adopted:

1.  **Preserve Existing Form:** The current `src/pages/ListingForm.tsx` and its associated step components (`src/components/ListingForm/*`) will **remain unchanged** for the time being. The "Listing Ad" functionality will continue to operate as is.
2.  **Define Core Structures:** Establish the foundational TypeScript interfaces and types (`form-types.ts`) that define how *any* form type will be configured. This creates the blueprint for the new system.
3.  **Build Generic Container:** Create a **new, separate** React component (`src/pages/GenericFormPage.tsx` or similar). This container will be designed to render *any* multi-step form based on a provided configuration.
4.  **Implement New Forms Incrementally:** When the requirements (steps, fields, questions, submission details) for a *new* form type (e.g., "Giveaway Campaign") are finalized:
    *   Create its specific configuration file (e.g., `src/forms/giveaway.config.ts`) adhering to the defined structure.
    *   Develop any new, required step components (e.g., `GiveawayDetailsStep`, `PrizeInfoStep`) following the established guidelines and add them to a central component registry. Reusable steps (like `ContactStep`) can be leveraged.
    *   Update application routing (`src/App.tsx`) to direct the corresponding service URL (e.g., `/form/giveaway-campaign`) to the `GenericFormPage.tsx` component, passing the appropriate `formTypeId`.
    *   Update `src/data/services.json` to point the service's `url` to the new internal route.
5.  **Future Migration (Optional):** Once the `GenericFormPage.tsx` and the configuration system have proven stable with one or more new forms, a future task *could* involve migrating the original "Listing Ad" form to also use this generic system. This is not part of the initial scope.

### Diagram: Phased Approach

```mermaid
graph TD
    subgraph Current State (Untouched)
        A[User Clicks 'Listing Ad'] --> B{App Router};
        B -- Route: /listing-form --> C(ListingForm.tsx - Existing Page);
        C --> D[Existing Step Components];
        C --> E[Hardcoded Submission Logic];
    end

    subgraph New Development (Phased)
        F[User Clicks 'Giveaway'] --> G{App Router};
        G -- Route: /form/giveaway-campaign --> H(GenericFormPage.tsx formTypeId='giveaway-campaign');
        H -- Loads --> I[Form Config for 'giveaway-campaign'];
        H -- Renders Steps using --> J((Step Component Registry));
        J --> K[Reusable Steps (Contact, etc.)];
        J --> L[New Steps (GiveawayDetails, PrizeInfo)];
        H -- Uses Config for --> M[Dynamic Submission Logic];
    end

    style C fill:#eee,stroke:#999,stroke-width:1px,stroke-dasharray: 5 5
    style D fill:#eee,stroke:#999,stroke-width:1px,stroke-dasharray: 5 5
    style E fill:#eee,stroke:#999,stroke-width:1px,stroke-dasharray: 5 5

    style H fill:#ccf,stroke:#333,stroke-width:2px
    style I fill:#f9f,stroke:#333,stroke-width:2px
    style J fill:#f9f,stroke:#333,stroke-width:2px
    style M fill:#f9f,stroke:#333,stroke-width:2px
```

## 4. Core Architectural Components

The new system will rely on these key components:

*   **`GenericFormPage.tsx` (New Component):**
    *   Accepts a `formTypeId` prop.
    *   Loads the corresponding `FormTypeConfig` on mount.
    *   Manages generic state: `currentStep`, `formData` (typed based on config), `submissionStatus`, `isStepValid`.
    *   Orchestrates step rendering based on the `steps` array in the config.
    *   Handles `handleNext`, `handleBack`, `updateFormData` (using `dataKey` from step config).
    *   Executes submission using `mapToPayload` and `submissionEndpoint` from the config.
    *   Renders shared UI elements like `FormProgress` and `MobileFormNavigation`.
*   **Form Configuration Files (`src/forms/*.config.ts`):**
    *   One file per form type (e.g., `giveaway.config.ts`, `listing-ad.config.ts` - for reference initially).
    *   Exports a `FormTypeConfig` object defining the form's specific steps, data structure, initial values, submission logic, and display text.
*   **Component Registries (`src/forms/registries.ts` - New File):**
    *   Simple mappings (JavaScript objects) linking string identifiers (e.g., `"ContactStep"`) to the actual imported React component functions (e.g., `ContactStep`).
    *   Separate registries for standard steps (`stepComponentRegistry`), intro steps (`introComponentRegistry`), and review steps (`reviewComponentRegistry`) allow for different prop requirements if needed.
*   **Routing (`src/App.tsx` or router config):**
    *   Define routes like `/form/:formTypeId` that render `<GenericFormPage formTypeId={formTypeId} />`.

## 5. Configuration Structure Definition (`src/forms/form-types.ts`)

This file defines the TypeScript structures that govern how forms are configured.

```typescript
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
```

## 6. High-Level Implementation Steps

1.  **Create `src/forms/form-types.ts`:** Add the TypeScript definitions above.
2.  **Create `src/forms/registries.ts`:** Initialize empty registry objects (e.g., `export const stepComponentRegistry: StepComponentRegistry = {};`). Add existing reusable components like `ContactStep` to the appropriate registry.
3.  **Build `src/pages/GenericFormPage.tsx`:** Implement the core logic as described in Section 4.
4.  **(When Ready for "Giveaway" Form):**
    *   Define `GiveawayFormData` interface in `giveaway.config.ts`.
    *   Create `src/forms/giveaway.config.ts` exporting the `FormTypeConfig<GiveawayFormData>`.
    *   Create new step components (e.g., `src/components/GiveawayForm/GiveawayDetailsStep.tsx`, `PrizeInfoStep.tsx`) ensuring they accept `StepProps`.
    *   Import and add these new components to the `stepComponentRegistry` in `registries.ts`.
    *   Add route `/form/giveaway-campaign` in `App.tsx` pointing to `GenericFormPage`.
    *   Update `url` in `services.json` for `giveaway-campaign` to `/form/giveaway-campaign`.
5.  **Testing:** Thoroughly test the new form flow end-to-end. Ensure the existing `ListingForm` remains unaffected.

## 7. Example Configuration Snippet (`giveaway.config.ts`)

```typescript
// src/forms/giveaway.config.ts
import { FormTypeConfig } from './form-types';
// Assume ContactStep, GiveawayDetailsStep, PrizeInfoStep, RulesStep are created and registered

// 1. Define the specific data structure for this form
interface GiveawayFormData {
  contact: { firstName: string; lastName: string; email: string; }; // Reusable
  giveawayDetails: { campaignName: string; duration: number; targetAudience: string; };
  prizeInfo: { prizeDescription: string; prizeValue: number; numberOfWinners: number; };
  rules: { eligibility: string; entryMethod: string; };
}

// 2. Define the configuration object
export const giveawayFormConfig: FormTypeConfig<GiveawayFormData> = {
  formTypeId: 'giveaway-campaign',
  name: 'Giveaway Campaign Setup',
  steps: [
    // Step 0: Intro (Can be handled by introComponentId or default logic in GenericFormPage)
    { stepId: 'contact', componentId: 'ContactStep', title: 'Your Info', dataKey: 'contact', icon: 'User' },
    { stepId: 'details', componentId: 'GiveawayDetailsStep', title: 'Campaign Details', dataKey: 'giveawayDetails', icon: 'Settings' },
    { stepId: 'prize', componentId: 'PrizeInfoStep', title: 'Prize Info', dataKey: 'prizeInfo', icon: 'Gift' },
    { stepId: 'rules', componentId: 'RulesStep', title: 'Official Rules', dataKey: 'rules', icon: 'ScrollText', isOptional: true }, // Example optional step
    // Step X: Review (Can be handled by reviewComponentId or default logic)
  ],
  initialData: {
    contact: { firstName: '', lastName: '', email: '' },
    giveawayDetails: { campaignName: '', duration: 7, targetAudience: '' },
    prizeInfo: { prizeDescription: '', prizeValue: 0, numberOfWinners: 1 },
    rules: { eligibility: '', entryMethod: '' },
  },
  mapToPayload: (data: GiveawayFormData): Record<string, any> => {
    // Transform GiveawayFormData into the specific JSON payload for the backend
    return {
      campaign_name: data.giveawayDetails.campaignName,
      contact_email: data.contact.email,
      contact_first_name: data.contact.firstName,
      prize: data.prizeInfo.prizeDescription,
      prize_value: data.prizeInfo.prizeValue,
      winners_count: data.prizeInfo.numberOfWinners,
      rules_eligibility: data.rules.eligibility,
      // ... other mapped fields
    };
  },
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/giveaway', // Specific endpoint for giveaways
  successMessage: 'Your giveaway campaign has been submitted successfully!',
  // introComponentId: 'GiveawayIntro', // Optional: Specify if a unique intro is needed
  // reviewComponentId: 'DefaultReviewStep', // Optional: Specify if a unique review is needed
};

```

## 8. Benefits of this Approach

*   **Reduced Risk:** Existing functionality (`ListingForm`) is protected during initial development.
*   **Flexibility & Scalability:** Easily add new form types primarily through configuration.
*   **Maintainability:** Centralized logic in `GenericFormPage` and clear configuration files.
*   **Consistency:** Enforces consistent structure and behavior across different forms.
*   **Code Reusability:** Step components (like `ContactStep`) can be reused across different form types.
*   **Incremental Development:** New forms can be developed and launched independently as requirements become clear.

## 9. Next Steps

Once this plan is approved, the recommended next action is to create the `src/forms/form-types.ts` file with the structure defined in Section 5. Following that, the component registries can be set up, and development of the `GenericFormPage.tsx` can begin.