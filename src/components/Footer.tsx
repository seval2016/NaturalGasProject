import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import styles from "../styles/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <img src="/images/logo/logo2.png" alt="Logo" className={styles.logo} />
          <h2 className={styles.title}>
            USTALIKLA ÇÖZÜLEN
            <br />TESİSAT İŞLERİ
          </h2>
        </div>

        <div className={styles.addressSection}>
          <h3 className={styles.sectionTitle}>Address</h3>
          <p className={styles.addressText}>TÜRKİYE —</p>
          <p className={styles.location}>Bursa, Orhangazi</p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <FaFacebookF />
            </a>
            <a href="#" className={styles.socialLink}>
              <FaTwitter />
            </a>
            <a href="#" className={styles.socialLink}>
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>İletişim</h3>
          <p className={styles.phone}>0542 401 79 04</p>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span className={styles.copyright}>
          Şentürk Sıhhi Tesisat © 2025. Tüm Hakları Saklıdır.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
