'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Eye, EyeOff } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Label } from '@/components/ui/label';
import { RequiredInput } from '@/components/ui/required-input';
import { Separator } from '@/components/ui/separator';

const PasswordResetPage = () => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    setResetToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const currentForm = formRef.current;
    if (!currentForm) return;
    const formData = new FormData(currentForm);

    // Check if passwords match each other
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('password-confirmation') as string;
    if (newPassword !== confirmPassword) {
      setError(t('auth.passwords-do-not-match'));
      return;
    }

    setLoading(true);

    let response;
    response = await fetch('/api/auth/password/modify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: newPassword,
      }),
    });

    setLoading(false);

    if (!response) return;

    const result = await response.json();

    if (response.ok) {
      setSuccessMessage(t('auth.password-changed-successfully'));
      currentForm.reset();
    } else {
      setError(t(`auth.${result.error}`));
    }
  };

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

        <h1 className="text-2xl font-bold">{t(`auth.change-password`)}</h1>
        {resetToken === 'invalid-token' ? (
          <p className="pt-2 text-lg text-destructive">{t(`auth.invalid-token`)}</p>
        ) : !resetToken ? (
          <p className="animate-pulse pt-2 text-lg">{t(`auth.processing`)}</p>
        ) : (
          <>
            <form
              className="flex min-w-64 flex-col pt-8 text-left"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <>
                <Label htmlFor="password-new" className="mb-2">
                  {t(`auth.new-password`)}
                </Label>
                <div className="relative">
                  <RequiredInput
                    type={showPassword ? 'text' : 'password'}
                    id="password-new"
                    name="password"
                    placeholder={t(`auth.password`)}
                    pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$"
                    errorMessage={t(`auth.password-requirements`)}
                    className="mb-5"
                    disabled={loading || !!successMessage}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || !!successMessage}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
              <>
                <Label htmlFor="password-confirmation" className="mb-2">
                  {t(`auth.confirmation-password`)}
                </Label>
                <div className="relative">
                  <RequiredInput
                    type={showPassword ? 'text' : 'password'}
                    id="password-confirmation"
                    name="password-confirmation"
                    placeholder={t(`auth.password`)}
                    className="mb-5"
                    disabled={loading || !!successMessage}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || !!successMessage}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
              <ButtonCustom
                type="submit"
                variant="default"
                className="mb-5"
                loading={loading}
                disabled={loading || !!successMessage}
              >
                {t(`auth.change-password`)}
              </ButtonCustom>
            </form>
            {error && <p className="mb-5 text-center text-sm text-destructive">{error}</p>}
            {successMessage && (
              <p className="mb-5 text-center text-sm text-c42green">{successMessage}</p>
            )}
          </>
        )}

        <Separator />

        <div id="buttons-block" className="flex w-full flex-col items-center justify-evenly gap-2">
          <ButtonCustom type="button" variant="default" size="default" className="min-w-32">
            <Link href={`/dashboard`}>{t('return-to') + ' ' + t('dashboard')}</Link>
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

export default PasswordResetPage;
