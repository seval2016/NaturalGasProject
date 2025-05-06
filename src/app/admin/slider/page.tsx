'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const [newSlide, setNewSlide] = useState({
    image: '',
    title: '',
    description: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
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
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan büyük olamaz');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        setError('Sadece görsel dosyaları yükleyebilirsiniz');
        return;
      }

      // Önizleme oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFile(file);
      if (e.target.files?.[0]) {
        setTitle(e.target.files[0].name);
        setDescription(e.target.files[0].name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Lütfen bir resim seçin');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await fetch('/api/admin/slider', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'Slider eklenemedi');
      }

      setSuccess('Slider başarıyla eklendi');
      setTitle('');
      setDescription('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Slider eklenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu slider öğesini silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/slider?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Slider silinemedi');
      fetchSlides();
    } catch (err) {
      setError('Slider silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Slider Yönetimi</h1>
        
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}
        
        {/* Yeni Slider Ekleme Formu */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Yeni Slider Ekle</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                        setNewSlide({ ...newSlide, image: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
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
                      className="hidden"
                      id="image-upload"
                      ref={fileInputRef}
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                    >
                      Görsel Seç
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      Maksimum dosya boyutu: 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Slider Ekle
              </button>
            </div>
          </div>
        </form>

        {/* Mevcut Slider Listesi */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Mevcut Sliderlar</h2>

          <div className="divide-y">
            {slides.map((slide) => (
              <div key={slide.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-20 w-32 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{slide.title}</h3>
                    <p className="text-sm text-gray-500">{slide.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 