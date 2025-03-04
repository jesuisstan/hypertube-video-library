'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { format } from 'date-fns';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Calendar } from '@/components/ui/calendar/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover-primitives';

export function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
}) {
  const t = useTranslations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ButtonCustom
          variant={'outline'}
          size={'sm'}
          className={clsx('h-fit w-fit min-w-28 py-1', !date && 'text-muted-foreground')}
        >
          {date ? format(date, 'PP') : <span className="animate-pulse">{t(`pick-a-date`)}</span>}
        </ButtonCustom>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={setDate}
          required={true}
          defaultMonth={date ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
