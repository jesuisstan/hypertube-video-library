import { useEffect } from 'react';
import { useSession } from 'next-auth/react'; // next-auth hook to get the session

import useUserStore from '@/stores/user'; // Your Zustand store

const UserSessionSynchronizer = () => {
  const { data: session, status } = useSession(); // Get session data
  const setUser = useUserStore((state) => state.setUser); // Access Zustand setUser method

  // Sync session data with Zustand store when session data is available
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user); // Set the user in the Zustand store
    }
  }, [session, status, setUser]);

  return null; // This component doesn't render anything, it just syncs the session to the store
};

export default UserSessionSynchronizer;
