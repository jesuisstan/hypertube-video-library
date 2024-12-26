'use client';

import { SessionProvider } from 'next-auth/react';

import UserSessionSynchronizer from '@/lib/user-session-synchronizer';

type Props = {
  children?: React.ReactNode;
};

const NextAuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <UserSessionSynchronizer /> {/* Sync session with Zustand store */}
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
