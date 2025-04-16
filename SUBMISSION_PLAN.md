# Plan: Implement Form Submission to Webhook

**Goal:** Modify the React form (`ListingForm.tsx` and `ReviewStep.tsx`) to send the collected data to `https://n8n.salesgenius.co/webhook/listingad` upon submission, using a derived JSON structure, providing user feedback, and using placeholders for photo URLs.

**1. Target JSON Structure & Mapping (Derived):**

The payload sent to the endpoint will be a single JSON object (`{...}`) with `snake_case` keys. The mapping from `formData` will be as follows:

*   **Contact:** `firstName` -> `first_name`, `lastName` -> `last_name`, `email` -> `email`, `phone` -> `phone`.
*   **Address:** `address` -> `address_line_1`, `address2` -> `address_line_2`, `city` -> `city`, `state` -> `state_province_region`, `zipCode` -> `zip_postal_code`, `country` -> `country`.
*   **Ad Details:** `objective` -> `ad_objective`, `targetLocations` (joined string) -> `ad_target_locations`, `duration` (mapped 'until_sold'/'specific_date') -> `ad_duration_type`, `endDate` -> `ad_end_date`, `dailyBudget` -> `ad_daily_budget`, `targetEmotion` -> `ad_target_emotion`.
*   **Property Details:** `propertyType` -> `property_type`, `otherType` -> `property_type_other`, `price` -> `listing_price`, `showPrice` (mapped 'ad'/'email' to boolean `true`/`false`) -> `show_price_in_ad`, `bedrooms` -> `bedrooms`, `bathrooms` -> `bathrooms`, `hasDen` (mapped 'yes'/'no' to boolean) -> `has_den`, `hasBasement` (mapped 'yes'/'no' to boolean) -> `has_basement`, `basementType` -> `basement_type`, `basementBedrooms` -> `basement_bedrooms`, `basementBathrooms` -> `basement_bathrooms`, `hasBasementEntrance` (mapped 'yes'/'no' to boolean) -> `has_separate_basement_entrance`, `squareFootage` -> `square_footage`.
*   **Property Highlights:** `topFeatures` -> `top_features`, `wowFactor` -> `wow_factor`, `firstImpression` -> `first_impression`, `hiddenGems` -> `hidden_gems`.
*   **Target Buyer:** `idealBuyer` -> `ideal_buyer`, `lifestyle` -> `lifestyle`, `propertyAppeal` -> `property_appeal`, `neighborhoodAppeal` -> `neighborhood_appeal`.
*   **Neighborhood Info:** `amenities` -> `local_amenities`, `otherAmenity` -> `other_amenity`, `comparison` -> `comparison_to_similar_listings`.
*   **Property Upgrades:** `upgradesDescription` -> `recent_upgrades`.
*   **Investment Potential:** `isGoodInvestment` (mapped 'yes'/'no' to boolean `true`/`false`) -> `is_investment_property`, `rentalIncome` -> `potential_rental_income`, `propertyAppreciation` -> `property_appreciation_potential`, `developmentPlans` -> `upcoming_development_plans`, `investmentHighlights` -> `investment_highlights`.
*   **Photos/Media:** `virtualTourUrl` -> `branded_photo_tour_url`.
*   **Photo Placeholders:** Dynamically generate keys `photo_url_1`, `photo_url_2`, ... based on the number of files in `formData.photosMedia.photos`, each with a value like `"PLACEHOLDER_S3_URL_X"`.
*   **Omitted Fields:** Fields from the example without a source in `formData` (like the listing description) will *not* be included.

**2. Implementation Steps:**

*   **Modify `ListingForm.tsx`:**
    *   Add state for submission status (`isSubmitting`, `submissionStatus`, `submissionMessage`).
    *   Create a `mapFormDataToPayload(formData)` function to perform the mapping defined above.
    *   Update `handleSubmit` to:
        *   Set loading state.
        *   Call `mapFormDataToPayload`.
        *   Use `fetch` to POST the resulting object (not an array) to the endpoint.
        *   Handle success/error responses by updating submission status state.
        *   Reset loading state.
*   **Modify `ReviewStep.tsx`:**
    *   Receive and use the submission status props (`isSubmitting`, `submissionStatus`, `submissionMessage`).
    *   Disable the submit button and show a loading indicator during submission.
    *   Display success or error messages based on `submissionStatus`.

**3. Submission Flow Diagram (Mermaid):**

```mermaid
sequenceDiagram
    participant User
    participant ReviewStep
    participant ListingForm
    participant API

    User->>ReviewStep: Clicks "Submit Listing" button
    ReviewStep->>ListingForm: Calls onSubmit (handleSubmit)
    ListingForm->>ListingForm: Set isSubmitting = true, status = 'idle'
    ListingForm->>ListingForm: mapFormDataToPayload(formData)
    ListingForm->>API: POST /webhook/listingad (JSON Object Payload)
    alt Request Successful (2xx)
        API-->>ListingForm: Success Response
        ListingForm->>ListingForm: Set status = 'success', message = 'Success!', isSubmitting = false
        ListingForm->>ReviewStep: Update props (status, message, isSubmitting)
        ReviewStep->>User: Show Success Message, Enable Button
    else Request Failed (non-2xx or Network Error)
        API-->>ListingForm: Error Response / Network Error
        ListingForm->>ListingForm: Set status = 'error', message = 'Error!', isSubmitting = false
        ListingForm->>ReviewStep: Update props (status, message, isSubmitting)
        ReviewStep->>User: Show Error Message, Enable Button
    end