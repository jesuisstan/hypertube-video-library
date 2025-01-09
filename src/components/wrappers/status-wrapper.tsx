import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import DateSkeleton from '@/components/ui/skeletons/date-skeleton';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const StatusWrapper = ({
  confirmed,
  lastAction,
}: {
  confirmed: boolean | undefined;
  lastAction: string | undefined;
}) => {
  const t = useTranslations();
  const formatedLastActionDate = formatApiDateLastUpdate(lastAction);

  return (
    <div
      className={clsx(
        'relative grid max-h-28 w-full min-w-52 grid-flow-col grid-rows-1 overflow-hidden rounded-2xl bg-card p-4 shadow-md shadow-primary/20 smooth42transition',
        'lg:max-w-96'
      )}
    >
      <div className="min-w-36">
        <p className="text-base font-bold">{t('last-action')}</p>
        {!lastAction || formatedLastActionDate === t('invalid-date') ? (
          <DateSkeleton />
        ) : (
          <p
            className="line-clamp-1 h-[max-content] text-ellipsis text-sm"
            title={formatedLastActionDate}
          >
            {formatedLastActionDate}
          </p>
        )}
      </div>

      <div className="w-max">
        <p className="text-base font-bold">{t('status')}</p>
        <p
          className={clsx(
            'line-clamp-1 h-[max-content] text-ellipsis text-sm',
            confirmed ? 'text-c42green' : 'text-destructive'
          )}
          title={confirmed ? t('confirmed') : t('not-confirmed')}
        >
          {confirmed ? t('confirmed') : t('not-confirmed')}
        </p>
      </div>
    </div>
  );
};

export default StatusWrapper;
