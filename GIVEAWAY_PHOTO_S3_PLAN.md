# Plan: Implement S3 Upload for Giveaway Theme Photo

**Goal:** Modify `GiveawayPhotoStep.tsx` to upload a single theme photo to S3, display it, and handle replacement, mirroring the core logic of `PhotosMediaStep.tsx` for consistency.

**Plan Details:**

1.  **Update State and Props:**
    *   Modify the `GiveawayPhotoData` type (likely in `giveaway.config.ts` and used in `GiveawayPhotoStep.tsx`) to store S3 upload information: `{ id: string, s3Key: string, s3Url: string } | null`.
    *   Update `GiveawayPhotoStepProps` to accept `giveawayId: string | null` and `onGiveawayIdChange: (id: string) => void` props.
    *   The `value` prop will now be of the new photo info shape.
    *   The `onChange` prop will pass this new shape.

2.  **Integrate S3 Logic:**
    *   Copy S3 client initialization, `uploadPhoto`, and `deletePhotoFromS3` functions from `PhotosMediaStep.tsx` into `GiveawayPhotoStep.tsx`.
    *   Modify `uploadPhoto`:
        *   Use S3 key structure: `giveaways/${currentGiveawayId}/${photoId}-${sanitizedFilename}`.
        *   `onChange` call should update the single photo object: `onChange({ id: photoId, s3Key: key, s3Url: url })`.
        *   Before uploading a new photo, check if `value` exists. If yes, store its `s3Key`.
        *   After successful new upload, call `deletePhotoFromS3` with the stored old `s3Key`.
    *   Modify `handleFileChange`:
        *   Check/generate `giveawayId` using `uuidv4()` and call `onGiveawayIdChange` if needed.
        *   Call the modified `uploadPhoto` for the selected file.

3.  **Update UI:**
    *   Remove `fileName` state.
    *   Add state for `isUploading` (boolean) and `uploadError` (string | null).
    *   Conditionally render:
        *   Loading indicator (`Loader2`) if `isUploading`.
        *   Error message if `uploadError`.
        *   If `value` exists (and not loading/error):
            *   Display image: `<img>` with `src={value.s3Url}`.
            *   Make image clickable (or add "Change Photo" button) to trigger file input.
            *   Add "Remove Photo" button (`Trash2`) to call `deletePhotoFromS3(value.s3Key)` and `onChange(null)`.
        *   If `value` is null (and not loading/error):
            *   Show "Click to Upload Photo" area, triggering file input on click.
    *   Ensure file input (`<input type="file">`) accepts only images (`accept="image/*"`) and is not `multiple`.

4.  **Update Validation:**
    *   `isValid` remains `true` (optional step).
    *   Disable the "Next" button if `isUploading === true`.

**Mermaid Diagram:**

```mermaid
graph TD
    A[Start: GiveawayPhotoStep] --> B{Photo Exists?};
    B -- No --> C[Show Upload Area];
    B -- Yes --> D[Show Image + Change/Remove Buttons];

    C --> E{User Clicks Upload};
    D -- User Clicks Change --> E;
    D -- User Clicks Remove --> F[Call deletePhotoFromS3];
    F --> G[Call onChange(null)];
    G --> C;

    E --> H[Trigger File Input];
    H --> I{File Selected?};
    I -- No --> A;
    I -- Yes --> J[Get File];
    J --> K{Giveaway ID Exists?};
    K -- No --> L[Generate Giveaway ID];
    L --> M[Call onGiveawayIdChange];
    K -- Yes --> N[Set isUploading = true];
    M --> N;

    N --> O{Old Photo Exists?};
    O -- Yes --> P[Store Old s3Key];
    O -- No --> Q[Call uploadPhoto(newFile)];
    P --> Q;

    Q --> R{Upload Success?};
    R -- Yes --> S[Call onChange(newPhotoInfo)];
    R -- No --> T[Set uploadError];
    T --> U[Set isUploading = false];
    U --> B;

    S --> V{Old s3Key Stored?};
    V -- Yes --> W[Call deletePhotoFromS3(oldKey)];
    V -- No --> X[Set isUploading = false];
    W --> X;
    X --> B;

    subgraph S3 Interaction
        direction LR
        uploadPhoto --> S3_Put[S3 PutObject];
        deletePhotoFromS3 --> S3_Delete[S3 DeleteObject];
    end

    subgraph State Updates
        direction LR
        onChange --> ParentState[Update Parent Form State];
        onGiveawayIdChange --> ParentState;
        isUploading --> LocalState[Local Step State];
        uploadError --> LocalState;
    end
```

**Summary of Changes:**

*   Replace local file handling with S3 upload/delete logic.
*   Update component state and props for S3 data and `giveawayId`.
*   Modify UI for image display, loading/error states, and change/remove controls.
*   Ensure consistency with `PhotosMediaStep`.