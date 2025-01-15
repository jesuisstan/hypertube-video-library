import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import SkeletonDate from '@/components/ui/skeletons/skeleton-date';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const StatusWrapper = ({ confirmed }: { confirmed: boolean | undefined }) => {
  const t = useTranslations();

  return (
    <div className="relative rounded-2xl bg-card p-5 shadow-md shadow-primary/20">
      <div className="flex flex-col justify-start">
        <h3 className="text-base font-bold">{t(`status`)}</h3>
        <div className="mt-4">
          <div className="flex items-center">
            {confirmed ? (
              <span className="flex items-center text-sm text-c42green">{t('confirmed')}</span>
            ) : (
              <span className="flex items-center text-sm text-destructive">
                {t('not-confirmed')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusWrapper;
