import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import AvatarGeneral from '@/components/avatar/avatar-general';
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
        'bg-card shadow-primary/20 smooth42transition relative flex max-h-fit min-h-[104px] w-full min-w-64 flex-row flex-wrap items-center justify-center gap-x-10 gap-y-1 rounded-md border p-5 align-middle shadow-xs transition-all duration-300 ease-in-out'
      )}
    >
      <div className="relative">
        {/* AVATAR */}
        <AvatarGeneral
          src={photoURL}
          nickname={nickname ?? '???'}
          rounded
          width={184}
          height={184}
          onAvatarChange={() => handleModify('photos' as keyof typeof TProfileCompleteLayout)}
        />
        {modifiable && (
          <div
            className={'absolute top-1 right-1 cursor-pointer'}
            onClick={() => handleModify('photos' as keyof typeof TProfileCompleteLayout)}
          >
            <FilledOrNot size={15} filled={!!photoURL} />
          </div>
        )}
      </div>

      <div
        id="basic-user-info"
        className="relative flex w-full flex-col gap-2 overflow-hidden"
        onClick={() => handleModify('basics' as keyof typeof TProfileCompleteLayout)}
      >
        <div className="w-max">
          <h1 title={nickname} className="cursor-pointer truncate text-4xl font-bold">
            {nickname}
          </h1>
        </div>
        <div className="w-max">
          <p className="text-base font-bold">{t('firstname')}</p>
          <p
            title={firstName}
            className="smooth42transition cursor-pointer flex-wrap truncate text-sm"
          >
            {firstName}
          </p>
        </div>
        <div className="w-max">
          <p className="text-base font-bold">{t('lastname')}</p>
          <p
            title={lastName}
            className="smooth42transition cursor-pointer flex-wrap truncate text-sm"
          >
            {lastName}
          </p>
        </div>
        {modifiable && (
          <div
            className="bg-card/70 absolute right-0 cursor-pointer rounded-md"
            onClick={() => handleModify('basics' as keyof typeof TProfileCompleteLayout)}
          >
            <FilledOrNot size={15} filled={!!lastName && !!firstName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderWrapper;
