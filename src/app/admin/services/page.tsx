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
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-end items-center mb-6">
        
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            {showForm ? 'Formu Kapat' : 'Yeni Hizmet Ekle'}
          </button>
        </div>
        
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
        
        {showForm && (
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
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
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
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-md transition-colors"
                      >
                        Görsel Seç
                      </label>
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
                  required
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İkon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setIcon(option.value)}
                      className={`flex items-center p-3 border rounded-md ${
                        icon === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      <span className="mr-2">{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isUpdateMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    İptal
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  {isUpdateMode ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Görsel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İkon
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getIconComponent(service.icon)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdate(service)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Düzenle"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Sil"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 