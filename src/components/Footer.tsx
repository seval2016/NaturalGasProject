'use client';

import Link from 'next/link';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import styles from '../styles/footer.module.css';
import { useContact } from '@/context/ContactContext';

const Footer = () => {
  const { contactInfo } = useContact();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
      <div className={styles.content}>
          {/* Company Info */}
          <div className={styles.companyInfo}>
            <Link href="/" className={styles.logoLink}>
              <img src="/images/logo/logo2.png" alt="Logo" className={styles.logoImage} />
              <div className={styles.logoText}>
                <span className={styles.logoTitle} style={{ color: '#1f84d6' }}>Şentürk</span>
                <span className={styles.logoSubtitle}>Sıhhi Tesisat</span>
              </div>
            </Link>
            <p className={styles.description}>
              Profesyonel sıhhi tesisat hizmetleri ile 7/24 yanınızdayız.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.quickLinks}>
            <h3 className={styles.sectionTitle}>Hızlı Bağlantılar</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/#home" className={styles.link}>
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/#services" className={styles.link}>
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link href="/#about" className={styles.link}>
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/#contact" className={styles.link}>
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.contactInfo}>
            <h3 className={styles.sectionTitle}>İletişim Bilgileri</h3>
            <ul className={styles.contactList}>
              <li>
                <FaPhoneAlt className={styles.icon} />
                <a href={`tel:${contactInfo?.phone}`} className={styles.contactLink}>
                  {contactInfo?.phone}
                </a>
              </li>
              <li>
                <FaWhatsapp className={styles.icon} />
                <a href={`https://wa.me/${contactInfo?.whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  {contactInfo?.whatsapp}
                </a>
              </li>
              <li>
                <FaEnvelope className={styles.icon} />
                <a href={`mailto:${contactInfo?.email}`} className={styles.contactLink}>
                  {contactInfo?.email}
                </a>
              </li>
              <li>
                <FaMapMarkerAlt className={styles.icon} />
                <span className={styles.contactText}>
                  {contactInfo?.address}
                </span>
              </li>
            </ul>
        </div>

          {/* Social Media */}
          <div className={styles.socialMedia}>
            <h3 className={styles.sectionTitle}>Sosyal Medya</h3>
          <div className={styles.socialLinks}>
              {contactInfo?.facebook && (
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaFacebook className={styles.socialIcon} />
                </a>
              )}
              {contactInfo?.instagram && (
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaInstagram className={styles.socialIcon} />
                </a>
              )}
              {contactInfo?.twitter && (
                <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaTwitter className={styles.socialIcon} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Şentürk Sıhhi Tesisat. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
