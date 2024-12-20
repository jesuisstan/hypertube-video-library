import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import clsx from 'clsx';
import { Star } from 'lucide-react';
import { MapPinned } from 'lucide-react';

import AvatarMini from '@/components/ui/avatar-mini';
import { getColorByRating } from '@/components/wrappers/rating-wrapper';
import { TDateProfile } from '@/types/date-profile';
import { calculateAge } from '@/utils/format-string';

const ProfileCardWrapper = ({ profile }: { profile: TDateProfile }) => {
  const t = useTranslations();
  const { theme } = useTheme();

  return (
    <Link href={`/search/${profile.id}`} passHref>
      {' '}
      {/* Link to the profile page */}
      <div className="relative flex max-w-72 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-2 smooth42transition hover:scale-105 hover:border-c42green">
        {/* RAITING */}
        <div
          title={t(`rating`)}
          className="absolute -right-3 -top-3 flex w-8 flex-col items-center justify-center gap-1 rounded-2xl border bg-muted/70 p-1 "
        >
          <Star size={18} className={getColorByRating(profile?.rating)} />
          <p className="text-sm">{profile?.rating}</p>
        </div>

        {/* STATUS */}
        <div
          title={profile?.online ? t('online') : t('offline')}
          className={clsx(
            'absolute bottom-2 right-2 rounded-full p-1',
            profile?.online ? 'animate-ping bg-c42green' : 'bg-destructive animate-pulse'
          )}
        ></div>

        <AvatarMini
          src={profile?.photos?.[0] ?? ''}
          nickname={profile?.nickname}
          width={40}
          height={40}
        />
        <div className="h-fit w-[160px] items-center justify-center self-center rounded-2xl text-center align-middle">
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="max-w-32 truncate text-base font-bold" title={profile?.nickname}>
              {profile?.nickname}
            </p>
            {'/'}
            <p className="text-base">
              {profile?.age ? profile?.age : calculateAge(profile?.birthdate)}
            </p>
          </div>

          <div className="m-2 flex flex-row items-center justify-center gap-2">
            <div>
              <MapPinned size={20} />
            </div>
            <p className="truncate text-sm" title={profile?.address}>
              {profile?.address}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCardWrapper;
