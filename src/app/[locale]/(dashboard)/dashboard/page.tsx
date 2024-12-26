'use client';

import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { slides } from '../../authentication/(components)/logos-slides';

import EmblaCarouselAuto from '@/components/ui/carousel/auto/EmblaCarousel';
import AutoCarousel from '@/components/ui/carousel/auto-carousel';
import DashboardSkeleton from '@/components/ui/skeletons/dashboard-skeleton';
import TooltipBasic from '@/components/ui/tooltips/tooltip-basic';
import { EmptyPhoto } from '@/components/wrappers/photo-gallery-wrapper';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const Dashboard = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);

  const SLIDES = [
    <div
      key="slide1"
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[0] ? (
        <Image
          src={`${user?.photos?.[0]}`}
          alt="photo1"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-c42green"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide2"
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[1] ? (
        <Image
          src={`${user?.photos?.[1]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-c42green"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide3"
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[2] ? (
        <Image
          src={`${user?.photos?.[2]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-c42green"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide4"
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[3] ? (
        <Image
          src={`${user?.photos?.[3]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-c42green"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide5"
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[4] ? (
        <Image
          src={`${user?.photos?.[4]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-c42green"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
  ];

  const { data: session, status } = useSession(); // Get session data
  console.log('session', session);
  return !user ? (
    <DashboardSkeleton />
  ) : (
    <div>
      <TooltipBasic trigger={<div>SHOW</div>}>
        <p>La la la</p>
      </TooltipBasic>

      <TooltipBasic>
        <p>This is a default tooltip</p>
      </TooltipBasic>
    </div>
  );
};

export default Dashboard;
