"use client";
import React, { useState } from 'react';
import Carousel from '@/components/Carousel';
import carouselData from '@/data/carousel.json';
import ContactHero from '@/components/ContactHero';
import Services from '@/components/Services';
import About from '@/components/About';
import WorksModal from '@/components/WorksModal';
import worksData from '@/data/works.json';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="pt-16">
      <div className="py-3" />
      <section id="anasayfa">
        <Carousel slides={carouselData.slides} />
      </section>
      <div className="py-6" />
      <section id="hizmetler">
        <Services />
      </section>
      <div className="py-6" />
      <section id="hakkimizda">
        <About />
      </section>
      <div className="py-8" />
      <section id="iletisim">
        <ContactHero />
      </section>
    </div>
  );
}
