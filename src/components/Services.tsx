'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaFireAlt, 
  FaBath, 
  FaProjectDiagram, 
  FaGasPump,
  FaWater,
  FaTemperatureHigh
} from 'react-icons/fa';
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
  "fa-temperature-high": <FaTemperatureHigh className={styles.icon} size={24} />,
  "fa-bath": <FaBath className={styles.icon} size={24} />,
  "fa-project-diagram": <FaProjectDiagram className={styles.icon} size={24} />,
  "fa-gas-pump": <FaGasPump className={styles.icon} size={24} />,
  "fa-fire-alt": <FaFireAlt className={styles.icon} size={24} />,
  "fa-faucet": <FaWater className={styles.icon} size={24} />,
  "": <FaTemperatureHigh className={styles.icon} size={24} />
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services');
        if (!response.ok) {
          throw new Error('Hizmet verileri alınamadı');
        }
        const data = await response.json();
        const updatedData = data.map((service: Service) => {
          if (service.title === "Yerden Isıtma" && !service.icon) {
            return { ...service, icon: "fa-temperature-high" };
          }
          return service;
        });
        setServices(updatedData);
        setError(null);
      } catch (err) {
        console.error('Hizmet verileri yüklenirken hata:', err);
        setError('Hizmet verileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <SectionTitle
          label="HİZMETLERİMİZ"
          title="Kaliteli Hizmet Garantimizdir"
          description="Hem bireysel hem de kurumsal müşterilerimize yönelik geniş kapsamlı tesisat hizmetleri sunuyoruz. En karmaşık sorunlarda bile etkili ve güvenilir çözümlerle yanınızdayız."
        />
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <SectionTitle
          label="HİZMETLERİMİZ"
          title="Kaliteli Hizmet Garantimizdir"
          description="Hem bireysel hem de kurumsal müşterilerimize yönelik geniş kapsamlı tesisat hizmetleri sunuyoruz. En karmaşık sorunlarda bile etkili ve güvenilir çözümlerle yanınızdayız."
        />
        <div className="flex items-center justify-center h-[400px] text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <SectionTitle
        label="HİZMETLERİMİZ"
        title="Kaliteli Hizmet Garantimizdir"
        description="Hem bireysel hem de kurumsal müşterilerimize yönelik geniş kapsamlı tesisat hizmetleri sunuyoruz. En karmaşık sorunlarda bile etkili ve güvenilir çözümlerle yanınızdayız."
      />
      <div className={`${styles.gridContainer} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8`}>
        {services.length > 0 ? (
          services.map((service) => (
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
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-[400px] text-gray-500">
            Henüz hizmet eklenmemiş
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;