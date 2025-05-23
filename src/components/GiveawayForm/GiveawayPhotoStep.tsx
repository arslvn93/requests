import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ImagePlus, UploadCloud, Trash2, Loader2, AlertCircle } from 'lucide-react'; // Updated icons
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { StepProps } from '../../forms/form-types';
import { GiveawayFormData, GiveawayPhotoInfo } from '../../forms/giveaway.config'; // Import new type

// Extend StepProps with the specific data type and new props
interface GiveawayPhotoStepProps extends StepProps<GiveawayPhotoInfo | null, GiveawayFormData> {
  giveawayId: string | null; // Receive giveawayId
  onGiveawayIdChange: (id: string) => void; // To update giveawayId in parent state
}

// --- S3 Client Configuration ---
// Ensure environment variables are set: VITE_AWS_REGION, VITE_AWS_ACCESS_KEY_ID, VITE_AWS_SECRET_ACCESS_KEY, VITE_S3_BUCKET
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = import.meta.env.VITE_S3_BUCKET;
const awsRegion = import.meta.env.VITE_AWS_REGION;
// --- End S3 Client Configuration ---

const GiveawayPhotoStep: React.FC<GiveawayPhotoStepProps> = ({
  value, // Now GiveawayPhotoInfo | null
  onChange,
  onNext,
  onValidationChange,
  giveawayId,
  onGiveawayIdChange,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- S3 Delete Logic ---
  const deletePhotoFromS3 = async (s3Key: string) => {
    if (!s3Key) return;
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });
      console.log(`Attempting to delete ${s3Key} from S3...`);
      await s3Client.send(command);
      console.log(`Successfully deleted ${s3Key} from S3.`);
    } catch (error) {
      console.error(`Failed to delete ${s3Key} from S3:`, error);
      // Optionally notify user, but proceed with UI update
    }
  };
  // --- End S3 Delete Logic ---

  // --- S3 Upload Logic ---
  const uploadPhoto = async (file: File, currentGiveawayId: string, oldS3Key?: string) => {
    setIsUploading(true);
    setUploadError(null);

    const photoId = uuidv4(); // Unique ID for this photo instance
    const sanitizedFilename = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const key = `giveaways/${currentGiveawayId}/${photoId}-${sanitizedFilename}`;

    try {
      const fileBuffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type,
        ACL: 'public-read' as const,
      });

      await s3Client.send(command);
      const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;

      // Update parent state with the new photo info
      const newPhotoInfo: GiveawayPhotoInfo = { id: photoId, s3Key: key, s3Url: url };
      onChange(newPhotoInfo);

      // Delete the old photo *after* the new one is successfully uploaded
      if (oldS3Key) {
        await deletePhotoFromS3(oldS3Key);
      }

    } catch (error: any) {
      console.error(`Failed to upload ${key}:`, error);
      setUploadError(error.message || 'Upload failed. Please try again.');
      onChange(null); // Clear the value on error if needed, or keep old value? Clearing for now.
    } finally {
      setIsUploading(false);
    }
  };
  // --- End S3 Upload Logic ---

  // --- Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    const oldS3Key = value?.s3Key; // Store key of photo being replaced

    let currentGiveawayId = giveawayId;
    // Generate giveawayId if it doesn't exist yet
    if (!currentGiveawayId) {
      currentGiveawayId = uuidv4();
      onGiveawayIdChange(currentGiveawayId); // Update parent state
    }

    uploadPhoto(file, currentGiveawayId, oldS3Key);

    // Clear the file input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!value || isUploading) return;
    const keyToDelete = value.s3Key;
    onChange(null); // Optimistically remove from UI
    await deletePhotoFromS3(keyToDelete); // Delete from S3
  };

  // Trigger hidden file input click
  const handleTriggerUpload = () => {
    if (isUploading) return; // Don't allow triggering while upload is in progress
    fileInputRef.current?.click();
  };

  // --- Validation ---
  // Step is optional, so always valid for navigation.
  // We only disable Next button during upload.
  const isValid = useCallback(() => true, []);

  // Effect to notify parent component of validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [isValid, onValidationChange]);

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUploading) { // Prevent submission during upload
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ImagePlus className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Giveaway Theme Photo</h2>
          <p className="text-white/60">Upload a relevant photo (optional).</p>
          {/* Display Upload Error */}
          {uploadError && (
             <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                 <AlertCircle className="w-4 h-4" /> {uploadError}
             </p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question: File Upload */}
        <div className="space-y-3">
          <p className="text-white/90">Please upload a relevant photo related to your giveaway theme.</p>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif, image/webp" // Specify acceptable image types
            className="hidden"
            id="giveawayPhotoUpload"
            disabled={isUploading}
          />

          {/* Upload Area / Display Area */}
          <div className="w-full aspect-video glass-card border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-center relative overflow-hidden group">
            {isUploading ? (
              <div className="flex flex-col items-center text-blue-300 animate-pulse">
                <Loader2 className="w-12 h-12 animate-spin mb-3" />
                <p className="text-white/90 font-medium">Uploading...</p>
              </div>
            ) : value?.s3Url ? (
              <>
                <img
                  src={value.s3Url}
                  alt="Giveaway theme photo"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    setUploadError("Failed to load uploaded image preview.");
                    onChange(null); // Clear value if image fails to load
                  }}
                />
                {/* Overlay for Change/Remove */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                   <button
                     type="button"
                     onClick={handleTriggerUpload}
                     className="p-3 bg-blue-500/80 rounded-full text-white hover:bg-blue-500 transition-colors backdrop-blur-sm"
                     title="Change Photo"
                   >
                     <UploadCloud className="w-6 h-6" />
                   </button>
                   <button
                     type="button"
                     onClick={handleRemovePhoto}
                     className="p-3 bg-red-600/80 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                     title="Remove Photo"
                   >
                     <Trash2 className="w-6 h-6" />
                   </button>
                </div>
              </>
            ) : (
              // Empty State / Upload Trigger
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="w-full h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors duration-200"
              >
                <UploadCloud className="w-12 h-12 text-blue-400 mb-3" />
                <p className="text-white/90 font-medium">Click to Upload Photo</p>
                <p className="text-xs text-white/50 mt-1">PNG, JPG, GIF, WEBP accepted</p>
              </button>
            )}
          </div>
           <p className="text-sm text-white/50">Example: If it's Halloween-themed, include a fun photo of yourself related to it.</p>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          disabled={isUploading} // Disable button during upload
          className="w-full mt-6 py-3 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-button-focus disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default GiveawayPhotoStep;