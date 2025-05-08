import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Settings } from 'lucide-react';

import DialogChangeEmail from '@/components/dialogs-custom/dialog-change-email';
import DialogChangePassword from '@/components/dialogs-custom/dialog-change-password';
import DialogDeleteAccount from '@/components/dialogs-custom/dialog-delete-account';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import LocaleSwitcher from '@/components/ui/buttons/locale-switcher';
import ThemeToggler from '@/components/ui/buttons/theme-toggler';
import DialogBasic from '@/components/ui/dialog/dialog-basic';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const DialogSettings = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations();
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  return (
    <DialogBasic
      isOpen={show}
      setIsOpen={setShow}
      title={t('settings')}
      trigger={
        <ButtonCustom
          variant="ghost"
          size="icon"
          title={t(`settings`)}
          className="smooth42transition hover:bg-transparent hover:text-c42orange"
        >
          <div className="flex flex-row items-center gap-2">
            <Settings />
            <span className="sr-only">{t(`settings`)}</span>
          </div>
        </ButtonCustom>
      }
    >
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-5 text-center">
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Label>{t(`color-theme`) + ':'}</Label>
            <ThemeToggler translate={t} />
          </div>
          <Separator />
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Label>{t(`app-language`) + ':'}</Label>
            <LocaleSwitcher />
          </div>
          <Separator />
          <DialogChangeEmail show={showChangeEmailModal} setShow={setShowChangeEmailModal} />
          <DialogChangePassword
            show={showChangePasswordModal}
            setShow={setShowChangePasswordModal}
          />
          <DialogDeleteAccount show={showDeleteAccountModal} setShow={setShowDeleteAccountModal} />
        </div>
      </div>
    </DialogBasic>
  );
};

export default DialogSettings;
