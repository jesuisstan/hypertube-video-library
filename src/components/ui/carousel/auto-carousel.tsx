import { FC, useEffect, useState } from 'react';

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

import { ButtonCustom } from '../buttons/button-custom';

type TCarouselProps = {
  title?: string;
  direction: 'horizontal' | 'vertical';
  interval: number;
  items: React.ReactNode[];
  hideArrows?: boolean;
};

const AutoCarousel: FC<TCarouselProps> = ({
  title,
  direction = 'horizontal',
  interval = 3000,
  items,
  hideArrows = false,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = items.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, items]);

  useEffect(() => {
    let slider = setInterval(() => {
      setIndex(index + 1);
    }, interval);
    return () => clearInterval(slider);
  }, [index]);

  const getPositionClass = (itemIndex: number) => {
    if (direction === 'horizontal') {
      if (itemIndex === index) return 'translate-x-0 opacity-100';
      if (itemIndex === index - 1 || (index === 0 && itemIndex === items.length - 1))
        return '-translate-x-full opacity-0';
      return 'translate-x-full opacity-0';
    } else {
      if (itemIndex === index) return 'translate-y-0 opacity-100';
      if (itemIndex === index - 1 || (index === 0 && itemIndex === items.length - 1))
        return '-translate-y-full opacity-0';
      return 'translate-y-full opacity-0';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {title && (
        <div className="title">
          <h2>
            <span>{title}</span>
          </h2>
        </div>
      )}
      <div
        className={`relative flex ${direction === 'horizontal' ? 'h-80 w-[80vw]' : 'h-[80vh] w-80'} max-w-full flex-col items-center justify-center overflow-hidden text-center`}
      >
        {items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${getPositionClass(itemIndex)}`}
          >
            {item}
          </div>
        ))}
        {!hideArrows && (
          <div>
            <ButtonCustom
              type="button"
              variant="ghost"
              size={'icon'}
              className={`absolute ${direction === 'horizontal' ? 'top-1/2 left-0 -translate-y-1/2' : 'top-0 left-1/2 -translate-x-1/2'}`}
              onClick={() => setIndex(index - 1)}
            >
              {direction === 'horizontal' ? <ChevronLeft /> : <ChevronUp />}
            </ButtonCustom>

            <ButtonCustom
              type="button"
              variant="ghost"
              size={'icon'}
              className={`absolute ${direction === 'horizontal' ? 'top-1/2 right-0 -translate-y-1/2' : 'bottom-0 left-1/2 -translate-x-1/2'}`}
              onClick={() => setIndex(index + 1)}
            >
              {direction === 'horizontal' ? <ChevronRight /> : <ChevronDown />}
            </ButtonCustom>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoCarousel;
