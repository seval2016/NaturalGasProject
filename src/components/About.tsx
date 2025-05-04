import React from 'react';
import SectionTitle from './SectionTitle';
import { FaCheckSquare } from 'react-icons/fa';

const features = [
  'Qualified team',
  'Affordable pricing',
  'Quick service',
  '10+ years experience',
  '100+ projects done',
  'Plumbing Experts',
];

const About = () => {
  return (
    <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
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
          label="ABOUT US"
          title="Plumbing is what we do"
          description="We are an award winning plumbing company with over 20 years experience in the business. We provide a wide range of services for both residential and commercial clients."
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
          No job is too big or too small, we've got you covered. In addition to our services, you can check out our shop for a wide range of plumbing supplies and equipment. When it comes to plumbing we are your one stop shop.
        </p>
      </div>
    </section>
  );
};

export default About; 