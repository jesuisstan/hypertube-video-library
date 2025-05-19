import { useTranslations } from 'next-intl';

const StatusWrapper = ({ confirmed }: { confirmed: boolean | undefined }) => {
  const t = useTranslations();

  return (
    <div className="bg-card shadow-primary/20 relative rounded-md border p-5 shadow-xs">
      <div className="flex flex-col justify-start">
        <h3 className="text-base font-bold">{t(`status`)}</h3>
        <div className="mt-4">
          <div className="flex items-center">
            {confirmed ? (
              <span className="text-positive flex items-center text-sm">{t('confirmed')}</span>
            ) : (
              <span className="text-destructive flex items-center text-sm">
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
