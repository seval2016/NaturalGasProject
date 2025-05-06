'use client';

import React, { useState, useEffect } from 'react';
import { FaFaucet, FaFireAlt, FaBath, FaProjectDiagram, FaGasPump } from 'react-icons/fa';
import SectionTitle from './SectionTitle';
import styles from '../styles/services.module.css';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  "FaFaucet": <FaFaucet className={styles.icon} />,
  "FaFireAlt": <FaFireAlt className={styles.icon} />,
  "FaBath": <FaBath className={styles.icon} />,
  "FaProjectDiagram": <FaProjectDiagram className={styles.icon} />,
  "FaGasPump": <FaGasPump className={styles.icon} />
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services');
        if (!response.ok) throw new Error('Hizmet verileri alınamadı');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Hizmet verileri yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <section className={styles.section}>
      <SectionTitle
        label="HİZMETLERİMİZ"
        title="Kaliteli Hizmet Garantimizdir"
        description="Hem bireysel hem de kurumsal müşterilerimize yönelik geniş kapsamlı tesisat hizmetleri sunuyoruz. En karmaşık sorunlarda bile etkili ve güvenilir çözümlerle yanınızdayız."
      />
      <div className={`${styles.gridContainer} grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8`}>
        {services.map((service) => (
          <div key={service.id} className={`${styles.card} group`}>
            <div className={styles.imageContainer}>
              <img
                src={service.image}
                alt={service.title}
                className={`${styles.image} group-hover:scale-110`}
              />
              <div className={styles.iconContainer}>
                {iconMap[service.icon]}
              </div>
            </div>
            <div className={styles.content}>
              <h2 className={styles.title}>{service.title}</h2>
              <p className={styles.description}>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;