import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { PencilLine } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';
import { capitalize } from '@/utils/format-string';

type LabelsWrapperProps = {
  firstName: string;
  lastName: string;
  loading: boolean;
  modifiable?: boolean;
  onModify?: () => void;
};

const LabelsWrapper = ({
  firstName,
  lastName,
  loading,
  modifiable,
  onModify,
}: LabelsWrapperProps) => {
  const t = useTranslations();

  return (
    <div
      className={clsx(
        'relative grid max-h-28 min-h-[104px] min-w-64 grid-flow-col grid-rows-2 gap-x-0 rounded-2xl bg-card p-4 pb-2 pt-2 shadow-md'
      )}
    >
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

      {modifiable && (
        <div className={'absolute right-2 top-2 flex gap-1'}>
          <FilledOrNot size={15} filled={!!lastName || !!firstName} />
          <div
            className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}
            title={t('click-to-modify')}
          >
            <PencilLine size={15} onClick={onModify} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelsWrapper;
