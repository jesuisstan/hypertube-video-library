'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ButtonHypertube } from '@/components/ui/buttons/button-hypertube';
import { Separator } from '@/components/ui/separator';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';

const NotFoundPage = () => {
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
        <h1 className="text-4xl font-bold">{t('error') + ' 404' + ': ' + t('not-found.title')}</h1>
        <TextWithLineBreaks text={t('not-found.content')} />

        <Separator />

        <div id="buttons-block" className="flex w-full flex-col items-center justify-evenly gap-2">
          <ButtonHypertube type="button" variant="default" size="default" className="min-w-32">
            <Link href={`/dashboard`}>{t('return-to') + ' ' + t('dashboard')}</Link>
          </ButtonHypertube>

          <a href="mailto:support@q3-technology.com" target="_blank" rel="noopener noreferrer">
            <ButtonHypertube type="button" variant="link" size="sm">
              {t('contact-support')}
            </ButtonHypertube>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
