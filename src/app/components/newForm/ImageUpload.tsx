// File: components/ImageUpload.tsx
"use client";
import { useState } from "react";

type Props = {
  onImageChange: (file: File | null, previewUrl: string | null) => void;
};

export default function ImageUpload({ onImageChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file, url);
    } else {
      setPreviewUrl(null);
      onImageChange(null, null);
    }
  };

  return (
    <section>
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Upload Image (optional)
      </label>
      <div className="flex flex-col items-start space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full
                     file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        {previewUrl && (
          <div className="mt-2 w-full border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full object-cover max-h-60"
            />
          </div>
        )}
      </div>
    </section>
  );
}
