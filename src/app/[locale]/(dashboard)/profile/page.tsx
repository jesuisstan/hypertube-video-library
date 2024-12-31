'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import DialogProfileIsComplete from '@/components/dialogs-custom/dialog-profile-is-complete';
import ModalProfileComplete from '@/components/dialogs-custom/dialog-profile-modify';
import TProfileCompleteLayout from '@/components/dialogs-custom/dialog-profile-modify';
import AvatarGeneral from '@/components/ui/avatar/avatar-general';
import ProfilePageSkeleton from '@/components/ui/skeletons/profile-page-skeleton';
import DescriptionWrapper from '@/components/wrappers/description-wrapper';
import HeaderWrapper from '@/components/wrappers/header-wrapper';
import InterestsWrapper from '@/components/wrappers/interests-wrapper';
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
    <div>
      <ModalProfileComplete
        show={showProfileCompleteModal}
        setShow={setShowProfileCompleteModal}
        startLayout={profileCompleteModalLayout as keyof typeof TProfileCompleteLayout}
        setProfileIsCompleted={setShowProfileCongratsModal}
      />
      <DialogProfileIsComplete
        show={showProfileCongratsModal}
        setShow={setShowProfileCongratsModal}
      />

      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          {/* HEADER */}
          <HeaderWrapper
            photoURL={user?.photos[0]}
            nickname={user?.nickname ?? '???'}
            firstName={user?.firstname ?? '???'}
            lastName={user?.lastname ?? '???'}
            loading={false}
            modifiable
            onModify={handleModifyClick}
          />
          <div
            className={clsx(
              'flex flex-col items-stretch space-y-4',
              'lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0'
            )}
          >
            <div className={clsx('col-span-12 space-y-5 self-center', 'lg:col-span-6')}></div>
            {/* DESCRIPTION */}
            <DescriptionWrapper
              text={user?.biography}
              modifiable
              onModify={() => handleModifyClick('biography' as keyof typeof TProfileCompleteLayout)}
            />
            {/* STATUS GROUP */}
            <StatusWrapper confirmed={user?.confirmed} lastAction={user?.last_action} />
            {/* LOCATION */}
            <LocationWrapper
              address={user?.address}
              modifiable
              onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-4 grid grid-cols-12 gap-4">
        {/* LEFT SECTOR */}
        <div className={clsx('col-span-12 h-max space-y-5', 'lg:col-span-3')}>
          {/* LOCATION */}
          <LocationWrapper
            address={user?.address}
            modifiable
            onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
          />
        </div>

        {/* CENTER SECTOR */}
        <div className={clsx('col-span-12 space-y-5', 'lg:col-span-6')}>
          {/* AVATAR */}
          <AvatarGeneral
            src={user?.photos[0]}
            nickname={user?.nickname ?? '???'}
            rounded
            width={242}
            height={242}
            onAvatarChange={() =>
              handleModifyClick('photos' as keyof typeof TProfileCompleteLayout)
            }
          />
        </div>

        {/* RIGHT SECTOR */}
        <div className={clsx('col-span-12 space-y-5', 'lg:col-span-3')}>
          {/* INTERESTS */}
          <InterestsWrapper
            tagsList={user?.tags!}
            modifiable
            onModify={() => handleModifyClick('tags' as keyof typeof TProfileCompleteLayout)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
