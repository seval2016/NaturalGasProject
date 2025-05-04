import React, { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import WorksModal from '@/components/WorksModal';
import worksData from '@/data/works.json';

const ContactHero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <section className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left Side */}
      <div className="flex-1 max-w-xl">
        <p className="uppercase tracking-widest text-gray-500 mb-2 font-semibold">KALİTE GÜVENCESİ</p>
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-4">İhtiyacınıza özel tesisat çözümleri</h1>
        <h2 className="text-xl font-medium mb-4 text-gray-700">Eviniz için en iyi tesisatı kuruyoruz</h2>
        <p className="mb-8 text-sm text-gray-500">Eviniz için en iyi ve en güvenilir tesisat sistemlerini kuruyoruz.
        Alanında uzman ekibimizle, yüksek kalite standartlarına uygun, uzun ömürlü çözümler sunuyoruz. İhtiyacınıza göre hızlı, temiz ve etkili hizmet anlayışıyla yanınızdayız.</p>
        <div className="flex items-center gap-4">
        <div className="flex justify-center my-8">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#1f84d6] text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Yapılan Çalışmalar
        </button>
      </div>
      <WorksModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={worksData.images}
      />
          <div className="flex items-center bg-gray-100 px-4 py-3 rounded">
            <FaPhoneAlt className="mr-2" style={{ color: '#1f84d6' }} />
            <span className="font-medium text-gray-800">0 800 555 44 33</span>
          </div>
        </div>
      </div>
      {/* Right Side - Görseller üst üste bindirilmiş */}
      <div className="flex-1 flex justify-center items-center relative min-w-[500px] min-h-[500px]">
        {/* Sağdaki görsel (arkada) */}
        <img
          src="/images/hero-pipe.jpg"
          alt="Tesisat"
          className="w-[480px] h-[480px] object-cover shadow-lg absolute top-0 right-0 md:translate-x-16 md:-translate-y-12 z-10 transition-all duration-300"
        />
        {/* Soldaki görsel (önde) */}
        <img
          src="/images/hero-handshake.jpg"
          alt="El sıkışma"
          className="w-[520px] h-[520px] object-cover shadow-xl relative z-20"
        />
      </div>
    </section>
  );
};

export default ContactHero; 