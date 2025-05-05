import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaDribbble,
} from "react-icons/fa";

const images = [
  "/images/banner/galeri1.jpg",
  "/images/banner/galeri2.jpg",
  "/images/banner/galeri3.jpg",
  "/images/banner/galeri4.jpg",
  "/images/banner/galeri5.jpg",
  "/images/banner/galeri6.jpg",
];

const FooterImages = () => (
  <div className="w-full grid grid-cols-2 md:grid-cols-6 pt-8 md:pt-16">
    {images.map((img, i) => (
      <div key={i} className="h-32 md:h-56 overflow-hidden">
        <img
          src={img}
          alt="footer visual"
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
);

const Footer = () => {
  return (
    <>
      <FooterImages />
      <footer className="bg-gray-900 text-white relative min-h-[500px] pt-0 mt-8 md:mt-0">
        <div className="absolute inset-0 bg-[url('/images/home-bg.png')] opacity-60 z-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gray-900 opacity-80 z-0"></div>
        {/* Alt iletişim ve sosyal medya */}
        <div className="container mx-auto px-2 md:px-4 py-12 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-items-center relative z-20">
          {/* Sol: Başlık */}
          <div className="md:col-span-1 flex flex-col justify-center mb-8 md:mb-0 items-center">
            <img src="/images/logo/logo2.png" alt="Logo" className="h-12 md:h-16 w-auto mb-2" />
            <h2 className="text-lg md:text-2xl font-base text-center">
              USTALIKLA ÇÖZÜLEN
              <br />TESİSAT İŞLERİ
            </h2>
          </div>
          {/* Orta: Adres */}
          <div className="md:col-span-1 mb-8 md:mb-0 flex flex-col items-start text-left">
            <h3 className="font-bold mb-2">Address</h3>
            <p className="mb-1">TÜRKİYE —</p>
            <p className="mb-4">Bursa, Orhangazi</p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
          {/* Sağ: İletişim */}
          <div className="md:col-span-1 flex flex-col items-center text-center">
            <h3 className="font-bold mb-2">İletişim</h3>
            <p className="text-xl mb-4">0542 401 79 04</p>
          </div>
        </div>
        {/* Alt menü ve copyright */}
        <div className="container mx-auto md:pe-24 pb-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-800 pt-6">
          <nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
            <a
              href="#anasayfa"
              className="text-gray-100 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium text-center"
            >
              Ana Sayfa
            </a>
            <a
              href="#hakkimizda"
              className="text-gray-100 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium text-center"
            >
              Hakkımızda
            </a>
            <a
              href="#hizmetler"
              className="text-gray-100 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium text-center"
            >
              Hizmetler
            </a>
            <a
              href="#iletisim"
              className="text-gray-100 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium text-center"
            >
              İletişim
            </a>
          </nav>
          <span className="text-gray-400 text-sm mt-2 md:mt-0">
            Şentürk Sıhhi Tesisat © 2025. Tüm Hakları Saklıdır.
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
