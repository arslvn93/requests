import React from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';
import { VideoEditRequestFormData } from '../../forms/video-edit-request.config'; // Import the specific FormData type

// Define props expected by this Review step
interface VideoEditReviewStepProps {
  formData: VideoEditRequestFormData;
  onSubmit: () => void;
  isSubmitting: boolean;
  submissionStatus: 'idle' | 'success' | 'error';
  submissionMessage: string;
  // Add onBack or other navigation if needed from props
}

// Helper to display array data nicely
const formatArray = (arr: string[] | undefined): string => {
    if (!arr || arr.length === 0) return 'N/A';
    // Simple join, could map to labels later if needed
    return arr.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(', ');
}

// Helper to format Yes/No values
const formatYesNo = (value: 'yes' | 'no' | '' | undefined): string => {
    if (value === 'yes') return 'Yes';
    if (value === 'no') return 'No';
    return 'N/A';
}

const VideoEditReviewStep: React.FC<VideoEditReviewStepProps> = ({
  formData,
  onSubmit,
  isSubmitting,
  submissionStatus,
  submissionMessage
}) => {

  // Destructure for easier access, provide defaults
  const {
    contact = { firstName: '', lastName: '', phone: '', email: '' },
    videoDetails = { originalTitle: '', driveLink: '' },
    videoType = { selectedType: '', otherType: '' },
    editTypes = { selectedEdits: [], otherEdit: '' },
    additionalNotes = '',
    urgency = { deadline: '', isUrgent: '', notifiedTeam: '' }
  } = formData;

  const displayVideoType = videoType.selectedType === 'Other' ? videoType.otherType : videoType.selectedType;
  const displayEditTypes = editTypes.selectedEdits.includes('other')
    ? [...editTypes.selectedEdits.filter(e => e !== 'other'), `Other: ${editTypes.otherEdit || 'Not specified'}`].join(', ')
    : formatArray(editTypes.selectedEdits);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CheckSquare className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Review Your Request</h2>
          <p className="text-white/60">Please confirm the details for your video edit request.</p>
        </div>
      </div>

      {/* Review Sections */}
      <div className="space-y-6 text-white/90">

        {/* Contact Info */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Contact Info</h3>
          <p><strong>Name:</strong> {contact.firstName} {contact.lastName}</p>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone || 'N/A'}</p>
        </div>

        {/* Video Details */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Video Details</h3>
          <p><strong>Original Title:</strong> {videoDetails.originalTitle || 'N/A'}</p>
          <p><strong>Drive Link:</strong> <a href={videoDetails.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{videoDetails.driveLink || 'N/A'}</a></p>
        </div>

        {/* Video Type */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Video Type</h3>
          <p>{displayVideoType || 'N/A'}</p>
        </div>

        {/* Edit Types */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Requested Edits</h3>
          <p>{displayEditTypes || 'N/A'}</p>
        </div>

        {/* Additional Notes */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Additional Notes & Timestamps</h3>
          <p className="whitespace-pre-wrap">{additionalNotes || 'N/A'}</p>
        </div>

        {/* Urgency */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300 border-b border-white/10 pb-1">Urgency</h3>
          <p><strong>Requested Deadline:</strong> {urgency.deadline || 'Not specified'}</p>
          <p><strong>Is Urgent (&lt;2-3 days):</strong> {formatYesNo(urgency.isUrgent)}</p>
          {urgency.isUrgent === 'yes' && (
            <p><strong>Team Notified of Urgency:</strong> {formatYesNo(urgency.notifiedTeam)}</p>
          )}
        </div>

      </div>

      {/* Submission Button */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full mt-8 py-3 px-6 bg-green-600/90 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting Request...
          </>
        ) : (
          'Confirm & Submit Request'
        )}
      </button>

       {/* Display submission errors here */}
       {submissionStatus === 'error' && (
         <p className="text-red-400 text-center mt-4">{submissionMessage}</p>
       )}

    </div>
  );
};

export default VideoEditReviewStep;