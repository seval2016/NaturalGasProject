'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

export default function SliderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchSlides();
    }
  }, [status, router]);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/slider');
      if (!response.ok) throw new Error('Slider verileri alınamadı');
      const data = await response.json();
      setSlides(data);
    } catch (err) {
      setError('Slider verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan büyük olamaz');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Sadece görsel dosyaları yükleyebilirsiniz');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFile(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setPreviewImage(null);
    setIsUpdateMode(false);
    setSelectedSlide(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('title', title);
    formData.append('description', description);

    try {
      const url = isUpdateMode 
        ? `/api/admin/slider?id=${selectedSlide?.id}`
        : '/api/admin/slider';
      
      const response = await fetch(url, {
        method: isUpdateMode ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'İşlem başarısız');
      }

      setSuccess(isUpdateMode ? 'Slider başarıyla güncellendi' : 'Slider başarıyla eklendi');
      resetForm();
      fetchSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleUpdate = (slide: Slide) => {
    setSelectedSlide(slide);
    setTitle(slide.title);
    setDescription(slide.description);
    setPreviewImage(slide.image);
    setIsUpdateMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu slider öğesini silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/slider?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Slider silinemedi');
      setSuccess('Slider başarıyla silindi');
      fetchSlides();
    } catch (err) {
      setError('Slider silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div id="slider" className="flex justify-end items-center">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="text-sm font-medium inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Yeni Slider Ekle 
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}
      
      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-48 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <FaPlus className="mr-2" />
                      Görsel Seç
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Slider başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Slider açıklaması"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isUpdateMode ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleUpdate(slide)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{slide.title}</h3>
              <p className="text-gray-600 text-sm">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 