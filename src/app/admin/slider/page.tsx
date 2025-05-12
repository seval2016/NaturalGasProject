'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaTimes } from 'react-icons/fa';
import styles from '@/styles/admin/slider.module.css';
import { createActivity } from '@/lib/activity';

interface Slider {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function SliderPage() {
  const { data: session } = useSession();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<Slider | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/admin/slider');
      if (!response.ok) throw new Error('Slider görselleri yüklenirken bir hata oluştu');
      const data = await response.json();
      setSliders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedFile && !editingSlider) {
      setError('Lütfen bir görsel seçin');
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      const url = editingSlider 
        ? `/api/admin/slider?id=${editingSlider.id}`
        : '/api/admin/slider';
      
      const method = editingSlider ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(editingSlider 
          ? 'Slider güncellenirken bir hata oluştu'
          : 'Slider eklenirken bir hata oluştu'
        );
      }

      const data = await response.json();
      
      // Aktivite kaydı oluştur
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: editingSlider ? 'update' : 'create',
          entityType: 'slide',
          description: editingSlider 
            ? `Slider güncellendi: ${formData.title}`
            : `Yeni slider eklendi: ${formData.title}`,
          userId: Number(session?.user?.id),
          slideId: data.id
        }),
      });

      resetForm();
      fetchSliders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      description: slider.description,
    });
    setPreviewUrl(slider.image);
    setIsFormOpen(true);
  };

  const handleDelete = async (slider: Slider) => {
    setSliderToDelete(slider);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!sliderToDelete) return;

    if (!confirm('Bu slider\'ı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/slider?id=${sliderToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Slider silinirken bir hata oluştu');
      }

      // Aktivite kaydı oluştur
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          entityType: 'slide',
          description: `Slider silindi (ID: ${sliderToDelete.id})`,
          userId: Number(session?.user?.id),
          slideId: sliderToDelete.id
        }),
      });

      await fetchSliders();
      setShowDeleteDialog(false);
      setSliderToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingSlider(null);
    setIsFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
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
              onClick={() => setIsFormOpen(true)}
              className={styles.addButton}
            >
              <FaPlus className={styles.addIcon} />
              Yeni Slider
            </button>
          </div>

          {isFormOpen && (
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>
                {editingSlider ? 'Slider\'ı Düzenle' : 'Yeni Slider Ekle'}
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
                  {editingSlider ? 'Güncelle' : 'Ekle'}
                </button>
              </form>
            </div>
          )}

          <div className={styles.slidersGrid}>
            {sliders.map((slider) => (
              <div key={slider.id} className={styles.sliderCard}>
                <div className={styles.sliderImage}>
                  <img 
                    src={slider.image} 
                    alt={slider.title}
                    className={styles.sliderImageContent}
                  />
                  <div className={styles.sliderOverlay}>
                    <button
                      onClick={() => handleEdit(slider)}
                      className={styles.sliderButton}
                    >
                      <FaEdit className={styles.sliderIcon} />
                    </button>
                    <button
                      onClick={() => handleDelete(slider)}
                      className={styles.sliderButton}
                    >
                      <FaTrash className={styles.sliderIcon} />
                    </button>
                  </div>
                </div>
                <div className={styles.sliderContent}>
                  <h3 className={styles.sliderTitle}>{slider.title}</h3>
                  <p className={styles.sliderDescription}>{slider.description}</p>
                </div>
              </div>
            ))}
          </div>

          {showDeleteDialog && (
            <div className={styles.deleteDialog}>
              <div className={styles.dialogContent}>
                <h3 className={styles.dialogTitle}>Slider\'ı Sil</h3>
                <p className={styles.dialogText}>
                  Bu slider\'ı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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