'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaImages, FaCogs, FaEnvelope, FaBriefcase } from 'react-icons/fa';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: '12',
      icon: <FaUsers className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Slider Görselleri',
      value: '5',
      icon: <FaImages className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Hizmetler',
      value: '6',
      icon: <FaCogs className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Çalışmalar',
      value: '8',
      icon: <FaBriefcase className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hoşgeldiniz Kartı */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold mb-2">Hoş Geldiniz, {session?.user?.name}!</h1>
            <p className="text-blue-100">Doğalgaz tesisatı yönetim panelinize hoş geldiniz.</p>
          </div>
          <div className="w-full md:w-1/3">
            <img
              src="/admin-illustration.svg"
              alt="Admin Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hızlı Erişim Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/slider')}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaImages className="w-5 h-5 text-blue-600" />
              <span>Slider Yönetimi</span>
            </button>
            <button
              onClick={() => router.push('/admin/services')}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaCogs className="w-5 h-5 text-green-600" />
              <span>Hizmetler</span>
            </button>
            <button
              onClick={() => router.push('/admin/works')}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaBriefcase className="w-5 h-5 text-purple-600" />
              <span>Çalışmalar</span>
            </button>
            <button
              onClick={() => router.push('/admin/contact')}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaEnvelope className="w-5 h-5 text-yellow-600" />
              <span>İletişim</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Yeni slider görseli eklendi</p>
                <p className="text-xs text-gray-400">2 saat önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Hizmet güncellendi</p>
                <p className="text-xs text-gray-400">3 saat önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Yeni çalışma eklendi</p>
                <p className="text-xs text-gray-400">5 saat önce</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 