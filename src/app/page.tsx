import Carousel from '@/components/Carousel';
import carouselData from '@/data/carousel.json';
import ContactHero from '@/components/ContactHero';
import Services from '@/components/Services';
import About from '@/components/About';

export default function Home() {
  return (
    <div>
      <div className="py-3" />
      <Carousel slides={carouselData.slides} />
      <div className="py-6" />
      <Services />
      <div className="py-6" />
      <About />
      <div className="py-6" />
      <ContactHero />
    </div>
  );
}
