'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Kullanıcılar yüklenemedi');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Kullanıcı silinemedi');
      fetchUsers();
    } catch (err) {
      setError('Kullanıcı silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Masaüstü Görünümü - Tablo */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Güncelleme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="w-4 h-4 mr-2" />
                      {new Date(user.updatedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="Düzenle"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Sil"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobil Görünüm - Kartlar */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 mr-2" />
                <span>Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="w-4 h-4 mr-2" />
                <span>Son Güncelleme: {new Date(user.updatedAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => router.push(`/admin/users/${user.id}`)}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                title="Düzenle"
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                title="Sil"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 