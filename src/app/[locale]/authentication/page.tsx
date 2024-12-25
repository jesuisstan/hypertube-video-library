'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

import SocialMediaAuth from '@/app/[locale]/authentication/(components)/social-media-auth';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import LocaleSwitcher from '@/components/ui/buttons/locale-switcher';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import { Separator } from '@/components/ui/separator';
import useSearchStore from '@/stores/search';
import { spaceToKebab } from '@/utils/format-string';

const Authentication = () => {
  const t = useTranslations();
  const { resetSearchStore } = useSearchStore();
  const router = useRouter();
  const [pageLayout, setPageLayout] = React.useState('login');
  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loginMethod, setLoginMethod] = React.useState('email'); // <'email' | 'nickname'>

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
        resetSearchStore(); // reset search store
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
        response = await fetch('/api/auth/password-forgotten-email', {
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
          if (result) {
            setLoading(true);
            router.push('/dashboard');
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
    <div className={clsx('flex h-screen w-screen items-center justify-center bg-card')}>
      <div
        className={clsx(
          'hidden h-screen items-center justify-center bg-card',
          'md:flex md:w-2/3',
          'lg:flex lg:w-3/4'
        )}
      >
        <div className="relative flex h-full w-full">
          <div className="flex items-center justify-center align-middle">
            <Image
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
            />
          </div>
          <div className="absolute bottom-0 z-10 p-4 text-foreground">
            {/*<h2 className="mb-2 text-2xl smooth42transition xl:text-3xl">{t(`slogan`)}</h2>*/}
            <div className="text-sm">
              Hypertube Video Library {t(`rights-reserved`)}
              {'. '}
              {t(`service-provided`)}{' '}
              <a
                href={`https://www.krivtsoff.site/`}
                target="_blank"
                className="my-6 text-center text-sm text-c42green transition-all duration-300 ease-in-out hover:text-c42orange"
              >
                Stan Krivtsoff
              </a>
              {'. '}
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'm-auto flex h-full w-full flex-col overflow-y-scroll pl-5 pr-5',
          'md:w-1/3',
          'lg:w-1/4'
        )}
      >
        <div className="flex flex-row items-center justify-center gap-5 md:hidden">
          <Image
            src="/identity/logo-square.png"
            blurDataURL="/identity/logo-square.png"
            className="z-10 mt-5"
            alt="logo"
            width={30}
            height={0}
            placeholder="blur"
            priority
          />
          <Image
            src="/identity/logo-title-only.png"
            blurDataURL="/identity/logo-title-only.png"
            className="z-10 mt-5"
            alt="logo"
            width={200}
            height={0}
            placeholder="blur"
            priority
          />
        </div>
        <div className="my-5 flex self-center">
          <LocaleSwitcher />
        </div>
        <h2 className="mb-5 text-center text-2xl text-foreground">
          {pageLayout === 'login' && t(`auth.sign-in`)}
          {pageLayout === 'register' && t(`auth.register-new`)}
          {pageLayout === 'confirmation' && t(`auth.confirm-email`)}
          {pageLayout === 'forgot' && t(`auth.reset-password`)}
        </h2>

        {/* Social login buttons */}
        {(pageLayout === 'login' || pageLayout === 'register') && <SocialMediaAuth />}
        {/* Horizontal devider */}
        {(pageLayout === 'login' || pageLayout === 'register') && (
          <Separator text={t(`or`).toUpperCase()} />
        )}

        {/* Login method selector */}
        {pageLayout === 'login' && (
          <div className="mb-7 flex flex-row justify-start gap-5">
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
                className="mb-2"
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
                className="mb-2"
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
                className="mb-2"
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
                className="mb-2"
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
                className="mb-2"
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
                  className="mb-5"
                />
                <button
                  type="button"
                  className="absolute right-2 top-[7px] text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </>
          )}

          {/* Submit button */}
          <ButtonCustom type="submit" variant="default" className="mb-5" loading={loading}>
            {pageLayout === 'login' && t(`auth.sign-in`)}
            {pageLayout === 'register' && t(`auth.sign-up`)}
            {pageLayout === 'confirmation' && t(`auth.resend-confirmation-email`)}
            {pageLayout === 'forgot' && t(`auth.send-reset-link`)}
          </ButtonCustom>
        </form>
        {error && <p className="mb-5 text-center text-sm text-destructive">{error}</p>}
        {successMessage && (
          <p className="mb-5 text-center text-sm text-c42green">{successMessage}</p>
        )}
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
              <Separator text={t(`or`).toUpperCase()} />
              <div className="flex flex-col items-center justify-center gap-2 xs:flex-row">
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
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
          className="my-6 text-center text-sm text-muted-foreground transition-all duration-300 ease-in-out hover:text-c42orange"
        >
          {t(`need-help`)}
        </a>
      </div>
    </div>
  );
};

export default Authentication;
