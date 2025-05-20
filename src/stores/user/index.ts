import { User } from 'next-auth';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type TUserStore = {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
  logout: () => void;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
};

const useUserStore = create<TUserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (userData: User) => set({ user: userData }),
      clearUser: () => set({ user: null }),
      logout: () => {
        set({ user: null });
        document.cookie = 'token=; Max-Age=0; path=/';
      },
      globalLoading: false,
      setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
    }),
    {
      name: 'hypertube-user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
