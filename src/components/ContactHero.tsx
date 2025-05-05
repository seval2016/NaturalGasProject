import React, { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import WorksModal from '@/components/WorksModal';
import worksData from '@/data/works.json';
import styles from '../styles/contactHero.module.css';

const ContactHero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <section className={styles.section}>
      {/* Left Side */}
      <div className={styles.leftSide}>
        <p className={styles.subtitle}>KALİTE GÜVENCESİ</p>
        <h1 className={styles.title}>İhtiyacınıza özel tesisat çözümleri</h1>
        <h2 className={styles.subtitle2}>Eviniz için en iyi tesisatı kuruyoruz</h2>
        <p className={styles.description}>Eviniz için en iyi ve en güvenilir tesisat sistemlerini kuruyoruz.
        Alanında uzman ekibimizle, yüksek kalite standartlarına uygun, uzun ömürlü çözümler sunuyoruz. İhtiyacınıza göre hızlı, temiz ve etkili hizmet anlayışıyla yanınızdayız.</p>
        <div className={styles.buttonContainer}>
          <div className="flex justify-center my-8">
            <button
              onClick={() => setModalOpen(true)}
              className={styles.button}
            >
              Yapılan Çalışmalar
            </button>
          </div>
          <WorksModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            images={worksData.images}
          />
        </div>
      </div>
      {/* Right Side - Görseller üst üste bindirilmiş */}
      <div className={styles.rightSide}>
        {/* Sağdaki görsel (arkada) */}
        <img
          src="/images/hero-pipe.jpg"
          alt="Tesisat"
          className={styles.backImage}
        />
        {/* Soldaki görsel (önde) */}
        <img
          src="/images/hero-handshake.jpg"
          alt="El sıkışma"
          className={styles.frontImage}
        />
      </div>
    </section>
  );
};

export default ContactHero; 