import { Dispatch, SetStateAction, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { OctagonAlert, PencilLine } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import DialogBasic from '@/components/ui/dialog/dialog-basic';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const DialogChangePassword = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations();
  const { logout } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleProceed = async () => {
    setLoading(true);
    logout(); // clear local user state

    // Use NextAuth's signOut method
    await signOut({
      redirect: false, // Prevent automatic redirection
      callbackUrl: '/authentication', // Specify where to redirect after logout
    });

    setLoading(false);
    router.push('/authentication'); // Redirect explicitly (optional, as callbackUrl handles it)
  };

  return (
    <DialogBasic
      isOpen={show}
      setIsOpen={setShow}
      title={t('auth.change-password')}
      trigger={
        <ButtonCustom
          title={t('auth.change-password')}
          variant="default"
          size="default"
          className="w-full min-w-32"
        >
          <div className="flex flex-row items-center space-x-5">
            <div>
              <PencilLine size={16} />
            </div>
            <span>{t('auth.change-password')}</span>
          </div>
        </ButtonCustom>
      }
    >
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-10 text-center">
        <div className="mb-5 text-c42orange">
          <OctagonAlert size={60} className="smooth42transition hover:scale-150" />
        </div>
        <TextWithLineBreaks text={t('auth.password-change-message')} />
      </div>

      <div className="flex flex-row justify-center">
        <ButtonCustom
          type="button"
          variant="default"
          onClick={handleProceed}
          className="min-w-32"
          loading={loading}
        >
          {t('proceed')}
        </ButtonCustom>
      </div>
    </DialogBasic>
  );
};

export default DialogChangePassword;
