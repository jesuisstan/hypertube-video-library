import { useTranslations } from 'next-intl';

import { OctagonAlert } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import ModalBasic from '@/components/ui/modals/modal-basic';
import { usePathname, useRouter } from '@/i18n/routing';
import { TUser } from '@/types/user';

const ModalProfileWarning = ({ user }: { user: TUser }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  //useEffect(() => {
  //  if (!user?.complete) {
  //    setShow(true);
  //  }
  //}, []);

  const handleProceed = () => {
    if (pathname !== '/profile') {
      router.push('/profile'); // Navigate to /profile if not already there
    }
  };

  return (
    <ModalBasic isOpen={!user?.complete} title={t('attension')}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-5 text-center">
        <div className="text-c42orange">
          <OctagonAlert size={60} className="smooth42transition hover:scale-150" />
        </div>
        <div>
          <p className="max-w-[60vh]">{t('complete-your-profile-message')}</p>
          <br />
          <p className="max-w-[60vh]">{t('not-available-for-search')}</p>
        </div>
      </div>

      <div className="flex flex-row justify-center">
        <ButtonCustom type="button" variant="default" onClick={handleProceed} className="min-w-32">
          {t('proceed')}
        </ButtonCustom>
      </div>
    </ModalBasic>
  );
};

export default ModalProfileWarning;
