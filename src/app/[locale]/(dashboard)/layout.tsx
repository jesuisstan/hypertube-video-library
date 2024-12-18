'use client';

import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import Footer from '@/components/footer';
import Menu from '@/components/menu/menu';
import useUserStore from '@/stores/user';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();

  return (
    <div className={clsx('relative flex min-h-screen w-full flex-col lg:flex-row')}>
      {/*<Image
        src="/map.svg"
        alt="hearts-bg"
        fill
        placeholder="blur"
        blurDataURL="/map.svg"
        //className="z-[-5] object-cover opacity-5"
        sizes="100vw"
        priority
      />*/}
      <Menu />
      <div className="flex w-full flex-grow flex-col items-center justify-between">
        <main
          id="main-content"
          role="main"
          className={clsx('mb-auto w-full max-w-[1700px] items-center p-4')}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
