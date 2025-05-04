import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const ContactHero = () => {
  return (
    <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left Side */}
      <div className="flex-1 max-w-xl">
        <p className="uppercase tracking-widest text-gray-500 mb-2 font-semibold">KALİTE GÜVENCESİ</p>
        <h1 className="text-5xl font-bold mb-4 leading-tight text-gray-900">Plumbing solutions on demand</h1>
        <h2 className="text-xl font-medium mb-4 text-gray-700">Eviniz için en iyi tesisatı kuruyoruz</h2>
        <p className="mb-8 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non incididunt ut.</p>
        <div className="flex items-center gap-4">
          <button className="px-8 py-3 rounded font-semibold hover:brightness-110 transition text-white" style={{ backgroundColor: '#1f84d6' }}>Hakkımızda</button>
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