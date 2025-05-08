import React, { useState, useEffect } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import WorksModal from '@/components/WorksModal';
import styles from '../styles/contactHero.module.css';

interface Work {
  id: number;
  image: string;
  createdAt: string;
}

const ContactHero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('/api/admin/works');
        if (!response.ok) throw new Error('Çalışmalar alınamadı');
        const data = await response.json();
        setWorks(data);
      } catch (err) {
        console.error('Çalışmalar yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

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
              disabled={loading || works.length === 0}
            >
              {loading ? 'Yükleniyor...' : 'Yapılan Çalışmalar'}
            </button>
          </div>
          <WorksModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            images={works.map(work => work.image)}
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