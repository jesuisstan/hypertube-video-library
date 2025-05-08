'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';

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
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const globalLoading = useUserStore((state) => state.globalLoading);

  const [loading, setLoading] = useState(false);
  const [showProfileCompleteModal, setShowProfileCompleteModal] = useState(false);
  const [profileCompleteModalLayout, setProfileCompleteModalLayout] = useState('basics');

  const handleModifyClick = (layout: keyof typeof TProfileCompleteLayout) => {
    setProfileCompleteModalLayout(layout);
    setShowProfileCompleteModal(true);
  };

  return loading || globalLoading || !user ? (
    <Loading />
  ) : (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={framerMotion}
      className="flex flex-col items-stretch space-y-4"
    >
      <DialogProfileModify
        show={showProfileCompleteModal}
        setShow={setShowProfileCompleteModal}
        startLayout={profileCompleteModalLayout as keyof typeof TProfileCompleteLayout}
      />

      {/* PROFILE GRID */}
      <motion.div
        variants={slideFromBottom}
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

        {/* LOCATION & LANG */}
        <div className="flex flex-col gap-4">
          <LocationWrapper
            address={user?.address}
            modifiable
            onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
          />
          <PrefLangWrapper
            lang={user?.preferred_language}
            modifiable
            onModify={() =>
              handleModifyClick('preferred_language' as keyof typeof TProfileCompleteLayout)
            }
          />
        </div>

        {/* STATUS */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row xl:flex-col xl:justify-start">
          <StatusWrapper confirmed={user?.confirmed} />
          <LastModificationWrapper date={user?.last_action} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
