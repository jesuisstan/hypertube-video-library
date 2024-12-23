'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Separator } from '@/components/ui/separator';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';

const DefaultErrorPage = () => {
  const t = useTranslations();

  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      <div
        id="access-denied-warning"
        className="flex w-fit min-w-96 flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5 text-center shadow-md"
      >
        <Image
          src="/identity/logo-title-only.png"
          blurDataURL="/identity/logo-title-only.png"
          alt="logo"
          width={142}
          height={0}
          placeholder="blur"
          priority
        />

        <h1 className="text-4xl font-bold">{t('error') + ' 500'}</h1>
        <TextWithLineBreaks text={t('something-went-wrong')} />

        <Separator />

        <div id="buttons-block" className="flex w-full flex-col items-center justify-evenly gap-2">
          <ButtonCustom type="button" variant="default" size="default" className="min-w-32">
            <Link href={`/dashboard`}>{t('return-to') + ' ' + t('dashboard')}</Link>
          </ButtonCustom>

          <a href="mailto:support@q3-technology.com" target="_blank" rel="noopener noreferrer">
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
