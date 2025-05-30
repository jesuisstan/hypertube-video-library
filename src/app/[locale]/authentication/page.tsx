'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { EmblaOptionsType } from 'embla-carousel';
import { Eye, EyeOff } from 'lucide-react';

import { SLIDES } from './(components)/slides';

import SocialMediaAuth from '@/app/[locale]/authentication/(components)/social-media-auth';
import EmblaCarouselAutoscrolling from '@/components/carousel/embla-carousel-autoscrolling';
import Footer from '@/components/footer';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import LocaleSwitcher from '@/components/ui/buttons/locale-switcher';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import { Separator } from '@/components/ui/separator';
import { Link, useRouter } from '@/i18n/routing';
import useSearchStore from '@/stores/search';
import { spaceToKebab } from '@/utils/format-string';

const OPTIONS: EmblaOptionsType = { loop: true };

const Authentication = () => {
  const t = useTranslations();
  const router = useRouter();
  const resetSearchStore = useSearchStore((state) => state.resetSearchStore);
  const setGenresList = useSearchStore((state) => state.setGenresList);
  const [pageLayout, setPageLayout] = React.useState('login');
  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loginMethod, setLoginMethod] = React.useState('email'); // <'email' | 'nickname'>

  const scrapeGenresList = async () => {
    try {
      const response = await fetch(`/api/genres`);
      const data = await response.json();
      setGenresList(data);
    } catch (error) {
      console.error('Error scraping TMDB:', error);
    }
  };

  useEffect(() => {
    scrapeGenresList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const currentForm = formRef.current;
    if (!currentForm) return;
    const formData = new FormData(currentForm);

    // Trim spaces from all input values
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        formData.set(key, value.trim());
      }
    });

    let response;
    switch (pageLayout) {
      case 'login':
        setLoading(true);
        response = await signIn('credentials', {
          redirect: false,
          emailOrNickname:
            loginMethod === 'email' ? formData.get('email') : formData.get('nickname-login'),
          password: formData.get('password'),
        });
        setLoading(false);
        break;
      case 'register':
        setLoading(true);
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            nickname: formData.get('nickname'),
          }),
        });
        setLoading(false);
        break;
      case 'confirmation':
        setLoading(true);
        response = await fetch('/api/auth/resend-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
          }),
        });
        setLoading(false);
        break;
      case 'forgot':
        setLoading(true);
        response = await fetch('/api/auth/password/forgotten-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
          }),
        });
        setLoading(false);
        break;
    }

    if (!response) return;

    const result = response instanceof Response ? await response.json() : response;

    if (response.ok) {
      switch (pageLayout) {
        case 'login':
          resetSearchStore(); // clear search filters store;
          if (result) {
            setLoading(true);
            router.push('/browse');
          } else {
            if (result.error) {
              setError(t(`auth.${spaceToKebab(result.error).toLocaleLowerCase()}`));
            } else if (result.message) {
              setSuccessMessage(t(`auth.${spaceToKebab(result.message).toLocaleLowerCase()}`));
            }
            setLoading(false);
          }
          break;
        case 'register':
          setSuccessMessage(t(`auth.${result.message}`));
          setPageLayout('login');
          break;
        case 'confirmation':
          setSuccessMessage(t(`auth.${result.message}`));
          break;
        case 'forgot':
          setSuccessMessage(t(`auth.${spaceToKebab(result.message).toLocaleLowerCase()}`));
          break;
      }
    } else {
      if (result.error) {
        setError(t(`auth.${spaceToKebab(result.error).toLocaleLowerCase()}`));
      } else if (result.message) {
        setSuccessMessage(t(`auth.${spaceToKebab(result.message).toLocaleLowerCase()}`));
      }
    }
  };

  return (
    <div className={clsx('bg-card flex h-screen w-screen items-center justify-center')}>
      <div
        className={clsx(
          'bg-card hidden h-screen items-center justify-center',
          'md:flex md:w-2/3',
          'lg:flex lg:w-3/4'
        )}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="flex items-center justify-center align-middle">
            {/*<Image
              src="/identity/hypertube-high-resolution-logo-transparent.png"
              blurDataURL="/identity/hypertube-high-resolution-logo-transparent.png"
              alt="high-resolution-logo"
              placeholder="empty"
              priority
              className="max-h-[90%] max-w-[90%] object-contain"
              sizes="auto"
              style={{ width: 3000, height: 1500 }}
              width={0}
              height={0}
            />*/}
            <EmblaCarouselAutoscrolling
              slides={SLIDES!}
              options={OPTIONS}
              className="max-w-[70vw]"
            />
          </div>
          <div className="text-foreground absolute bottom-0 z-10 p-4">
            <Footer />
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'm-auto flex h-full w-full flex-col gap-4 overflow-y-scroll py-4 pr-4 pl-4',
          'md:w-1/3',
          'lg:w-1/4'
        )}
      >
        <div className="flex flex-row items-center justify-center gap-4 md:hidden">
          <Image
            src="/identity/logo-square.png"
            blurDataURL="/identity/logo-square.png"
            className="z-10"
            alt="logo"
            width={30}
            height={0}
            placeholder="blur"
            priority
          />
          <Image
            src="/identity/logo-title-only.png"
            blurDataURL="/identity/logo-title-only.png"
            className="z-10"
            alt="logo"
            width={200}
            height={0}
            placeholder="blur"
            priority
          />
        </div>
        <div className="mt-1 flex self-center">
          <LocaleSwitcher />
        </div>
        <h1 className="text-foreground text-center text-2xl">
          {pageLayout === 'login' && t(`auth.sign-in`)}
          {pageLayout === 'register' && t(`auth.register-new`)}
          {pageLayout === 'confirmation' && t(`auth.confirm-email`)}
          {pageLayout === 'forgot' && t(`auth.reset-password`)}
        </h1>

        {/* Social login buttons */}
        {(pageLayout === 'login' || pageLayout === 'register') && (
          <SocialMediaAuth translate={t} setError={setError} />
        )}
        {/* Horizontal devider */}
        {(pageLayout === 'login' || pageLayout === 'register') && (
          <div className="text-muted-foreground flex w-full items-center justify-center gap-2 overflow-hidden px-4">
            <Separator />
            <span className="text-muted-foreground text-nowrap">{t(`or-continue-with`)}</span>
            <Separator />
          </div>
        )}

        {/* Login method selector */}
        {pageLayout === 'login' && (
          <div className="mb-2">
            <RadioGroup
              label={t(`auth.login-method`) + ':'}
              options={[
                { value: 'email', label: t(`auth.email`) },
                { value: 'nickname', label: t(`nickname`) },
              ]}
              defaultValue="email"
              selectedItem={loginMethod}
              onSelectItem={setLoginMethod}
            />
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col" onSubmit={handleSubmit} ref={formRef}>
          {/* Register form */}
          {pageLayout === 'register' && (
            <>
              <Label htmlFor="firstname" className="mb-2">
                {t(`firstname`)}
              </Label>
              <RequiredInput
                type="text"
                id="firstname"
                name="firstname"
                placeholder={t(`firstname`)}
                maxLength={21}
                pattern="^[A-Za-z\-]{1,21}$"
                errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
              />
              <Label htmlFor="lastname" className="mb-2">
                {t(`lastname`)}
              </Label>
              <RequiredInput
                type="text"
                id="lastname"
                name="lastname"
                placeholder={t('lastname')}
                maxLength={21}
                pattern="^[A-Za-z\-]{1,21}$"
                errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
              />
              <Label htmlFor="nickname" className="mb-2">
                {t(`nickname`)}
              </Label>
              <RequiredInput
                type="text"
                id="nickname"
                name="nickname"
                placeholder={t(`nickname`)}
                pattern="^[A-Za-z0-9\-@]{1,21}$"
                maxLength={21}
                errorMessage={t('auth.max-char') + ' 21: a-Z 0-9 - @'}
              />
            </>
          )}

          {/* Login form with Nickname */}
          {pageLayout === 'login' && loginMethod === 'nickname' && (
            <>
              <Label htmlFor="nickname-login" className="mb-2">
                {t(`nickname`)}
              </Label>
              <RequiredInput
                type="text"
                id="nickname-login"
                name="nickname-login"
                placeholder={t(`nickname`)}
                pattern="^[A-Za-z0-9\-@]{1,21}$"
                maxLength={21}
                errorMessage={t('auth.max-char') + ' 21: a-Z 0-9 - @'}
              />
            </>
          )}

          {/* Login form with Email */}
          {((pageLayout === 'login' && loginMethod === 'email') || pageLayout !== 'login') && (
            <>
              <Label htmlFor="email" className="mb-2">
                {t(`auth.email`)}
              </Label>
              <RequiredInput
                type="email"
                id="email"
                name="email"
                placeholder={t(`auth.email`)}
                autoComplete="email"
                maxLength={42}
                //errorMessage="Valid email with max length 42"
                //pattern="^(?=.{1,42}$)\\S+@\\S+\\.\\S+$"
              />
            </>
          )}

          {/* Password Input */}
          {pageLayout !== 'confirmation' && pageLayout !== 'forgot' && (
            <>
              <Label htmlFor="password" className="mb-2">
                {t(`auth.password`)}
              </Label>
              <div className="relative">
                <RequiredInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder={t(`auth.password`)}
                  autoComplete="current-password"
                  errorMessage={t(`auth.password-requirements`)}
                  minLength={8}
                  maxLength={21}
                  pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$"
                />
                <button
                  type="button"
                  className="text-muted-foreground absolute top-[7px] right-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </>
          )}

          {/* Submit button */}
          <ButtonCustom type="submit" variant="default" loading={loading}>
            {pageLayout === 'login' && t(`auth.sign-in`)}
            {pageLayout === 'register' && t(`auth.sign-up`)}
            {pageLayout === 'confirmation' && t(`auth.resend-confirmation-email`)}
            {pageLayout === 'forgot' && t(`auth.send-reset-link`)}
          </ButtonCustom>
        </form>
        {error && <p className="text-destructive text-center text-sm">{error}</p>}
        {successMessage && <p className="text-positive text-center text-sm">{successMessage}</p>}
        <div className="flex justify-center">
          {pageLayout !== 'login' && (
            <ButtonCustom
              variant="link"
              onClick={() => {
                setPageLayout('login');
                setError('');
                setSuccessMessage('');
              }}
            >
              {t(`auth.back-to-login`)}
            </ButtonCustom>
          )}

          {/* Additional buttons */}
          {pageLayout === 'login' && (
            <div className="flex w-full flex-col items-center justify-center gap-2 align-middle">
              {/* Horizontal devider with text */}
              <div className="text-muted-foreground flex w-full items-center justify-center gap-2 overflow-hidden px-4">
                <Separator />
                <span className="text-muted-foreground">{t(`or`)}</span>
                <Separator />
              </div>
              {/* Buttons to switch between login, register and confirmation */}
              <div className="xs:flex-row flex flex-col items-center justify-center gap-2">
                <ButtonCustom
                  variant="link"
                  onClick={() => {
                    setPageLayout('register');
                    setError('');
                    setSuccessMessage('');
                  }}
                  disabled={loading}
                  className="w-44 md:w-28"
                >
                  {t(`auth.create-account`)}
                </ButtonCustom>
                <ButtonCustom
                  variant="link"
                  onClick={() => {
                    setPageLayout('confirmation');
                    setError('');
                    setSuccessMessage('');
                  }}
                  disabled={loading}
                  className="w-44 md:w-28"
                >
                  {t(`auth.confirm-email`)}
                </ButtonCustom>
                <ButtonCustom
                  variant="link"
                  onClick={() => {
                    setPageLayout('forgot');
                    setError('');
                    setSuccessMessage('');
                  }}
                  disabled={loading}
                  className="w-44 md:w-28"
                >
                  {t(`auth.forgot-password`)}
                </ButtonCustom>
              </div>
            </div>
          )}
        </div>
        <div className="mt-16 flex w-full flex-col items-center justify-center gap-4 align-middle">
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
            className="text-muted-foreground hover:text-c42orange smooth42transition text-center text-sm"
          >
            {t(`need-help`)}
          </a>
          <div className="text-muted-foreground hover:text-c42orange smooth42transition text-center text-sm">
            <Link href={`/about`}>{t('about')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
