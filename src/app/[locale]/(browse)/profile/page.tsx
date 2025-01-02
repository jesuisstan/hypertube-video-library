'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import DialogProfileModify from '@/components/dialogs-custom/dialog-profile-modify';
import TProfileCompleteLayout from '@/components/dialogs-custom/dialog-profile-modify';
import ProfilePageSkeleton from '@/components/ui/skeletons/profile-page-skeleton';
import DescriptionWrapper from '@/components/wrappers/description-wrapper';
import HeaderWrapper from '@/components/wrappers/header-wrapper';
import PrefLangWrapper from '@/components/wrappers/lang-wrapper';
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
    <ProfilePageSkeleton />
  ) : (
    <div className="flex flex-col items-stretch space-y-4">
      <DialogProfileModify
        show={showProfileCompleteModal}
        setShow={setShowProfileCompleteModal}
        startLayout={profileCompleteModalLayout as keyof typeof TProfileCompleteLayout}
      />

      {/* HEADER */}
      <div className={clsx('flex flex-row flex-wrap items-end gap-4')}>
        <HeaderWrapper
          photoURL={user?.photos[0]}
          nickname={user?.nickname ?? '???'}
          firstName={user?.firstname ?? '???'}
          lastName={user?.lastname ?? '???'}
          loading={false}
          modifiable
          onModify={handleModifyClick}
        />
        {/* STATUS GROUP */}
        <StatusWrapper confirmed={user?.confirmed} lastAction={user?.last_action} />
      </div>

      {/* MAIN CONTENT */}
      <div className={clsx('flex flex-col items-stretch gap-4', 'lg:flex-row lg:items-start')}>
        {/* DESCRIPTION */}
        <div className="w-full basis-1/3">
          <DescriptionWrapper
            text={user?.biography}
            modifiable
            onModify={() => handleModifyClick('description' as keyof typeof TProfileCompleteLayout)}
          />
        </div>
        {/* LOCATION */}
        <div className="w-full basis-1/3">
          <LocationWrapper
            address={user?.address}
            modifiable
            onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
          />
        </div>
        {/* LANGUAGE PREFERED */}
        <div className="w-full basis-1/3">
          <PrefLangWrapper
            lang={user?.prefered_language}
            modifiable
            onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
