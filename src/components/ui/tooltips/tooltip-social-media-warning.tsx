import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { OctagonAlert } from 'lucide-react';

import { ButtonCustom } from '../buttons/button-custom';

import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import TooltipBasic from '@/components/ui/tooltips/tooltip-basic';
import { useRouter } from '@/i18n/routing';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

const TooltipSocialMediaWarning = () => {
  const t = useTranslations();
  const { logout } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resetSearchStore } = useSearchStore();

  const handleProceed = async () => {
    setLoading(true);
    resetSearchStore(); // reset search store
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
    <div className="flex flex-col items-center space-x-1 xs:flex-row">
      <p>{t('auth.social-media-authenticated')}</p>
      <TooltipBasic>
        <div className="m-5 flex flex-col items-center gap-5">
          <div className="text-c42orange">
            <OctagonAlert size={42} className="smooth42transition hover:scale-150" />
          </div>
          <div className="flex max-w-96">
            <TextWithLineBreaks text={t('auth.social-media-email-password-change-tooltip')} />
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
        </div>
      </TooltipBasic>
    </div>
  );
};

export default TooltipSocialMediaWarning;
