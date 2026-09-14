import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { portfolioService } from '../../lib/portfolioService';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket: 'avatars' | 'projects';
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  bucket,
  label = 'Gambar',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [inputUrl, setInputUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP, dll.)');
      return;
    }

    setIsUploading(true);
    try {
      const url = await portfolioService.uploadImage(file, bucket);
      onChange(url);
      setInputUrl(url);
    } catch (err: any) {
      alert('Gagal mengunggah gambar: ' + (err.message || 'Error tidak diketahui'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
      setUrlMode(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setUrlMode(!urlMode)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          {urlMode ? <UploadCloud className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
          {urlMode ? 'Gunakan Upload File' : 'Gunakan URL Eksternal'}
        </button>
      </div>

      {urlMode ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... atau URL gambar"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Gunakan
            </button>
          </div>
          <p className="text-2xs text-slate-500">
            Mendukung link langsung gambar atau file publik.
          </p>
        </div>
      ) : (
        <div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            {isUploading ? (
              <div className="py-4 flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-600 font-medium">
                  Mengunggah gambar...
                </span>
              </div>
            ) : value ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                  <img
                    src={value}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('');
                      setInputUrl('');
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs"
                    title="Hapus gambar"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800">
                    Gambar Terpilih
                  </p>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Klik atau tarik file baru ke sini untuk mengganti
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Klik untuk memilih file <span className="text-slate-400">atau drag & drop</span>
                </p>
                <p className="text-2xs text-slate-400 mt-1">
                  Format PNG, JPG, GIF atau WebP (Maks 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
