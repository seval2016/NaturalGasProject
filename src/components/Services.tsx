import React from 'react';
import services from '@/data/services.json';
import { FaFaucet, FaFireAlt, FaProjectDiagram, FaGasPump, FaBath } from 'react-icons/fa';
import SectionTitle from './SectionTitle';

const iconMap: Record<string, JSX.Element> = {
  FaFaucet: <FaFaucet className="text-white text-xl" />,
  FaFireAlt: <FaFireAlt className="text-white text-xl" />,
  FaProjectDiagram: <FaProjectDiagram className="text-white text-xl" />,
  FaGasPump: <FaGasPump className="text-white text-xl" />,
  FaBath: <FaBath className="text-white text-xl" />,
};

const Services = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <SectionTitle
        label="HİZMETLERİMİZ"
        title="Kaliteli Hizmet Garantimizdir"
        description="Hem bireysel hem de kurumsal müşterilerimize yönelik geniş kapsamlı tesisat hizmetleri sunuyoruz. En karmaşık sorunlarda bile etkili ve güvenilir çözümlerle yanınızdayız."
      />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-2xl overflow-hidden group transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            <div className="relative w-full h-[150px] md:h-[250px]">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#1f84d6] rounded-full p-3 shadow-xl flex items-center justify-center">
                {iconMap[service.icon]}
              </div>
            </div>
            <div className="p-4 md:p-6">
              <h2 className="text-sm md:text-lg font-bold text-gray-900 mb-2">{service.title}</h2>
              <p className="text-gray-600 text-xs md:text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services; 