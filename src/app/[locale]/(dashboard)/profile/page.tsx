'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import ModalProfileComplete from '@/components/ui/modals/modal-profile-complete';
import TProfileCompleteLayout from '@/components/ui/modals/modal-profile-complete';
import ModalProfileCongrats from '@/components/ui/modals/modal-profile-congrats';
import ProfilePageSkeleton from '@/components/ui/skeletons/profile-page-skeleton';
import ConfirmationWrapper from '@/components/wrappers/confirmation-wrapper';
import DescriptionWrapper from '@/components/wrappers/description-wrapper';
import InterestsWrapper from '@/components/wrappers/interests-wrapper';
import LabelsWrapper from '@/components/wrappers/labels-wrapper';
import LocationWrapper from '@/components/wrappers/location-wrapper';
import PhotoGalleryWrapper from '@/components/wrappers/photo-gallery-wrapper';
import RatingWrapper from '@/components/wrappers/rating-wrapper';
import StatusWrapper from '@/components/wrappers/status-wrapper';
import useUserStore from '@/stores/user';
import { calculateAge } from '@/utils/format-string';

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const globalLoading = useUserStore((state) => state.globalLoading);

  const [loading, setLoading] = useState(false);
  const [showProfileCompleteModal, setShowProfileCompleteModal] = useState(false);
  const [showProfileCongratsModal, setShowProfileCongratsModal] = useState(false);
  const [profileCompleteModalLayout, setProfileCompleteModalLayout] = useState('basics');

  //useEffect(() => {
  //  if (!user) return;
  //  if (!user?.complete) {
  //    setShowProfileCompleteModal(true);
  //  }
  //}, [user]);

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
      <ModalProfileCongrats show={showProfileCongratsModal} setShow={setShowProfileCongratsModal} />

      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div id="user-nickname" className="mb-2 flex w-fit flex-wrap gap-x-2 smooth42transition">
            {/* CONFIRMED ? */}
            <ConfirmationWrapper confirmed={user?.confirmed} />
            <h1
              title={user?.nickname ?? '???'}
              className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit"
            >
              {user?.nickname ?? '???'}
            </h1>
          </div>
          <div
            className={clsx(
              'flex flex-col items-stretch space-y-4',
              'lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0'
            )}
          >
            {/* LABELS */}
            <LabelsWrapper
              firstName={user?.firstname ?? '???'}
              lastName={user?.lastname ?? '???'}
              //age={calculateAge(user?.birthdate)}
              //sex={user?.sex ?? '???'}
              age={calculateAge('0')}
              sex={'???'}
              loading={false}
              modifiable
              onModify={() => handleModifyClick('basics' as keyof typeof TProfileCompleteLayout)}
            />
            {/* DESCRIPTION */}
            <DescriptionWrapper
              text={user?.biography}
              modifiable
              onModify={() => handleModifyClick('biography' as keyof typeof TProfileCompleteLayout)}
            />
            {/* STATUS GROUP */}
            {/*<StatusWrapper onlineStatus={user?.online} lastAction={user?.last_action} />*/}
            <StatusWrapper onlineStatus={false} lastAction={user?.last_action} />
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
          {/* PHOTOS */}
          <PhotoGalleryWrapper
            profile={user}
            modifiable
            onModify={() => handleModifyClick('photos' as keyof typeof TProfileCompleteLayout)}
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
