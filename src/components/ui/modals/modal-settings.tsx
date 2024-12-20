import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslations } from 'next-intl';

import { PenLine, Trash2 } from 'lucide-react';

import { ButtonHypertube } from '@/components/ui/buttons/button-hypertube';
import ModalBasic from '@/components/ui/modals/modal-basic';
import ModalChangeEmail from '@/components/ui/modals/modal-change-email';
import ModalChangePassword from '@/components/ui/modals/modal-change-password';
import ModalDeleteAccount from '@/components/ui/modals/modal-delete-account';

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
      <ModalChangeEmail show={showChangeEmailModal} setShow={setShowChangeEmailModal} />
      <ModalChangePassword show={showChangePasswordModal} setShow={setShowChangePasswordModal} />
      <ModalDeleteAccount show={showDeleteAccountModal} setShow={setShowDeleteAccountModal} />
      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <ButtonHypertube
          title={t('email-change')}
          variant="default"
          size="default"
          className="w-full min-w-32"
          onClick={() => setShowChangeEmailModal(true)}
        >
          <div className="flex flex-row items-center space-x-2">
            <span>{t('auth.email')}</span>
            <div>
              <PenLine size={15} />
            </div>
          </div>
        </ButtonHypertube>
        <ButtonHypertube
          title={t('auth.change-password')}
          variant="default"
          size="default"
          className="w-full min-w-32"
          onClick={() => setShowChangePasswordModal(true)}
        >
          <div className="flex flex-row items-center space-x-2">
            <span>{t('auth.password')}</span>
            <div>
              <PenLine size={15} />
            </div>
          </div>
        </ButtonHypertube>
        <ButtonHypertube
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
        </ButtonHypertube>
      </div>
    </ModalBasic>
  );
};

export default ModalSettings;
