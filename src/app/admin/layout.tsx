'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome, FaImages, FaEnvelope, FaBriefcase, FaCogs, FaBell, FaUser, FaSignOutAlt, FaCog, FaUserCircle, FaUsers, FaBars, FaTimes, FaGasPump } from 'react-icons/fa';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl shadow-sm">
              <Image
                src="/images/logo/logo.png"
                alt="Natural Gas Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-500">Şentürk Sıhhi Tesisat</p>
            </div>
          </div>
        </div>
        <nav className="mt-4 px-4">
          <Link
            href="/admin"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors ${
              pathname === '/admin' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaHome className="w-5 h-5 mr-3" />
            <span>Ana Sayfa</span>
          </Link>
          <Link
            href="/admin/slider"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors ${
              pathname === '/admin/slider' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaImages className="w-5 h-5 mr-3" />
            <span>Slider</span>
          </Link>
          <Link
            href="/admin/services"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors ${
              pathname === '/admin/services' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaCogs className="w-5 h-5 mr-3" />
            <span>Hizmetler</span>
          </Link>
          <Link
            href="/admin/works"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors ${
              pathname === '/admin/works' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaBriefcase className="w-5 h-5 mr-3" />
            <span>Çalışmalar</span>
          </Link>
          <Link
            href="/admin/contact"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors ${
              pathname === '/admin/contact' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaEnvelope className="w-5 h-5 mr-3" />
            <span>İletişim</span>
          </Link>
          <Link
            href="/admin/users"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors ${
              pathname === '/admin/users' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaUsers className="w-5 h-5 mr-3" />
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
                <button 
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 mr-2"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <FaBars className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {pathname === '/admin' ? 'Gösterge Paneli' : 
                   pathname === '/admin/slider' ? 'Slider' :
                   pathname === '/admin/services' ? 'Hizmetler' :
                   pathname === '/admin/works' ? 'Çalışmalar' :
                   pathname === '/admin/contact' ? 'İletişim' :
                   pathname === '/admin/users' ? 'Kullanıcılar' :
                   pathname === '/admin/profile' ? 'Profil' :
                   pathname === '/admin/settings' ? 'Ayarlar' :
                   'Sayfa'}
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
                      <div className="hidden sm:block text-sm text-left">
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
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
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