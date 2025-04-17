# Guide: Creating New Forms with the Generic System

## 1. Introduction

This guide outlines the standard workflow and key considerations for creating new multi-step forms within this application, leveraging the generic form system established in `REVISED_MULTI_FORM_PLAN.md`. Following these steps will help ensure consistency, maintainability, and fewer errors.

**Core Architecture Reminder:**

*   **`GenericFormPage.tsx`:** The main component that renders forms based on configuration. It expects a `formTypeId` prop.
*   **Configuration Files (`src/forms/*.config.ts`):** Define the structure, steps, data, and submission logic for each specific form type.
*   **Type Definitions (`src/forms/form-types.ts`):** Contains the TypeScript interfaces (`FormTypeConfig`, `FormStepConfig`, `StepProps`) that govern the configuration and component interactions.
*   **Component Registries (`src/forms/registries.ts`):** Map string IDs to actual React components (for steps, intros, reviews).
*   **Configuration Loader (`src/forms/configLoader.ts`):** Loads the correct configuration object based on the `formTypeId`.

## 2. Workflow for Creating a New Form (e.g., "Client Intake")

### Phase 1: Planning & Design (Architect/Planning Mode Recommended)

1.  **Define Purpose & Scope:**
    *   What is the goal of this form? (e.g., "Onboard new clients")
    *   Who is the target user?
2.  **Outline Steps & Questions:**
    *   List all distinct steps required.
    *   List all questions within each step.
3.  **Design UI/UX for Each Step:**
    *   **Input Types:** Choose appropriate inputs (text, textarea, date, multi-select buttons, file upload, etc.). Refer to `FORM_STEP_GUIDELINES.md`.
    *   **Icons:** Select relevant icons (e.g., from `lucide-react`) for each step header and potentially within inputs.
    *   **Placeholders & Descriptions:** Write clear helper text.
    *   **Suggestions/Pre-fills:** Consider if suggestion buttons or default values would improve usability.
    *   *(Recommendation: Create a specific plan document like `GIVEAWAY_FORM_IMPLEMENTATION_PLAN.md`)*.
4.  **Define Data Structure:**
    *   Create the TypeScript interface for this form's data (e.g., `ClientIntakeFormData`). Group related fields logically, often mirroring the steps.
5.  **Identify Reusable vs. New Components:**
    *   Which existing step components (`ContactStep`, etc.) can be reused?
    *   Which new step components need to be created?
    *   Will a custom Intro or Review step be needed, or can defaults suffice? (Lesson: Review steps often need to be custom due to data differences).
6.  **Plan Conditional Logic:**
    *   Identify any steps that should only appear based on previous answers.
    *   Plan the `shouldSkip` logic required in the step configuration.
7.  **Define Backend Integration:**
    *   Specify the target submission endpoint URL.
    *   Define the exact JSON payload structure the backend expects. Plan the `mapToPayload` function logic.
8.  **Configure Backend CORS:**
    *   **Crucial Step:** Ensure the backend endpoint is configured to accept requests from the frontend's origin (`http://localhost:5173` for development, and the production domain later). The server must send the `Access-Control-Allow-Origin` header. Failure to do this *will* block form submission.

### Phase 2: Implementation (Code Mode Recommended)

1.  **Define `NewFormData` Interface:** Create the TypeScript interface (e.g., in `src/forms/client-intake.types.ts` or directly in the config file).
2.  **Create New Step Components:**
    *   Build any required new components (e.g., in `src/components/ClientIntakeForm/`).
    *   Ensure they accept `StepProps` (or specific Intro/Review props) and implement `onChange`, `onNext`, and `onValidationChange`.
    *   Follow styling guidelines from `FORM_STEP_GUIDELINES.md`.
3.  **Create Configuration File (`src/forms/client-intake.config.ts`):**
    *   Import the `FormTypeConfig` type and the form's specific `FormData` interface.
    *   Define `initialData` matching the interface.
    *   Define the `steps` array:
        *   Assign a unique `stepId`.
        *   Specify the correct `componentId` (matching the key in the registry).
        *   Set `title`, `icon`.
        *   Specify the correct `dataKey` pointing to the relevant slice of `FormData`.
        *   Add `shouldSkip: (formData) => ...` functions for conditional steps.
        *   Set `isOptional: true` if applicable.
    *   Specify `introComponentId` and `reviewComponentId` (use defaults like `'DefaultIntroStep'` or custom ones like `'ClientIntakeReviewStep'`).
    *   Implement the `mapToPayload` function to transform `FormData` into the required backend JSON.
    *   Set the correct `submissionEndpoint` and `successMessage`.
4.  **Update Registries (`src/forms/registries.ts`):**
    *   `import` all newly created components (step, intro, review).
    *   Add entries for each new component in the corresponding registry (`stepComponentRegistry`, `introComponentRegistry`, `reviewComponentRegistry`). Use the `componentId` from the config file as the key.
5.  **Update Config Loader (`src/forms/configLoader.ts`):**
    *   `import` the new configuration object (e.g., `clientIntakeFormConfig`).
    *   Add a `case` to the `switch` statement in `getFormConfig` to return the imported config when the new `formTypeId` is requested.
6.  **Update Routing (`src/App.tsx`):**
    *   Add a specific `<Route>` for the new form (e.g., `<Route path="/client-intake" element={<GenericFormPage formTypeId="client-intake" />} />`).
7.  **Update Service Data (`src/data/services.json`):**
    *   Add or update the service entry for the new form, setting the `id` (matching `formTypeId`) and the `url` (matching the new route path, e.g., `/client-intake`).

### Phase 3: Testing

1.  **Component Rendering:** Verify all steps render correctly.
2.  **Navigation:** Test forward and backward navigation.
3.  **Conditional Logic:** Test scenarios where steps should be skipped and ensure navigation flows correctly.
4.  **Validation:** Ensure required fields are enforced and `onValidationChange` works correctly (Next button enables/disables).
5.  **Data Entry & State:** Confirm data entered persists between steps.
6.  **Review Step:** Verify all data is displayed correctly before submission.
7.  **Submission:**
    *   Open browser developer console.
    *   Click Submit.
    *   Check console for the logged payload (`Submitting payload: ...`). Verify it matches the backend expectation.
    *   Check console and Network tab for CORS errors or other network errors (4xx, 5xx).
    *   Confirm data is received correctly by the backend endpoint.
8.  **Success/Error Handling:**
    *   Verify the Success page appears on a successful (e.g., 200 OK) response.
    *   Verify appropriate error messages appear on failed submissions.
9.  **Reset:** Test the "Submit Another" / Reset functionality on the success page.

## 3. Key Considerations & Gotchas Recap

*   **CORS is Backend:** Remember that CORS errors must be fixed by configuring the *backend server* (n8n, API gateway) to allow requests from your frontend origin.
*   **Review Step Specificity:** The default `ReviewStep` likely won't work for new forms. Plan to create a custom review step that correctly displays the fields for the new form's data structure.
*   **`shouldSkip` Logic:** Implement conditional logic via the `shouldSkip` function in the step config and ensure `GenericFormPage` handles it.
*   **File Uploads:** The simple file input works but lacks features. For advanced uploads (previews, progress, direct S3), plan for more complex component logic and potentially backend changes (e.g., pre-signed URLs). Ensure `mapToPayload` handles the `File` object correctly.
*   **Type Safety:** Keep TypeScript interfaces (`FormData`, `StepProps`, etc.) accurate and use them consistently.
*   **Planning:** Detailed planning of steps, UI, and data structure *before* coding significantly reduces errors and rework.