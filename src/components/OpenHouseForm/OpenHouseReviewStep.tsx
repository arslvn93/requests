import React, { useEffect } from 'react';
import { OpenHouseFormData, PhotoUploadInfo } from '../../forms/open-house.config'; // Import PhotoUploadInfo
import {
  User, MapPin, Building, Sparkles, Map, CalendarDays, Camera, CheckSquare,
  ClipboardList, Loader2, ExternalLink // Added ExternalLink
} from 'lucide-react';

// Define props expected by Review steps (as passed by GenericFormPage)
interface OpenHouseReviewStepProps {
  formData: OpenHouseFormData;
  onEdit: (stepId: string) => void; // Function to navigate back to a specific step
  onSubmit: () => void;
  isSubmitting?: boolean;
  submissionStatus?: 'idle' | 'success' | 'error';
  submissionMessage?: string;
  // Keep onValidationChange for consistency, though review is always valid
  onValidationChange: (isValid: boolean) => void;
}

// Helper component for consistent section layout
const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; stepId: string; onEdit: (stepId: string) => void }> = ({
  title,
  icon: Icon,
  children,
  stepId,
  onEdit
}) => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex justify-between items-center mb-4"> {/* Keep flex for alignment */}
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      </div>
      {/* Removed Edit button */}
      {/* <button onClick={() => onEdit(stepId)} className="text-sm text-blue-400 hover:text-blue-300">Edit</button> */}
    </div>
    {children}
  </div>
);

// Helper component for consistent label/value pairs
const InfoPair: React.FC<{ label: string; value?: React.ReactNode | string[] | number | null }> = ({ label, value }) => {
  let displayValue: React.ReactNode = '-'; // Default to '-'

  if (Array.isArray(value)) {
    displayValue = value.length > 0 ? value.join(', ') : '-';
  } else if (value !== null && value !== undefined && value !== '') {
    displayValue = String(value);
  }

  // Handle boolean-like 'yes'/'no' strings (only if it's still a string)
  if (typeof displayValue === 'string') {
      const lowerCaseValue = displayValue.toLowerCase();
      if (lowerCaseValue === 'yes') displayValue = 'Yes';
      if (lowerCaseValue === 'no') displayValue = 'No';
  }


  // Render only if value is meaningful (not just the default '-')
  // Or if label implies presence (like 'Has Den?')
  if (displayValue === '-' && !label.toLowerCase().includes('has')) {
     // Optionally return null to hide empty fields completely
     // return null;
  }

  // Special handling for multi-line text
  if (typeof displayValue === 'string' && displayValue.includes('\n')) {
      displayValue = displayValue.split('\n').map((line, index) => (
          <React.Fragment key={index}>{line}<br /></React.Fragment>
      ));
  }


  return (
    <div>
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-white/90 mt-1 whitespace-pre-wrap">{displayValue}</p>
    </div>
  );
};


// Helper to format date string (YYYY-MM-DD)
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString + 'T00:00:00'); // Ensure correct parsing
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return dateString; // Fallback
  }
};

// Helper to format time string (HH:MM)
const formatTime = (timeString: string | undefined) => {
    if (!timeString) return 'N/A';
    try {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
        return timeString; // Fallback
    }
};


const OpenHouseReviewStep: React.FC<OpenHouseReviewStepProps> = ({
    formData,
    onEdit,
    onSubmit,
    isSubmitting,
    submissionStatus,
    submissionMessage,
    onValidationChange
}) => {

  // --- Debugging Log ---
  console.log('[OpenHouseReviewStep] Rendering component with formData:', formData);
  // --- End Debugging Log ---


  useEffect(() => {
    // Review step is always considered valid for submission purposes
    onValidationChange(true);
  }, [onValidationChange]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Review Your Open House Request</h2>
          <p className="text-white/60">Please confirm all details before submitting.</p>
        </div>
      </div>

      {/* Review Sections */}
      <Section title="Contact Information" icon={User} stepId="contact" onEdit={onEdit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          <InfoPair label="First Name" value={formData.contact?.firstName} />
          <InfoPair label="Last Name" value={formData.contact?.lastName} />
          <InfoPair label="Email" value={formData.contact?.email} />
          <InfoPair label="Phone" value={formData.contact?.phone} />
        </div>
      </Section>

      <Section title="Property Address" icon={MapPin} stepId="address" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Street" value={formData.address?.street} />
            <InfoPair label="Apt/Suite (Optional)" value={formData.address?.address2} />
            <InfoPair label="City" value={formData.address?.city} />
            <InfoPair label="Province" value={formData.address?.province} />
            <InfoPair label="Postal Code" value={formData.address?.postalCode} />
            <InfoPair label="Country" value={formData.address?.country} />
         </div>
      </Section>

      <Section title="Property Details" icon={Building} stepId="propertyDetails" onEdit={onEdit}>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <InfoPair label="Property Type" value={formData.propertyDetails?.propertyType === 'other' ? formData.propertyDetails?.otherType : formData.propertyDetails?.propertyType} />
            <InfoPair label="Bedrooms" value={formData.propertyDetails?.bedrooms} />
            <InfoPair label="Bathrooms" value={formData.propertyDetails?.bathrooms} />
            <InfoPair label="Square Footage" value={formData.propertyDetails?.squareFootage ? `${formData.propertyDetails.squareFootage} sq ft` : '-'} />
            {/* Optional: Add Price/Show Price if relevant for review */}
            {/* <InfoPair label="Price" value={formData.propertyDetails?.price} /> */}
            {/* <InfoPair label="Show Price In Ad" value={formData.propertyDetails?.showPrice} /> */}
            {formData.propertyDetails?.propertyType === 'condo' && <InfoPair label="Has Den?" value={formData.propertyDetails?.hasDen} />}
             {['freehold', 'townhouse', 'other'].includes(formData.propertyDetails?.propertyType || '') && (
                <>
                <InfoPair label="Has Basement?" value={formData.propertyDetails?.hasBasement} />
                {formData.propertyDetails?.hasBasement === 'yes' && (
                    <>
                    <InfoPair label="Basement Type" value={formData.propertyDetails?.basementType} />
                    <InfoPair label="Basement Bedrooms" value={formData.propertyDetails?.basementBedrooms} />
                    <InfoPair label="Basement Bathrooms" value={formData.propertyDetails?.basementBathrooms} />
                    <InfoPair label="Separate Basement Entrance?" value={formData.propertyDetails?.hasBasementEntrance} />
                    </>
                )}
                </>
            )}
         </div>
      </Section>

      <Section title="Property Highlights" icon={Sparkles} stepId="propertyHighlights" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Top 3-5 Selling Features" value={formData.propertyHighlights?.topFeatures} />
            <InfoPair label="Biggest 'WOW' Factor" value={formData.propertyHighlights?.wowFactor} />
            <InfoPair label="First Impression Feature" value={formData.propertyHighlights?.firstImpression} />
            <InfoPair label="Hidden Gems/Benefits" value={formData.propertyHighlights?.hiddenGems} />
         </div>
      </Section>

      <Section title="Neighborhood Information" icon={Map} stepId="neighborhoodInfo" onEdit={onEdit}>
         <div className="space-y-3">
            <InfoPair label="Nearby Amenities" value={formData.neighborhoodInfo?.amenities} />
            {formData.neighborhoodInfo?.amenities?.includes('other') && <InfoPair label="Other Amenity" value={formData.neighborhoodInfo?.otherAmenity} />}
            <InfoPair label="Comparison to Similar Listings" value={formData.neighborhoodInfo?.comparison} />
         </div>
      </Section>

      <Section title="Open House Date(s) & Time(s)" icon={CalendarDays} stepId="openHouseDates" onEdit={onEdit}>
         {formData.openHouseDates && formData.openHouseDates.length > 0 ? (
           formData.openHouseDates.map((entry, index) => (
             <div key={entry.id || index} className="border-b border-white/10 pb-2 last:border-b-0">
               <p className="text-white/90">
                 {formatDate(entry.date)} from {formatTime(entry.startTime)} to {formatTime(entry.endTime)}
               </p>
             </div>
           ))
         ) : (
           <p className="text-white/70 italic">No dates provided.</p>
         )}
       </Section>
 
       <Section title="Photos & Media" icon={Camera} stepId="photosMedia" onEdit={onEdit}>
          <InfoPair label="Number of Photos Uploaded" value={formData.photosMedia?.uploads?.length ?? 0} />
          {/* Display Thumbnails */}
          {formData.photosMedia?.uploads && formData.photosMedia.uploads.length > 0 && (
             <div className="mt-2">
               <p className="text-sm text-white/60 mb-2">Uploaded Photos (Order reflects ranking):</p>
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                 {formData.photosMedia.uploads.map((upload: PhotoUploadInfo, index: number) => (
                   <div key={upload.id} className="relative aspect-square border border-white/10 rounded-lg overflow-hidden group">
                      <img
                        src={upload.s3Url}
                        alt={`Uploaded photo ${index + 1}`}
                        className="w-full h-full object-cover bg-gray-700"
                        onError={(e) => { console.error(`Error loading image source: ${e.currentTarget.src}`); }}
                      />
                      {/* Order Badge */}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-500/90 rounded-full text-white text-[10px] font-medium z-10">
                        {index + 1}
                      </div>
                      {/* Optional: Link overlay on hover */}
                      <a
                         href={upload.s3Url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20"
                         title="View full size"
                      >
                         <ExternalLink className="w-5 h-5 text-white" /> {/* Assuming ExternalLink icon exists */}
                      </a>
                   </div>
                 ))}
               </div>
             </div>
           )}
          <InfoPair label="Virtual Tour URL" value={formData.photosMedia?.virtualTourUrl} />
          <InfoPair label="Video URL" value={formData.photosMedia?.videoUrl} />
       </Section>


      {/* Submission Button */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full mt-8 py-3 px-6 bg-green-600/90 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Confirm & Submit Open House Request' // Adjusted text
        )}
      </button>

      {/* Display submission errors here */}
      {submissionStatus === 'error' && (
        <p className="text-red-400 text-center mt-4">{submissionMessage}</p>
      )}
    </div>
  );
};

export default OpenHouseReviewStep;