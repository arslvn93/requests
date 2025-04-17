import { FormTypeConfig } from './form-types';

// ==========================================================================
// Data Structure for Video Edit Request Form
// ==========================================================================
export interface VideoEditRequestFormData {
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
    // Using descriptive keys for clarity
    selectedEdits: ('captions' | 'trim' | 'music' | 'branding' | 'cta' | 'audio' | 'pacing' | 'other')[];
    otherEdit?: string;     // Conditionally shown text input
  };
  // From Step 5: Additional Notes
  additionalNotes: string; // Textarea input
  // From Step 6: Urgency
  urgency: {
    deadline?: string;      // Date input (YYYY-MM-DD), optional? Let's make it optional.
    isUrgent: 'yes' | 'no' | ''; // Yes/No selection
    notifiedTeam?: 'yes' | 'no' | ''; // Conditional Yes/No selection
  };
}

// ==========================================================================
// Initial Data
// ==========================================================================
const initialVideoEditData: VideoEditRequestFormData = {
  contact: { firstName: '', lastName: '', phone: '', email: '' },
  videoDetails: { originalTitle: '', driveLink: '' },
  videoType: { selectedType: '', otherType: '' },
  editTypes: { selectedEdits: [], otherEdit: '' },
  additionalNotes: '',
  urgency: { deadline: '', isUrgent: '', notifiedTeam: '' },
};


// ==========================================================================
// Configuration Object
// ==========================================================================
export const videoEditRequestFormConfig: FormTypeConfig<VideoEditRequestFormData> = {
  formTypeId: 'video-edit-request',
  name: 'Video Editing Change Request',
  introComponentId: 'VideoEditIntroStep', // New component needed
  reviewComponentId: 'VideoEditReviewStep', // New component needed

  steps: [
    // Step 1: Contact (Reuse)
    { stepId: 'contact', componentId: 'ContactStep', title: 'Contact Info', dataKey: 'contact', icon: 'User' },
    // Step 2: Video Details (New)
    { stepId: 'videoDetails', componentId: 'VideoDetailsStep', title: 'Video Details', dataKey: 'videoDetails', icon: 'FileVideo' },
    // Step 3: Video Type (New)
    { stepId: 'videoType', componentId: 'VideoTypeStep', title: 'Video Type', dataKey: 'videoType', icon: 'Film' },
    // Step 4: Edit Types (New)
    { stepId: 'editTypes', componentId: 'EditTypeStep', title: 'Edit Types', dataKey: 'editTypes', icon: 'Wand2' },
    // Step 5: Additional Notes (New)
    { stepId: 'additionalNotes', componentId: 'EditNotesStep', title: 'Edit Notes', dataKey: 'additionalNotes', icon: 'List' },
    // Step 6: Urgency (New)
    { stepId: 'urgency', componentId: 'UrgencyStep', title: 'Urgency', dataKey: 'urgency', icon: 'Clock', isOptional: true }, // Making deadline optional
  ],

  initialData: initialVideoEditData,

  mapToPayload: (data: VideoEditRequestFormData): Record<string, any> => {
    // Transform VideoEditRequestFormData into the backend JSON payload
    const payload: Record<string, any> = {
      contact_email: data.contact.email,
      contact_name: `${data.contact.firstName} ${data.contact.lastName}`,
      contact_phone: data.contact.phone, // Added phone
      video_title: data.videoDetails.originalTitle,
      video_link: data.videoDetails.driveLink,
      video_type: data.videoType.selectedType === 'Other' ? data.videoType.otherType : data.videoType.selectedType,
      edit_types: data.editTypes.selectedEdits.includes('other')
        ? [...data.editTypes.selectedEdits.filter(e => e !== 'other'), data.editTypes.otherEdit].join(', ')
        : data.editTypes.selectedEdits.join(', '),
      additional_notes: data.additionalNotes,
      deadline: data.urgency.deadline || null, // Send null if empty
      is_urgent: data.urgency.isUrgent === 'yes',
    };
    // Only include notified_team if the request is urgent
    if (data.urgency.isUrgent === 'yes') {
      payload.notified_team = data.urgency.notifiedTeam === 'yes';
    }
    return payload;
  },

  // TODO: Confirm/Update the actual submission endpoint
  submissionEndpoint: 'https://n8n.salesgenius.co/webhook/video-edit-request', // Using planned endpoint

  successMessage: `🎉 Success! Your Video Change Request Has Been Submitted!\n🚀 Next Steps:\n✅ Our team will review your request and begin working on your revisions.\n✅ Typical turnaround time for edits: 2-3 business days (longer for complex requests).\n✅ If we need further clarification, we’ll reach out via email.\n💡 Need urgent changes? Contact clientcare@salesgenius.co.\nThanks for submitting your request – we’ll make sure your video is perfect! 🎬✨`,
};