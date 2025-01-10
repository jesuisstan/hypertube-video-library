import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import DateSkeleton from '@/components/ui/skeletons/date-skeleton';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const StatusWrapper = ({ confirmed }: { confirmed: boolean | undefined }) => {
  const t = useTranslations();

  return (
    <div className="relative rounded-2xl bg-card p-5 shadow-md shadow-primary/20">
      <div className="flex flex-col justify-start">
        <h3 className="text-xl font-bold">{t(`status`)}</h3>
        <div className="mt-4">
          <div className="flex items-center">
            {confirmed ? (
              <span className="flex items-center text-c42green">{t('confirmed')}</span>
            ) : (
              <span className="flex items-center text-destructive">{t('not-confirmed')}</span>
            )}
            {/*<p
              className={clsx(
                'line-clamp-1 h-[max-content] text-ellipsis text-sm',
                confirmed ? 'text-c42green' : 'text-destructive'
              )}
              title={confirmed ? t('confirmed') : t('not-confirmed')}
            >
              {confirmed ? t('confirmed') : t('not-confirmed')}
            </p>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusWrapper;
