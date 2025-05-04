import React from 'react';
import SectionTitle from './SectionTitle';
import { FaCheckSquare } from 'react-icons/fa';

const features = [
  'Uzman ve nitelikli ekip',
  'Uygun fiyat garantisi',
  'Hızlı ve güvenilir hizmet',
  '20+ yıl tecrübe',
  '100+ tamamlanmış proje',
  'Tesisat uzmanlığı',
];

const About = () => {
  return (
    <section className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-12">
      {/* Sol: Görsel */}
      <div className="flex-1 w-full max-w-md">
        <img
          src="/images/about.jpg"
          alt="About us"
          className="w-full h-auto object-cover rounded-2xl shadow-lg"
        />
      </div>
      {/* Sağ: İçerik */}
      <div className="flex-1 w-full">
        <SectionTitle
          label="HAKKIMIZDA"
          title="Tesisat bizim işimiz"
          description="20 yılı aşkın deneyimimizle hem bireysel hem de kurumsal müşterilerimize geniş hizmet yelpazesi sunuyoruz."
        />
        {/* Özellikler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6 max-w-xl mx-auto">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center text-gray-700 text-base mb-2">
              <FaCheckSquare className="text-[#1f84d6] mr-2" />
              {feature}
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
        Hiçbir iş bizim için ne çok büyük ne de çok küçük; her ihtiyacınızda yanınızdayız. Hizmetlerimizin yanı sıra, tesisat malzemeleri ve ekipmanları için mağazamızı da ziyaret edebilirsiniz. Tesisat konusunda ihtiyacınız olan her şey tek bir adreste!
        </p>
      </div>
    </section>
  );
};

export default About; 