# Plan: Seller Success Story Form

This document outlines the plan for creating the new "Seller Success Story" multi-step form.

## Phase 1: Planning & Design

1.  **Purpose & Scope:**
    *   **Goal:** Collect detailed information about a successful property sale from an agent to automatically generate a marketing case study (Facebook/Instagram ad + email campaign).
    *   **Target User:** Real estate agents using the platform.

2.  **Form ID:**
    *   `formTypeId`: `seller-success-story`

3.  **Steps & Component Mapping:**
    *   New components will be created under `src/components/SellerSuccessForm/`.
    *   **Step 0 (Intro):** `SellerSuccessIntroStep` (New) - Icon: `ThumbsUp`
    *   **Step 1:** `ContactStep` (Reuse `ListingForm/ContactStep`) - Icon: `User`
    *   **Step 2:** `AddressStep` (Reuse `ListingForm/AddressStep`) - Icon: `MapPin`
    *   **Step 3:** `PropertyDetailsStep` (Reuse `ListingForm/PropertyDetailsStep`) - Icon: `Home`
    *   **Step 4:** `PropertyStatsStep` (New) - Fields: Listed Price, Sold Price, Days on Market, Offers, Showings, Other Stats. Icon: `TrendingUp`
    *   **Step 5:** `SupportingLinksStep` (New) - Field: Google Drive Link (Required). Icon: `Link`
    *   **Step 6:** `MlsLinkStep` (New) - Field: MLS Link (Optional). Icon: `Database`
    *   **Step 7:** `BackstoryStep` (New) - Fields: Seller Profile, Challenges, Fears, Why You?, Goals. Icon: `Users`
    *   **Step 8:** `StrategyStep` (New) - Fields: Pricing, Marketing, Buyer Source, Showings/Offers, Urgency, Challenges Handled. Icon: `Target`
    *   **Step 9:** `ResultsStep` (New) - Fields: Final vs. Asking, Speed, Multiple Offers?, Terms?, Reaction. Icon: `Award`
    *   **Step 10:** `EmotionalImpactStep` (New) - Fields: Life Change, Rewarding Part, Testimonial?, Quote. Icon: `Heart`
    *   **Step 11:** `CallToActionStep` (New) - Fields: #1 Thing, Misconception, Advice. Icon: `Lightbulb`
    *   **Step 12:** `BonusItemsStep` (New) - Fields: Unique?, Before & After?, Impossible?. Icon: `Gift`
    *   **Step 13:** `ClientPermissionsStep` (New) - Fields: Has Review? (Y/N), Review Link (Conditional). Icon: `CheckSquare`
    *   **Step 14:** `ClientNamePrivacyStep` (New) - Fields: Share Name? (Y/N), Client Name (Conditional). Icon: `EyeOff`
    *   **Step 15 (Review):** `SellerSuccessReviewStep` (New - Custom). Icon: `ClipboardList`
    *   **Step 16 (Success):** `SellerSuccessConfirmationStep` (New - Custom). Icon: `PartyPopper`

4.  **Data Structure (`SellerSuccessStoryData` Interface):**
    ```typescript
    interface SellerSuccessStoryData {
      contact: { firstName: string; lastName: string; email: string; };
      address: { street: string; city: string; state: string; zip: string; };
      propertyDetails: { propertyType: string; bedrooms: number | string; bathrooms: number | string; squareFootage: number | string; yearBuilt: number | string; };
      propertyStats: { listedPrice: string; soldPrice: string; daysOnMarket: number | string; numOffers: number | string; numShowings: number | string; otherStats?: string; };
      supportingLinks: { googleDriveLink: string; };
      mlsLink?: { mlsUrl?: string; mlsDetails?: string; };
      backstory: { sellerProfile: string; challenges: string; fears: string; whyAgent: string; initialGoals: string; };
      strategy: { pricing: string; marketing: string; buyerSource?: string; showingsOffersGenerated: string; urgency: string; challengesHandled?: string; };
      results: { finalVsAsking: string; speedVsAverage: string; multipleOffers?: string; negotiatedTerms?: string; sellerReaction: string; };
      emotionalImpact: { lifeChange: string; rewardingPart: string; testimonial?: string; resonatingQuote?: string; };
      callToAction: { num1ThingToKnow: string; misconception: string; advice: string; };
      bonusItems?: { unique?: string; beforeAfter?: string; impossibleAchieved?: string; };
      clientPermissions: { hasReview: 'Yes' | 'No' | ''; reviewLink?: string; };
      clientNamePrivacy: { shareName: 'Yes, use their name' | 'No, keep it private' | ''; clientName?: string; };
    }
    ```

5.  **Conditional Logic:**
    *   **Intra-Step:**
        *   `ClientPermissionsStep`: Show `reviewLink` field only when `hasReview` is 'Yes'.
        *   `ClientNamePrivacyStep`: Show `clientName` field only when `shareName` is 'Yes, use their name'. Make `clientName` required if visible.

6.  **Backend Integration:**
    *   **Submission Endpoint:** `https://n8n.salesgenius.co/webhook/seller-success`
    *   **Payload Structure:** JSON based on `SellerSuccessStoryData`. Exact structure to be confirmed if different from the interface.
    *   **`mapToPayload` Function:** To be implemented in the config file to transform `formData` to the required backend payload.
    *   **CORS:** Endpoint **must** be configured for the frontend origin.

7.  **UI/UX Details:**
    *   Follow `FORM_INTRO_STEP_GUIDELINES.md` and `FORM_STEP_GUIDELINES.md`.
    *   Use icons and text provided in the outline/plan.
    *   Success message as provided in the outline.

## Phase 2: Implementation (Code Mode)

1.  Define `SellerSuccessStoryData` interface in `src/forms/seller-success-story.config.ts`.
2.  Create new components in `src/components/SellerSuccessForm/`.
3.  Create `src/forms/seller-success-story.config.ts` defining steps, components, `initialData`, `mapToPayload`, `submissionEndpoint`, etc.
4.  Update `src/forms/registries.ts` with new components.
5.  Update `src/forms/configLoader.ts` with the new config.
6.  Update `src/App.tsx` with the route `/seller-success-story` pointing to `<GenericFormPage formTypeId="seller-success-story" />`.
7.  Update `src/data/services.json` to add the "Seller Success Story" service linking to `/seller-success-story`.

## Phase 3: Testing & Troubleshooting

*   Follow detailed testing steps outlined in `FINAL_FORM_CREATION_WORKFLOW.md`.

## Diagram (Simplified Flow)

```mermaid
graph TD
    A[Start: Define Purpose & Data Structure] --> B(Identify Reusable & New Components);
    B --> C{Plan Conditional Logic};
    C --> D(Define Backend Endpoint & Payload);
    D --> E[Confirm CORS Configuration];
    E --> F(Implement: Create Components);
    F --> G(Implement: Create Config File);
    G --> H(Implement: Update Registries & Loader);
    H --> I(Implement: Update Routing & Service Link);
    I --> J(Test: Flow, UI, Conditionals, Validation);
    J --> K(Test: Review Step Accuracy);
    K --> L(Test: Submission Payload & CORS);
    L --> M(Test: Success/Error Handling);
    M --> N[End: Form Complete];