import React from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

type TPropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  className?: string;
};

const EmblaCarouselAutoscrolling: React.FC<TPropType> = (props) => {
  const { slides, options, className } = props;
  const t = useTranslations();
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 3000, stopOnFocusIn: false, stopOnInteraction: false }),
  ]);

  return (
    <section className={clsx('mx-auto', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => (
            <div key={index}>{slide}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarouselAutoscrolling;
