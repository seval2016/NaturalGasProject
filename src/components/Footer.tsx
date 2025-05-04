import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaDribbble } from 'react-icons/fa';

const images = [
  '/images/banner/galeri1.jpg',
  '/images/banner/galeri2.jpg',
  '/images/banner/galeri3.jpg',
  '/images/banner/galeri4.jpg',
  '/images/banner/galeri5.jpg',
  '/images/banner/galeri6.jpg',
];

const FooterImages = () => (
  <div className="w-full hidden md:grid grid-cols-2 md:grid-cols-6 pt-16">
    {images.map((img, i) => (
      <div key={i} className="h-56 overflow-hidden">
        <img src={img} alt="footer visual" className="w-full h-full object-cover" />
      </div>
    ))}
  </div>
);

const Footer = () => {
  return (
    <>
      <FooterImages />
      <footer className="bg-gray-900 text-white relative min-h-[500px] pt-0 mt-16 md:mt-0">
        <div className="absolute inset-0 bg-[url('/images/home-bg.png')] opacity-60 z-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gray-900 opacity-80 z-0"></div>
        {/* Alt iletişim ve sosyal medya */}
        <div className="container mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-20">
          {/* Sol: Başlık */}
          <div className="md:col-span-1 flex flex-col justify-center mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plumbing services with<br />a quality guarantee</h2>
          </div>
          {/* Orta: Adres */}
          <div className="md:col-span-1 mb-8 md:mb-0">
            <h3 className="font-bold mb-2">Address</h3>
            <p className="mb-1">The USA —</p>
            <p className="mb-1">785 15th Street, Office 478</p>
            <p className="mb-4">Boston, MD 02130</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"><FaFacebookF /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"><FaTwitter /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"><FaDribbble /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"><FaInstagram /></a>
            </div>
          </div>
          {/* Sağ: İletişim */}
          <div className="md:col-span-1">
            <h3 className="font-bold mb-2">Say Hello</h3>
            <p className="mb-2"><a href="mailto:info@email.com" className="hover:underline">info@email.com</a></p>
            <p className="text-2xl font-semibold mb-4">+1 800 555 25 69</p>
          </div>
        </div>
        {/* Alt menü ve copyright */}
        <div className="container mx-auto px-4 pb-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-800 pt-6">
          <nav className="flex space-x-8 mb-4 md:mb-0">
            <a href="#" className="text-white font-medium border-b-2 border-white pb-1">Home</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Services</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Shop</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </nav>
          <span className="text-gray-400 text-sm mt-2 md:mt-0">ThemeREX © 2025. All Rights Reserved.</span>
        </div>
      </footer>
    </>
  );
};

export default Footer; 