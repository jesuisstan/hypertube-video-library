import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Spinner from '@/components/ui/spinner';

const Loading = () => {
  const t = useTranslations();

  return (
    <div className="bg-background/80 text-foreground absolute inset-0 z-50 flex flex-col items-center justify-center gap-10 text-center">
      <Image
        src="/identity/hypertube-high-resolution-logo-transparent.png"
        blurDataURL={'/identity/hypertube-high-resolution-logo-transparent.png'}
        alt="loading"
        width="0"
        height="0"
        sizes="100vw"
        className="smooth42transition h-52 w-auto min-w-80 md:h-60 lg:h-72"
        priority
        placeholder="blur"
      />
      <p className="mb-16 text-lg leading-[48px] font-normal tracking-wider sm:text-2xl">
        {t(`slogan`)}
      </p>
      <div className="flex flex-col items-center justify-center">
        <Spinner size={42} />
        <p className="mt-[14px] animate-pulse text-base leading-[19px] font-normal">
          {t(`loading`)}
        </p>
      </div>
    </div>
  );
};

export default Loading;
