'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

interface ContactInfo {
  id: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export default function ContactPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchContactInfo();
    }
  }, [status, router]);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'İletişim bilgileri alınamadı');
      }
      const data = await response.json();
      setContactInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İletişim bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      address: formData.get('address'),
      facebook: formData.get('facebook'),
      instagram: formData.get('instagram'),
      twitter: formData.get('twitter'),
    };

    try {
      const response = await fetch('/api/admin/contact', {
        method: contactInfo ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('API Error:', responseData);
        throw new Error(
          responseData.details 
            ? `${responseData.error}\n${responseData.details}`
            : responseData.error || 'İşlem başarısız'
        );
      }

      setSuccess('İletişim bilgileri başarıyla güncellendi');
      fetchContactInfo();
    } catch (err) {
      console.error('Submit Error:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">İletişim Bilgileri</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium">Hata</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-medium">Başarılı</p>
            <p className="text-green-600">{success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={contactInfo?.phone}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaWhatsapp className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="whatsapp"
                  defaultValue={contactInfo?.whatsapp}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="905XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  defaultValue={contactInfo?.email}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  defaultValue={contactInfo?.address}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Şirket adresi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFacebook className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="facebook"
                  defaultValue={contactInfo?.facebook}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaInstagram className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="instagram"
                  defaultValue={contactInfo?.instagram}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTwitter className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="twitter"
                  defaultValue={contactInfo?.twitter}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 