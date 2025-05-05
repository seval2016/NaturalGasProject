import React from 'react';

interface SectionTitleProps {
  label: string;
  title: string;
  description: string;
}

const SectionTitle = ({ label, title, description }: SectionTitleProps) => {
  return (
    <div className="text-center mb-10">
      {label && (
        <div className="flex items-center justify-center mb-2">
          <span className="inline-block w-8 h-1 bg-red-500 rounded mr-2" />
          <span className="uppercase font-bold tracking-wider text-sm text-[#1f84d6]">{label}</span>
          <span className="inline-block w-8 h-1 bg-red-500 rounded ml-2" />
        </div>
      )}
      <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-4">{title}</h2>
      {description && (
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
};

export default SectionTitle; 