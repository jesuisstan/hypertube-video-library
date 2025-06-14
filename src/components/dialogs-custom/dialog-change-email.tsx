import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { User as TUser } from 'next-auth';
import { useTranslations } from 'next-intl';

import { Eye, EyeOff, Mail } from 'lucide-react';
import { Save } from 'lucide-react';

import DialogBasic from '@/components/dialogs-custom/dialog-basic';
import TooltipSocialMediaWarning from '@/components/tooltips-custom/tooltip-social-media-warning';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Label } from '@/components/ui/label';
import { RequiredInput } from '@/components/ui/required-input';
import useUpdateSession from '@/hooks/useUpdateSession';
import useUserStore from '@/stores/user';

const DialogChangeEmail = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const { updateSession } = useUpdateSession();
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);
    //const data = Object.fromEntries(formData.entries());
    const newEmail = formData.get('email-new');
    const confirmEmail = formData.get('email-confirm');

    if (newEmail !== confirmEmail) {
      setError(t('email-mismatch'));
      setLoading(false);
      return;
    }

    if (newEmail === user?.email) {
      setSuccessMessage(t('data-is-up-to-date'));
      setLoading(false);
      return;
    }

    let response: any;
    try {
      response = await fetch(`/api/auth/update-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          email: newEmail,
          password: formData.get('password'),
        }),
      });

      const result = await response.json();
      const updatedUserData: TUser = result.user;
      if (response.ok) {
        setSuccessMessage(t(result.message));
        if (updatedUserData) {
          //setUser({ ...user, ...updatedUserData });
          await updateSession(updatedUserData);
        }
      } else {
        setError(t(result.error));
      }
    } catch (error) {
      setError(t(error as string));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogBasic
      isOpen={show}
      setIsOpen={setShow}
      title={t('email-change')}
      description={t('email-current') + ': ' + user?.email}
      trigger={
        <ButtonCustom
          title={t('email-change')}
          variant="default"
          size="default"
          className="w-full min-w-32"
        >
          <div className="flex flex-row items-center space-x-5">
            <div>
              <Mail size={16} />
            </div>
            <span>{t('email-change')}</span>
          </div>
        </ButtonCustom>
      }
    >
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-5 text-center">
        <TooltipSocialMediaWarning />
        <form
          className="flex flex-col items-center justify-center text-left align-middle"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex flex-col">
            <div className="flex flex-col">
              <Label htmlFor="email-new" className="mb-2">
                {t(`email-new`)}
              </Label>
              <RequiredInput
                type="email"
                id="email-new"
                name="email-new"
                placeholder={t(`email-new-enter`)}
                autoComplete="email"
                maxLength={42}
                className="mb-2"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="email-confirm" className="mb-2">
                {t(`email-new-confirmation`)}
              </Label>
              <RequiredInput
                type="email"
                id="email-confirm"
                name="email-confirm"
                placeholder={t(`email-new-enter-again`)}
                autoComplete="new-email-confirmation"
                maxLength={42}
                className="mb-2"
              />
            </div>
            <div className="flex flex-col">
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
                  className="text-muted-foreground absolute top-2 right-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
          </div>

          <ButtonCustom
            variant="default"
            title={t('save')}
            size="default"
            className="w-full min-w-32"
            type="submit"
            loading={loading}
          >
            <div className="flex flex-row items-center space-x-2">
              <div>
                <Save size={16} />
              </div>
              <span>{t('save')}</span>
            </div>
          </ButtonCustom>
        </form>
        <div className="min-h-6">
          {error && <p className="text-destructive mb-5 text-center text-sm">{error}</p>}
          {successMessage && (
            <p className="text-positive mb-5 text-center text-sm">{successMessage}</p>
          )}
        </div>
      </div>
    </DialogBasic>
  );
};

export default DialogChangeEmail;
