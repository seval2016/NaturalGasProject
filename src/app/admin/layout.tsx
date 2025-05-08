'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome, FaImages, FaNewspaper, FaEnvelope, FaBriefcase, FaCogs, FaBell, FaUser, FaSignOutAlt, FaCog, FaUserCircle, FaUsers } from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dropdown dışına tıklandığında kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Login ve register sayfaları için özel kontrol
  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Yükleme durumu
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Oturum yoksa login sayfasına yönlendir
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaHome className="w-5 h-5 mr-2" />
            <span>Ana Sayfa</span>
          </Link>
          <Link
            href="/admin/slider"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaImages className="w-5 h-5 mr-2" />
            <span>Slider</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaCogs className="w-5 h-5 mr-2" />
            <span>Hizmetler</span>
          </Link>
          <Link
            href="/admin/works"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaBriefcase className="w-5 h-5 mr-2" />
            <span>Çalışmalar</span>
          </Link>
          <Link
            href="/admin/news"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaNewspaper className="w-5 h-5 mr-2" />
            <span>Haberler</span>
          </Link>
          <Link
            href="/admin/contact"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaEnvelope className="w-5 h-5 mr-2" />
            <span>İletişim</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaUsers className="w-5 h-5 mr-2" />
            <span>Kullanıcılar</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {pathname === '/admin' ? 'Dashboard' : 
                   (pathname?.split('/').pop() || 'Sayfa').charAt(0).toUpperCase() + 
                   (pathname?.split('/').pop() || 'Sayfa').slice(1)}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <FaBell className="w-5 h-5" />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 focus:outline-none"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm text-left">
                        <p className="font-medium text-gray-700">{session.user?.name}</p>
                        <p className="text-gray-500">{session.user?.email}</p>
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      
                      <Link
                        href="/admin/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUserCircle className="w-4 h-4 mr-2" />
                        Profil
                      </Link>
                      
                      <Link
                        href="/admin/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaCog className="w-4 h-4 mr-2" />
                        Ayarlar
                      </Link>
                      
                      <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="w-4 h-4 mr-2" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} Natural Gas Admin Panel
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 