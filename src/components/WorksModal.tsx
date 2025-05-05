import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import styles from '../styles/worksModal.module.css';

interface WorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

const WorksModal = ({ isOpen, onClose, images }: WorksModalProps) => {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<null | number>(null);

  if (!isOpen) return null;

  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className={styles.modal}>
      {/* Modal Close Button */}
      <button onClick={onClose} className={styles.closeButton}>
        <FaTimes />
      </button>
      {/* Carousel Area */}
      <div className={styles.carouselArea}>
        <div className={styles.carouselContainer}>
          <img
            src={images[current]}
            alt="Çalışma görseli"
            className={styles.image}
            onClick={() => setLightbox(current)}
          />
          {/* Prev/Next Buttons */}
          <button
            onClick={prev}
            className={`${styles.navButton} ${styles.prevButton}`}
          >
            <FaChevronLeft className={styles.navIcon} />
          </button>
          <button
            onClick={next}
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            <FaChevronRight className={styles.navIcon} />
          </button>
        </div>
        {/* Indicators */}
        <div className={styles.indicators}>
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`${styles.indicator} ${
                idx === current ? styles.indicatorActive : styles.indicatorInactive
              }`}
            />
          ))}
        </div>
      </div>
      {/* Lightbox */}
      {lightbox !== null && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <img src={images[lightbox]} alt="Büyük görsel" className={styles.lightboxImage} />
        </div>
      )}
    </div>
  );
};

export default WorksModal; 