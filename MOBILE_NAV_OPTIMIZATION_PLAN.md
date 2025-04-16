# Plan: Mobile Listing Form Navigation Optimization

**Goal:** Optimize the multi-step Listing Form for mobile by implementing a sticky bottom navigation bar (inspired by Typeform) for Back/Next actions, without affecting the desktop layout. The non-functional "Save Draft" button will also be removed.

**Current State:**
*   `ListingForm.tsx`: Manages steps, state, and core navigation logic (`handleNext`/`handleBack`).
*   `FormProgress.tsx`: Displays a progress bar and Back button, fixed to the *top*. It also currently includes a non-functional "Save Draft" button.
*   Individual Step Components (e.g., `ContactStep.tsx`): Render their own "Next: [Step Name]" button at the bottom of their content, scrolling with the page.

**Proposed Changes:**

**Phase 1: Create Sticky Mobile Navigation Component**
1.  **New Component:** `src/components/ListingForm/MobileFormNavigation.tsx`
2.  **Structure & Styling:**
    *   Implement Back (`<ChevronLeft />`) and Next (`<ChevronRight />`) icon buttons.
    *   Use Tailwind CSS: `fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/80 backdrop-blur-sm` (or similar clean/modern style).
    *   **Responsive:** Show *only* on mobile/small screens (`flex md:hidden`).
3.  **Props:** `onBack`, `onNext`, `isBackDisabled`, `isNextDisabled`, `isReviewStep`, `onSubmit`.

**Phase 2: Integrate Mobile Navigation into Main Form**
1.  **Modify `ListingForm.tsx`:**
    *   Import `MobileFormNavigation`.
    *   Render `<MobileFormNavigation />` conditionally (not on success screen).
    *   Pass props: `onBack={handleBack}`, `onNext={handleNext}`, `isBackDisabled={currentStep <= 1}`, `isNextDisabled={!isCurrentStepValid}` (see Phase 4), `isReviewStep={currentStep === totalSteps}`, `onSubmit={handleSubmit}`.

**Phase 3: Adapt Existing Components & Remove "Save Draft"**
1.  **Modify `FormProgress.tsx`:**
    *   **Remove "Save Draft":** Delete the `<button>` element (lines 33-35) and associated container logic if any.
    *   **Hide Top Back Button on Mobile:** Add responsive classes to the Back button container (e.g., `hidden md:flex` or similar) so it only shows on desktop.
2.  **Modify *All* Standard Step Components:** (e.g., `ContactStep.tsx`, `AddressStep.tsx`, etc.)
    *   Find the existing "Next: \[Step Name]" button.
    *   Add responsive classes to hide it on mobile (e.g., `hidden md:block`).
    *   Consider removing the step name text (e.g., ": Property Address") from the button for desktop consistency.

**Phase 4: Handle Validation for Mobile Next Button**
1.  **Lift Validation State:**
    *   In `ListingForm.tsx`, add state: `const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);`.
    *   Modify each step component:
        *   Add prop: `onValidationChange: (isValid: boolean) => void;`.
        *   Use `useEffect` to watch input values (`value` prop) and call `onValidationChange(isValid())` when validity changes.
    *   In `ListingForm.tsx`, pass `onValidationChange={setIsCurrentStepValid}` when rendering the step.
    *   Pass `isNextDisabled={!isCurrentStepValid}` to `MobileFormNavigation`.

**Phase 5: Handle Special Steps (Intro, Review, Success)**
1.  **Modify `ListingForm.tsx` / `MobileFormNavigation.tsx`:**
    *   **Intro Step (`currentStep === 0`):** Mobile nav shows only "Next". Hide existing "Get Started" button on mobile (`hidden md:block`).
    *   **Review Step (`currentStep === totalSteps`):** Mobile nav shows "Back" and "Submit" (using `isReviewStep` prop and `onSubmit`). Hide existing "Submit" button on mobile (`hidden md:block`).
    *   **Success Step:** Mobile nav is not rendered (handled by conditional rendering in Phase 2). Existing "Start New Listing" button remains.

**Phase 6: Styling Refinements & Testing**
1.  **Refine `MobileFormNavigation.tsx` Styling:** Ensure adequate tap targets, clean aesthetics (Typeform inspiration), transitions.
2.  **Testing:** Test thoroughly on mobile viewports (sticky behavior, validation, special steps) and verify the desktop view is unaffected. Ensure "Save Draft" is gone.

**Mermaid Diagram:**

```mermaid
graph TD
    subgraph Mobile View
        direction TB
        A[User] --> B(ListingForm);
        B --> C{Current Step Component};
        B --> D[MobileFormNavigation (Fixed Bottom)];
        B --> E(FormProgress (Fixed Top - No Save Draft));

        C -- Inputs --> F[Validation Logic in Step];
        F -- isValid --> B;
        B -- isCurrentStepValid --> D;

        D -- Back --> B;
        D -- Next/Submit --> B;

        E --> G[Progress Bar];
        E --> H[Back Button (Hidden)];
        C --> I[Original Next Button (Hidden)];
    end

    subgraph Desktop View
        direction TB
        J[User] --> K(ListingForm);
        K --> L{Current Step Component};
        K --> M(FormProgress (Fixed Top - No Save Draft));

        M --> N[Progress Bar];
        M --> O[Back Button (Visible)];
        O -- Back --> K;

        L --> P[Original Next Button (Visible)];
        P -- Next --> K;
    end

    style D fill:#cff,stroke:#333,stroke-width:2px;
    style H fill:#eee,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5;
    style I fill:#eee,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5;
    style O fill:#ccf,stroke:#333,stroke-width:2px;
    style P fill:#ccf,stroke:#333,stroke-width:2px;
    style E fill:#fef,stroke:#333,stroke-width:1px;
    style M fill:#fef,stroke:#333,stroke-width:1px;