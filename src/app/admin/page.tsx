'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6 pt-24">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Hoş geldiniz, {session.user?.name}! Bu panelden site içeriğini yönetebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Kullanıcı Yönetimi</h2>
          <p className="text-gray-600 mb-4">Kullanıcıları görüntüle ve yönet</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Kullanıcıları Görüntüle
          </button>
        </div>

        {/* Posts Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">İçerik Yönetimi</h2>
          <p className="text-gray-600 mb-4">Blog yazılarını yönet</p>
          <button
            onClick={() => router.push('/admin/posts')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Yazıları Görüntüle
          </button>
        </div>

        {/* Images Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Medya Yönetimi</h2>
          <p className="text-gray-600 mb-4">Resimleri ve medya dosyalarını yönet</p>
          <button
            onClick={() => router.push('/admin/images')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Medyayı Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
} 