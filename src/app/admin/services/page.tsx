'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaFaucet, FaFireAlt, FaBath, FaProjectDiagram, FaGasPump, FaHome, FaEdit, FaTrash, FaPlus, FaUpload, FaTimes, FaWrench, FaTools, FaCog, FaHammer, FaTruck, FaTachometerAlt } from 'react-icons/fa';
import styles from '@/styles/admin/services.module.css';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

interface IconOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const iconOptions: IconOption[] = [
  { value: 'fa-faucet', label: 'Su Tesisatı', icon: FaFaucet },
  { value: 'fa-fire-alt', label: 'Kalorifer Tesisatı', icon: FaFireAlt },
  { value: 'fa-gas-pump', label: 'Doğalgaz Tesisatı', icon: FaGasPump },
  { value: 'fa-home', label: 'Yerden Isıtma', icon: FaHome },
  { value: 'fa-bath', label: 'Banyo Tadilat', icon: FaBath },
  { value: 'fa-project-diagram', label: 'Doğalgaz Proje', icon: FaProjectDiagram },
];

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });

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

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingService(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.icon) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (!editingService && !selectedFile) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    const formDataToSend = new FormData();
    if (selectedFile) {
      formDataToSend.append('file', selectedFile);
    }
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('icon', formData.icon);

    try {
      const url = editingService 
        ? `/api/admin/services?id=${editingService.id}`
        : '/api/admin/services';
      
      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'İşlem başarısız');
      }

      setSuccess(editingService ? 'Hizmet başarıyla güncellendi' : 'Hizmet başarıyla eklendi');
      resetForm();
      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
    setPreviewUrl(service.image);
    setIsFormOpen(true);
  };

  const handleDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`/api/admin/services?id=${serviceToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Silme işlemi başarısız oldu');

      await fetchServices();
      setShowDeleteDialog(false);
      setServiceToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className={styles.addButton}
            >
              <FaPlus className={styles.addIcon} />
              Yeni Hizmet
            </button>
          </div>

          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}
          
          {isFormOpen && (
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>
                {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>Başlık</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>Açıklama</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={styles.textarea}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="icon" className={styles.label}>İkon</label>
                  <select
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className={styles.select}
                    required
                  >
                    <option value="">İkon Seçin</option>
                    {iconOptions.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Görsel</label>
                  <div 
                    className={styles.imageUpload}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    {previewUrl ? (
                      <div className={styles.imagePreview}>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className={styles.removeButton}
                        >
                          <FaTimes className={styles.removeIcon} />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.imageUploadContent}>
                        <FaUpload className={styles.uploadIcon} />
                        <p className={styles.uploadText}>
                          Görsel yüklemek için tıklayın veya sürükleyin
                        </p>
                        <span className={styles.uploadButton}>Görsel Seç</span>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                  {editingService ? 'Güncelle' : 'Ekle'}
                </button>
              </form>
            </div>
          )}

          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceImage}>
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className={styles.serviceImageContent}
                  />
                  <div className={styles.serviceOverlay}>
                    <button
                      onClick={() => handleEdit(service)}
                      className={styles.serviceButton}
                    >
                      <FaEdit className={styles.serviceIcon} />
                    </button>
                    <button
                      onClick={() => handleDeleteDialog(service)}
                      className={styles.serviceButton}
                    >
                      <FaTrash className={styles.serviceIcon} />
                    </button>
                  </div>
                </div>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                  <div className={styles.serviceIconWrapper}>
                    {iconOptions.find(opt => opt.value === service.icon)?.icon && 
                      React.createElement(
                        iconOptions.find(opt => opt.value === service.icon)!.icon,
                        { className: styles.serviceIcon }
                      )
                    }
                    <span className={styles.serviceIconText}>{service.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showDeleteDialog && (
            <div className={styles.deleteDialog}>
              <div className={styles.dialogContent}>
                <h3 className={styles.dialogTitle}>Hizmeti Sil</h3>
                <p className={styles.dialogText}>
                  Bu hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
                <div className={styles.dialogButtons}>
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className={styles.cancelButton}
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className={styles.deleteButton}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 