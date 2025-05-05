import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { PencilLine } from 'lucide-react';

import TProfileCompleteLayout from '@/components/dialogs-custom/dialog-profile-modify';
import AvatarGeneral from '@/components/ui/avatar/avatar-general';
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
        'bg-card shadow-primary/20 smooth42transition relative flex max-h-fit min-h-[104px] w-full min-w-64 flex-row flex-wrap items-center justify-center gap-x-10 gap-y-1 rounded-2xl p-5 align-middle shadow-md transition-all duration-300 ease-in-out'
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
          <h1 title={nickname} className="xs:max-w-fit max-w-96 truncate text-4xl font-bold">
            {nickname}
          </h1>
        </div>
        <div className="w-max">
          <p className="text-base font-bold">{t('firstname')}</p>
          <p
            title={firstName}
            className="smooth42transition xs:max-w-min max-w-44 flex-wrap truncate text-sm lg:max-w-32"
          >
            {firstName}
          </p>
        </div>
        <div className="w-max">
          <p className="text-base font-bold">{t('lastname')}</p>
          <p
            title={lastName}
            className="smooth42transition xs:max-w-min max-w-44 flex-wrap truncate text-sm lg:max-w-32"
          >
            {lastName}
          </p>
        </div>
      </div>

      {modifiable && (
        <div className={'absolute top-2 right-2 flex gap-1'}>
          <FilledOrNot size={15} filled={!!lastName || !!firstName} />
          <div
            className={'text-foreground smooth42transition opacity-60 hover:opacity-100'}
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
