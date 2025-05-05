'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/logo/logo2.png" alt="Logo" className="h-20 w-auto" />
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-semibold" style={{ color: '#1f84d6' }}>Şentürk</span>
                <span className="text-xs font-medium text-gray-500 tracking-wide mt-0.5 ml-0.5">Sıhhi Tesisat</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#anasayfa" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Ana Sayfa
            </a>
            <a href="#hakkimizda" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Hakkımızda
            </a>
            <a href="#hizmetler" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Hizmetler
            </a>
            <a href="#iletisim" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              İletişim
            </a>
            {/* Desktop Phone and WhatsApp Buttons */}
            <div className="flex items-center ml-8 gap-1">
              <button
                onClick={() => window.open('tel:05424017904')}
                className="flex items-center gap-1 px-2 py-1 rounded bg-[#1f84d6] text-white text-sm font-semibold hover:bg-blue-700 transition shadow"
                title="Telefon ile Ara"
              >
                <FaPhoneAlt className="w-4 h-4" />
                <span>Ara</span>
              </button>
              <button
                onClick={() => window.open('https://wa.me/905424017904', '_blank')}
                className="flex items-center gap-1 px-2 py-1 rounded bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition shadow"
                title="WhatsApp ile İletişim"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? <FaBars className="h-6 w-6" /> : <FaTimes className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Ana Sayfa
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Hakkımızda
            </Link>
            <Link href="/services" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Hizmetler
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              İletişim
            </Link>
          </div>
          {/* Mobile Phone and WhatsApp Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => window.open('tel:05424017904')}
              className="p-2 rounded-full bg-[#1f84d6] text-white hover:bg-blue-700 transition"
              title="Telefon ile Ara"
            >
              <FaPhoneAlt className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open('https://wa.me/905424017904', '_blank')}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
              title="WhatsApp ile İletişim"
            >
              <FaWhatsapp className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 