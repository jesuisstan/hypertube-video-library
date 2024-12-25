import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { LogOut } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

const LogoutButton = ({ translate }: { translate: (key: string) => string }) => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const setGlobalLoading = useUserStore((state) => state.setGlobalLoading);

  const { resetSearchStore } = useSearchStore();
  const router = useRouter();

  const handleLogout = async () => {
    setGlobalLoading(true); // set global loading

    resetSearchStore(); // reset search store
    logout(); // clear local user state

    // Use NextAuth's signOut method
    await signOut({
      redirect: false, // Prevent automatic redirection
      callbackUrl: '/authentication', // Specify where to redirect after logout
    });

    setGlobalLoading(false); // stop global loading
    router.push('/authentication'); // Redirect explicitly (optional, as callbackUrl handles it)
  };

  return (
    <div className="items-center">
      <ButtonCustom
        variant="ghost"
        size="icon"
        title={translate(`auth.logout`)}
        onClick={handleLogout}
        className="smooth42transition hover:bg-transparent hover:text-c42orange"
      >
        <div className="flex flex-row items-center gap-2">
          <LogOut />
          {/*<p>{translate(`auth.logout`)}</p>*/}
          <span className="sr-only">{translate(`auth.logout`)}</span>
        </div>
      </ButtonCustom>
    </div>
  );
};

export default LogoutButton;
