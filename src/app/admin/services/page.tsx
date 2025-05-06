'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaFaucet, FaFireAlt, FaBath, FaProjectDiagram, FaGasPump } from 'react-icons/fa';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
}

const iconOptions = [
  { value: 'FaFaucet', label: 'Musluk', icon: <FaFaucet /> },
  { value: 'FaFireAlt', label: 'Ateş', icon: <FaFireAlt /> },
  { value: 'FaBath', label: 'Banyo', icon: <FaBath /> },
  { value: 'FaProjectDiagram', label: 'Proje', icon: <FaProjectDiagram /> },
  { value: 'FaGasPump', label: 'Doğalgaz', icon: <FaGasPump /> },
];

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchServices();
    }
  }, [status, router]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (!response.ok) throw new Error('Hizmet verileri alınamadı');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError('Hizmet verileri yüklenirken bir hata oluştu');
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
    setIcon('');
    setFile(null);
    setPreviewImage(null);
    setIsUpdateMode(false);
    setSelectedService(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !icon) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('title', title);
    formData.append('description', description);
    formData.append('icon', icon);

    try {
      const url = isUpdateMode 
        ? `/api/admin/services?id=${selectedService?.id}`
        : '/api/admin/services';
      
      const response = await fetch(url, {
        method: isUpdateMode ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'İşlem başarısız');
      }

      setSuccess(isUpdateMode ? 'Hizmet başarıyla güncellendi' : 'Hizmet başarıyla eklendi');
      resetForm();
      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleUpdate = (service: Service) => {
    setSelectedService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon);
    setPreviewImage(service.image);
    setIsUpdateMode(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Hizmet silinemedi');
      setSuccess('Hizmet başarıyla silindi');
      fetchServices();
    } catch (err) {
      setError('Hizmet silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hizmet Yönetimi</h1>
        
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isUpdateMode ? 'Hizmeti Güncelle' : 'Yeni Hizmet Ekle'}
          </h2>
          
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
                        setFile(null);
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
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                İkon
              </label>
              <select
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">İkon Seçin</option>
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isUpdateMode ? 'Güncelle' : 'Ekle'}
              </button>
              {isUpdateMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İptal
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Mevcut Hizmetler</h2>

          <div className="divide-y">
            {services.map((service) => (
              <div key={service.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-20 w-32 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(service)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 