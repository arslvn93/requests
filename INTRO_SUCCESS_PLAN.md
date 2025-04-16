# Plan: Add Intro Step and Update Success Step for Listing Form

This plan outlines the steps to add a new introductory screen before the first step of the listing form and update the content and confetti effect of the final success screen.

**1. Create an Introductory Step Component:**

*   Create a new file: `src/components/ListingForm/IntroStep.tsx`.
*   This component will display the introductory text provided:
    *   Heading: "Submit Your Listing – We’ll Handle the Ads!"
    *   Warning icon + text: "⚠️For Optimal Results: Please take a few minutes to complete this form with as much detail as possible."
    *   Paragraph explaining the value proposition.
    *   "What to Expect:" section with bullet points (using checkmark icons ✅).
    *   "Important Guidelines:" section with bullet points (using warning icons ❗️).
    *   Acknowledgement text.
    *   Optionality note (👉).
    *   A "Start" button.
    *   Helper text below the button: "press Enter ↵ | Takes 7+ minutes".
*   The component will accept an `onNext` function prop, which will be called when the "Start" button is clicked.

**2. Modify the Main Form (`ListingForm.tsx`):**

*   **Import `IntroStep`:** Add `import IntroStep from '../components/ListingForm/IntroStep';`
*   **Adjust Step Logic:**
    *   Change the initial state for `currentStep` to `0`: `useState<number>(0)`. This `0` will represent the new intro step.
    *   Keep `totalSteps` as `12` (representing the actual form field steps).
*   **Update Rendering Logic:**
    *   Add a condition to render `<IntroStep onNext={handleNext} />` when `currentStep === 0`.
    *   Keep the existing conditions for steps 1 through 12 as they are (`ContactStep` for `currentStep === 1`, etc.).
*   **Update `FormProgress`:**
    *   Conditionally render the `FormProgress` component only when `currentStep > 0`.
    *   Pass `currentStep` and `totalSteps={totalSteps}` (which remains 12) to `FormProgress`.
    *   Adjust the `showBack` prop for `FormProgress` to be `currentStep > 1` (so the back button doesn't show on the first *real* step, `ContactStep`).
*   **Update Navigation Logic (`handleBack`):**
    *   Modify `handleBack` so that if `currentStep` is `1` (the first *real* step), it calls `setCurrentStep(0)` to go back to the intro step.
    *   If `currentStep` is `0` (the intro step), it navigates away (`navigate('/')`).
    *   Otherwise, it decrements the step as usual.
*   **Update Navigation Logic (`handleNext`):** The existing `handleNext` logic should work correctly, incrementing from `0` (intro) to `1` (first real step) and so on, up to `12` (review step).

**3. Modify the Success Step (`SuccessStep.tsx`):**

*   **Update Text Content:**
    *   Change the main heading (`h2`) to: `✅ Submission Complete – We’re On It!`.
    *   Replace the paragraph (`p`) content with the new message: "Thank you for submitting your listing details! 🎯 What happens next? ..." using appropriate formatting (e.g., a list for the steps).
*   **Enhance Confetti:**
    *   In the `<ReactConfetti />` component:
        *   Increase `numberOfPieces` from `300` to `600`.
        *   Increase the duration the confetti runs by changing the `setTimeout` delay from `5000` to `7000` (7 seconds).

**Diagrammatic Flow:**

```mermaid
graph TD
    A[Intro Step (Step 0)] -- Start --> B(Contact Step (Step 1));
    B -- Next --> C(Address Step (Step 2));
    C -- Next --> D(...);
    D -- Next --> E(Photos/Media Step (Step 11));
    E -- Next --> F(Review Step (Step 12));
    F -- Submit --> G{Submission Logic};
    G -- Success --> H[Success Step];
    G -- Error --> F;

    B -- Back --> A;
    C -- Back --> B;
    D -- Back --> C;
    E -- Back --> D;
    F -- Back --> E;

    A -- Back --> I[/ (Navigate Away)];
    H -- Submit Another --> A;