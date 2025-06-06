import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Settings } from 'lucide-react';

import DialogBasic from '@/components/dialogs-custom/dialog-basic';
import DialogChangeEmail from '@/components/dialogs-custom/dialog-change-email';
import DialogChangePassword from '@/components/dialogs-custom/dialog-change-password';
import DialogDeleteAccount from '@/components/dialogs-custom/dialog-delete-account';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';

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
          className="smooth42transition hover:text-c42orange hover:bg-transparent"
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
