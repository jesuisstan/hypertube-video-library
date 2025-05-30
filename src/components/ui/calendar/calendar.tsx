'use client';

import * as React from 'react';
import {
  DayPicker,
  type DayPickerProps,
  labelNext,
  labelPrevious,
  useDayPicker,
} from 'react-day-picker';

import clsx from 'clsx';
import { differenceInCalendarDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ButtonCustom, buttonVariants } from '@/components/ui/buttons/button-custom';

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number;

  /**
   * Wether to show the year switcher in the caption.
   * @default true
   */
  showYearSwitcher?: boolean;

  monthsClassName?: string;
  monthCaptionClassName?: string;
  weekdaysClassName?: string;
  weekdayClassName?: string;
  monthClassName?: string;
  captionClassName?: string;
  captionLabelClassName?: string;
  buttonNextClassName?: string;
  buttonPreviousClassName?: string;
  navClassName?: string;
  monthGridClassName?: string;
  weekClassName?: string;
  dayClassName?: string;
  dayButtonClassName?: string;
  rangeStartClassName?: string;
  rangeEndClassName?: string;
  selectedClassName?: string;
  todayClassName?: string;
  outsideClassName?: string;
  disabledClassName?: string;
  rangeMiddleClassName?: string;
  hiddenClassName?: string;
};

type NavView = 'days' | 'years';

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = React.useState<NavView>('days');
  const [displayYears, setDisplayYears] = React.useState<{
    from: number;
    to: number;
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getUTCFullYear();
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      };
    }, [yearRange])
  );

  const { onNextClick, onPrevClick, startMonth, endMonth } = props;

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths;

  const _monthsClassName = clsx('relative flex', props.monthsClassName);
  const _monthCaptionClassName = clsx(
    'relative mx-10 flex h-7 items-center justify-center',
    props.monthCaptionClassName
  );
  const _weekdaysClassName = clsx('flex flex-row', props.weekdaysClassName);
  const _weekdayClassName = clsx(
    'w-8 text-sm font-normal text-muted-foreground',
    props.weekdayClassName
  );
  const _monthClassName = clsx('w-full', props.monthClassName);
  const _captionClassName = clsx(
    'relative flex items-center justify-center pt-1',
    props.captionClassName
  );
  const _captionLabelClassName = clsx('truncate text-sm font-medium', props.captionLabelClassName);
  const buttonNavClassName = buttonVariants({
    variant: 'outline',
    className: 'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
  });
  const _buttonNextClassName = clsx(buttonNavClassName, 'right-0', props.buttonNextClassName);
  const _buttonPreviousClassName = clsx(
    buttonNavClassName,
    'left-0',
    props.buttonPreviousClassName
  );
  const _navClassName = clsx('flex items-start', props.navClassName);
  const _monthGridClassName = clsx('mx-auto mt-4', props.monthGridClassName);
  const _weekClassName = clsx('mt-2 flex w-max items-start', props.weekClassName);
  const _dayClassName = clsx(
    'flex size-8 flex-1 items-center justify-center p-0 text-sm',
    props.dayClassName
  );
  const _dayButtonClassName = clsx(
    buttonVariants({ variant: 'ghost' }),
    'size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100',
    props.dayButtonClassName
  );
  const buttonRangeClassName =
    'bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground';
  const _rangeStartClassName = clsx(
    buttonRangeClassName,
    'day-range-start rounded-s-md',
    props.rangeStartClassName
  );
  const _rangeEndClassName = clsx(
    buttonRangeClassName,
    'day-range-end rounded-e-md',
    props.rangeEndClassName
  );
  const _rangeMiddleClassName = clsx(
    'bg-accent !text-foreground [&>button]:bg-transparent [&>button]:!text-foreground [&>button]:hover:bg-transparent [&>button]:hover:!text-foreground',
    props.rangeMiddleClassName
  );
  const _selectedClassName = clsx(
    '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
    props.selectedClassName
  );
  const _todayClassName = clsx(
    '[&>button]:bg-accent [&>button]:text-positive',
    props.todayClassName
  );
  const _outsideClassName = clsx(
    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
    props.outsideClassName
  );
  const _disabledClassName = clsx('text-muted-foreground opacity-50', props.disabledClassName);
  const _hiddenClassName = clsx('invisible flex-1', props.hiddenClassName);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={clsx('p-3', className)}
      style={{
        width: 248.8 * (columnsDisplayed ?? 1) + 'px',
      }}
      classNames={{
        months: _monthsClassName,
        month_caption: _monthCaptionClassName,
        weekdays: _weekdaysClassName,
        weekday: _weekdayClassName,
        month: _monthClassName,
        caption: _captionClassName,
        caption_label: _captionLabelClassName,
        button_next: _buttonNextClassName,
        button_previous: _buttonPreviousClassName,
        nav: _navClassName,
        month_grid: _monthGridClassName,
        week: _weekClassName,
        day: _dayClassName,
        day_button: _dayButtonClassName,
        range_start: _rangeStartClassName,
        range_middle: _rangeMiddleClassName,
        range_end: _rangeEndClassName,
        selected: _selectedClassName,
        today: _todayClassName,
        outside: _outsideClassName,
        disabled: _disabledClassName,
        hidden: _hiddenClassName,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
        Nav: ({ className }) => (
          <Nav
            className={className}
            displayYears={displayYears}
            navView={navView}
            setDisplayYears={setDisplayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            onPrevClick={onPrevClick}
          />
        ),
        CaptionLabel: (props) => (
          <CaptionLabel
            showYearSwitcher={showYearSwitcher}
            navView={navView}
            setNavView={setNavView}
            displayYears={displayYears}
            {...props}
          />
        ),
        MonthGrid: ({ className, children, ...props }) => (
          <MonthGrid
            className={className}
            displayYears={displayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            navView={navView}
            setNavView={setNavView}
            {...props}
          >
            {children}
          </MonthGrid>
        ),
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

function Nav({
  className,
  navView,
  startMonth,
  endMonth,
  displayYears,
  setDisplayYears,
  onPrevClick,
  onNextClick,
}: {
  className?: string;
  navView: NavView;
  startMonth?: Date;
  endMonth?: Date;
  displayYears: { from: number; to: number };
  setDisplayYears: React.Dispatch<React.SetStateAction<{ from: number; to: number }>>;
  onPrevClick?: (date: Date) => void;
  onNextClick?: (date: Date) => void;
}) {
  const { nextMonth, previousMonth, goToMonth } = useDayPicker();

  const isPreviousDisabled = (() => {
    if (navView === 'years') {
      return (
        (startMonth &&
          differenceInCalendarDays(new Date(Date.UTC(displayYears.from - 1, 0, 1)), startMonth) <
            0) ||
        (endMonth &&
          differenceInCalendarDays(new Date(Date.UTC(displayYears.from - 1, 0, 1)), endMonth) > 0)
      );
    }
    return !previousMonth;
  })();

  const isNextDisabled = (() => {
    if (navView === 'years') {
      return (
        (startMonth &&
          differenceInCalendarDays(new Date(Date.UTC(displayYears.to + 1, 0, 1)), startMonth) <
            0) ||
        (endMonth &&
          differenceInCalendarDays(new Date(Date.UTC(displayYears.to + 1, 0, 1)), endMonth) > 0)
      );
    }
    return !nextMonth;
  })();

  const handlePreviousClick = React.useCallback(() => {
    if (!previousMonth) return;
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }));
      onPrevClick?.(
        new Date(Date.UTC(displayYears.from - (displayYears.to - displayYears.from), 0, 1))
      );
      return;
    }
    goToMonth(previousMonth);
    onPrevClick?.(
      new Date(
        Date.UTC(
          previousMonth.getUTCFullYear(),
          previousMonth.getUTCMonth(),
          previousMonth.getUTCDate()
        )
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousMonth, goToMonth]);

  const handleNextClick = React.useCallback(() => {
    if (!nextMonth) return;
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }));
      onNextClick?.(
        new Date(Date.UTC(displayYears.from + (displayYears.to - displayYears.from), 0, 1))
      );
      return;
    }
    goToMonth(nextMonth);
    onNextClick?.(
      new Date(
        Date.UTC(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth(), nextMonth.getUTCDate())
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goToMonth, nextMonth]);

  return (
    <nav className={clsx('flex items-center', className)}>
      <ButtonCustom
        variant="outline"
        className="absolute left-0 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        size={'sm'}
        tabIndex={isPreviousDisabled ? undefined : -1}
        disabled={isPreviousDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the previous ${displayYears.to - displayYears.from + 1} years`
            : labelPrevious(previousMonth)
        }
        onClick={handlePreviousClick}
      >
        <ChevronLeft className="h-4 w-4" />
      </ButtonCustom>

      <ButtonCustom
        variant="outline"
        className="absolute right-0 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        size={'sm'}
        tabIndex={isNextDisabled ? undefined : -1}
        disabled={isNextDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
            : labelNext(nextMonth)
        }
        onClick={handleNextClick}
      >
        <ChevronRight className="h-4 w-4" />
      </ButtonCustom>
    </nav>
  );
}

function CaptionLabel({
  children,
  showYearSwitcher,
  navView,
  setNavView,
  displayYears,
  ...props
}: {
  showYearSwitcher?: boolean;
  navView: NavView;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
  displayYears: { from: number; to: number };
} & React.HTMLAttributes<HTMLSpanElement>) {
  if (!showYearSwitcher) return <span {...props}>{children}</span>;
  return (
    <ButtonCustom
      className="truncate text-sm font-medium"
      variant="ghost"
      size="sm"
      onClick={() => setNavView((prev) => (prev === 'days' ? 'years' : 'days'))}
    >
      {navView === 'days' ? children : displayYears.from + ' - ' + displayYears.to}
    </ButtonCustom>
  );
}

function MonthGrid({
  className,
  children,
  displayYears,
  startMonth,
  endMonth,
  navView,
  setNavView,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  displayYears: { from: number; to: number };
  startMonth?: Date;
  endMonth?: Date;
  navView: NavView;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
} & React.TableHTMLAttributes<HTMLTableElement>) {
  if (navView === 'years') {
    return (
      <YearGrid
        displayYears={displayYears}
        startMonth={startMonth}
        endMonth={endMonth}
        setNavView={setNavView}
        navView={navView}
        className={className}
        {...props}
      />
    );
  }
  return (
    <table className={className} {...props}>
      {children}
    </table>
  );
}

function YearGrid({
  className,
  displayYears,
  startMonth,
  endMonth,
  setNavView,
  navView,
  ...props
}: {
  className?: string;
  displayYears: { from: number; to: number };
  startMonth?: Date;
  endMonth?: Date;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
  navView: NavView;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { goToMonth, selected } = useDayPicker();

  return (
    <div className={clsx('grid grid-cols-4 gap-y-2', className)} {...props}>
      {Array.from({ length: displayYears.to - displayYears.from + 1 }, (_, i) => {
        const isBefore =
          differenceInCalendarDays(new Date(Date.UTC(displayYears.from + i, 11, 31)), startMonth!) <
          0;

        const isAfter =
          differenceInCalendarDays(new Date(Date.UTC(displayYears.from + i, 0, 0)), endMonth!) > 0;

        const isDisabled = isBefore || isAfter;
        return (
          <ButtonCustom
            key={i}
            className={clsx(
              'text-foreground h-7 w-full text-xs font-normal',
              displayYears.from + i === new Date().getUTCFullYear() &&
                'bg-accent text-accent-foreground font-medium'
            )}
            variant="ghost"
            onClick={() => {
              setNavView('days');
              goToMonth(
                new Date(Date.UTC(displayYears.from + i, 0)) // setting month to 0 (January)
              );
            }}
            disabled={navView === 'years' ? isDisabled : undefined}
            title={String(displayYears.from + i)}
          >
            {displayYears.from + i}
          </ButtonCustom>
        );
      })}
    </div>
  );
}

export { Calendar };
