'use client';

import { SessionProvider } from 'next-auth/react';

import UserSessionSync from '@/hooks/UserSessionSync';

type Props = {
  children?: React.ReactNode;
};

const NextAuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <UserSessionSync /> {/* Sync session with Zustand store */}
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
