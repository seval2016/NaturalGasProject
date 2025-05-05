'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import styles from '../styles/header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logoLink}>
              <img src="/images/logo/logo2.png" alt="Logo" className={styles.logoImage} />
              <div className={styles.logoText}>
                <span className={styles.logoTitle} style={{ color: '#1f84d6' }}>Şentürk</span>
                <span className={styles.logoSubtitle}>Sıhhi Tesisat</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <a href="#anasayfa" className={styles.navLink}>
              Ana Sayfa
            </a>
            <a href="#hakkimizda" className={styles.navLink}>
              Hakkımızda
            </a>
            <a href="#hizmetler" className={styles.navLink}>
              Hizmetler
            </a>
            <a href="#iletisim" className={styles.navLink}>
              İletişim
            </a>
            {/* Desktop Phone and WhatsApp Buttons */}
            <div className={styles.contactButtons}>
              <button
                onClick={() => window.open('tel:05424017904')}
                className={styles.phoneButton}
                title="Telefon ile Ara"
              >
                <FaPhoneAlt className={styles.icon} />
                <span>Ara</span>
              </button>
              <button
                onClick={() => window.open('https://wa.me/905424017904', '_blank')}
                className={styles.whatsappButton}
                title="WhatsApp ile İletişim"
              >
                <FaWhatsapp className={styles.icon} />
                <span>WhatsApp</span>
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className={styles.mobileMenuButton}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.menuButton}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? <FaBars className="h-6 w-6" /> : <FaTimes className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={styles.mobileNav}>
          <div className={styles.mobileNavContainer}>
            <Link href="/" className={styles.mobileNavLink}>
              Ana Sayfa
            </Link>
            <Link href="/about" className={styles.mobileNavLink}>
              Hakkımızda
            </Link>
            <Link href="/services" className={styles.mobileNavLink}>
              Hizmetler
            </Link>
            <Link href="/contact" className={styles.mobileNavLink}>
              İletişim
            </Link>
          </div>
          {/* Mobile Phone and WhatsApp Buttons */}
          <div className={styles.mobileContactButtons}>
            <button
              onClick={() => window.open('tel:05424017904')}
              className={styles.mobilePhoneButton}
              title="Telefon ile Ara"
            >
              <FaPhoneAlt className={styles.mobileIcon} />
            </button>
            <button
              onClick={() => window.open('https://wa.me/905424017904', '_blank')}
              className={styles.mobileWhatsappButton}
              title="WhatsApp ile İletişim"
            >
              <FaWhatsapp className={styles.mobileIcon} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 