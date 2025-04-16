import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotosStepProps {
  value: File[];
  onChange: (value: File[]) => void;
  onNext: () => void;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ value, onChange, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    onChange([...value, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">Upload Photos</h2>
      <p className="text-white/60">Add high-quality photos of your property (minimum 3 photos)</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {value.map((file, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={URL.createObjectURL(file)}
              alt={`Property photo ${index + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full 
                       hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
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

      {value.length >= 3 && (
        <button
          onClick={onNext}
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default PhotosStep;