'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Separator } from '@/components/ui/separator';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';

const EmailConfirmation = () => {
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [displayTitle, setDisplayTitle] = useState('processing');
  const [displayMessage, setDisplayMessage] = useState('processing');

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      const messageParam = query.get('message') || '';
      const errorParam = query.get('error') || '';
      setMessage(messageParam);
      setError(errorParam);
      setDisplayTitle(messageParam ? 'success' : errorParam ? 'error' : 'processing');
      setDisplayMessage(messageParam ? messageParam : errorParam ? errorParam : 'processing');
    }
  }, []);

  return (
    <div
      className="flex w-full items-center justify-center smooth42transition"
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      <div
        id="email-confirmation"
        className="flex w-fit min-w-96 flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5 text-center shadow-md"
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

        <h1
          className={clsx('text-4xl font-bold', displayTitle === 'processing' && 'animate-pulse')}
        >
          {t(`${displayTitle.toLowerCase()}`)}
        </h1>
        <div className={clsx(displayMessage === 'processing' && 'animate-pulse')}>
          <TextWithLineBreaks text={t(`auth.${displayMessage}`)} />
        </div>

        <div id="buttons-block" className="flex w-full flex-col items-center justify-evenly gap-2">
          <ButtonCustom type="button" variant="default" size="default" className="min-w-32">
            <Link href={`/browse`}>{t('return-to') + ' ' + t('browse')}</Link>
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

export default EmailConfirmation;
