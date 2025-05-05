"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "../styles/carousel.module.css";

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface CarouselProps {
  slides: Slide[];
}

const Carousel = ({ slides }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselContainer}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${
                index === currentIndex ? styles.slideActive : styles.slideInactive
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={styles.slideImage}
              />
              <div className={styles.overlay}>
                <div className={styles.content}>
                  <h2 className={styles.title}>{slide.title}</h2>
                  <p className={styles.description}>{slide.description}</p>
                  <a
                    href="#hizmetler"
                    className={styles.button}
                  >
                    Detaylı Bilgi
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className={`${styles.navButton} ${styles.prevButton}`}
        >
          <FaChevronLeft className={styles.navIcon} />
        </button>
        <button
          onClick={nextSlide}
          className={`${styles.navButton} ${styles.nextButton}`}
        >
          <FaChevronRight className={styles.navIcon} />
        </button>

        <div className={styles.indicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`${styles.indicator} ${
                index === currentIndex
                  ? styles.indicatorActive
                  : styles.indicatorInactive
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
