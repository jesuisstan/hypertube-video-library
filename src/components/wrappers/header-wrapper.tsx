import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { PencilLine } from 'lucide-react';

import AvatarGeneral from '../ui/avatar/avatar-general';

import TProfileCompleteLayout from '@/components/dialogs-custom/dialog-profile-modify';
import FilledOrNot from '@/components/ui/filled-or-not';

type THeaderWrapperProps = {
  nickname: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  loading: boolean;
  modifiable?: boolean;
  onModify?: (layout: keyof typeof TProfileCompleteLayout) => void;
};

const HeaderWrapper = ({
  nickname,
  firstName,
  lastName,
  photoURL,
  loading,
  modifiable,
  onModify,
}: THeaderWrapperProps) => {
  const t = useTranslations();

  const handleModify = (layout: keyof typeof TProfileCompleteLayout) => {
    if (onModify) {
      onModify(layout);
    } else {
      console.warn('No onModify function provided.');
    }
  };

  return (
    <div
      className={clsx(
        'relative flex max-h-fit min-h-[104px] w-fit  min-w-64 flex-row flex-wrap items-center justify-center gap-5 rounded-2xl bg-card p-5 align-middle shadow-md shadow-primary/20 transition-all duration-300 ease-in-out smooth42transition'
      )}
    >
      {/* AVATAR */}
      <AvatarGeneral
        src={photoURL}
        nickname={nickname ?? '???'}
        rounded
        width={184}
        height={184}
        onAvatarChange={() => handleModify('photos' as keyof typeof TProfileCompleteLayout)}
      />
      <div className="flex flex-col gap-2">
        <div className="w-max">
          <h1 title={nickname} className="max-w-96 truncate text-4xl font-bold xs:max-w-fit">
            {nickname}
          </h1>
        </div>
        <div className="w-max">
          <p className="text-base font-bold">{t('firstname')}</p>
          <p
            title={firstName}
            className="max-w-44 flex-wrap truncate text-sm smooth42transition xs:max-w-min lg:max-w-32"
          >
            {firstName}
          </p>
        </div>
        <div className="w-max">
          <p className="text-base font-bold">{t('lastname')}</p>
          <p
            title={lastName}
            className="max-w-44 flex-wrap truncate text-sm smooth42transition xs:max-w-min lg:max-w-32"
          >
            {lastName}
          </p>
        </div>
      </div>

      {modifiable && (
        <div className={'absolute right-2 top-2 flex gap-1'}>
          <FilledOrNot size={15} filled={!!lastName || !!firstName} />
          <div
            className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}
            title={t('click-to-modify')}
          >
            <PencilLine
              size={15}
              onClick={() => handleModify('basics' as keyof typeof TProfileCompleteLayout)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderWrapper;
