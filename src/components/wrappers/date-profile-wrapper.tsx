'use client';

import { Dispatch, SetStateAction } from 'react';

import clsx from 'clsx';

import DescriptionWrapper from '@/components/wrappers/description-wrapper';
import HeaderWrapper from '@/components/wrappers/header-wrapper';
import InterestsWrapper from '@/components/wrappers/interests-wrapper';
import LocationWrapper from '@/components/wrappers/location-wrapper';
import StatusWrapper from '@/components/wrappers/status-wrapper';
import { TDateProfile } from '@/types/date-profile';

const DateProfileWrapper = ({
  dateProfile,
  setDateProfile,
  isMatch,
  isLiked,
  isLikedBy,
  isBlocked,
}: {
  dateProfile: TDateProfile;
  setDateProfile: Dispatch<SetStateAction<TDateProfile | null>>;
  isMatch: boolean;
  isLiked: boolean;
  isLikedBy: boolean;
  isBlocked: boolean;
}) => {
  return (
    <div>
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div className="mb-2 flex w-fit flex-wrap gap-x-2 smooth42transition">
            <h1
              id="user-nickname"
              title={dateProfile?.nickname ?? '???'}
              className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit"
            >
              {dateProfile?.nickname ?? '???'}
            </h1>
          </div>
          <div
            className={clsx(
              'flex flex-col items-stretch space-y-4',
              'lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0'
            )}
          >
            {/* LABELS */}
            {/*<LabelsWrapper
              firstName={dateProfile?.firstname ?? '???'}
              lastName={dateProfile?.lastname ?? '???'}
              loading={false}
            />*/}
            {/* DESCRIPTION */}
            <DescriptionWrapper text={dateProfile?.biography} />
            {/* STATUS GROUP */}
            <StatusWrapper
              confirmed={dateProfile?.confirmed}
              lastAction={dateProfile?.last_action}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-4 grid grid-cols-12 gap-4">
        {/* LEFT SECTOR */}
        <div className={clsx('col-span-12 h-max space-y-5', 'lg:col-span-3')}>
          {/* LOCATION */}
          <LocationWrapper address={dateProfile?.address} />
        </div>

        {/* RIGHT SECTOR */}
        <div className={clsx('col-span-12 space-y-5', 'lg:col-span-3')}>
          {/* INTERESTS */}
          <InterestsWrapper tagsList={dateProfile?.tags!} />
        </div>
      </div>
    </div>
  );
};

export default DateProfileWrapper;
