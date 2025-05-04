import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaRegClock, FaEnvelope } from 'react-icons/fa';

const items = [
  {
    icon: <FaPhoneAlt className="text-[#1f84d6] text-xl mr-2" />, 
    title: '123456789',
    desc: 'support@plumbit.com',
  },
  {
    icon: <FaMapMarkerAlt className="text-[#1f84d6] text-xl mr-2" />, 
    title: '73 Canal Street',
    desc: 'New York, NY',
  },
  {
    icon: <FaRegClock className="text-[#1f84d6] text-xl mr-2" />, 
    title: 'Mon-Sat 9.00-15:00',
    desc: 'Sunday CLOSED',
  },
];

const Topbar = () => (
  <div className="hidden md:flex w-full bg-white border-b border-gray-100 py-2">
    <div className="container mx-auto px-4 flex flex-1 justify-end gap-12">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 min-w-[180px]">
          {item.icon}
          <div>
            <span className="font-bold text-gray-900 mr-1">{item.title}</span>
            <span className="block text-gray-500 text-xs font-normal leading-tight">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Topbar; 