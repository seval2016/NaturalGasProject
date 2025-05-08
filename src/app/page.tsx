"use client";
import React, { useState, useEffect } from 'react';
import Carousel from '@/components/Carousel';
import ContactHero from '@/components/ContactHero';
import Services from '@/components/Services';
import About from '@/components/About';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/admin/slider');
        if (!response.ok) throw new Error('Slider verileri alınamadı');
        const data = await response.json();
        setSlides(data);
      } catch (err) {
        console.error('Slider verileri yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  return (
    <div className="pt-16">
      <div className="py-3" />
      <section id="home">
        {!loading && slides.length > 0 && <Carousel slides={slides} />}
      </section>
      <div className="py-6" />
      <section id="services">
        <Services />
      </section>
      <div className="py-6" />
      <section id="about">
        <About />
      </section>
      <div className="py-6" />
      <section id="contact">
        <ContactHero />
      </section>
    </div>
  );
}
