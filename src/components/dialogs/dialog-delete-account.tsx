import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Eye, EyeOff } from 'lucide-react';
import { Trash2 } from 'lucide-react';

import DialogBasic from '@/components/dialogs/dialog-basic';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Label } from '@/components/ui/label';
import { RequiredInput } from '@/components/ui/required-input';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const DialogDeleteAccount = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
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
    let response: any;
    try {
      response = await fetch(`/api/profile/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          password: formData.get('password'),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(t(result.message));
        setTimeout(async () => {
          logout(); // clear local user state

          // Use NextAuth's signOut method
          await signOut({
            redirect: false, // Prevent automatic redirection
            callbackUrl: '/authentication', // Specify where to redirect after logout
          });

          router.push('/authentication'); // Redirect explicitly (optional, as callbackUrl handles it)
        }, 1000);
      } else {
        setError(t(result.error));
      }
    } catch (error) {
      setError(t(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogBasic
      isOpen={show}
      setIsOpen={setShow}
      title={t('delete-account')}
      trigger={
        <ButtonCustom
          title={t('delete-account')}
          variant="destructive"
          size="default"
          className="w-full min-w-32"
        >
          <div className="flex flex-row items-center space-x-5">
            <div>
              <Trash2 size={16} />
            </div>
            <span>{t('delete-account')}</span>
          </div>
        </ButtonCustom>
      }
    >
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-5 text-center">
        <p className="text-destructive">{t('are-you-sure')}</p>
        <form
          className="flex flex-col items-center justify-center text-left align-middle"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex flex-col">
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
                  className="absolute right-2 top-2 text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
          </div>

          <ButtonCustom
            variant="destructive"
            title={t('delete')}
            size="default"
            className="w-full min-w-32"
            type="submit"
            loading={loading}
          >
            <div className="flex flex-row items-center space-x-5">
              <div>
                <Trash2 size={15} />
              </div>
              <span>{t('delete')}</span>
            </div>
          </ButtonCustom>
        </form>
        <div className="min-h-6">
          {error && <p className="mb-5 text-center text-sm text-destructive">{error}</p>}
          {successMessage && (
            <p className="mb-5 text-center text-sm text-c42green">{successMessage}</p>
          )}
        </div>
      </div>
    </DialogBasic>
  );
};

export default DialogDeleteAccount;
