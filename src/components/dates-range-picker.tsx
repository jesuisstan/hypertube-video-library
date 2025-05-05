import { Dispatch, FC, SetStateAction } from 'react';

import { MoveRight } from 'lucide-react';

import { DatePicker } from '@/components/ui/calendar/date-picker';

type TDatesRangePickerProps = {
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
};

const DatesRangePicker: FC<TDatesRangePickerProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  if (!startDate || !endDate) return null;

  const handleSetStartDate = (date: Date) => {
    setStartDate(date);
  };

  const handleSetEndDate = (date: Date) => {
    setEndDate(date);
  };

  return (
    <div className="text-foreground flex items-center justify-center gap-1 text-center text-sm">
      <DatePicker date={startDate} setDate={handleSetStartDate} />
      <MoveRight size={16} />
      <DatePicker date={endDate} setDate={handleSetEndDate} />
    </div>
  );
};

export default DatesRangePicker;
