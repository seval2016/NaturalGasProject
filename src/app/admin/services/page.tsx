'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaFaucet, FaFireAlt, FaBath, FaProjectDiagram, FaGasPump, FaHome, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
}

// İkon seçenekleri
const iconOptions = [
  { value: 'FaFaucet', label: 'Su Tesisatı', icon: <FaFaucet className="w-5 h-5" /> },
  { value: 'FaFireAlt', label: 'Kalorifer Tesisatı', icon: <FaFireAlt className="w-5 h-5" /> },
  { value: 'FaGasPump', label: 'Doğalgaz Tesisatı', icon: <FaGasPump className="w-5 h-5" /> },
  { value: 'FaProjectDiagram', label: 'Doğalgaz Proje', icon: <FaProjectDiagram className="w-5 h-5" /> },
  { value: 'FaBath', label: 'Banyo Tadilat', icon: <FaBath className="w-5 h-5" /> },
  { value: 'FaHome', label: 'Yerden Isıtma', icon: <FaHome className="w-5 h-5" /> },
];

// İkon bileşenlerini oluşturan fonksiyon
const getIconComponent = (iconName: string) => {
  const IconComponent = {
    FaFaucet,
    FaFireAlt,
    FaBath,
    FaProjectDiagram,
    FaGasPump,
    FaHome,
  }[iconName];

  return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
};

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
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(false);
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
    setShowForm(true);
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
    <div className="space-y-6">
      <div id="services" className="flex justify-end items-center">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="text-sm font-medium inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Yeni Hizmet Ekle
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}
      
      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold">
              {isUpdateMode ? 'Hizmeti Güncelle' : 'Yeni Hizmet Ekle'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hizmet başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İkon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {iconOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setIcon(option.value)}
                        className={`flex items-center space-x-2 px-3 py-2 border rounded-md transition-colors ${
                          icon === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {option.icon}
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
                placeholder="Hizmet açıklaması"
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
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleUpdate(service)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                {getIconComponent(service.icon)}
                <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 