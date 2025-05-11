'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Separator } from '@/components/ui/separator';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';

const DefaultErrorPage = () => {
  const t = useTranslations();

  const handleButtonClick = () => {
    if (window.location.pathname.includes('/browse')) {
      window.location.reload();
    } else {
      window.location.href = '/browse';
    }
  };

  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      <div
        id="access-denied-warning"
        className="bg-card flex w-fit min-w-96 flex-col items-center justify-center gap-5 rounded-md p-5 text-center shadow-md"
      >
        <Image
          src="/identity/logo-title-only.png"
          blurDataURL="/identity/logo-title-only.png"
          alt="logo"
          width={121}
          height={0}
          placeholder="empty"
          priority
        />

        <Separator />

        <h1 className="text-3xl font-bold">{t('error') + ' 500'}</h1>
        <TextWithLineBreaks text={t('something-went-wrong')} />

        <div id="buttons-block" className="flex w-full flex-col items-center justify-evenly gap-2">
          <ButtonCustom
            type="button"
            variant="default"
            size="default"
            className="min-w-32"
            onClick={handleButtonClick}
          >
            {t('return-to') + ' ' + t('browse')}
          </ButtonCustom>

          <a
            href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ButtonCustom type="button" variant="link" size="sm">
              <span className="text-muted-foreground">{t('contact-support')}</span>
            </ButtonCustom>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DefaultErrorPage;
