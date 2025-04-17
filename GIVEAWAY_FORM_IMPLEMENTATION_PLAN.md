# Plan: Giveaway Form Implementation Details

## 1. Overview

This document details the specific implementation plan for the "Giveaway Campaign" form, building upon the architecture defined in `REVISED_MULTI_FORM_PLAN.md`. It incorporates the UI/UX decisions made to ensure a modern, cool, and easy user experience.

**Key Architectural Choices:**

*   **Framework:** Uses the `GenericFormPage.tsx` component and configuration-driven approach.
*   **Conditional Logic:** Implements the "Config-Driven Skip" method. Steps for Q9, Q10, Q11, Q12 will have a `shouldSkip` function in their configuration checking if "Promote via Paid Social Media Ads" (Option D) was selected in Q8.
*   **File Upload (Q13):** Starts with a simple file input approach. Enhancements like previews or drag-and-drop can be added later if needed.

## 2. Data Structure (`GiveawayFormData`)

The primary data structure for the form state:

```typescript
// Likely defined in src/forms/giveaway.config.ts or a dedicated types file

interface GiveawayFormData {
  // Step 1: Contact Info
  contact: {
    firstName: string;
    lastName: string;
    phone: string; // Assuming phone is still needed for consistency
    email: string;
  };
  // Step 2: Giveaway Details
  giveawayTypeDesc: string;         // Q1 (Textarea)
  giveawayValue: string;            // Q2 (Text input, allows currency/text)
  giveawayReason: string;           // Q3 (Textarea)
  // Step 3: Dates
  drawDate: string;                 // Q4 (Date input YYYY-MM-DD)
  promoStartDate: string;           // Q5 (Date input YYYY-MM-DD)
  // Step 4: Participant & Audience
  participantInfo: string;          // Q6 (Textarea)
  targetAudience: string;           // Q7 (Textarea)
  // Step 5: Promotion Method
  promotionMethods: string[];       // Q8 (Multi-select, values: 'A', 'B', 'C', 'D')
  // Step 6: Paid Campaign Type (Conditional)
  paidCampaignType?: string[];      // Q9 (Multi-select, values: 'A', 'B', 'C', 'D')
  // Step 7: Paid Campaign Details (Conditional)
  paidCampaignTarget?: string;      // Q10 (Text input)
  paidCampaignBudget?: string;      // Q11 (Text input, numeric ideally but string for flexibility)
  paidCampaignEndDate?: string;     // Q12 (Date input YYYY-MM-DD)
  // Step 8: Theme Photo
  themePhoto?: File | null;         // Q13 (File object for simple upload)
  // Optional: Store uploaded URL if implementing upload within the step
  // themePhotoUrl?: string;
}
```

## 3. Step-by-Step Implementation Details

| Step # | Title                 | `stepId`              | `componentId`             | `dataKey` / Fields Handled | Icon           | UI Details & Notes                                                                                                                               | `shouldSkip` Logic                                                                 |
| :----- | :-------------------- | :-------------------- | :------------------------ | :------------------------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| 0      | Intro                 | `intro`               | `GiveawayIntroStep` (New) | N/A                        | `Gift`         | Displays title, description, and "Start" button as provided. Component needs creation.                                                           | N/A                                                                                |
| 1      | Contact Info          | `contact`             | `ContactStep` (Reuse)     | `contact`                  | `User`         | Reuses existing component.                                                                                                                       | N/A                                                                                |
| 2      | Giveaway Details      | `giveawayDetails`     | `GiveawayDetailsStep` (New) | `giveawayTypeDesc`, `giveawayValue`, `giveawayReason` | `ClipboardList` | **Q1:** Textarea with suggestion buttons (Golf, Spa, Wine Tasting, Family Pass). **Q2:** Standard text input (prefix with '$'?). **Q3:** Textarea. | N/A                                                                                |
| 3      | Dates                 | `giveawayDates`       | `GiveawayDatesStep` (New)   | `drawDate`, `promoStartDate` | `CalendarDays` | **Q4 & Q5:** Use standard date inputs.                                                                                                           | N/A                                                                                |
| 4      | Participant & Audience | `giveawayAudience`    | `GiveawayAudienceStep` (New)| `participantInfo`, `targetAudience` | `Users`        | **Q6 & Q7:** Use textareas.                                                                                                                      | N/A                                                                                |
| 5      | Promotion Method      | `giveawayPromoMethod` | `GiveawayPromoMethodStep` (New)| `promotionMethods`         | `Megaphone`    | **Q8:** Multi-select icon buttons (A: `Share2`, B: `Mail`, C: `Printer`, D: `MousePointerSquare`).                                                | N/A                                                                                |
| 6      | Paid Campaign Type    | `paidCampaignType`    | `GiveawayPaidTypeStep` (New)| `paidCampaignType`         | `Target`       | **Q9:** Multi-select icon buttons (A: `Repeat`, B: `ThumbsUp`, C: `Instagram`, D: `MapPin`).                                                      | `(formData) => !formData.promotionMethods?.includes('D')`                          |
| 7      | Paid Campaign Details | `paidCampaignDetails` | `GiveawayPaidDetailsStep` (New)| `paidCampaignTarget`, `paidCampaignBudget`, `paidCampaignEndDate` | `DollarSign`   | **Q10:** Text input. **Q11:** Text input (prefix '$'?). **Q12:** Date input.                                                                     | `(formData) => !formData.promotionMethods?.includes('D')`                          |
| 8      | Theme Photo           | `giveawayPhoto`       | `GiveawayPhotoStep` (New)   | `themePhoto`               | `ImagePlus`    | **Q13:** Simple file input (`<input type="file">`) triggered by a styled button. No preview initially.                                            | N/A                                                                                |
| 9      | Review                | `review`              | `DefaultReviewStep` (Reuse) | N/A                        | `CheckSquare`  | Reuses existing component. Displays summary of `GiveawayFormData`.                                                                               | N/A                                                                                |
| 10     | Success               | `success`             | `DefaultSuccessStep` (Reuse)| N/A                        | `PartyPopper`  | Reuses existing component. Displays custom success message from config.                                                                          | N/A                                                                                |

**Notes:**

*   New components (`GiveawayIntroStep`, `GiveawayDetailsStep`, etc.) need to be created in a suitable directory (e.g., `src/components/GiveawayForm/`).
*   Icons are suggestions from `lucide-react`.
*   The `dataKey` for multi-field steps like `GiveawayDetailsStep` needs careful handling. Either the step component updates multiple fields via `onChange` callbacks, or the `dataKey` points to a sub-object within `GiveawayFormData` that the step manages entirely. The latter is often cleaner. (This plan assumes the latter where applicable).
*   Validation logic (`onValidationChange`) needs to be implemented within each new step component.

## 4. Configuration File (`src/forms/giveaway.config.ts`) Outline

```typescript
import { FormTypeConfig } from './form-types';
import { GiveawayFormData } from './giveaway.types'; // Assuming types are separated

export const giveawayFormConfig: FormTypeConfig<GiveawayFormData> = {
  formTypeId: 'giveaway-campaign',
  name: 'Giveaway Campaign Setup',
  introComponentId: 'GiveawayIntroStep',
  reviewComponentId: 'DefaultReviewStep', // Or custom 'GiveawayReviewStep'
  steps: [
    // Step 1
    { stepId: 'contact', componentId: 'ContactStep', title: 'Contact Info', dataKey: 'contact', icon: 'User' },
    // Step 2
    { stepId: 'giveawayDetails', componentId: 'GiveawayDetailsStep', title: 'Giveaway Details', dataKey: 'giveawayDetails', icon: 'ClipboardList' }, // Assuming dataKey is an object slice
    // Step 3
    { stepId: 'giveawayDates', componentId: 'GiveawayDatesStep', title: 'Dates', dataKey: 'giveawayDates', icon: 'CalendarDays' }, // Assuming dataKey is an object slice
    // Step 4
    { stepId: 'giveawayAudience', componentId: 'GiveawayAudienceStep', title: 'Audience', dataKey: 'giveawayAudience', icon: 'Users' }, // Assuming dataKey is an object slice
    // Step 5
    { stepId: 'giveawayPromoMethod', componentId: 'GiveawayPromoMethodStep', title: 'Promotion', dataKey: 'promotionMethods', icon: 'Megaphone' },
    // Step 6 (Conditional)
    {
      stepId: 'paidCampaignType',
      componentId: 'GiveawayPaidTypeStep',
      title: 'Ad Type',
      dataKey: 'paidCampaignType',
      icon: 'Target',
      shouldSkip: (formData: GiveawayFormData) => !formData.promotionMethods?.includes('D')
    },
    // Step 7 (Conditional)
    {
      stepId: 'paidCampaignDetails',
      componentId: 'GiveawayPaidDetailsStep',
      title: 'Ad Details',
      dataKey: 'paidCampaignDetails', // Assuming dataKey is an object slice
      icon: 'DollarSign',
      shouldSkip: (formData: GiveawayFormData) => !formData.promotionMethods?.includes('D')
    },
    // Step 8
    { stepId: 'giveawayPhoto', componentId: 'GiveawayPhotoStep', title: 'Photo', dataKey: 'themePhoto', icon: 'ImagePlus' },
  ],
  initialData: {
    // Initialize all fields from GiveawayFormData with defaults
    contact: { firstName: '', lastName: '', phone: '', email: '' },
    giveawayTypeDesc: '',
    giveawayValue: '',
    // ... etc.
    promotionMethods: [],
  },
  mapToPayload: (data: GiveawayFormData): Record<string, any> => {
    // Logic to transform GiveawayFormData into the backend JSON payload
    // Example:
    return {
      contact_email: data.contact.email,
      giveaway_description: data.giveawayTypeDesc,
      giveaway_value: data.giveawayValue,
      draw_date: data.drawDate,
      promo_methods: data.promotionMethods.join(','), // Example transformation
      // Conditionally include paid ad details
      ...(data.promotionMethods.includes('D') && {
         paid_ad_type: data.paidCampaignType?.join(','),
         paid_ad_target: data.paidCampaignTarget,
         paid_ad_budget: data.paidCampaignBudget,
         paid_ad_end_date: data.paidCampaignEndDate,
      }),
      // Handle file upload data (e.g., pass filename, or handle upload separately)
      theme_photo_filename: data.themePhoto?.name || null,
    };
  },
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/giveaway', // Confirm endpoint
  successMessage: `🎉 Success! Giveaway Funnel Has Been Submitted!\n🚀 Next Steps:\n✅ Our team will review your responses and craft your Giveaway Funnel.\n✅ We’ll send you a preview before launching the ad and email campaign.\n✅ Expect to hear from us within 3 business days.\n💡 Need to update something? Contact clientcare@salesgenius.co.\nThanks for sharing your success – let’s turn it into more wins! 🏡💰`,
};
```

## 5. Next Steps

With this detailed plan:

1.  Switch to **Code Mode**.
2.  Create the necessary type definitions (if separating `GiveawayFormData`).
3.  Create `src/forms/giveaway.config.ts` based on the outline above.
4.  Begin creating the new step components (`GiveawayIntroStep`, `GiveawayDetailsStep`, etc.) in `src/components/GiveawayForm/`.
5.  Update `src/forms/registries.ts` to include the new components.
6.  Modify `GenericFormPage.tsx` to correctly implement the `shouldSkip` logic during navigation/rendering.
7.  Update routing and `services.json`.
