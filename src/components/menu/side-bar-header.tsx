import { useState } from 'react';

import DialogSettings from '@/components/dialogs-custom/dialog-settings';
import LogoutButton from '@/components/menu/logout-button';
import AvatarMini from '@/components/ui/avatar/avatar-mini';
import ThemeToggler from '@/components/ui/buttons/theme-toggler';
import { Separator } from '@/components/ui/separator';
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
        className="mb-2 flex items-center justify-center space-x-4 align-middle font-bold"
      >
        {/* Avatar */}
        <AvatarMini src={photoUrl} nickname={name ?? ''} rounded />

        {/* Nickname */}
        <div className="text-2xl text-foreground">
          {name ? (
            <div className="max-w-[180px] truncate">{name && formatUserName(name)}</div>
          ) : (
            <UserNameSkeleton />
          )}
        </div>
      </div>

      <Separator />
      <div className="flex flex-row items-center gap-x-1 self-center align-middle">
        <ThemeToggler translate={translate} />
        <DialogSettings show={showSettingsModal} setShow={setShowSettingsModal} />
        <LogoutButton translate={translate} />
      </div>
    </div>
  );
};

export default SideBarHeader;
