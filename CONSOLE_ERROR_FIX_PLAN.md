# Plan to Fix Console Errors in Listing Form

Based on the console errors reported, here is the plan to address them:

**Phase 1: Fix Specific Component Error**

1.  **Investigate `ContactStep.tsx`:** The error message "Warning: ContactStep contains an input of type text with both value and defaultValue props" points directly to this file. Examine this component and ensure its input fields are correctly implemented as controlled components (using `value` and `onChange`) by removing the `defaultValue` prop.

**Phase 2: Address Form-Wide Issues**

2.  **Add `id` and `name` Attributes:** The error regarding missing `id` or `name` attributes impacts autofill. Systematically review *all* form step components used in `ListingForm.tsx` and add appropriate `id` and `name` attributes to each input, select, textarea, etc. Use the corresponding `formData` key as a convention (e.g., `id="firstName"`, `name="firstName"`).
    *   Relevant step components:
        *   `ContactStep.tsx` (Will be fixed in Phase 1)
        *   `AddressStep.tsx`
        *   `PropertyDetailsStep.tsx`
        *   `PriceStep.tsx`
        *   `PropertyUpgradesStep.tsx`
        *   `PropertyHighlightsStep.tsx`
        *   `InvestmentPotentialStep.tsx`
        *   `NeighborhoodInfoStep.tsx`
        *   `TargetBuyerStep.tsx`
        *   `AdDetailsStep.tsx`
        *   `PhotosMediaStep.tsx` (Check for relevant form fields)

**Phase 3: Update Router Configuration**

3.  **Address React Router Warnings:** The warnings about `v7_startTransition` and `v7_relativeSplatPath` suggest opting into future React Router behaviors. Update the main router configuration (likely in `App.tsx` or `main.tsx`) by adding a `future` prop to the `<BrowserRouter>` or relevant Router component.

**Phase 4: Review and Submit**

4.  **Review Changes:** After making the code modifications, review them for correctness.
5.  **Handle `runtime.lastError`:** Initially ignore these errors, as they often relate to browser extensions. Fixing React-specific errors might resolve them. If they persist after other fixes, further investigation (e.g., testing with extensions disabled) may be needed.

**Visual Plan (Mermaid Diagram):**

```mermaid
graph TD
    A[Start: Console Errors Reported] --> B{Analyze Errors};
    B --> C[Error 1: Missing id/name];
    B --> D[Error 2: Router Future Flags];
    B --> E[Error 3: Controlled/Uncontrolled Input];
    B --> F[Error 4: runtime.lastError];

    C --> G[Plan: Add id/name to all form step inputs];
    D --> H[Plan: Update Router config in App.tsx/main.tsx];
    E --> I[Plan: Fix ContactStep.tsx input props];
    F --> J[Plan: Defer/Ignore initially];

    I --> K{Implement Fixes (Requires Code Mode)};
    G --> K;
    H --> K;

    K --> L[Review Code Changes];
    L --> M[Test Form];
    M --> N{Check Console};
    N -- Errors Fixed --> O[End: Errors Resolved];
    N -- runtime.lastError Persists --> P[Investigate Browser Extensions];
    N -- Other Errors Persist --> K;