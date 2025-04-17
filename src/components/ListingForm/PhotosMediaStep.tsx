import React, { useState, useRef, useCallback, useEffect } from 'react'; // Import useEffect
import { Camera, Upload, X, Image as ImageIcon, Video, GripVertical, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'; // Updated import path

// Import the simplified PhotoUploadInfo from ListingForm
import { PhotoUploadInfo } from '../../pages/ListingForm';

// Define the data structure this component manages (matching ListingForm state)
interface PhotosMediaData {
  uploads: PhotoUploadInfo[]; // Array order represents user ranking
  virtualTourUrl?: string;
  videoUrl?: string;
}

interface PhotosMediaStepProps {
  value: PhotosMediaData;
  listingId: string | null; // Receive listingId
  onChange: (value: PhotosMediaData) => void; // To update photosMedia part of state
  onListingIdChange: (id: string) => void; // To update listingId in parent state
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void; // Add prop for validation status
}

// --- S3 Client Configuration ---
// Ideally, initialize once and pass via context or props. Duplicating for now.
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

const PhotosMediaStep: React.FC<PhotosMediaStepProps> = ({
  value,
  listingId,
  onChange,
  onListingIdChange,
  onNext,
  onValidationChange // Destructure new prop
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set()); // Track files currently uploading by a temporary ID
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({}); // Track errors by temporary ID
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MIN_PHOTOS = 4;

  // --- S3 Upload Logic ---
  const uploadPhoto = async (file: File, tempId: string, currentListingId: string) => {
    setUploadingFiles(prev => new Set(prev).add(tempId));
    setUploadErrors(prev => {
      const next = { ...prev };
      delete next[tempId];
      return next;
    });

    const photoId = uuidv4(); // Unique ID for this photo instance
    const sanitizedFilename = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const key = `listings/${currentListingId}/${photoId}-${sanitizedFilename}`;

    try {
      const fileBuffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type,
        ACL: 'public-read' as const,
      });

      // console.log(`Attempting S3 upload for key: ${key}`); // Removed log
      await s3Client.send(command);
      const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
      // console.log(`Successfully uploaded ${key} to ${url}`); // Removed log

      // Add the successfully uploaded photo to the parent state
      const newUpload: PhotoUploadInfo = { id: photoId, s3Key: key, s3Url: url };
      onChange({
        ...value,
        uploads: [...value.uploads, newUpload], // Add to the end
      });

    } catch (error: any) {
      console.error(`Failed to upload ${key}:`, error);
      setUploadErrors(prev => ({ ...prev, [tempId]: error.message || 'Upload failed' }));
    } finally {
      setUploadingFiles(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }
  };
  // --- End S3 Upload Logic ---

  // --- S3 Delete Logic ---
  const deletePhotoFromS3 = async (s3Key: string) => {
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
      // Handle error appropriately (e.g., notify user)
      // For now, we'll proceed with removing from UI even if S3 delete fails
    }
  };
  // --- End S3 Delete Logic ---


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));

    if (validFiles.length === 0) return;

    let currentListingId = listingId;
    // Generate listingId if it doesn't exist yet
    if (!currentListingId) {
      currentListingId = uuidv4();
      onListingIdChange(currentListingId); // Update parent state
    }

    // Trigger uploads for the newly added photos
    validFiles.forEach(file => {
      const tempId = uuidv4(); // Temporary ID for tracking upload progress/errors
      uploadPhoto(file, tempId, currentListingId as string);
    });

     // Clear the file input value
     if (fileInputRef.current) {
        fileInputRef.current.value = '';
     }
  };

  const removePhoto = async (idToRemove: string) => {
    const photoToRemove = value.uploads.find(p => p.id === idToRemove);
    if (!photoToRemove) return;

    // First, attempt to delete from S3
    await deletePhotoFromS3(photoToRemove.s3Key);

    // Then, remove from the state
    const newUploads = value.uploads.filter(p => p.id !== idToRemove);
    onChange({ ...value, uploads: newUploads });
  };

  // --- Drag and Drop Logic ---
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Reorder the uploads array
    const items = Array.from(value.uploads);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Update the state in the parent component
    onChange({ ...value, uploads: items });
  };
  // --- End Drag and Drop Logic ---

  const isValid = () => {
    // Check if minimum photos are uploaded and no uploads are currently in progress
    return value.uploads.length >= MIN_PHOTOS && uploadingFiles.size === 0;
  };

  // Effect to notify parent component (ListingForm) about validation status changes
  useEffect(() => {
    onValidationChange(isValid());
  }, [value.uploads, uploadingFiles, onValidationChange]); // Re-run when uploads or uploading status changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Photos & Media</h2>
          <p className="text-white/60">Upload and arrange photos (minimum {MIN_PHOTOS}). Drag to reorder (1st is best).</p>
          {uploadingFiles.size > 0 && (
            <p className="text-yellow-400 text-sm flex items-center gap-1 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploadingFiles.size} photo(s) uploading...
            </p>
          )}
          {Object.keys(uploadErrors).length > 0 && (
             <div className="mt-2 text-red-400 text-sm space-y-1">
                {Object.entries(uploadErrors).map(([tempId, errorMsg]) => (
                    <p key={tempId} className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Upload Error: {errorMsg}
                    </p>
                ))}
             </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Area */}
        <div className="space-y-3">
          <p className="text-white/90">Arrange Photos (Drag & Drop)</p>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="photos" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4" // Adjust grid layout as needed
                >
                  {value.uploads.map((photoInfo, index) => (
                    <Draggable key={photoInfo.id} draggableId={photoInfo.id} index={index}>
                      {(providedDraggable, snapshot) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          className={`relative aspect-square group border rounded-xl overflow-hidden transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg border-blue-400 ring-2 ring-blue-400' : 'border-white/10'
                          }`}
                        >
                          <img
                            src={photoInfo.s3Url}
                            alt={`Uploaded photo ${index + 1}`}
                            className="w-full h-full object-cover bg-gray-700" // Added bg for loading phase
                            onError={(e) => { console.error(`Error loading image source: ${e.currentTarget.src}`); }}
                          />

                          {/* Order Badge */}
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500/90 rounded-full text-white text-xs font-medium backdrop-blur-sm z-10">
                            {index + 1}
                          </div>

                          {/* Drag Handle & Remove Button Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end justify-between p-2 z-20">
                             {/* Drag Handle */}
                             <div
                                {...providedDraggable.dragHandleProps}
                                title="Drag to reorder"
                                className="p-2 rounded-full bg-black/50 text-white/90 hover:bg-black/70 cursor-grab active:cursor-grabbing transition-colors backdrop-blur-sm"
                             >
                               <GripVertical className="w-4 h-4" />
                             </div>
                             {/* Remove Button */}
                             <button
                               type="button"
                               onClick={() => removePhoto(photoInfo.id)}
                               title="Remove Photo"
                               className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                               disabled={uploadingFiles.size > 0} // Disable remove while uploads are active
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFiles.size > 0} // Disable adding more while uploads are in progress
                    className="aspect-square glass-card flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-400/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-blue-400" />
                    <span className="text-white/90 text-sm">Add Photos</span>
                  </button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          // multiple // Removed to allow only single file selection
          onChange={handleFileChange}
          className="hidden"
          disabled={uploadingFiles.size > 0} // Also disable input itself
        />

        {/* Virtual Tour URL */}
        <div className="space-y-3">
          <p className="text-white/90">Virtual Tour URL (optional)</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'virtualTour' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <ImageIcon className="w-6 h-6 text-blue-400" />
            <input
              type="url"
              id="virtualTourUrl"
              name="virtualTourUrl"
              value={value.virtualTourUrl || ''}
              onChange={(e) => onChange({ ...value, virtualTourUrl: e.target.value })}
              onFocus={() => setFocusedField('virtualTour')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter virtual tour URL"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        {/* Video URL */}
        <div className="space-y-3">
          <p className="text-white/90">Property Video URL (optional)</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'video' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Video className="w-6 h-6 text-blue-400" />
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={value.videoUrl || ''}
              onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
              onFocus={() => setFocusedField('video')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          type="submit"
          disabled={!isValid()}
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed
                   hidden md:block" // Hide on mobile, show on desktop
        >
          {/* Keep dynamic text for desktop, but simplify */}
          {uploadingFiles.size > 0 ? 'Waiting for uploads...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default PhotosMediaStep;