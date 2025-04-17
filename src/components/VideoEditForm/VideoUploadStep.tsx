import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UploadCloud, Trash2, Loader2, AlertCircle, FileText } from 'lucide-react'; // Use relevant icons
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { StepProps } from '../../forms/form-types';
// Import types from the correct config file
import { VideoEditRequestFormData, VideoUploadInfo } from '../../forms/video-edit-request.config';

// Extend StepProps with the specific data type and new props
interface VideoUploadStepProps extends StepProps<VideoUploadInfo | null, VideoEditRequestFormData> {
  videoEditRequestId: string | null; // Receive request ID
  onVideoEditRequestIdChange: (id: string) => void; // To update request ID in parent state
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

const VideoUploadStep: React.FC<VideoUploadStepProps> = ({
  value, // Now VideoUploadInfo | null
  onChange,
  onNext,
  onValidationChange,
  videoEditRequestId,
  onVideoEditRequestIdChange,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- S3 Delete Logic ---
  const deleteVideoFromS3 = async (s3Key: string) => {
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
  const uploadVideo = async (file: File, currentRequestId: string, oldS3Key?: string) => {
    setIsUploading(true);
    setUploadError(null);

    const videoId = uuidv4(); // Unique ID for this video instance
    const sanitizedFilename = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    // Use the new S3 path structure
    const key = `video-edits/${currentRequestId}/${videoId}-${sanitizedFilename}`;

    try {
      const fileBuffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type || 'application/octet-stream', // Provide a default content type
        ACL: 'public-read' as const, // Or adjust ACL as needed
      });

      await s3Client.send(command);
      const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;

      // Update parent state with the new video info, including original filename
      const newVideoInfo: VideoUploadInfo = {
        id: videoId,
        s3Key: key,
        s3Url: url,
        originalFilename: file.name // Store original filename
      };
      onChange(newVideoInfo);

      // Delete the old video *after* the new one is successfully uploaded
      if (oldS3Key) {
        await deleteVideoFromS3(oldS3Key);
      }

    } catch (error: any) {
      console.error(`Failed to upload ${key}:`, error);
      setUploadError(error.message || 'Upload failed. Please try again.');
      onChange(null); // Clear the value on error
    } finally {
      setIsUploading(false);
    }
  };
  // --- End S3 Upload Logic ---

  // --- Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      // No file selected or selection cancelled
      return;
    }

    // Removed file type check to allow any file

    const oldS3Key = value?.s3Key; // Store key of video being replaced

    let currentRequestId = videoEditRequestId;
    // Generate request ID if it doesn't exist yet
    if (!currentRequestId) {
      currentRequestId = uuidv4();
      onVideoEditRequestIdChange(currentRequestId); // Update parent state
    }

    uploadVideo(file, currentRequestId, oldS3Key);

    // Clear the file input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = async () => {
    if (!value || isUploading) return;
    const keyToDelete = value.s3Key;
    onChange(null); // Optimistically remove from UI
    await deleteVideoFromS3(keyToDelete); // Delete from S3
  };

  // Trigger hidden file input click
  const handleTriggerUpload = () => {
    if (isUploading) return; // Don't allow triggering while upload is in progress
    fileInputRef.current?.click();
  };

  // --- Validation ---
  // Step is required, so check if value exists and not uploading
  const isValid = useCallback(() => !!value && !isUploading, [value, isUploading]);

  // Effect to notify parent component of validation status
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, isUploading, isValid, onValidationChange]); // Added isUploading dependency

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) { // Only proceed if valid
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UploadCloud className="w-8 h-8 text-blue-400" /> {/* Changed Icon */}
        <div>
          <h2 className="text-2xl font-bold text-white/90">Upload Video File</h2> {/* Changed Title */}
          <p className="text-white/60">Upload the video file you need edited.</p> {/* Changed Subtitle */}
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
          <p className="text-white/90">Please upload the video file.</p>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            // Removed accept attribute to allow any file type
            className="hidden"
            id="videoFileUpload"
            disabled={isUploading}
          />

          {/* Upload Area / Display Area */}
          <div className="w-full min-h-[150px] glass-card border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-center relative group p-4">
            {isUploading ? (
              <div className="flex flex-col items-center text-blue-300 animate-pulse">
                <Loader2 className="w-12 h-12 animate-spin mb-3" />
                <p className="text-white/90 font-medium">Uploading...</p>
              </div>
            ) : value?.s3Url ? (
              // Display Filename and Controls when uploaded
              <div className="flex flex-col items-center gap-3 w-full">
                 <FileText className="w-10 h-10 text-blue-400 mb-2" />
                 <p className="text-white/90 font-medium">File Selected:</p>
                 <p className="text-sm text-blue-300 break-all max-w-full truncate" title={value.originalFilename}>
                    {value.originalFilename}
                 </p>
                 <div className="flex items-center justify-center gap-4 mt-3">
                   <button
                     type="button"
                     onClick={handleTriggerUpload}
                     className="p-2 bg-blue-500/80 rounded-full text-white hover:bg-blue-500 transition-colors backdrop-blur-sm"
                     title="Replace File"
                   >
                     <UploadCloud className="w-5 h-5" />
                   </button>
                   <button
                     type="button"
                     onClick={handleRemoveVideo}
                     className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                     title="Remove File"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
              </div>
            ) : (
              // Empty State / Upload Trigger
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="w-full h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors duration-200"
              >
                <UploadCloud className="w-12 h-12 text-blue-400 mb-3" />
                <p className="text-white/90 font-medium">Click to Upload Video</p>
                <p className="text-xs text-white/50 mt-1">Any video file format accepted</p>
              </button>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          disabled={!isValid()} // Disable button if not valid (no file or uploading)
          className="w-full mt-6 py-3 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-button-focus disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default VideoUploadStep;