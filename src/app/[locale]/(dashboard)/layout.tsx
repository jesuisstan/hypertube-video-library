'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

import clsx from 'clsx';

import Footer from '@/components/footer';
import Menu from '@/components/menu/menu';
import useUserStore from '@/stores/user';
import { TUser } from '@/types/user';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);

  //React.useEffect(() => {
  //  if (session?.user) {
  //    setUser(session.user as TUser);
  //  }
  //}, [session, setUser]);

  return (
    <div className={clsx('relative flex min-h-screen w-full flex-col lg:flex-row')}>
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
