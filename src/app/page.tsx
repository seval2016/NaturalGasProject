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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/admin/slider');
        if (!response.ok) {
          throw new Error('Slider verileri alınamadı');
        }
        const data = await response.json();
        setSlides(data);
        setError(null);
      } catch (err) {
        console.error('Slider verileri yüklenirken hata:', err);
        setError('Slider verileri yüklenirken bir hata oluştu');
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
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[400px] text-red-600">
            {error}
          </div>
        ) : slides.length > 0 ? (
          <Carousel slides={slides} />
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            Henüz slider eklenmemiş
          </div>
        )}
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
