'use client';

import { useState, useRef } from 'react';

interface Image {
  id: number;
  url: string;
  name: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    setUploadMessage(null);

    // Burada gerçek bir API çağrısı yapılacak
    // Şimdilik sadece simüle ediyoruz
    setTimeout(() => {
      const newImage: Image = {
        id: Date.now(),
        url: previewUrl || '',
        name: fileInputRef.current?.files?.[0]?.name || 'Görsel',
      };

      setImages([...images, newImage]);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsUploading(false);
      setUploadMessage('Görsel başarıyla yüklendi!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Görsel Yükle</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Görsel Seç
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>

          {previewUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Önizleme
              </label>
              <img
                src={previewUrl}
                alt="Önizleme"
                className="max-w-full h-auto rounded-lg shadow"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || !previewUrl}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Yükleniyor...' : 'Yükle'}
          </button>

          {uploadMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              {uploadMessage}
            </div>
          )}
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Yüklenen Görseller</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-600 truncate">{image.name}</p>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              Henüz görsel yüklenmemiş
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 