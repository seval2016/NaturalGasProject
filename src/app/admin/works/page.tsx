'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

interface Work {
  id: number;
  image: string;
  createdAt: string;
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/admin/works');
      if (!response.ok) throw new Error('Çalışmalar alınamadı');
      const data = await response.json();
      setWorks(data);
    } catch (err) {
      setError('Çalışmalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setSelectedFile(file);
    setError(null);

    // Önizleme URL'i oluştur
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/admin/works', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Yükleme başarısız');
      }
      
      const newWork = await response.json();
      setWorks([newWork, ...works]);
      
      // Formu sıfırla
      setSelectedFile(null);
      setPreviewUrl(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görsel yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/works?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Silme işlemi başarısız');
      
      setWorks(works.filter(work => work.id !== id));
    } catch (err) {
      setError('Görsel silinirken bir hata oluştu');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div id="works" className="flex justify-end items-center">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="text-sm font-medium inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Yeni Görsel Ekle
        </button>
      </div>

      {/* Yükleme Formu */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            {previewUrl ? (
              <div className="relative w-full max-w-md">
                <Image
                  src={previewUrl}
                  alt="Önizleme"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    <FaPlus className="mr-2" />
                    Görsel Seç
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, GIF (max. 5MB)
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {selectedFile && (
            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Yükleniyor...
                </>
              ) : (
                'Görseli Yükle'
              )}
            </button>
          )}
        </form>
      </div>

      {/* Görsel Listesi */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Mevcut Görseller</h2>
        </div>
        {works.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz görsel eklenmemiş</p>
        ) : (
          <div className="divide-y">
            {works.map((work) => (
              <div key={work.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="relative w-32 h-20">
                    <Image
                      src={work.image}
                      alt="Çalışma görseli"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(work.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Sil"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 