import { useState } from 'react';

import { Settings } from 'lucide-react';

import LogoutButton from '@/components/menu/logout-button';
import AvatarMini from '@/components/ui/avatar-mini';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import LocaleSwitcher from '@/components/ui/buttons/locale-switcher';
import ThemeToggler from '@/components/ui/buttons/theme-toggler';
import ModalSettings from '@/components/ui/modals/modal-settings';
import { UserNameSkeleton } from '@/components/ui/skeletons/menu-skeleton';
import { formatUserName } from '@/utils/format-string';

const SideBarHeader = ({
  name,
  photoUrl,
  translate,
}: {
  name?: string;
  photoUrl?: string;
  translate: (key: string) => string;
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-2 align-middle">
      <div
        title={name}
        className="flex items-center justify-center space-x-4 align-middle font-bold "
      >
        {/* Avatar */}
        <AvatarMini src={photoUrl!} nickname={name || ''} rounded />

        {/* Nickname */}
        <div className="text-2xl text-foreground">
          {name ? (
            <div className="max-w-[180px] truncate">{name && formatUserName(name)}</div>
          ) : (
            <UserNameSkeleton />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center text-xs font-normal text-foreground">
        <div className="mb-3 mt-5 flex self-center">
          <LocaleSwitcher />
        </div>

        <div className="flex flex-row items-center gap-x-1 self-center align-middle">
          <ModalSettings show={showSettingsModal} setShow={setShowSettingsModal} />
          <ThemeToggler translate={translate} />
          <ButtonCustom
            variant="ghost"
            size="icon"
            title={translate(`settings`)}
            onClick={() => setShowSettingsModal(true)}
            className="smooth42transition hover:bg-transparent hover:text-c42orange"
          >
            <div className="flex flex-row items-center gap-2">
              <Settings />
              {/*<p>{translate(`settings`)}</p>*/}
              <span className="sr-only">{translate(`settings`)}</span>
            </div>
          </ButtonCustom>
          <LogoutButton translate={translate} />
        </div>
      </div>
    </div>
  );
};

export default SideBarHeader;
