# Plan: Implement Success Screen with Confetti

**Goal:** Replace the success message on the Review step with a dedicated Success Screen featuring confetti and a "Submit Another Listing" button, preventing further navigation on the completed form.

**1. Install Confetti Library:**
    *   Command: `npm install react-confetti`

**2. Create `SuccessStep.tsx` Component:**
    *   Create file: `src/components/ListingForm/SuccessStep.tsx`.
    *   **Functionality:**
        *   Import `ReactConfetti` from `react-confetti`.
        *   Use `<ReactConfetti />` within the component. Consider using `useWindowSize` hook (from `react-use` or similar, or implement simply) to make confetti fill the screen. Run confetti for a limited time (e.g., using `recycle={false}` and `numberOfPieces={200}`).
        *   Display a success title (e.g., "Listing Submitted Successfully!").
        *   Display the `submissionMessage` prop (which may include notes about failed uploads).
        *   Display a button "Submit Another Listing".
        *   The button's `onClick` handler should call the `onReset` function passed as a prop.
    *   **Props:**
        *   `submissionMessage: string`
        *   `onReset: () => void`

**3. Modify `ListingForm.tsx`:**
    *   **Import:** `import SuccessStep from '../components/ListingForm/SuccessStep';`
    *   **Initial State:** Define the initial state object for `formData` outside the component or memoize it so it can be reused for resetting.
    *   **Reset Function:** Create `handleReset`:
        ```typescript
        const handleReset = () => {
          setFormData(initialFormData); // Use the defined initial state
          setCurrentStep(1);
          setSubmissionStatus('idle');
          setSubmissionMessage('');
          setIsSubmitting(false);
        };
        ```
    *   **Conditional Rendering:** Modify the main `return` statement:
        ```jsx
        return (
          <div className="min-h-screen bg-black">
            {submissionStatus === 'success' ? (
              <SuccessStep submissionMessage={submissionMessage} onReset={handleReset} />
            ) : (
              <>
                <FormProgress
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onBack={handleBack}
                  showBack={currentStep > 1} // Only show back if not on step 1
                />
                <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
                  {/* ... existing step rendering logic ... */}
                   {currentStep === 1 && ( <ContactStep ... /> )}
                   {/* ... other steps ... */}
                   {currentStep === 12 && (
                     <ReviewStep
                       formData={formData}
                       onSubmit={handleSubmit}
                       isSubmitting={isSubmitting}
                       submissionStatus={submissionStatus} // Still needed for error display
                       submissionMessage={submissionMessage} // Still needed for error display
                     />
                   )}
                </div>
              </>
            )}
          </div>
        );
        ```

**4. Modify `ReviewStep.tsx`:**
    *   Remove the JSX block responsible for rendering the success message (`{submissionStatus === 'success' && ...}`).
    *   Keep the error message block (`{submissionStatus === 'error' && ...}`).

**Diagram (Mermaid - Flow with Success Screen):**

```mermaid
sequenceDiagram
    participant User
    participant ReviewStep
    participant ListingForm
    participant SuccessStep
    participant S3 / Webhook

    User->>ReviewStep: Clicks "Submit Listing"
    ReviewStep->>ListingForm: Calls onSubmit (handleSubmit)
    ListingForm->>ListingForm: Set isSubmitting = true, status = 'idle'
    ListingForm->>S3 / Webhook: Perform S3 Uploads & Webhook POST
    alt Submission Process Successful
        S3 / Webhook-->>ListingForm: Success (potentially with upload failure count)
        ListingForm->>ListingForm: Set status = 'success', message = '...', isSubmitting = false
        ListingForm->>SuccessStep: Render SuccessStep (passing message, onReset)
        activate SuccessStep
        SuccessStep->>User: Show Confetti, Success Message, "Submit Another" Button
        User->>SuccessStep: Clicks "Submit Another"
        SuccessStep->>ListingForm: Calls onReset (handleReset)
        ListingForm->>ListingForm: Reset state (formData, currentStep=1, status='idle', etc.)
        ListingForm->>ContactStep: Render Step 1
        deactivate SuccessStep
    else Submission Process Failed
        S3 / Webhook-->>ListingForm: Error
        ListingForm->>ListingForm: Set status = 'error', message = '...', isSubmitting = false
        ListingForm->>ReviewStep: Update props (status, message, isSubmitting)
        ReviewStep->>User: Show Error Message on Review Step
    end