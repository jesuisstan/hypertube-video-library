import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { CircleAlert } from 'lucide-react';

import { ButtonCustom } from '../ui/buttons/button-custom';

import TooltipBasic from '@/components/tooltips-custom/tooltip-basic';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { useRouter } from '@/i18n/routing';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

const TooltipSocialMediaWarning = () => {
  const t = useTranslations();
  const logout = useUserStore((state) => state.logout);
  const resetSearchStore = useSearchStore((state) => state.resetSearchStore);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleProceed = async () => {
    setLoading(true);
    logout(); // clear local user state
    resetSearchStore(); // clear search filters store

    // Use NextAuth's signOut method
    await signOut({
      redirect: false, // Prevent automatic redirection
      callbackUrl: '/authentication', // Specify where to redirect after logout
    });

    setLoading(false);
    router.push('/authentication'); // Redirect explicitly (optional, as callbackUrl handles it)
  };

  return (
    <div className="xs:flex-row flex flex-col items-center space-x-1">
      <p>{t('auth.social-media-authenticated')}</p>
      <TooltipBasic>
        <div className="m-5 flex flex-col items-center gap-5">
          <div className="text-c42orange">
            <CircleAlert size={42} className="smooth42transition hover:scale-150" />
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
