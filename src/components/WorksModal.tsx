import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface WorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

const WorksModal: React.FC<WorksModalProps> = ({ isOpen, onClose, images }) => {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<null | number>(null);

  if (!isOpen) return null;

  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90">
      {/* Modal Close Button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white text-3xl z-50">
        <FaTimes />
      </button>
      {/* Carousel Area */}
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        <div className="relative w-full h-80 md:h-[450px] flex items-center justify-center">
          <img
            src={images[current]}
            alt="Çalışma görseli"
            className="object-contain w-full h-full rounded-xl shadow-xl cursor-pointer"
            onClick={() => setLightbox(current)}
          />
          {/* Prev/Next Buttons */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2 rounded-full z-10"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2 rounded-full z-10"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        </div>
        {/* Indicators */}
        <div className="flex space-x-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>
      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setLightbox(null)}>
          <img src={images[lightbox]} alt="Büyük görsel" className="max-w-full max-h-full rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default WorksModal; 