import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon, Video, Star } from 'lucide-react';

interface PhotosMediaInfo {
  photos: File[];
  featuredPhotoIndex: number;
  virtualTourUrl?: string;
  videoUrl?: string;
}

interface PhotosMediaStepProps {
  value: PhotosMediaInfo;
  onChange: (value: PhotosMediaInfo) => void;
  onNext: () => void;
}

const PhotosMediaStep: React.FC<PhotosMediaStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    onChange({ ...value, photos: [...value.photos, ...validFiles] });
  };

  const removePhoto = (index: number) => {
    const newPhotos = value.photos.filter((_, i) => i !== index);
    const newFeaturedIndex = value.featuredPhotoIndex >= newPhotos.length ? 0 : value.featuredPhotoIndex;
    onChange({ ...value, photos: newPhotos, featuredPhotoIndex: newFeaturedIndex });
  };

  const setFeaturedPhoto = (index: number) => {
    onChange({ ...value, featuredPhotoIndex: index });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPhotos = [...value.photos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    let newFeaturedIndex = value.featuredPhotoIndex;
    if (value.featuredPhotoIndex === draggedIndex) {
      newFeaturedIndex = index;
    } else if (
      (draggedIndex < value.featuredPhotoIndex && index >= value.featuredPhotoIndex) ||
      (draggedIndex > value.featuredPhotoIndex && index <= value.featuredPhotoIndex)
    ) {
      newFeaturedIndex = value.featuredPhotoIndex + (draggedIndex < index ? -1 : 1);
    }

    onChange({ ...value, photos: newPhotos, featuredPhotoIndex: newFeaturedIndex });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const isValid = () => {
    return value.photos.length >= 3;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Photos & Media</h2>
          <p className="text-white/60">Upload photos and add media links (minimum 3 photos)</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {value.photos.map((file, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square group cursor-move
                ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Property photo ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                           transition-opacity rounded-xl flex items-center justify-center gap-2">
                <button
                  onClick={() => setFeaturedPhoto(index)}
                  className={`p-2 rounded-full transition-colors
                    ${index === value.featuredPhotoIndex 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-black/50 text-white/90 hover:bg-black/70'}`}
                >
                  <Star className="w-5 h-5" />
                </button>
                <button
                  onClick={() => removePhoto(index)}
                  className="p-2 bg-black/50 rounded-full text-white/90 hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {index === value.featuredPhotoIndex && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 rounded-full 
                             text-white text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
          ))}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square glass-card flex flex-col items-center justify-center gap-3"
          >
            <Upload className="w-8 h-8 text-blue-400" />
            <span className="text-white/90 text-sm">Add Photos</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-3">
          <p className="text-white/90">Virtual Tour URL (optional)</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'virtualTour' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <ImageIcon className="w-6 h-6 text-blue-400" />
            <input
              type="url"
              value={value.virtualTourUrl || ''}
              onChange={(e) => onChange({ ...value, virtualTourUrl: e.target.value })}
              onFocus={() => setFocusedField('virtualTour')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter virtual tour URL"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/90">Property Video URL (optional)</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'video' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Video className="w-6 h-6 text-blue-400" />
            <input
              type="url"
              value={value.videoUrl || ''}
              onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
              onFocus={() => setFocusedField('video')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        {isValid() && (
          <button
            onClick={onNext}
            className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500
                     text-white font-medium rounded-xl transition-all duration-200
                     hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Next: Review Listing
          </button>
        )}
      </div>
    </div>
  );
};

export default PhotosMediaStep;