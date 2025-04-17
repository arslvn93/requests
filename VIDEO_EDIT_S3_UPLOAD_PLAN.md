# Plan: Replace Video Details Step with S3 Upload

**Goal:** Replace the current `VideoDetailsStep` (which uses a Google Drive link) in the Video Editing form with a new step (`VideoUploadStep`) that handles direct S3 upload for a single video file. This step will be modeled after `GiveawayPhotoStep` but simplified (no preview) and allow any file type.

**Plan Details:**

1.  **Update `src/forms/video-edit-request.config.ts`:**
    *   **Define Type:** Add `export interface VideoUploadInfo { id: string; s3Key: string; s3Url: string; originalFilename: string; }`.
    *   **Modify Form Data:** In `VideoEditRequestFormData`, remove `videoDetails`. Add `videoUpload?: VideoUploadInfo | null;`.
    *   **Update Initial Data:** In `initialVideoEditData`, remove `videoDetails`, add `videoUpload: null`.
    *   **Update Steps Array:** Replace the `VideoDetailsStep` entry with: `{ stepId: 'videoUpload', componentId: 'VideoUploadStep', title: 'Upload Video', dataKey: 'videoUpload', icon: 'UploadCloud' }`. (Mark as required by default).
    *   **Update Payload Mapping:** In `mapToPayload`, remove `video_title` and `video_link`. Add:
        *   `video_s3_url: data.videoUpload?.s3Url || null,`
        *   `video_original_filename: data.videoUpload?.originalFilename || null,`

2.  **Create New Component `src/components/VideoEditForm/VideoUploadStep.tsx`:**
    *   Use `src/components/GiveawayForm/GiveawayPhotoStep.tsx` as a template.
    *   **Props:** Rename types/props (e.g., `GiveawayPhotoInfo` -> `VideoUploadInfo`, `giveawayId` -> `videoEditRequestId`).
    *   **S3 Logic:**
        *   Keep S3 client setup.
        *   Use S3 key: `` `video-edits/${currentRequestId}/${videoId}-${sanitizedFilename}` ``.
        *   Include `originalFilename: file.name` in the `VideoUploadInfo` object.
        *   Keep `deleteVideoFromS3`.
    *   **State:** Keep `isUploading`, `uploadError`.
    *   **Handlers:**
        *   `handleFileChange`: Remove image type check. Generate `currentRequestId` if needed. Call `uploadVideo`, passing `oldS3Key`. Store `originalFilename`.
        *   Keep `handleRemovePhoto`.
        *   Keep `handleTriggerUpload`.
    *   **Validation:** `isValid` should return `!!value && !isUploading`. Update `useEffect` and disable "Next" button accordingly.
    *   **UI:**
        *   No `<img>` preview.
        *   Show loading state if `isUploading`.
        *   If `value` exists: Show filename (`value.originalFilename`), "Replace File" button, "Remove File" button.
        *   If `value` is null: Show upload area/button.
        *   Keep hidden `<input type="file">` without `accept` attribute.
        *   Display `uploadError`.

3.  **Update `src/forms/registries.ts`:**
    *   Remove `VideoDetailsStep` from `stepComponentRegistry`.
    *   Add `VideoUploadStep: VideoUploadStep,` (import the new component).

4.  **Update `src/pages/GenericFormPage.tsx`:**
    *   In the step rendering logic, add an `else if` check for `stepConfig.componentId === 'VideoUploadStep'`.
    *   Inside this block, add the props: `stepProps.videoEditRequestId = formInstanceId;` and `stepProps.onVideoEditRequestIdChange = setFormInstanceId;`.

**Mermaid Diagram (Simplified Flow):**

```mermaid
graph TD
    A[Start: VideoUploadStep] --> B{Video Uploaded?};
    B -- No --> C[Show Upload Area Button];
    B -- Yes --> D[Show Filename + Replace/Remove Buttons];

    C --> E{User Clicks Upload};
    D -- User Clicks Replace --> E;
    D -- User Clicks Remove --> F[Call deleteVideoFromS3];
    F --> G[Call onChange(null)];
    G --> C;

    E --> H[Trigger File Input];
    H --> I{File Selected?};
    I -- No --> A;
    I -- Yes --> J[Get File];
    J --> K{Request ID Exists?};
    K -- No --> L[Generate Request ID];
    L --> M[Call onVideoEditRequestIdChange];
    K -- Yes --> N[Set isUploading = true];
    M --> N;

    N --> O{Old Video Exists?};
    O -- Yes --> P[Store Old s3Key];
    O -- No --> Q[Call uploadVideo(newFile)];
    P --> Q;

    Q --> R{Upload Success?};
    R -- Yes --> S[Call onChange(newVideoInfo)];
    R -- No --> T[Set uploadError];
    T --> U[Set isUploading = false];
    U --> B; 

    S --> V{Old s3Key Stored?};
    V -- Yes --> W[Call deleteVideoFromS3(oldKey)];
    V -- No --> X[Set isUploading = false];
    W --> X;
    X --> B; 

    subgraph S3 Interaction
        direction LR
        uploadVideo --> S3_Put[S3 PutObject];
        deleteVideoFromS3 --> S3_Delete[S3 DeleteObject];
    end

    subgraph State Updates
        direction LR
        onChange --> ParentState[Update Parent Form State];
        onVideoEditRequestIdChange --> ParentState;
        isUploading --> LocalState[Local Step State];
        uploadError --> LocalState;
    end