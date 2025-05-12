'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaTrash, FaPlus, FaUpload, FaTimes } from 'react-icons/fa';
import styles from '@/styles/admin/works.module.css';
import { createActivity } from '@/lib/activity';

interface Work {
  id: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchWorks();
    }
  }, [status, router]);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/admin/works');
      if (!response.ok) throw new Error('Çalışma verileri alınamadı');
      const data = await response.json();
      setWorks(data);
    } catch (err) {
      setError('Çalışma verileri yüklenirken bir hata oluştu');
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
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/admin/works', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'İşlem başarısız');
      }

      setSuccess('Görsel başarıyla eklendi');
      resetForm();
      fetchWorks();

      // Aktivite kaydı oluştur
      await createActivity({
        action: 'create',
        entityType: 'work',
        description: 'Yeni çalışma görseli eklendi',
        userId: Number(session?.user?.id),
        workId: (await response.json()).id
      });
    } catch (err) {
      setError('Görsel yüklenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/works?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Görsel silinemedi');
      setSuccess('Görsel başarıyla silindi');
      fetchWorks();

      // Aktivite kaydı oluştur
      await createActivity({
        action: 'delete',
        entityType: 'work',
        description: 'Çalışma görseli silindi',
        userId: Number(session?.user?.id),
        workId: id
      });
    } catch (err) {
      setError('Görsel silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => setIsFormOpen(true)}
          className={styles.addButton}
        >
          <FaPlus className={styles.addIcon} />
          Yeni Görsel
        </button>
      </div>

      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {isFormOpen && (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Yeni Görsel Ekle</h2>
            <button
              onClick={resetForm}
              className={styles.closeButton}
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
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
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Yükle
            </button>
          </form>
        </div>
      )}

      <div className={styles.worksGrid}>
        {works.map((work) => (
          <div key={work.id} className={styles.workCard}>
            <div className={styles.workImage}>
              <img 
                src={work.image} 
                alt="Çalışma"
                className={styles.workImageContent}
              />
              <div className={styles.workOverlay}>
                <button
                  onClick={() => handleDelete(work.id)}
                  className={styles.workButton}
                >
                  <FaTrash className={styles.workIcon} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 