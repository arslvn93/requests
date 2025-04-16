# Plan: Implement S3 Image Upload Integration (Partial Success Allowed)

**Goal:** Modify the React form (`ListingForm.tsx`) to upload selected photos to AWS S3 before submitting the main form data to the webhook (`https://n8n.salesgenius.co/webhook/listingad`). Include only the successfully generated S3 URLs in the webhook payload.

**Security Note:** Using AWS credentials directly in client-side code (via environment variables) is a security risk in production. Consider using temporary credentials (STS) or a backend proxy for uploads in a production environment. This plan proceeds assuming the risk is understood for the current context.

**1. Install Dependencies:**
    *   AWS SDK v3 S3 Client: `npm install @aws-sdk/client-s3`
    *   UUID Generator: `npm install uuid`
    *   UUID Types (for TypeScript): `npm install --save-dev @types/uuid`

**2. Configure S3 Client:**
    *   Create an S3 client instance (e.g., in a utility file or within `ListingForm.tsx`).
    *   Configure it using credentials and region from Vite environment variables:
        *   `accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID`
        *   `secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY`
        *   `region: import.meta.env.VITE_AWS_REGION`
    *   Store the bucket name: `const bucketName = import.meta.env.VITE_S3_BUCKET;`

**3. Generate Unique Identifiers:**
    *   Use `uuidv4()` from the `uuid` library to generate a unique `listingId` at the start of the `handleSubmit` process in `ListingForm.tsx`.

**4. Define S3 Folder Structure:**
    *   Use the structure: `listings/{listingId}/{original_filename}`
        *   `listings`: Top-level folder.
        *   `{listingId}`: Unique UUID for the submission.
        *   `{original_filename}`: Original file name (consider sanitization or using UUIDs for filenames too).

**5. Modify Submission Flow (`ListingForm.tsx` - `handleSubmit`):**
    *   **Start:** Set `isSubmitting = true`, clear status messages.
    *   **Generate ID:** `const listingId = uuidv4();`
    *   **Upload Photos:**
        *   Implement an async function `uploadPhotosToS3(photos: File[], listingId: string): Promise<{ successfulUrls: string[]; failedCount: number; }>`:
            *   Initialize the S3 client.
            *   Create an array of upload promises. Each promise corresponds to sending a `PutObjectCommand` for one photo.
                *   `Bucket`: `bucketName`
                *   `Key`: `listings/${listingId}/${photo.name}`
                *   `Body`: `photo` (File object)
                *   `ContentType`: `photo.type`
                *   `ACL`: `'public-read'` (if needed for public access, verify bucket policy).
            *   Use `Promise.allSettled(uploadPromises)` to wait for all uploads to complete or fail.
            *   Process results: Iterate through the settled promises. If fulfilled, construct the S3 URL (`https://${bucketName}.s3.${region}.amazonaws.com/${key}`) and add to `successfulUrls`. If rejected, increment `failedCount` and log the error.
            *   Return `{ successfulUrls, failedCount }`.
        *   Call `uploadPhotosToS3` within `handleSubmit`: `const { successfulUrls, failedCount } = await uploadPhotosToS3(formData.photosMedia.photos, listingId);`
    *   **Map Data:** Call `mapFormDataToPayload(formData, successfulUrls)`.
    *   **Submit to Webhook:** `fetch` POST to the n8n endpoint with the payload containing only the `successfulUrls`.
    *   **Handle Webhook Response:**
        *   On success (`response.ok`): Set status to 'success'. Set message considering `failedCount` (e.g., "Success!" or "Success! (X photos failed)").
        *   On failure: Set status to 'error' with webhook error details.
    *   **Finish:** Set `isSubmitting = false` in a `finally` block.

**6. Update `mapFormDataToPayload`:**
    *   Modify signature: `mapFormDataToPayload(data: FormData, photoUrls: string[])`.
    *   Map the `photoUrls` array to `photo_url_1`, `photo_url_2`, etc. keys in the payload object.

**7. Update User Feedback (`ReviewStep.tsx`):**
    *   No major changes needed here. The component already displays status messages passed from `ListingForm`. The success message will now reflect partial upload failures if they occurred.

**Diagram (Mermaid - Flow with Partial Success):**

```mermaid
sequenceDiagram
    participant User
    participant ReviewStep
    participant ListingForm
    participant AWS_S3
    participant API_Webhook

    User->>ReviewStep: Clicks "Submit Listing" button
    ReviewStep->>ListingForm: Calls onSubmit (handleSubmit)
    ListingForm->>ListingForm: Set isSubmitting = true, status = 'idle'
    ListingForm->>ListingForm: Generate unique listingId (UUID)
    ListingForm->>ListingForm: Call uploadPhotosToS3(photos, listingId)
    activate ListingForm #FF9999
    %% Use Promise.allSettled internally %%
    loop For Each Photo Upload Attempt
        ListingForm->>AWS_S3: PutObjectCommand (Bucket, Key: listings/{id}/{name}, Body: File)
        AWS_S3-->>ListingForm: Upload Result (Settled: Fulfilled/Rejected)
    end
    ListingForm->>ListingForm: Collect successful S3 URLs & count failures
    deactivate ListingForm #FF9999
    ListingForm->>ListingForm: mapFormDataToPayload(formData, successfulUrls)
    ListingForm->>API_Webhook: POST /webhook/listingad (Payload with successful S3 URLs)
    alt Webhook Success (2xx)
        API_Webhook-->>ListingForm: Success Response
        ListingForm->>ListingForm: Set status = 'success', message = 'Success! (+ note if uploads failed)'
    else Webhook Failed (non-2xx or Network Error)
        API_Webhook-->>ListingForm: Error Response / Network Error
        ListingForm->>ListingForm: Set status = 'error', message = 'Webhook Error!'
    end
    ListingForm->>ListingForm: Set isSubmitting = false
    ListingForm->>ReviewStep: Update props (status, message, isSubmitting)
    ReviewStep->>User: Show Final Status Message (incl. upload failure note if needed), Enable Button