import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { ChevronDown, ChevronUp, PencilLine } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { capitalize } from '@/utils/format-string';

const DescriptionWrapper = ({
  text,
  modifiable,
  onModify,
}: {
  text: string | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div
      title={isDescriptionExpanded ? t('click-to-wrap') : t('click-to-unwrap')}
      onClick={toggleDescription}
      className={clsx(
        'relative min-h-28 w-full min-w-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl bg-card p-5 shadow-md shadow-primary/20 transition-all duration-300 ease-in-out'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
    >
      <div className="flex flex-col justify-start gap-4">
        <p className="text-base font-bold">{capitalize(t('description'))}</p>
        <p
          className={clsx(
            'text-sm smooth42transition',
            isDescriptionExpanded ? 'h-auto' : 'line-clamp-6 h-[max-content] text-ellipsis'
          )}
          style={{ maxWidth: '100%' }} // Ensure the description doesn't exceed the container width
        >
          <TextWithLineBreaks text={text ?? t(`no-description`)} />
        </p>
      </div>

      <div
        className={clsx(
          'absolute bottom-0 left-[50%] m-auto w-min translate-x-[-50%]',
          isHovered
            ? 'text-positive transition-all duration-300 ease-in-out'
            : 'text-slate-200 transition-all duration-300 ease-in-out'
        )}
      >
        {isDescriptionExpanded ? (
          <ChevronUp
            size={18}
            className={clsx(
              isHovered
                ? 'opacity-100 transition duration-300'
                : 'opacity-0 transition duration-300'
            )}
          />
        ) : (
          <ChevronDown
            size={18}
            className={clsx(
              isHovered
                ? 'opacity-100 transition duration-300'
                : 'opacity-0 transition duration-300'
            )}
          />
        )}
      </div>

      {modifiable && (
        <div className={'absolute right-2 top-2 flex gap-1'}>
          <FilledOrNot size={15} filled={!!text} />
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

export default DescriptionWrapper;
