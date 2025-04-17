# Plan: Video Editing Change Request Form Implementation

## 1. Overview

This document details the specific implementation plan for the "Video Editing Change Request" form, following the guidelines in `NEW_FORM_CREATION_GUIDE.md` and using the generic form system (`GenericFormPage.tsx`).

**Form Goal:** Allow clients to submit specific revision requests for videos previously edited by the team.

## 2. Data Structure (`VideoEditRequestFormData`)

```typescript
// To be defined (e.g., in src/forms/video-edit-request.config.ts)
interface VideoEditRequestFormData {
  // From Step 1: Contact Info
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  // From Step 2: Video Details
  videoDetails: {
    originalTitle: string;
    driveLink: string;
  };
  // From Step 3: Video Type
  videoType: {
    selectedType: string; // Value from options list or 'Other'
    otherType?: string;   // Conditionally shown text input
  };
  // From Step 4: Edit Types
  editTypes: {
    selectedEdits: string[]; // Array of keys like 'captions', 'trim', 'music', etc.
    otherEdit?: string;     // Conditionally shown text input
  };
  // From Step 5: Additional Notes
  additionalNotes: string; // Textarea input
  // From Step 6: Urgency
  urgency: {
    deadline?: string;      // Date input (YYYY-MM-DD), optional?
    isUrgent: 'yes' | 'no' | ''; // Yes/No selection
    notifiedTeam?: 'yes' | 'no' | ''; // Conditional Yes/No selection
  };
}
```

## 3. Step-by-Step Implementation Details

| Step | Title                 | `stepId`          | `componentId`             | `dataKey` / Fields Handled | Icon         | UI Details & Notes                                                                                                                                                              | Conditional Logic Notes                                                                                                |
| :--- | :-------------------- | :---------------- | :------------------------ | :------------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| 0    | Intro                 | `intro`           | `VideoEditIntroStep` (New) | N/A                        | `Edit`       | Displays title, description, how-it-works, important notes.                                                                                                                     | N/A                                                                                                                    |
| 1    | Contact Info          | `contact`         | `ContactStep` (Reuse)     | `contact`                  | `User`       | Standard contact fields.                                                                                                                                                        | N/A                                                                                                                    |
| 2    | Video Details         | `videoDetails`    | `VideoDetailsStep` (New)   | `videoDetails`             | `FileVideo`  | **Q1:** Text input (Original Title). **Q2:** Text input (Drive Link - URL type?).                                                                                                | N/A                                                                                                                    |
| 3    | Video Type            | `videoType`       | `VideoTypeStep` (New)      | `videoType`                | `Film`       | **Q3:** Single-select (radio/cards) for predefined types + "Other". Text input appears if "Other" selected.                                                                       | Show `otherType` input if `selectedType === 'Other'`. (Handled *within* `VideoTypeStep`).                               |
| 4    | Edit Types            | `editTypes`       | `EditTypeStep` (New)       | `editTypes`                | `Wand2`      | **Q4:** Multi-select (checkboxes/cards) for predefined edits + "Other". Text input appears if "Other" selected.                                                                   | Show `otherEdit` input if `selectedEdits.includes('other')`. (Handled *within* `EditTypeStep`).                         |
| 5    | Additional Notes      | `additionalNotes` | `EditNotesStep` (New)      | `additionalNotes`          | `List`       | **Q5:** Long textarea input for detailed instructions and timestamps.                                                                                                             | N/A                                                                                                                    |
| 6    | Urgency & Deadline    | `urgency`         | `UrgencyStep` (New)        | `urgency`                  | `Clock`      | **Q6:** Date input (Deadline). **Q7:** Yes/No buttons (Is Urgent?). **Q8:** Yes/No buttons (Notified Team?) shown conditionally.                                                   | Show "Notified Team?" question if `isUrgent === 'yes'`. (Handled *within* `UrgencyStep`).                               |
| 7    | Review                | `review`          | `VideoEditReviewStep` (New)| N/A                        | `CheckSquare`| Displays summary of `VideoEditRequestFormData`. Needs creation.                                                                                                                 | N/A                                                                                                                    |
| 8    | Success               | `success`         | `DefaultSuccessStep` (Reuse)| N/A                        | `PartyPopper`| Displays custom success message from config.                                                                                                                                    | N/A                                                                                                                    |

## 4. Configuration File (`src/forms/video-edit-request.config.ts`) Outline

```typescript
import { FormTypeConfig } from './form-types';
import { VideoEditRequestFormData } from './video-edit-request.types'; // Or define interface here

export const videoEditRequestFormConfig: FormTypeConfig<VideoEditRequestFormData> = {
  formTypeId: 'video-edit-request',
  name: 'Video Editing Change Request',
  introComponentId: 'VideoEditIntroStep',
  reviewComponentId: 'VideoEditReviewStep', // Use the new specific review step

  steps: [
    { stepId: 'contact', componentId: 'ContactStep', title: 'Contact Info', dataKey: 'contact', icon: 'User' },
    { stepId: 'videoDetails', componentId: 'VideoDetailsStep', title: 'Video Details', dataKey: 'videoDetails', icon: 'FileVideo' },
    { stepId: 'videoType', componentId: 'VideoTypeStep', title: 'Video Type', dataKey: 'videoType', icon: 'Film' },
    { stepId: 'editTypes', componentId: 'EditTypeStep', title: 'Edit Types', dataKey: 'editTypes', icon: 'Wand2' },
    { stepId: 'additionalNotes', componentId: 'EditNotesStep', title: 'Edit Notes', dataKey: 'additionalNotes', icon: 'List' },
    { stepId: 'urgency', componentId: 'UrgencyStep', title: 'Urgency', dataKey: 'urgency', icon: 'Clock' },
  ],

  initialData: {
    contact: { firstName: '', lastName: '', phone: '', email: '' },
    videoDetails: { originalTitle: '', driveLink: '' },
    videoType: { selectedType: '', otherType: '' },
    editTypes: { selectedEdits: [], otherEdit: '' },
    additionalNotes: '',
    urgency: { deadline: '', isUrgent: '', notifiedTeam: '' },
  },

  mapToPayload: (data: VideoEditRequestFormData): Record<string, any> => {
    // Transform VideoEditRequestFormData into the backend JSON payload
    return {
      contact_email: data.contact.email,
      contact_name: `${data.contact.firstName} ${data.contact.lastName}`,
      video_title: data.videoDetails.originalTitle,
      video_link: data.videoDetails.driveLink,
      video_type: data.videoType.selectedType === 'Other' ? data.videoType.otherType : data.videoType.selectedType,
      edit_types: data.editTypes.selectedEdits.includes('other')
        ? [...data.editTypes.selectedEdits.filter(e => e !== 'other'), data.editTypes.otherEdit].join(', ')
        : data.editTypes.selectedEdits.join(', '),
      additional_notes: data.additionalNotes,
      deadline: data.urgency.deadline,
      is_urgent: data.urgency.isUrgent === 'yes',
      notified_team: data.urgency.isUrgent === 'yes' ? data.urgency.notifiedTeam === 'yes' : undefined, // Only include if urgent
    };
  },

  // TODO: Define the actual submission endpoint
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/video-edit-request', // Example endpoint

  successMessage: `🎉 Success! Your Video Change Request Has Been Submitted!\n🚀 Next Steps:\n✅ Our team will review your request and begin working on your revisions.\n✅ Typical turnaround time for edits: 2-3 business days (longer for complex requests).\n✅ If we need further clarification, we’ll reach out via email.\n💡 Need urgent changes? Contact clientcare@salesgenius.co.\nThanks for submitting your request – we’ll make sure your video is perfect! 🎬✨`,
};
```

## 5. Implementation Steps Summary

1.  Create `VideoEditRequestFormData` interface.
2.  Create new components: `VideoEditIntroStep`, `VideoDetailsStep`, `VideoTypeStep`, `EditTypeStep`, `EditNotesStep`, `UrgencyStep`, `VideoEditReviewStep`.
3.  Create `video-edit-request.config.ts` as outlined above.
4.  Update `registries.ts` with new components.
5.  Update `configLoader.ts` to load the new config.
6.  Update `App.tsx` with the route `/video-edit-request`.
7.  Update `services.json` URL for `video-editing`.
8.  Configure backend CORS for the new endpoint.
9.  Test thoroughly.
