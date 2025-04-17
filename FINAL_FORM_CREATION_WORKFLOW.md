# Final Guide: Creating New Forms (Comprehensive Workflow)

## 1. Introduction

This document provides the definitive workflow and best practices for creating new multi-step forms within this application. It builds upon the generic form system (`GenericFormPage.tsx`, configuration files, registries) and incorporates lessons learned during the implementation of the "Giveaway Campaign" and "Video Editing Change Request" forms. Adhering to this guide will maximize consistency, minimize errors, and streamline future development.

**Core Architecture Recap:**

*   **`GenericFormPage.tsx`:** Renders forms based on configuration. Expects a `formTypeId` prop. Handles step navigation (including skipping), state management, and submission.
*   **Configuration Files (`src/forms/*.config.ts`):** Define *everything* about a specific form: its ID, steps, data structure, initial values, component mapping, conditional logic rules (`shouldSkip`), payload mapping (`mapToPayload`), submission endpoint, and success message.
*   **Type Definitions (`src/forms/form-types.ts`):** Central TypeScript interfaces (`FormTypeConfig`, `FormStepConfig`, `StepProps`) ensuring type safety and consistency.
*   **Component Registries (`src/forms/registries.ts`):** Central mapping of string IDs (used in configs) to imported React component functions (for steps, intros, reviews).
*   **Configuration Loader (`src/forms/configLoader.ts`):** Simple lookup mechanism (currently a `switch` statement) to load the correct configuration object based on the `formTypeId`.
*   **Routing (`src/App.tsx`):** Uses specific, named routes (e.g., `/giveaway-form`) for each form, passing the `formTypeId` as a prop to `GenericFormPage`.
*   **Service Linking (`src/data/services.json` & `src/components/ServiceCard.tsx`):** `services.json` defines the `url` (internal route like `/giveaway-form`) and `ServiceCard.tsx` handles navigation correctly (same tab for internal routes, modal/new tab for external).

## 2. Workflow for Creating a New Form

### Phase 1: Planning & Design (Crucial First Step!)

1.  **Define Purpose & Scope:** Clearly state the form's goal and target user.
2.  **Outline Steps & Questions:** List all steps and the specific questions/fields within each.
3.  **Design UI/UX for Each Step:**
    *   Choose appropriate **Input Types** (text, textarea, date, single-select cards, multi-select cards/checkboxes, file upload). Refer to `FORM_STEP_GUIDELINES.md`.
    *   Select relevant **Icons** (`lucide-react`) for step headers/inputs.
    *   Write clear **Placeholders & Descriptions**.
    *   Consider **Suggestion Buttons** or default values for usability.
    *   *(Strong Recommendation: Document these details in a dedicated plan file, e.g., `NEW_FORM_XYZ_PLAN.md`)*.
4.  **Define Data Structure (`NewFormData`):**
    *   Create the TypeScript interface for the form's state.
    *   Group related fields logically (often mirroring steps, e.g., using nested objects like `videoDetails: { title: string; link: string; }`). This improves organization in the config and components.
5.  **Identify Components:**
    *   **Reuse:** Identify existing components (`ContactStep`, etc.) from `src/components/ListingForm` or other form directories that fit the requirements.
    *   **New:** List all new components needed (Intro, Steps, Review). Plan their location (e.g., `src/components/NewFormName/`).
    *   **Review Step:** **Strongly recommend creating a custom Review step** (e.g., `NewFormReviewStep`) for each form to accurately display its unique `FormData`. Do *not* rely on `DefaultReviewStep` unless the data structure is identical to the Listing form (unlikely).
6.  **Plan Conditional Logic:**
    *   **Step Skipping:** Identify steps that should be skipped based on previous answers. Define the logic for the `shouldSkip: (formData) => boolean` function in the step's configuration.
    *   **Intra-Step Conditionals:** Identify fields/questions *within* a single step that appear/disappear based on other fields in that same step (e.g., "Other" text fields, "Notified Team?" question). This logic will be handled using standard React state and conditional rendering *inside* the relevant step component.
7.  **Define Backend Integration:**
    *   Get the exact **Submission Endpoint URL**.
    *   Define the required **JSON Payload Structure** for the backend.
    *   Plan the **`mapToPayload` Function Logic** in the config file, including any necessary data transformations (e.g., joining arrays, handling conditional fields, formatting dates).
8.  **Confirm Backend CORS Configuration:**
    *   **Essential:** Verify with the backend/n8n administrator that the target endpoint URL is configured to accept `POST` (and potentially `OPTIONS` for preflight) requests from the frontend origin (`http://localhost:5173` for development, production domain later). It **must** send the `Access-Control-Allow-Origin` header.

### Phase 2: Implementation (Code Mode)

*(Follow steps sequentially)*

1.  **Define `NewFormData` Interface:** Add the interface to `src/forms/new-form-name.config.ts` (or a separate types file if preferred).
2.  **Create New Step Components:**
    *   Create necessary files in `src/components/NewFormName/`.
    *   Implement component logic, ensuring they accept `StepProps` (or specific Intro/Review props) and correctly call `onChange`, `onNext`, `onValidationChange`.
    *   Implement any *intra-step* conditional rendering logic.
    *   Adhere to `FORM_STEP_GUIDELINES.md`.
3.  **Create Configuration File (`src/forms/new-form-name.config.ts`):**
    *   Import `FormTypeConfig` and the `NewFormData` interface.
    *   Define `initialData`.
    *   Define the `steps` array, carefully mapping `stepId`, `componentId`, `title`, `icon`, `dataKey`. Add `shouldSkip` functions where needed. Mark optional steps with `isOptional: true`.
    *   Set `introComponentId` and `reviewComponentId` (use the custom review step ID).
    *   Implement the `mapToPayload` function.
    *   Set `submissionEndpoint` and `successMessage`.
4.  **Update Registries (`src/forms/registries.ts`):**
    *   `import` all newly created components (Intro, Steps, Review).
    *   Add entries to the correct registry (`stepComponentRegistry`, `introComponentRegistry`, `reviewComponentRegistry`) using the `componentId` from the config as the key.
5.  **Update Config Loader (`src/forms/configLoader.ts`):**
    *   `import` the `newFormNameConfig` object.
    *   Add a `case 'new-form-type-id': return newFormNameConfig;` to the `switch` statement.
6.  **Update Routing (`src/App.tsx`):**
    *   Add the specific route: `<Route path="/new-form-name" element={<GenericFormPage formTypeId="new-form-type-id" />} />`.
7.  **Update Service Data (`src/data/services.json`):**
    *   Add/update the service entry, setting `id` to `"new-form-type-id"` and `url` to `"/new-form-name"`.

### Phase 3: Testing & Troubleshooting

1.  **Basic Flow:** Navigate through all steps, including conditional paths. Check forward/back navigation.
2.  **Component Rendering:** Ensure each step UI matches the design. Check icons.
3.  **Conditional Logic:** Verify steps are correctly skipped via `shouldSkip`. Verify intra-step conditional fields appear/disappear correctly.
4.  **Validation:** Test required fields and ensure the "Next" button enables/disables correctly based on `onValidationChange`.
5.  **Data Persistence:** Confirm data entered is retained when navigating back and forth.
6.  **Review Step:** **Critically check** that all entered data, including conditional fields, is displayed accurately on the custom review step.
7.  **Submission:**
    *   Open browser developer console (Console & Network tabs).
    *   Submit the form from the review step.
    *   **Check Console:** Look for the `Submitting payload: ...` log. Copy the payload and verify its structure and values match the backend expectation defined in the plan.
    *   **Check Console/Network:** Look for **CORS errors**. If present, the backend needs configuration. Look for other network errors (4xx, 5xx) indicating backend issues or payload problems. Look for "Webhook submission failed..." logs from `GenericFormPage`.
    *   **Confirm Backend:** Verify data was received successfully in the backend system (e.g., n8n execution log).
8.  **Success/Error Display:** Verify the correct success page (with the custom message from config) or error message (from `GenericFormPage`) is shown based on the submission outcome.
9.  **Reset:** Test the reset button on the success page.
10. **Navigation:** Test clicking the service card on the main page navigates directly to the form in the same tab without modals.

## 4. Key Learnings & Gotchas Summary

*   **Backend CORS is Mandatory:** Frontend code cannot fix CORS errors. The backend *must* be configured to allow requests from the frontend origin.
*   **Custom Review Step is (Usually) Necessary:** Due to unique data structures, plan to create a specific review component for each form.
*   **Configuration is Key:** Ensure `configLoader.ts` and `registries.ts` are updated for every new component and config file. Mismatched IDs are a common source of errors.
*   **Routing:** Use specific routes (`/form-name`) in `App.tsx` and pass `formTypeId` as a prop. Update `services.json` accordingly.
*   **`ServiceCard` Logic:** Ensure it correctly uses `navigate` for internal routes (`/`) and handles external URLs separately.
*   **Conditional Logic:** Differentiate between step skipping (`shouldSkip` in config, handled by `GenericFormPage`) and intra-step rendering (handled within the step component).
*   **Payload Mapping:** Carefully implement `mapToPayload` to match the exact structure expected by the backend, including handling of arrays and conditional fields. Log the payload during testing.
*   **Dynamic Icons:** Use the `React.createElement(PotentialIcon as React.ElementType, { ...props })` pattern in `ServiceCard` for robust dynamic icon loading.