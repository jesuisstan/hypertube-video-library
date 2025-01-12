'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import Loading from '@/app/loading';
import DialogProfileModify from '@/components/dialogs-custom/dialog-profile-modify';
import TProfileCompleteLayout from '@/components/dialogs-custom/dialog-profile-modify';
import DescriptionWrapper from '@/components/wrappers/description-wrapper';
import HeaderWrapper from '@/components/wrappers/header-wrapper';
import PrefLangWrapper from '@/components/wrappers/lang-wrapper';
import LastModificationWrapper from '@/components/wrappers/last-modification-wrapper';
import LocationWrapper from '@/components/wrappers/location-wrapper';
import StatusWrapper from '@/components/wrappers/status-wrapper';
import useUserStore from '@/stores/user';

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const globalLoading = useUserStore((state) => state.globalLoading);

  const [loading, setLoading] = useState(false);
  const [showProfileCompleteModal, setShowProfileCompleteModal] = useState(false);
  const [showProfileCongratsModal, setShowProfileCongratsModal] = useState(false);
  const [profileCompleteModalLayout, setProfileCompleteModalLayout] = useState('basics');

  const handleModifyClick = (layout: keyof typeof TProfileCompleteLayout) => {
    setProfileCompleteModalLayout(layout);
    setShowProfileCompleteModal(true);
  };

  return loading || globalLoading || !user ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-stretch space-y-4">
      <DialogProfileModify
        show={showProfileCompleteModal}
        setShow={setShowProfileCompleteModal}
        startLayout={profileCompleteModalLayout as keyof typeof TProfileCompleteLayout}
      />

      {/* PROFILE GRID */}
      <div
        className={clsx(
          'grid gap-4',
          'auto-rows-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}
      >
        {/* HEADER */}
        <div>
          <HeaderWrapper
            photoURL={user?.photos[0]}
            nickname={user?.nickname ?? '???'}
            firstName={user?.firstname ?? '???'}
            lastName={user?.lastname ?? '???'}
            loading={false}
            modifiable
            onModify={handleModifyClick}
          />
        </div>
        {/* DESCRIPTION */}
        <div>
          <DescriptionWrapper
            text={user?.biography}
            modifiable
            onModify={() => handleModifyClick('description' as keyof typeof TProfileCompleteLayout)}
          />
        </div>

        {/* STATUS */}
        <div>
          <StatusWrapper confirmed={user?.confirmed} />
        </div>

        {/* LAST ACTION */}
        <div>
          <LastModificationWrapper date={user?.last_action} />
        </div>

        {/* LOCATION */}
        <div>
          <LocationWrapper
            address={user?.address}
            modifiable
            onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
          />
        </div>

        {/* PREFERRED LANGUAGE */}
        <div>
          <PrefLangWrapper
            lang={user?.preferred_language}
            modifiable
            onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
