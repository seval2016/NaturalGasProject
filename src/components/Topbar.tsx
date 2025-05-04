import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaRegClock, FaEnvelope } from 'react-icons/fa';
import topbarData from '@/data/topbar.json';

const iconMap: Record<string, JSX.Element> = {
  FaPhoneAlt: <FaPhoneAlt className="text-[#1f84d6] text-xl mr-2" />,
  FaMapMarkerAlt: <FaMapMarkerAlt className="text-[#1f84d6] text-xl mr-2" />,
  FaRegClock: <FaRegClock className="text-[#1f84d6] text-xl mr-2" />,
  FaEnvelope: <FaEnvelope className="text-[#1f84d6] text-xl mr-2" />
};

const Topbar = () => (
  <div className="hidden md:flex w-full bg-white border-b border-gray-100 py-2">
    <div className="container mx-auto px-4 flex flex-1 justify-end gap-12">
      {topbarData.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 min-w-[180px]">
          {iconMap[item.icon]}
          <div>
            {item.icon === "FaPhoneAlt" ? (
              <a href={`tel:${item.title.replace(/\s/g, '')}`} className="font-bold text-gray-900 mr-1 hover:text-[#1f84d6] transition-colors">
                {item.title}
              </a>
            ) : (
              <span className="font-bold text-gray-900 mr-1">{item.title}</span>
            )}
            <span className="block text-gray-500 text-xs font-normal leading-tight">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Topbar; 