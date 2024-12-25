import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Trash2 } from 'lucide-react';

import ModalBasic from '@/components/modals/modal-basic';
import ModalDeleteAccount from '@/components/modals/modal-delete-account';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import DialogChangeEmail from '@/components/ui/dialogs/dialog-change-email';
import DialogChangePassword from '@/components/ui/dialogs/dialog-change-password';

const ModalSettings = ({
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
    <ModalBasic isOpen={show} setIsOpen={setShow} title={t('settings')}>
      <ModalDeleteAccount show={showDeleteAccountModal} setShow={setShowDeleteAccountModal} />
      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <DialogChangeEmail show={showChangeEmailModal} setShow={setShowChangeEmailModal} />
        <DialogChangePassword show={showChangePasswordModal} setShow={setShowChangePasswordModal} />
        <ButtonCustom
          title={t('delete-account')}
          variant="destructive"
          size="default"
          className="w-full min-w-32"
          onClick={() => setShowDeleteAccountModal(true)}
        >
          <div className="flex flex-row items-center space-x-2">
            <span>{t('account')}</span>
            <div>
              <Trash2 size={15} />
            </div>
          </div>
        </ButtonCustom>
      </div>
    </ModalBasic>
  );
};

export default ModalSettings;
