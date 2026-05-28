import React, { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadToCloudinary } from "../../lib/cloudinary";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUploadInput({ value, onChange, label = "Upload Image", placeholder = "Choose an image..." }: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      const url = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });
      onChange(url);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {value ? (
            <img src={value} alt="Preview" className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl border border-white/10 shrink-0" />
          ) : (
             <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-xl border border-white/10 border-dashed flex items-center justify-center bg-black/20">
               <span className="text-[10px] text-white/30 text-center">No Img</span>
             </div>
          )}
          <div className="flex-1 relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
              id={`image-upload-${label.replace(/\s+/g, '-')}`} 
              disabled={uploading} 
            />
            <label 
              htmlFor={`image-upload-${label.replace(/\s+/g, '-')}`} 
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors text-sm font-medium ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4 text-primary" />}
              {uploading ? `Uploading... ${uploadProgress}%` : label}
            </label>
          </div>
        </div>
        {uploading && (
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mx-1">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
