# Plan: Buyer Success Story Form

This document outlines the plan for creating the new "Buyer Success Story" multi-step form, incorporating lessons learned from previous form implementations.

## Phase 1: Planning & Design

1.  **Purpose & Scope:**
    *   **Goal:** Collect detailed information about a successful property purchase from an agent to automatically generate a marketing case study (Facebook/Instagram ad + email campaign).
    *   **Target User:** Real estate agents using the platform.

2.  **Form ID:**
    *   `formTypeId`: `buyer-success-story` (Matches existing ID in `services.json`)

3.  **Steps & Component Mapping:**
    *   New components will be created under `src/components/BuyerSuccessForm/`.
    *   **Step 0 (Intro):** `BuyerSuccessIntroStep` (New) - Icon: `Users`
    *   **Step 1:** `ContactStep` (Reuse `ListingForm/ContactStep`) - Icon: `User`
    *   **Step 2:** `AddressStep` (Reuse `ListingForm/AddressStep`) - Icon: `MapPin`
    *   **Step 3:** `PropertyDetailsStep` (Reuse `ListingForm/PropertyDetailsStep`) - Icon: `Home`
    *   **Step 4:** `BuyerPropertyStatsStep` (New) - Fields: Listed Price, Purchased Price, Multiple Offers? (Y/N), Other Stats. Icon: `TrendingUp`
    *   **Step 5:** `BuyerSupportingLinksStep` (New) - Field: Google Drive Link (Required). Icon: `Link`
    *   **Step 6:** `BuyerBackstoryStep` (New) - Fields: Buyer Profile, Challenges, Fears, Why You?, Goals. Icon: `Users`
    *   **Step 7:** `HomeSearchProcessStep` (New) - Fields: Homes Viewed, Must-Haves, Bidding Wars?, Strategies Used, Terms Negotiated. Icon: `Search`
    *   **Step 8:** `BuyerEmotionalImpactStep` (New) - Fields: Life Change, Rewarding Part, Testimonial?, Resonating Quote. Icon: `Heart`
    *   **Step 9:** `FinalOutcomeStep` (New) - Fields: Final vs. Asking Price, Offer-to-Close Speed, Unexpected Benefits, Market Comparison. Icon: `Award`
    *   **Step 10:** `BuyerCallToActionStep` (New) - Fields: #1 Thing to Know, Misconception, Advice for Buyers. Icon: `Lightbulb`
    *   **Step 11:** `BuyerBonusItemsStep` (New) - Fields: Unique/Surprising?, Before & After?, Achieved the Impossible?. Icon: `Gift`
    *   **Step 12:** `BuyerClientPermissionsStep` (New) - Fields: Has Review? (Y/N), Review Link (Conditional). Icon: `CheckSquare`
    *   **Step 13:** `BuyerClientNamePrivacyStep` (New) - Fields: Share Name? (Y/N), Client Name (Conditional). Icon: `EyeOff`
    *   **Step 14 (Review):** `BuyerSuccessReviewStep` (New - Custom component following standard styling). Icon: `ClipboardList`
    *   **Step 15 (Success):** Use default success handling via `successMessage` in config.

4.  **Data Structure (`BuyerSuccessStoryData` Interface):**
    *   **Crucially, ensure the slices for reused components (`contact`, `address`, `propertyDetails`) exactly match the interfaces expected by those components.**
        ```typescript
        interface BuyerSuccessStoryData {
          // Slice matching ContactStep's ContactInfo interface
          contact: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
          };
          // Slice matching AddressStep's AddressInfo interface
          address: {
            address: string;
            address2: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
          };
          // Slice matching PropertyDetailsStep's PropertyDetailsInfo interface (Confirmed same as Seller form)
          propertyDetails: {
            propertyType: string;
            bedrooms: number | string;
            bathrooms: number | string;
            squareFootage: number | string;
            yearBuilt: number | string;
          };
          buyerPropertyStats: {
            listedPrice: string;
            purchasedPrice: string;
            multipleOffers: 'Yes' | 'No' | '';
            otherStats?: string;
          };
          buyerSupportingLinks: {
            googleDriveLink: string;
          };
          buyerBackstory: {
            buyerProfile: string;
            challenges: string;
            fears: string;
            whyAgent: string;
            initialGoals: string;
          };
          homeSearchProcess: {
            homesViewed: number | string;
            mustHaves: string;
            biddingWars?: string;
            strategiesUsed?: string;
            negotiatedTerms?: string;
          };
          buyerEmotionalImpact: {
            lifeChange: string;
            rewardingPart: string;
            testimonial?: string;
            resonatingQuote?: string;
          };
          finalOutcome: {
            finalVsAsking: string;
            offerToCloseSpeed: string;
            unexpectedBenefits?: string;
            marketComparison?: string;
          };
          buyerCallToAction: {
            num1ThingToKnow: string;
            misconception: string;
            advice: string;
          };
          buyerBonusItems?: {
            unique?: string;
            beforeAfter?: string;
            impossibleAchieved?: string;
          };
          buyerClientPermissions: {
            hasReview: 'Yes' | 'No' | '';
            reviewLink?: string;
          };
          buyerClientNamePrivacy: {
            shareName: 'Yes, use their name' | 'No, keep it private' | '';
            clientName?: string;
          };
        }
        ```

5.  **Identify Components (Recap):**
    *   **Reuse:** `ContactStep`, `AddressStep`, `PropertyDetailsStep`.
    *   **New:** Create components under `src/components/BuyerSuccessForm/`.
    *   **Review Step:** Create `BuyerSuccessReviewStep` following standard styling (`Section`, `InfoPair`).

6.  **Plan Conditional Logic:**
    *   **Step Skipping:** None identified.
    *   **Intra-Step:**
        *   `BuyerClientPermissionsStep`: Show `reviewLink` field only when `hasReview` is 'Yes'.
        *   `BuyerClientNamePrivacyStep`: Show `clientName` field only when `shareName` is 'Yes, use their name'. Make `clientName` required if visible.

7.  **Define Backend Integration:**
    *   **Submission Endpoint:** `https://n8n.salesgenius.co/webhook/buyer-success`
    *   **Payload Structure:** Confirm expected backend structure. Plan `mapToPayload` function in the config file.
    *   **CORS:** **Essential:** Ensure the backend endpoint is configured for the frontend origin.

8.  **UI/UX Details:**
    *   Use provided text for intro, descriptions, placeholders, success message.
    *   Follow `FORM_INTRO_STEP_GUIDELINES.md` and `FORM_STEP_GUIDELINES.md`.
    *   Icons as planned.

## Phase 2: Implementation (Code Mode)

1.  Define `BuyerSuccessStoryData` interface in `src/forms/buyer-success-story.config.ts`, ensuring reused slices match.
2.  Create new components in `src/components/BuyerSuccessForm/`.
3.  Create `src/forms/buyer-success-story.config.ts` defining steps, components, `initialData` (matching reused components), `mapToPayload`, `submissionEndpoint`, etc.
4.  Update `src/forms/registries.ts` with new components (ensure reused ones like `PropertyDetailsStep` are already registered).
5.  Update `src/forms/configLoader.ts` with the new config.
6.  Update `src/App.tsx` with the route `/buyer-success-story` pointing to `<GenericFormPage formTypeId="buyer-success-story" />`.
7.  Update `src/data/services.json` entry for `id: "buyer-success-story"` to use `url: "/buyer-success-story"`.

## Phase 3: Testing & Troubleshooting

*   Follow detailed testing steps from `FINAL_FORM_CREATION_WORKFLOW.md`.
*   Pay special attention to reused components (`ContactStep`, `AddressStep`, `PropertyDetailsStep`) to ensure no data mismatch errors occur.
*   Verify conditional logic in permissions/privacy steps.
*   Verify the custom review step displays all data correctly.
*   Verify desktop and mobile submit buttons appear correctly on the review step.
*   Check console for payload structure and CORS errors during submission.

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