import React from 'react';
import SectionTitle from './SectionTitle';
import { FaCheckSquare } from 'react-icons/fa';
import styles from '../styles/about.module.css';

const features = [
  'Uzman ve nitelikli ekip',
  'Uygun fiyat garantisi',
  'Hızlı ve güvenilir hizmet',
  '20+ yıl tecrübe',
  '100+ tamamlanmış proje',
  'Tesisat uzmanlığı',
];

const About = () => {
  return (
    <section className={styles.section}>
      {/* Sol: Görsel */}
      <div className={styles.imageContainer}>
        <img
          src="/images/about.jpg"
          alt="About us"
          className={styles.image}
        />
      </div>
      {/* Sağ: İçerik */}
      <div className={styles.content}>
        <SectionTitle
          label="HAKKIMIZDA"
          title="Tesisat bizim işimiz"
          description="20 yılı aşkın deneyimimizle hem bireysel hem de kurumsal müşterilerimize geniş hizmet yelpazesi sunuyoruz."
        />
        {/* Özellikler */}
        <div className={styles.features}>
          {features.map((feature, i) => (
            <div key={i} className={styles.feature}>
              <FaCheckSquare className={styles.featureIcon} />
              {feature}
            </div>
          ))}
        </div>
        <p className={styles.description}>
          Hiçbir iş bizim için ne çok büyük ne de çok küçük; her ihtiyacınızda yanınızdayız. Hizmetlerimizin yanı sıra, tesisat malzemeleri ve ekipmanları için mağazamızı da ziyaret edebilirsiniz. Tesisat konusunda ihtiyacınız olan her şey tek bir adreste!
        </p>
      </div>
    </section>
  );
};

export default About; 