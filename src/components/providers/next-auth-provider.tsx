'use client';

import UserSessionSync from '@/hooks/UserSessionSync';
import { SessionProvider } from 'next-auth/react';

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
